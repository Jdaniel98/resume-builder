/**
 * Rule-based bullet point enhancer.
 * Suggests stronger action verbs, quantification, and more impactful phrasing.
 */

const weakVerbs: Record<string, string[]> = {
  helped: ['Facilitated', 'Enabled', 'Accelerated', 'Contributed to'],
  worked: ['Collaborated', 'Partnered', 'Executed', 'Delivered'],
  'worked on': ['Developed', 'Engineered', 'Architected', 'Built'],
  did: ['Executed', 'Delivered', 'Accomplished', 'Completed'],
  made: ['Created', 'Developed', 'Produced', 'Engineered'],
  used: ['Leveraged', 'Utilized', 'Employed', 'Applied'],
  managed: ['Orchestrated', 'Directed', 'Oversaw', 'Spearheaded'],
  responsible: ['Led', 'Owned', 'Drove', 'Championed'],
  'responsible for': ['Led', 'Owned', 'Drove', 'Championed'],
  handled: ['Managed', 'Coordinated', 'Administered', 'Oversaw'],
  improved: ['Optimized', 'Enhanced', 'Elevated', 'Streamlined'],
  changed: ['Transformed', 'Revamped', 'Redesigned', 'Overhauled'],
  increased: ['Boosted', 'Amplified', 'Grew', 'Expanded'],
  decreased: ['Reduced', 'Minimized', 'Cut', 'Lowered'],
  started: ['Launched', 'Initiated', 'Pioneered', 'Spearheaded'],
  ran: ['Directed', 'Orchestrated', 'Operated', 'Managed'],
  showed: ['Demonstrated', 'Presented', 'Showcased', 'Illustrated'],
  wrote: ['Authored', 'Drafted', 'Composed', 'Documented'],
  built: ['Engineered', 'Developed', 'Architected', 'Constructed'],
  fixed: ['Resolved', 'Remediated', 'Debugged', 'Rectified'],
  set: ['Established', 'Implemented', 'Configured', 'Defined'],
  gave: ['Delivered', 'Presented', 'Provided', 'Contributed'],
  got: ['Achieved', 'Obtained', 'Secured', 'Acquired'],
  put: ['Implemented', 'Deployed', 'Installed', 'Integrated'],
  keep: ['Maintained', 'Sustained', 'Preserved', 'Upheld'],
  told: ['Communicated', 'Briefed', 'Advised', 'Informed'],
  talked: ['Presented', 'Communicated', 'Articulated', 'Conveyed'],
  sent: ['Distributed', 'Disseminated', 'Dispatched', 'Transmitted'],
  taught: ['Mentored', 'Trained', 'Coached', 'Educated'],
  created: ['Designed', 'Developed', 'Engineered', 'Established'],
  tested: ['Validated', 'Verified', 'Evaluated', 'Assessed'],
  updated: ['Modernized', 'Revamped', 'Refreshed', 'Upgraded'],
};

const weakPhrasePatterns: Array<{
  pattern: RegExp;
  suggestion: string;
}> = [
  {
    pattern: /^(I |i )/,
    suggestion: 'Remove "I" — start with a strong action verb instead',
  },
  {
    pattern: /^(was |were )/i,
    suggestion: 'Replace passive voice with an active verb (e.g., "Led" instead of "Was leading")',
  },
  {
    pattern: /^(assisted|helped) (with|in) /i,
    suggestion: 'Replace "Assisted with" — describe your specific contribution directly',
  },
  {
    pattern: /duties include/i,
    suggestion: 'Replace "duties include" with accomplishment-focused language',
  },
  {
    pattern: /team player/i,
    suggestion: 'Replace "team player" — show collaboration through specific examples',
  },
  {
    pattern: /various|several|many|multiple/i,
    suggestion: 'Replace vague quantifiers with specific numbers (e.g., "5 projects" not "various projects")',
  },
];

export interface EnhancementSuggestion {
  type: 'verb' | 'quantify' | 'impact' | 'structure';
  label: string;
  enhanced: string;
  explanation: string;
}

/**
 * Capitalize only the first letter of a string.
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate enhancement suggestions for a bullet point.
 */
export function enhanceBullet(bullet: string): EnhancementSuggestion[] {
  const trimmed = bullet.trim();
  if (!trimmed || trimmed.length < 5) return [];

  const suggestions: EnhancementSuggestion[] = [];

  // 1. Check for weak verbs
  const lowerBullet = trimmed.toLowerCase();
  for (const [weak, replacements] of Object.entries(weakVerbs)) {
    const weakPattern = new RegExp(`^${weak}\\b`, 'i');
    if (weakPattern.test(lowerBullet)) {
      const replacement = replacements[Math.floor(Math.random() * replacements.length)];
      const rest = trimmed.replace(new RegExp(`^${weak}\\s*`, 'i'), '');
      suggestions.push({
        type: 'verb',
        label: `Stronger verb: "${replacement}"`,
        enhanced: `${replacement} ${rest.charAt(0).toLowerCase() + rest.slice(1)}`,
        explanation: `"${capitalizeFirst(weak)}" is a weak verb. "${replacement}" sounds more impactful.`,
      });

      // Add a second option
      const replacement2 = replacements.find((r) => r !== replacement) ?? replacements[0];
      if (replacement2 !== replacement) {
        suggestions.push({
          type: 'verb',
          label: `Alternative: "${replacement2}"`,
          enhanced: `${replacement2} ${rest.charAt(0).toLowerCase() + rest.slice(1)}`,
          explanation: `Another strong alternative to "${capitalizeFirst(weak)}".`,
        });
      }
      break;
    }
  }

  // 2. Check for missing quantification
  const hasNumbers = /\d/.test(trimmed);
  if (!hasNumbers) {
    suggestions.push({
      type: 'quantify',
      label: 'Add metrics',
      enhanced: trimmed,
      explanation:
        'Add numbers to quantify your impact (e.g., "by 30%", "for 50+ users", "saving $10K/month"). Bullets with metrics are 40% more likely to catch a recruiter\'s eye.',
    });
  }

  // 3. Check for weak phrase patterns
  for (const { pattern, suggestion } of weakPhrasePatterns) {
    if (pattern.test(trimmed)) {
      suggestions.push({
        type: 'structure',
        label: 'Rephrase',
        enhanced: trimmed,
        explanation: suggestion,
      });
      break;
    }
  }

  // 4. Check if bullet starts with lowercase (not an action verb)
  if (/^[a-z]/.test(trimmed) && suggestions.length === 0) {
    suggestions.push({
      type: 'structure',
      label: 'Start with action verb',
      enhanced: capitalizeFirst(trimmed),
      explanation:
        'Start bullet points with a strong past-tense action verb (e.g., "Developed", "Led", "Optimized").',
    });
  }

  // 5. Check for impact/result clause
  const hasResult =
    /resulting in|leading to|which (led|resulted|increased|decreased|improved|reduced|saved)|saving|increasing|reducing|achieving|by \d/i.test(
      trimmed
    );
  if (!hasResult && trimmed.length > 15) {
    suggestions.push({
      type: 'impact',
      label: 'Add result',
      enhanced: `${trimmed}, resulting in [specific outcome]`,
      explanation:
        'Add a result clause to show business impact (e.g., ", resulting in 25% faster load times" or ", saving the team 10 hours/week").',
    });
  }

  return suggestions.slice(0, 4);
}
