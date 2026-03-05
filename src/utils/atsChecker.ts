/**
 * ATS (Applicant Tracking System) Score Checker.
 * Evaluates resume content against common ATS best practices.
 */

import type { ResumeData } from '../types/resume';

export interface ATSCheckResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: ATSCheck[];
}

export interface ATSCheck {
  id: string;
  category: 'contact' | 'content' | 'formatting' | 'keywords';
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
}

function getGrade(score: number): ATSCheckResult['grade'] {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

const strongActionVerbs = new Set([
  'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'boosted', 'built', 'championed', 'coached', 'collaborated',
  'communicated', 'completed', 'consolidated', 'coordinated', 'created',
  'decreased', 'delivered', 'designed', 'developed', 'directed',
  'drove', 'earned', 'eliminated', 'enabled', 'engineered',
  'established', 'evaluated', 'exceeded', 'executed', 'expanded',
  'facilitated', 'generated', 'grew', 'guided', 'identified',
  'implemented', 'improved', 'increased', 'influenced', 'initiated',
  'integrated', 'introduced', 'launched', 'led', 'leveraged',
  'maintained', 'managed', 'mentored', 'modernized', 'negotiated',
  'operated', 'optimized', 'orchestrated', 'organized', 'oversaw',
  'partnered', 'performed', 'pioneered', 'planned', 'presented',
  'produced', 'programmed', 'published', 'reduced', 'refactored',
  'redesigned', 'resolved', 'revamped', 'scaled', 'secured',
  'simplified', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'supervised', 'surpassed', 'trained', 'transformed',
  'upgraded', 'utilized', 'validated',
]);

export function runATSCheck(data: ResumeData): ATSCheckResult {
  const checks: ATSCheck[] = [];

  // ── Contact Info Checks ──

  checks.push({
    id: 'has-name',
    category: 'contact',
    label: 'Full name provided',
    passed: data.personal.fullName.trim().length > 0,
    weight: 10,
    tip: 'Include your full name at the top of your resume.',
  });

  checks.push({
    id: 'has-email',
    category: 'contact',
    label: 'Email address included',
    passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email.trim()),
    weight: 10,
    tip: 'Include a valid, professional email address.',
  });

  checks.push({
    id: 'has-phone',
    category: 'contact',
    label: 'Phone number included',
    passed: data.personal.phone.trim().length >= 7,
    weight: 5,
    tip: 'Include a phone number for recruiters to reach you.',
  });

  checks.push({
    id: 'has-location',
    category: 'contact',
    label: 'Location specified',
    passed: data.personal.location.trim().length > 0,
    weight: 3,
    tip: 'Include your city and state/country. Many ATS systems filter by location.',
  });

  checks.push({
    id: 'has-linkedin',
    category: 'contact',
    label: 'LinkedIn profile linked',
    passed: data.personal.linkedin.trim().length > 0,
    weight: 3,
    tip: 'Add your LinkedIn URL. Most recruiters will check it.',
  });

  // ── Content Checks ──

  checks.push({
    id: 'has-summary',
    category: 'content',
    label: 'Professional summary included',
    passed: data.personal.summary.trim().length >= 30,
    weight: 8,
    tip: 'Write a 2-3 sentence summary highlighting your key qualifications and career goals.',
  });

  checks.push({
    id: 'has-experience',
    category: 'content',
    label: 'Work experience listed',
    passed: data.experience.length > 0,
    weight: 10,
    tip: 'Include at least one work experience entry.',
  });

  const filledBullets = data.experience.flatMap((exp) =>
    exp.bullets.filter((b) => b.trim().length > 0)
  );

  checks.push({
    id: 'has-bullets',
    category: 'content',
    label: 'Achievement bullet points (3+ per role)',
    passed:
      data.experience.length === 0 ||
      data.experience.every(
        (exp) => exp.bullets.filter((b) => b.trim().length > 0).length >= 3
      ),
    weight: 8,
    tip: 'Each role should have at least 3 bullet points describing your achievements.',
  });

  // Quantified bullets (contain numbers)
  const quantifiedCount = filledBullets.filter((b) => /\d/.test(b)).length;
  const quantifiedRatio =
    filledBullets.length > 0 ? quantifiedCount / filledBullets.length : 0;

  checks.push({
    id: 'quantified-bullets',
    category: 'content',
    label: 'Bullets include metrics/numbers',
    passed: quantifiedRatio >= 0.4,
    weight: 8,
    tip: `${Math.round(quantifiedRatio * 100)}% of your bullets contain numbers. Aim for 40%+ with metrics like percentages, dollar amounts, or team sizes.`,
  });

  // Action verb usage
  const actionVerbCount = filledBullets.filter((b) => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return strongActionVerbs.has(firstWord);
  }).length;
  const actionVerbRatio =
    filledBullets.length > 0 ? actionVerbCount / filledBullets.length : 0;

  checks.push({
    id: 'action-verbs',
    category: 'content',
    label: 'Bullets start with action verbs',
    passed: actionVerbRatio >= 0.5,
    weight: 6,
    tip: `${Math.round(actionVerbRatio * 100)}% of bullets start with strong action verbs. Aim for 50%+ (e.g., "Developed", "Led", "Optimized").`,
  });

  checks.push({
    id: 'has-education',
    category: 'content',
    label: 'Education section included',
    passed: data.education.length > 0,
    weight: 6,
    tip: 'Include your educational background.',
  });

  checks.push({
    id: 'has-skills',
    category: 'content',
    label: 'Skills section included',
    passed: data.skills.length > 0 && data.skills.some((g) => g.items.filter(Boolean).length > 0),
    weight: 8,
    tip: 'Include a skills section with relevant technical and professional skills. ATS systems often scan for specific skill keywords.',
  });

  const totalSkills = data.skills.reduce(
    (sum, g) => sum + g.items.filter(Boolean).length,
    0
  );

  checks.push({
    id: 'enough-skills',
    category: 'content',
    label: 'Sufficient skills listed (6+)',
    passed: totalSkills >= 6,
    weight: 5,
    tip: `You have ${totalSkills} skills listed. Aim for at least 6 relevant skills to improve keyword matching.`,
  });

  // ── Formatting Checks ──

  checks.push({
    id: 'no-short-bullets',
    category: 'formatting',
    label: 'Bullets are descriptive (15+ chars)',
    passed:
      filledBullets.length === 0 ||
      filledBullets.every((b) => b.trim().length >= 15),
    weight: 4,
    tip: 'Each bullet point should be descriptive enough to convey your contribution (at least 15 characters).',
  });

  checks.push({
    id: 'no-long-bullets',
    category: 'formatting',
    label: 'Bullets are concise (under 200 chars)',
    passed:
      filledBullets.length === 0 ||
      filledBullets.every((b) => b.trim().length <= 200),
    weight: 3,
    tip: 'Keep bullet points concise. Very long bullets are hard to scan and may get truncated by ATS systems.',
  });

  checks.push({
    id: 'dates-filled',
    category: 'formatting',
    label: 'All dates are filled in',
    passed:
      data.experience.every(
        (exp) => exp.startDate.trim().length > 0 && exp.endDate.trim().length > 0
      ) &&
      data.education.every(
        (edu) => edu.startDate.trim().length > 0 && edu.endDate.trim().length > 0
      ),
    weight: 5,
    tip: 'Ensure all experience and education entries have start and end dates. ATS systems use dates to calculate tenure.',
  });

  checks.push({
    id: 'job-title',
    category: 'formatting',
    label: 'Professional title/headline set',
    passed: data.personal.title.trim().length > 0,
    weight: 5,
    tip: 'Set a professional title (e.g., "Senior Software Engineer") to help ATS systems categorize your resume.',
  });

  // ── Calculate score ──
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);

  const score = Math.round((earnedWeight / totalWeight) * 100);

  return {
    score,
    grade: getGrade(score),
    checks,
  };
}
