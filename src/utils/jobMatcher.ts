/**
 * Job Description keyword extraction and resume matching engine.
 * Extracts meaningful keywords/phrases from a JD and compares them
 * against the resume's skills, bullets, summary, and titles.
 */

import type { ResumeData } from '../types/resume';

// ── Common stop words to ignore ──
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
  'it', 'its', 'you', 'your', 'we', 'our', 'they', 'their', 'he', 'she',
  'this', 'that', 'these', 'those', 'what', 'which', 'who', 'whom',
  'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'just', 'about', 'above',
  'after', 'again', 'also', 'any', 'as', 'before', 'between', 'during',
  'here', 'into', 'if', 'then', 'up', 'out', 'over', 'under',
  'able', 'work', 'working', 'including', 'etc', 'using', 'well',
  'looking', 'join', 'team', 'role', 'position', 'company', 'ideal',
  'candidate', 'opportunity', 'responsibilities', 'requirements',
  'qualifications', 'benefits', 'apply', 'experience', 'years',
  'strong', 'excellent', 'good', 'great', 'preferred', 'required',
  'plus', 'minimum', 'equivalent', 'related', 'relevant', 'similar',
  'based', 'within', 'across', 'ensure', 'provide', 'support',
  'new', 'get', 'make', 'take', 'like', 'know', 'want', 'think',
  'see', 'come', 'go', 'say', 'give', 'tell', 'one', 'two',
]);

// ── Known multi-word technical terms ──
const MULTI_WORD_TERMS = [
  'machine learning', 'deep learning', 'natural language processing',
  'computer vision', 'data science', 'data engineering', 'data analysis',
  'full stack', 'front end', 'back end', 'ci cd', 'ci/cd',
  'project management', 'product management', 'user experience',
  'user interface', 'quality assurance', 'test driven', 'unit testing',
  'integration testing', 'agile methodology', 'scrum master',
  'version control', 'object oriented', 'design patterns',
  'cloud computing', 'cloud infrastructure', 'web development',
  'mobile development', 'cross functional', 'problem solving',
  'rest api', 'restful api', 'api design', 'api development',
  'microservices architecture', 'event driven', 'real time',
  'open source', 'supply chain', 'business intelligence',
  'google cloud', 'google cloud platform', 'amazon web services',
  'azure devops', 'power bi', 'visual studio',
  'spring boot', 'ruby on rails', 'react native', 'vue js',
  'node js', 'next js', 'express js', 'angular js',
  'type script', 'java script',
  'sql server', 'no sql', 'postgres sql',
  'time series', 'a b testing', 'key performance',
];

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  /** Where the keyword was found in the resume */
  foundIn: ('skills' | 'bullets' | 'summary' | 'title' | 'role')[];
  /** Importance: how many times it appeared in the JD */
  frequency: number;
  /** Whether this looks like a hard skill (technical) vs soft/generic */
  isHardSkill: boolean;
}

export interface JobMatchResult {
  /** Overall match percentage 0-100 */
  matchScore: number;
  /** Total keywords extracted */
  totalKeywords: number;
  /** How many were found in the resume */
  matchedCount: number;
  /** Matched keywords */
  matched: KeywordMatch[];
  /** Missing keywords */
  missing: KeywordMatch[];
  /** Top missing keywords by frequency (most impactful to add) */
  topMissing: KeywordMatch[];
  /** Hard skill match % */
  hardSkillMatch: number;
  /** Soft/generic match % */
  softSkillMatch: number;
}

// Known hard/technical skill indicators
const HARD_SKILL_INDICATORS = new Set([
  'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
  'node', 'django', 'flask', 'spring', 'rails', 'ruby', 'go', 'golang',
  'rust', 'c++', 'c#', 'swift', 'kotlin', 'php', 'perl', 'scala',
  'sql', 'nosql', 'mongodb', 'postgresql', 'postgres', 'mysql', 'redis',
  'elasticsearch', 'dynamodb', 'cassandra', 'firebase',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'terraform',
  'jenkins', 'gitlab', 'github', 'bitbucket', 'circleci',
  'linux', 'unix', 'bash', 'powershell', 'windows',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap',
  'webpack', 'vite', 'babel', 'rollup', 'parcel', 'esbuild',
  'graphql', 'rest', 'grpc', 'websocket', 'oauth', 'jwt',
  'tensorflow', 'pytorch', 'keras', 'scikit', 'pandas', 'numpy',
  'spark', 'hadoop', 'kafka', 'airflow', 'databricks', 'snowflake',
  'tableau', 'looker', 'grafana', 'prometheus', 'datadog',
  'figma', 'sketch', 'photoshop', 'illustrator', 'xd',
  'jira', 'confluence', 'trello', 'asana', 'notion',
  'git', 'svn', 'mercurial',
  'nginx', 'apache', 'tomcat', 'iis',
  'ssl', 'tls', 'https', 'dns', 'cdn', 'tcp', 'http',
  'api', 'sdk', 'cli', 'gui', 'saas', 'paas', 'iaas',
  'devops', 'sre', 'mlops', 'devsecops',
  'agile', 'scrum', 'kanban', 'waterfall', 'lean',
  'excel', 'powerpoint', 'word', 'outlook',
  'sap', 'salesforce', 'hubspot', 'marketo', 'segment',
  'stripe', 'plaid', 'twilio', 'sendgrid',
  'r', 'matlab', 'stata', 'spss', 'sas',
  'blockchain', 'solidity', 'ethereum', 'web3',
  'openai', 'langchain', 'llm', 'chatgpt', 'gpt',
  'cypress', 'selenium', 'jest', 'mocha', 'pytest', 'junit',
  'storybook', 'chromatic',
  'oauth2', 'saml', 'ldap', 'sso',
  'ci', 'cd', 'cicd',
]);

