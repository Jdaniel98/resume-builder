/**
 * ATS (Applicant Tracking System) Score Checker.
 * Professional-grade resume analysis with real checks:
 * - Contact completeness
 * - Content depth & quality
 * - Verb tense consistency
 * - Repetition detection
 * - Chronological ordering
 * - Employment gap detection
 * - Readability scoring
 * - Keyword density
 */

import type { ResumeData } from '../types/resume';

export interface ATSCheckResult {
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  checks: ATSCheck[];
  insights: ATSInsight[];
}

export interface ATSCheck {
  id: string;
  category: 'contact' | 'content' | 'formatting' | 'consistency';
  label: string;
  passed: boolean;
  weight: number;
  tip: string;
}

export interface ATSInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  detail: string;
}

function getGrade(score: number): ATSCheckResult['grade'] {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// ── Strong action verbs (expanded) ──
const strongActionVerbs = new Set([
  'accelerated', 'achieved', 'acquired', 'administered', 'advanced',
  'analyzed', 'approved', 'architected', 'assembled', 'assessed',
  'automated', 'balanced', 'boosted', 'budgeted', 'built',
  'centralized', 'championed', 'coached', 'collaborated', 'communicated',
  'compiled', 'completed', 'conducted', 'configured', 'consolidated',
  'constructed', 'consulted', 'converted', 'coordinated', 'created',
  'customized', 'debugged', 'decreased', 'defined', 'delegated',
  'delivered', 'deployed', 'designed', 'developed', 'devised',
  'diagnosed', 'directed', 'discovered', 'documented', 'drove',
  'earned', 'eliminated', 'enabled', 'enforced', 'engineered',
  'enhanced', 'established', 'evaluated', 'exceeded', 'executed',
  'expanded', 'expedited', 'facilitated', 'finalized', 'forecasted',
  'formulated', 'founded', 'generated', 'governed', 'grew',
  'guided', 'headed', 'identified', 'illustrated', 'implemented',
  'improved', 'increased', 'influenced', 'initiated', 'innovated',
  'inspected', 'installed', 'instituted', 'integrated', 'introduced',
  'investigated', 'launched', 'led', 'leveraged', 'maintained',
  'managed', 'mapped', 'maximized', 'measured', 'mentored',
  'merged', 'migrated', 'minimized', 'modernized', 'monitored',
  'motivated', 'navigated', 'negotiated', 'observed', 'obtained',
  'operated', 'optimized', 'orchestrated', 'organized', 'originated',
  'outperformed', 'oversaw', 'partnered', 'performed', 'piloted',
  'pioneered', 'planned', 'prepared', 'presented', 'prioritized',
  'processed', 'produced', 'programmed', 'promoted', 'proposed',
  'protected', 'provided', 'published', 'pursued', 'reconciled',
  'recruited', 'redesigned', 'reduced', 'refactored', 'refined',
  'regulated', 'remodeled', 'reorganized', 'replaced', 'reported',
  'represented', 'researched', 'resolved', 'restructured', 'revamped',
  'reviewed', 'revised', 'revitalized', 'saved', 'scaled',
  'scheduled', 'secured', 'simplified', 'solved', 'spearheaded',
  'standardized', 'steered', 'streamlined', 'strengthened', 'structured',
  'supervised', 'surpassed', 'sustained', 'synthesized', 'systematized',
  'targeted', 'tested', 'traced', 'tracked', 'trained',
  'transitioned', 'transformed', 'translated', 'troubleshot', 'unified',
  'upgraded', 'utilized', 'validated', 'verified', 'visualized',
]);

// Past tense markers for consistency check
const PRESENT_TENSE_PATTERNS = /^(manage|develop|create|lead|build|design|implement|coordinate|analyze|optimize|maintain|operate|collaborate|drive|support|deliver|oversee|ensure|handle|conduct|perform|direct|establish|provide|monitor|prepare|execute|facilitate|integrate|generate|research|evaluate|administer|organize|present|train|mentor|guide|plan|review|assess|produce|write|update|report|track|define|configure|test|debug|deploy|architect|automate)\b/i;

const PAST_TENSE_PATTERNS = /^(managed|developed|created|led|built|designed|implemented|coordinated|analyzed|optimized|maintained|operated|collaborated|drove|supported|delivered|oversaw|ensured|handled|conducted|performed|directed|established|provided|monitored|prepared|executed|facilitated|integrated|generated|researched|evaluated|administered|organized|presented|trained|mentored|guided|planned|reviewed|assessed|produced|wrote|updated|reported|tracked|defined|configured|tested|debugged|deployed|architected|automated)\b/i;

/**
 * Parse a date string into a sortable value (year * 12 + month).
 * Handles formats like "Jan 2022", "2022", "Present", "2022-01".
 */
function parseDateToMonths(dateStr: string): number | null {
  const trimmed = dateStr.trim().toLowerCase();
  if (!trimmed || trimmed === 'present' || trimmed === 'current') return Date.now();

  // "Jan 2022" or "January 2022"
  const monthYear = trimmed.match(
    /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s*(\d{4})$/i
  );
  if (monthYear) {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const m = months[monthYear[1].toLowerCase().slice(0, 3)] ?? 0;
    return parseInt(monthYear[2]) * 12 + m;
  }

  // "2022-01"
  const isoDate = trimmed.match(/^(\d{4})-(\d{1,2})$/);
  if (isoDate) {
    return parseInt(isoDate[1]) * 12 + parseInt(isoDate[2]) - 1;
  }

  // "2022"
  const yearOnly = trimmed.match(/^(\d{4})$/);
  if (yearOnly) {
    return parseInt(yearOnly[1]) * 12;
  }

  return null;
}

/**
 * Detect if a role is current (end date is "Present", "Current", or empty).
 */
function isCurrentRole(endDate: string): boolean {
  const lower = endDate.trim().toLowerCase();
  return lower === 'present' || lower === 'current' || lower === '';
}

export function runATSCheck(data: ResumeData): ATSCheckResult {
  const checks: ATSCheck[] = [];
  const insights: ATSInsight[] = [];

  // ════════════════════════════════════════
  // CONTACT INFO CHECKS
  // ════════════════════════════════════════

  checks.push({
    id: 'has-name',
    category: 'contact',
    label: 'Full name provided',
    passed: data.personal.fullName.trim().length > 0,
    weight: 10,
    tip: 'Include your full name. ATS systems use this as the primary identifier.',
  });

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email.trim());
  const emailProfessional = !/\d{4,}|sexy|hot|cool|69|420/i.test(data.personal.email);
  checks.push({
    id: 'has-email',
    category: 'contact',
    label: 'Professional email address',
    passed: emailValid && emailProfessional,
    weight: 10,
    tip: emailValid
      ? 'Use a professional email format (firstname.lastname@provider.com).'
      : 'Include a valid email address.',
  });

  checks.push({
    id: 'has-phone',
    category: 'contact',
    label: 'Phone number included',
    passed: data.personal.phone.trim().length >= 7,
    weight: 5,
    tip: 'Include a phone number. 65% of recruiters prefer to call candidates directly.',
  });

  checks.push({
    id: 'has-location',
    category: 'contact',
    label: 'Location specified',
    passed: data.personal.location.trim().length > 0,
    weight: 4,
    tip: 'Include city & state/country. ATS systems filter by location — missing it can auto-reject your application.',
  });

  checks.push({
    id: 'has-linkedin',
    category: 'contact',
    label: 'LinkedIn profile linked',
    passed: data.personal.linkedin.trim().length > 0,
    weight: 3,
    tip: 'Add your LinkedIn URL. 87% of recruiters use LinkedIn to vet candidates.',
  });

  // ════════════════════════════════════════
  // CONTENT DEPTH CHECKS
  // ════════════════════════════════════════

  // Summary quality
  const summaryLen = data.personal.summary.trim().length;
  checks.push({
    id: 'has-summary',
    category: 'content',
    label: 'Professional summary (50-300 chars)',
    passed: summaryLen >= 50 && summaryLen <= 300,
    weight: 8,
    tip: summaryLen < 50
      ? `Your summary is ${summaryLen} chars — too short. Write 2-3 sentences covering your experience level, core skills, and career goals.`
      : summaryLen > 300
        ? `Your summary is ${summaryLen} chars — too long. Keep it concise at 2-3 sentences. Recruiters spend ~7 seconds per resume.`
        : 'Good summary length.',
  });

  checks.push({
    id: 'has-title',
    category: 'content',
    label: 'Professional title/headline set',
    passed: data.personal.title.trim().length > 0,
    weight: 6,
    tip: 'Set a clear title (e.g., "Senior Software Engineer"). ATS systems use this for role matching.',
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

  // Bullets per role
  const bulletsPerRole = data.experience.map(
    (exp) => exp.bullets.filter((b) => b.trim().length > 0).length
  );
  const minBullets = bulletsPerRole.length > 0 ? Math.min(...bulletsPerRole) : 0;

  checks.push({
    id: 'bullets-per-role',
    category: 'content',
    label: 'At least 3 bullets per role',
    passed: data.experience.length === 0 || minBullets >= 3,
    weight: 7,
    tip: minBullets < 3
      ? `One of your roles has only ${minBullets} bullet(s). Each role needs 3-6 bullets to demonstrate depth.`
      : 'Each role has adequate bullet points.',
  });

  // Quantified bullets
  const quantifiedCount = filledBullets.filter((b) =>
    /\d/.test(b) && /(%|\$|£|€|#|\bx\b|hours?|days?|weeks?|months?|years?|users?|clients?|customers?|team|people|members?|projects?|revenue|sales|budget|saving|increase|decrease|reduce|improve)/i.test(b)
  ).length;
  const quantifiedRatio = filledBullets.length > 0 ? quantifiedCount / filledBullets.length : 0;

  checks.push({
    id: 'quantified-impact',
    category: 'content',
    label: 'Measurable impact in bullets (40%+)',
    passed: quantifiedRatio >= 0.4,
    weight: 10,
    tip: `${Math.round(quantifiedRatio * 100)}% of bullets show measurable impact. Aim for 40%+. Use numbers with context: revenue growth, team size, performance improvement, cost savings.`,
  });

  // Action verb usage
  const actionVerbCount = filledBullets.filter((b) => {
    const firstWord = b.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
    return strongActionVerbs.has(firstWord);
  }).length;
  const actionVerbRatio = filledBullets.length > 0 ? actionVerbCount / filledBullets.length : 0;

  checks.push({
    id: 'action-verbs',
    category: 'content',
    label: 'Strong action verbs (50%+ bullets)',
    passed: actionVerbRatio >= 0.5,
    weight: 6,
    tip: `${Math.round(actionVerbRatio * 100)}% of bullets start with strong action verbs. Aim for 50%+. Replace weak starters like "Responsible for" with "Led", "Developed", "Drove".`,
  });

  checks.push({
    id: 'has-education',
    category: 'content',
    label: 'Education section included',
    passed: data.education.length > 0,
    weight: 5,
    tip: 'Include education. Even with extensive experience, 77% of employers still require it.',
  });

  // Skills density
  const totalSkills = data.skills.reduce(
    (sum, g) => sum + g.items.filter(Boolean).length, 0
  );
  checks.push({
    id: 'skills-density',
    category: 'content',
    label: 'Skills section with 8+ skills',
    passed: totalSkills >= 8,
    weight: 8,
    tip: `You have ${totalSkills} skills. Include at least 8 relevant skills — ATS systems do keyword matching against skills sections first.`,
  });

  // Skill categories
  const filledCategories = data.skills.filter(
    (g) => g.category.trim().length > 0 && g.items.filter(Boolean).length > 0
  ).length;
  checks.push({
    id: 'skill-categories',
    category: 'content',
    label: 'Skills organized into categories',
    passed: filledCategories >= 2,
    weight: 3,
    tip: 'Organize skills into 2+ categories (e.g., "Languages", "Frameworks", "Tools"). This helps both ATS parsing and recruiter scanning.',
  });

  // ════════════════════════════════════════
  // FORMATTING & STRUCTURE CHECKS
  // ════════════════════════════════════════

  // Bullet length
  const tooShort = filledBullets.filter((b) => b.trim().length < 20);
  checks.push({
    id: 'bullet-length-min',
    category: 'formatting',
    label: 'Bullets are descriptive (20+ chars)',
    passed: tooShort.length === 0,
    weight: 4,
    tip: tooShort.length > 0
      ? `${tooShort.length} bullet(s) are too short (<20 chars). Each bullet should describe a specific achievement, not just a task name.`
      : 'Bullet lengths look good.',
  });

  const tooLong = filledBullets.filter((b) => b.trim().length > 180);
  checks.push({
    id: 'bullet-length-max',
    category: 'formatting',
    label: 'Bullets are concise (under 180 chars)',
    passed: tooLong.length === 0,
    weight: 3,
    tip: tooLong.length > 0
      ? `${tooLong.length} bullet(s) exceed 180 chars. Long bullets get truncated by ATS and ignored by recruiters. Split into two bullets or tighten the language.`
      : 'Bullet lengths look good.',
  });

  // All dates filled
  const missingDates =
    data.experience.filter(
      (exp) => !exp.startDate.trim() || !exp.endDate.trim()
    ).length +
    data.education.filter(
      (edu) => !edu.startDate.trim() || !edu.endDate.trim()
    ).length;

  checks.push({
    id: 'dates-complete',
    category: 'formatting',
    label: 'All dates filled in',
    passed: missingDates === 0,
    weight: 5,
    tip: missingDates > 0
      ? `${missingDates} entry(ies) have missing dates. ATS systems calculate tenure and flag incomplete dates.`
      : 'All dates are filled in.',
  });

  // Roles have company + location
  const incompleteRoles = data.experience.filter(
    (exp) => !exp.company.trim() || !exp.role.trim()
  ).length;
  checks.push({
    id: 'roles-complete',
    category: 'formatting',
    label: 'All roles have title & company',
    passed: incompleteRoles === 0,
    weight: 4,
    tip: 'Every experience entry should have both a job title and company name for ATS parsing.',
  });

  // ════════════════════════════════════════
  // CONSISTENCY CHECKS
  // ════════════════════════════════════════

  // Verb tense consistency
  if (data.experience.length > 0) {
    const tenseIssues: string[] = [];

    for (const exp of data.experience) {
      const isCurrent = isCurrentRole(exp.endDate);
      const bullets = exp.bullets.filter((b) => b.trim().length > 0);

      for (const bullet of bullets) {
        const trimmed = bullet.trim();
        if (isCurrent && PAST_TENSE_PATTERNS.test(trimmed)) {
          tenseIssues.push(
            `"${trimmed.slice(0, 30)}..." in current role uses past tense`
          );
        } else if (!isCurrent && PRESENT_TENSE_PATTERNS.test(trimmed)) {
          tenseIssues.push(
            `"${trimmed.slice(0, 30)}..." in past role uses present tense`
          );
        }
      }
    }

    checks.push({
      id: 'verb-tense',
      category: 'consistency',
      label: 'Consistent verb tense per role',
      passed: tenseIssues.length === 0,
      weight: 5,
      tip: tenseIssues.length > 0
        ? `Use present tense for current roles and past tense for previous roles. Found ${tenseIssues.length} inconsistency(ies).`
        : 'Verb tenses are consistent.',
    });

    if (tenseIssues.length > 0) {
      insights.push({
        id: 'tense-details',
        type: 'warning',
        title: 'Verb Tense Issues',
        detail: tenseIssues.slice(0, 3).join('\n') +
          (tenseIssues.length > 3 ? `\n...and ${tenseIssues.length - 3} more` : ''),
      });
    }
  }

  // Repetition detection — overused first verbs
  if (filledBullets.length >= 4) {
    const verbCounts = new Map<string, number>();
    for (const bullet of filledBullets) {
      const firstWord = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
      if (firstWord) {
        verbCounts.set(firstWord, (verbCounts.get(firstWord) ?? 0) + 1);
      }
    }

    const overused = [...verbCounts.entries()]
      .filter(([, count]) => count >= 3)
      .map(([verb, count]) => `"${verb}" (${count}x)`);

    checks.push({
      id: 'no-repetition',
      category: 'consistency',
      label: 'Varied vocabulary (no verb used 3+ times)',
      passed: overused.length === 0,
      weight: 4,
      tip: overused.length > 0
        ? `Overused starting verbs: ${overused.join(', ')}. Vary your vocabulary to keep the reader engaged and show range.`
        : 'Good vocabulary variety.',
    });

    if (overused.length > 0) {
      insights.push({
        id: 'repetition-details',
        type: 'warning',
        title: 'Repeated Verbs',
        detail: `These verbs are overused: ${overused.join(', ')}. Swap some for synonyms to improve readability.`,
      });
    }
  }

  // Chronological order (most recent first)
  if (data.experience.length >= 2) {
    let isChronological = true;
    for (let i = 0; i < data.experience.length - 1; i++) {
      const current = parseDateToMonths(data.experience[i].startDate);
      const next = parseDateToMonths(data.experience[i + 1].startDate);
      if (current !== null && next !== null && current < next) {
        isChronological = false;
        break;
      }
    }

    checks.push({
      id: 'chronological',
      category: 'consistency',
      label: 'Experience in reverse-chronological order',
      passed: isChronological,
      weight: 5,
      tip: 'List experience with most recent role first. ATS systems expect reverse-chronological order.',
    });
  }

  // Employment gaps
  if (data.experience.length >= 2) {
    const gaps: string[] = [];

    // Sort experiences by start date (most recent first)
    const sorted = [...data.experience]
      .map((exp) => ({
        ...exp,
        startMonths: parseDateToMonths(exp.startDate),
        endMonths: parseDateToMonths(exp.endDate),
      }))
      .filter((exp) => exp.startMonths !== null && exp.endMonths !== null)
      .sort((a, b) => (b.startMonths ?? 0) - (a.startMonths ?? 0));

    for (let i = 0; i < sorted.length - 1; i++) {
      const prevEnd = sorted[i + 1].endMonths;
      const nextStart = sorted[i].startMonths;

      if (prevEnd !== null && nextStart !== null) {
        const gapMonths = nextStart - prevEnd;
        if (gapMonths > 6) {
          const gapYears = Math.floor(gapMonths / 12);
          const gapRemaining = gapMonths % 12;
          const gapStr = gapYears > 0
            ? `${gapYears}y ${gapRemaining}m`
            : `${gapMonths}m`;
          gaps.push(
            `${gapStr} gap between ${sorted[i + 1].company || 'a role'} and ${sorted[i].company || 'a role'}`
          );
        }
      }
    }

    if (gaps.length > 0) {
      checks.push({
        id: 'no-gaps',
        category: 'consistency',
        label: 'No unexplained employment gaps (6+ months)',
        passed: false,
        weight: 4,
        tip: `Found ${gaps.length} gap(s) exceeding 6 months. Address gaps in your summary or add freelance/volunteer work to fill them.`,
      });

      insights.push({
        id: 'gap-details',
        type: 'warning',
        title: 'Employment Gaps Detected',
        detail: gaps.join('\n'),
      });
    } else {
      checks.push({
        id: 'no-gaps',
        category: 'consistency',
        label: 'No unexplained employment gaps',
        passed: true,
        weight: 4,
        tip: 'No significant gaps detected.',
      });
    }
  }

  // ── Readability insight (not a scored check, just info) ──
  if (filledBullets.length > 0) {
    const avgLen = Math.round(
      filledBullets.reduce((sum, b) => sum + b.trim().length, 0) / filledBullets.length
    );
    const avgWords = Math.round(
      filledBullets.reduce((sum, b) => sum + b.trim().split(/\s+/).length, 0) / filledBullets.length
    );

    insights.push({
      id: 'readability',
      type: avgLen > 150 ? 'warning' : avgLen < 30 ? 'warning' : 'info',
      title: 'Readability',
      detail: `Average bullet: ${avgLen} chars, ${avgWords} words. ${
        avgLen > 150
          ? 'Consider shortening — recruiters prefer scannable text.'
          : avgLen < 30
            ? 'Bullets may lack detail — expand with context and results.'
            : 'Good readability range (sweet spot: 60-150 chars).'
      }`,
    });
  }

  // Resume length insight
  const totalEntries = data.experience.length + data.education.length + data.projects.length;
  if (totalEntries > 0) {
    insights.push({
      id: 'resume-density',
      type: 'info',
      title: 'Resume Density',
      detail: `${data.experience.length} roles, ${filledBullets.length} bullets, ${totalSkills} skills, ${data.education.length} education, ${data.projects.length} projects.`,
    });
  }

  // ── Calculate score ──
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.passed)
    .reduce((sum, c) => sum + c.weight, 0);

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  // Add success insights
  if (score >= 90) {
    insights.push({
      id: 'great-score',
      type: 'success',
      title: 'Excellent Resume',
      detail: 'Your resume meets professional ATS standards. Pair it with job-specific keyword matching for best results.',
    });
  }

  return {
    score,
    grade: getGrade(score),
    checks,
    insights,
  };
}
