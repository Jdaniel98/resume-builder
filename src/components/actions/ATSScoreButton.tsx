import { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  FileSearch,
  Target,
  Info,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  runATSCheck,
  type ATSCheck,
  type ATSCheckResult,
  type ATSInsight,
} from '../../utils/atsChecker';
import {
  matchJobDescription,
  type JobMatchResult,
} from '../../utils/jobMatcher';

// ── Grade styling ──
const gradeColors: Record<ATSCheckResult['grade'], string> = {
  A: 'text-green-600',
  B: 'text-blue-600',
  C: 'text-amber-600',
  D: 'text-orange-600',
  F: 'text-red-600',
};

const gradeBgColors: Record<ATSCheckResult['grade'], string> = {
  A: 'from-green-500 to-emerald-500',
  B: 'from-blue-500 to-cyan-500',
  C: 'from-amber-500 to-yellow-500',
  D: 'from-orange-500 to-amber-500',
  F: 'from-red-500 to-rose-500',
};

const categoryLabels: Record<ATSCheck['category'], string> = {
  contact: 'Contact Information',
  content: 'Content Quality',
  formatting: 'Formatting & Structure',
  consistency: 'Consistency & Polish',
};

const categoryOrder: ATSCheck['category'][] = [
  'content',
  'contact',
  'consistency',
  'formatting',
];

const insightIcons: Record<ATSInsight['type'], typeof Info> = {
  warning: AlertTriangle,
  info: Info,
  success: Sparkles,
};

const insightColors: Record<ATSInsight['type'], string> = {
  warning: 'text-amber-600 bg-amber-50 border-amber-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200',
  success: 'text-green-600 bg-green-50 border-green-200',
};