/**
 * Normalize text for comparison — lowercase, strip punctuation.
 */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s\-\/\+\#\.]/g, '').trim();
}

/**
 * Extract meaningful keywords and phrases from a job description.
 */
export function extractKeywords(jdText: string): Map<string, number> {
  const text = normalize(jdText);
  const keywords = new Map<string, number>();

  // 1. Extract known multi-word terms first
  for (const term of MULTI_WORD_TERMS) {
    const regex = new RegExp(`\\b${term.replace(/[\/\+]/g, '\\$&')}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) {
      const normalized = term.toLowerCase().trim();
      keywords.set(normalized, (keywords.get(normalized) ?? 0) + matches.length);
    }
  }

  // 2. Extract individual words
  const words = text.split(/\s+/);
  for (const word of words) {
    const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
    if (
      clean.length >= 2 &&
      !STOP_WORDS.has(clean) &&
      !/^\d+$/.test(clean)
    ) {
      keywords.set(clean, (keywords.get(clean) ?? 0) + 1);
    }
  }

  // 3. Remove very low-signal words (appeared only once AND not a known hard skill)
  for (const [kw, count] of keywords) {
    if (count <= 1 && !isHardSkill(kw) && kw.split(' ').length === 1 && kw.length < 4) {
      keywords.delete(kw);
    }
  }

  return keywords;
}

function isHardSkill(keyword: string): boolean {
  const lower = keyword.toLowerCase();
  // Direct match
  if (HARD_SKILL_INDICATORS.has(lower)) return true;
  // Check if any word in the keyword is a known hard skill
  for (const word of lower.split(/\s+/)) {
    if (HARD_SKILL_INDICATORS.has(word)) return true;
  }
  // Looks like a technology pattern (e.g., "node.js", "C++", "AWS")
  if (/[.+#]/.test(keyword)) return true;
  if (/^[A-Z]{2,}$/.test(keyword)) return true;
  return false;
}

/**
 * Build a searchable text corpus from the resume.
 */
function buildResumeCorpus(data: ResumeData): {
  skills: string;
  bullets: string;
  summary: string;
  titles: string;
  roles: string;
  all: string;
} {
  const skills = data.skills
    .flatMap((g) => [g.category, ...g.items])
    .filter(Boolean)
    .join(' ');

  const bullets = data.experience
    .flatMap((e) => e.bullets)
    .filter(Boolean)
    .join(' ');

  const summary = data.personal.summary;
  const titles = data.personal.title;
  const roles = data.experience.map((e) => e.role).join(' ');

  const projectText = data.projects
    .flatMap((p) => [p.name, p.description, ...p.technologies])
    .filter(Boolean)
    .join(' ');

  const all = [skills, bullets, summary, titles, roles, projectText].join(' ');

  return { skills, bullets, summary, titles, roles, all };
}

/**
 * Check if a keyword exists in a text corpus (fuzzy).
 */
function findInText(keyword: string, text: string): boolean {
  const normalizedText = normalize(text);
  const normalizedKw = normalize(keyword);
  // Direct substring match
  if (normalizedText.includes(normalizedKw)) return true;
  // Try each word of multi-word keywords
  if (normalizedKw.includes(' ')) {
    const words = normalizedKw.split(' ');
    return words.every((w) => normalizedText.includes(w));
  }
  return false;
}

/**
 * Match job description keywords against resume content.
 */
export function matchJobDescription(
  jdText: string,
  data: ResumeData
): JobMatchResult {
  const keywords = extractKeywords(jdText);
  const corpus = buildResumeCorpus(data);

  const matches: KeywordMatch[] = [];

  for (const [keyword, frequency] of keywords) {
    const foundIn: KeywordMatch['foundIn'] = [];

    if (findInText(keyword, corpus.skills)) foundIn.push('skills');
    if (findInText(keyword, corpus.bullets)) foundIn.push('bullets');
    if (findInText(keyword, corpus.summary)) foundIn.push('summary');
    if (findInText(keyword, corpus.titles)) foundIn.push('title');
    if (findInText(keyword, corpus.roles)) foundIn.push('role');

    matches.push({
      keyword,
      found: foundIn.length > 0,
      foundIn,
      frequency,
      isHardSkill: isHardSkill(keyword),
    });
  }

  // Sort by frequency (most important first)
  matches.sort((a, b) => b.frequency - a.frequency);

  const matched = matches.filter((m) => m.found);
  const missing = matches.filter((m) => !m.found);

  // Hard skill breakdown
  const hardSkills = matches.filter((m) => m.isHardSkill);
  const hardMatched = hardSkills.filter((m) => m.found);
  const softSkills = matches.filter((m) => !m.isHardSkill);
  const softMatched = softSkills.filter((m) => m.found);

  const matchScore =
    matches.length > 0 ? Math.round((matched.length / matches.length) * 100) : 0;

  return {
    matchScore,
    totalKeywords: matches.length,
    matchedCount: matched.length,
    matched,
    missing,
    topMissing: missing
      .filter((m) => m.frequency >= 2 || m.isHardSkill)
      .slice(0, 10),
    hardSkillMatch:
      hardSkills.length > 0
        ? Math.round((hardMatched.length / hardSkills.length) * 100)
        : 100,
    softSkillMatch:
      softSkills.length > 0
        ? Math.round((softMatched.length / softSkills.length) * 100)
        : 100,
  };
}
