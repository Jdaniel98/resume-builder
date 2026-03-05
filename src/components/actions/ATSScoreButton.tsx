import { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { runATSCheck, type ATSCheck, type ATSCheckResult } from '../../utils/atsChecker';

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
  keywords: 'Keywords & Skills',
};

const categoryOrder: ATSCheck['category'][] = [
  'contact',
  'content',
  'formatting',
  'keywords',
];

export function ATSScoreButton() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<ATSCheckResult | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['content'])
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const resumeData = useResumeStore((s) => s.resumeData);

  useEffect(() => {
    if (open) {
      const checkResult = runATSCheck(resumeData);
      setResult(checkResult);
      // Auto-expand categories with failures
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
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Group checks by category
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
        <div className="absolute right-0 top-full mt-2 w-[340px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header with score */}
          <div
            className={`px-4 py-4 bg-gradient-to-r ${gradeBgColors[result.grade]} text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{result.score}</span>
                  <span className="text-sm opacity-80">/100</span>
                </div>
                <p className="text-xs opacity-90 mt-0.5">ATS Compatibility Score</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="text-xl font-bold">{result.grade}</span>
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

            {/* Score bar */}
            <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                style={{ width: `${result.score}%` }}
              />
            </div>
          </div>

          {/* Checks list */}
          <div className="max-h-80 overflow-y-auto">
            {groupedChecks.map((group) => {
              const passedCount = group.checks.filter((c) => c.passed).length;
              const isExpanded = expandedCategories.has(group.category);

              return (
                <div key={group.category} className="border-b border-gray-100 last:border-0">
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
                                check.passed ? 'text-green-700' : 'text-red-700'
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
          </div>

          {/* Footer summary */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center">
              {result.checks.filter((c) => c.passed).length} of{' '}
              {result.checks.length} checks passed •{' '}
              <span className={gradeColors[result.grade]}>Grade {result.grade}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