// ── Score ring component ──
function ScoreRing({
  score,
  size = 72,
  stroke = 5,
  color,
}: {
  score: number;
  size?: number;
  stroke?: number;
  color: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-white/20"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

// ── Main component ──
export function ATSScoreButton() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'check' | 'match'>('check');
  const [result, setResult] = useState<ATSCheckResult | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatchResult | null>(null);
  const [jdText, setJdText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const resumeData = useResumeStore((s) => s.resumeData);

  // Run ATS check when panel opens or resume changes
  useEffect(() => {
    if (open) {
      const checkResult = runATSCheck(resumeData);
      setResult(checkResult);
      const failedCategories = new Set(
        checkResult.checks
          .filter((c) => !c.passed)
          .map((c) => c.category)
      );
      setExpandedCategories(
        failedCategories.size > 0 ? failedCategories : new Set(['content'])
      );
    }
  }, [open, resumeData]);

  // Run job match when JD text changes
  useEffect(() => {
    if (jdText.trim().length > 30) {
      const matchResult = matchJobDescription(jdText, resumeData);
      setJobMatch(matchResult);
    } else {
      setJobMatch(null);
    }
  }, [jdText, resumeData]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const groupedChecks = result
    ? categoryOrder
        .map((cat) => ({
          category: cat,
          label: categoryLabels[cat],
          checks: result.checks.filter((c) => c.category === cat),
        }))
        .filter((g) => g.checks.length > 0)
    : [];

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
          open
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }`}
        title="ATS Score Checker"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">ATS Score</span>
      </button>

      {open && result && (
        <div className="absolute right-0 top-full mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* ── Header with score ── */}
          <div
            className={`px-4 py-4 bg-gradient-to-r ${gradeBgColors[result.grade]} text-white`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ScoreRing score={result.score} color="white" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{result.score}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    ATS Score: Grade {result.grade}
                  </p>
                  <p className="text-xs opacity-80 mt-0.5">
                    {result.checks.filter((c) => c.passed).length}/
                    {result.checks.length} checks passed
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('check')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'check'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              Resume Check
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('match')}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                activeTab === 'match'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Job Match
              {jobMatch && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    jobMatch.matchScore >= 70
                      ? 'bg-green-100 text-green-700'
                      : jobMatch.matchScore >= 40
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {jobMatch.matchScore}%
                </span>
              )}
            </button>
          </div>

          {/* ── Tab content ── */}
          <div className="max-h-[400px] overflow-y-auto">
            {activeTab === 'check' && (
              <>
                {/* Category checks */}
                {groupedChecks.map((group) => {
                  const passedCount = group.checks.filter(
                    (c) => c.passed
                  ).length;
                  const isExpanded = expandedCategories.has(group.category);

                  return (
                    <div
                      key={group.category}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => toggleCategory(group.category)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">
                            {group.label}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                              passedCount === group.checks.length
                                ? 'bg-green-50 text-green-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            {passedCount}/{group.checks.length}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                            isExpanded ? '' : '-rotate-90'
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-2.5 space-y-1">
                          {group.checks.map((check) => (
                            <div
                              key={check.id}
                              className={`flex items-start gap-2 px-2.5 py-2 rounded-lg text-xs ${
                                check.passed
                                  ? 'bg-green-50/50'
                                  : 'bg-red-50/50'
                              }`}
                            >
                              {check.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                              )}
                              <div>
                                <p
                                  className={`font-medium ${
                                    check.passed
                                      ? 'text-green-700'
                                      : 'text-red-700'
                                  }`}
                                >
                                  {check.label}
                                </p>
                                {!check.passed && (
                                  <p className="text-gray-500 mt-0.5 leading-relaxed">
                                    {check.tip}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Insights */}
                {result.insights.length > 0 && (
                  <div className="px-4 py-3 space-y-2 border-t border-gray-100">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Insights
                    </p>
                    {result.insights.map((insight) => {
                      const Icon = insightIcons[insight.type];
                      const colors = insightColors[insight.type];
                      return (
                        <div
                          key={insight.id}
                          className={`flex items-start gap-2 px-2.5 py-2 rounded-lg text-xs border ${colors}`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{insight.title}</p>
                            <p className="opacity-80 mt-0.5 leading-relaxed whitespace-pre-line">
                              {insight.detail}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeTab === 'match' && (
              <div className="p-4 space-y-3">
                {/* JD input */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Paste the job description
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the full job posting here to see how well your resume matches the requirements..."
                    rows={4}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {jdText.trim().length > 0
                      ? `${jdText.trim().split(/\s+/).length} words`
                      : 'Minimum 30 characters for analysis'}
                  </p>
                </div>

                {/* Match results */}
                {jobMatch && (
                  <>
                    {/* Score summary */}
                    <div className="grid grid-cols-3 gap-2">
                      <div
                        className={`text-center p-2.5 rounded-lg border ${
                          jobMatch.matchScore >= 70
                            ? 'bg-green-50 border-green-200'
                            : jobMatch.matchScore >= 40
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <p className="text-lg font-bold">
                          {jobMatch.matchScore}%
                        </p>
                        <p className="text-[10px] text-gray-500">Overall</p>
                      </div>
                      <div
                        className={`text-center p-2.5 rounded-lg border ${
                          jobMatch.hardSkillMatch >= 60
                            ? 'bg-green-50 border-green-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <p className="text-lg font-bold">
                          {jobMatch.hardSkillMatch}%
                        </p>
                        <p className="text-[10px] text-gray-500">Hard Skills</p>
                      </div>
                      <div
                        className={`text-center p-2.5 rounded-lg border ${
                          jobMatch.softSkillMatch >= 60
                            ? 'bg-green-50 border-green-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        <p className="text-lg font-bold">
                          {jobMatch.softSkillMatch}%
                        </p>
                        <p className="text-[10px] text-gray-500">General</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      Matched {jobMatch.matchedCount} of{' '}
                      {jobMatch.totalKeywords} keywords from the job description.
                    </p>

                    {/* Top missing keywords */}
                    {jobMatch.topMissing.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-red-600 mb-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Key Missing Keywords
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {jobMatch.topMissing.map((kw) => (
                            <span
                              key={kw.keyword}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${
                                kw.isHardSkill
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {kw.keyword}
                              {kw.frequency >= 3 && (
                                <span className="text-[9px] opacity-60">
                                  ×{kw.frequency}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          <span className="inline-block w-2 h-2 bg-red-200 rounded-full mr-1 align-middle" />
                          Hard skills
                          <span className="inline-block w-2 h-2 bg-amber-200 rounded-full ml-2 mr-1 align-middle" />
                          General keywords
                        </p>
                      </div>
                    )}

                    {/* Matched keywords */}
                    {jobMatch.matched.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Matched Keywords ({jobMatch.matchedCount})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {jobMatch.matched.slice(0, 20).map((kw) => (
                            <span
                              key={kw.keyword}
                              className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-[10px] border border-green-100"
                              title={`Found in: ${kw.foundIn.join(', ')}`}
                            >
                              {kw.keyword}
                            </span>
                          ))}
                          {jobMatch.matched.length > 20 && (
                            <span className="px-1.5 py-0.5 text-gray-400 text-[10px]">
                              +{jobMatch.matched.length - 20} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!jobMatch && jdText.trim().length > 0 && jdText.trim().length < 30 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    Keep pasting — need at least 30 characters for analysis.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              {activeTab === 'check' ? (
                <>
                  Score based on{' '}
                  <span className={gradeColors[result.grade]}>
                    {result.checks.length} professional checks
                  </span>
                  {' '}• Use Job Match tab for keyword analysis
                </>
              ) : (
                'Paste a job description to compare keywords against your resume'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
