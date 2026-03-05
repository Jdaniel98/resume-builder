import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ArrowRight, Lightbulb, Hash, Zap, AlignLeft } from 'lucide-react';
import { enhanceBullet, type EnhancementSuggestion } from '../../utils/bulletEnhancer';

interface BulletEnhancerProps {
  bullet: string;
  onApply: (enhanced: string) => void;
}

const typeIcons: Record<EnhancementSuggestion['type'], typeof Sparkles> = {
  verb: Zap,
  quantify: Hash,
  impact: Lightbulb,
  structure: AlignLeft,
};

const typeColors: Record<EnhancementSuggestion['type'], string> = {
  verb: 'text-purple-600 bg-purple-50 border-purple-200',
  quantify: 'text-amber-600 bg-amber-50 border-amber-200',
  impact: 'text-green-600 bg-green-50 border-green-200',
  structure: 'text-blue-600 bg-blue-50 border-blue-200',
};

export function BulletEnhancer({ bullet, onApply }: BulletEnhancerProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<EnhancementSuggestion[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSuggestions(enhanceBullet(bullet));
    }
  }, [open, bullet]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleApply = (enhanced: string) => {
    onApply(enhanced);
    setOpen(false);
  };

  const disabled = !bullet.trim() || bullet.trim().length < 5;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`p-1 rounded-md transition-all ${
          disabled
            ? 'text-gray-200 cursor-not-allowed'
            : open
              ? 'text-purple-600 bg-purple-50'
              : 'text-gray-300 hover:text-purple-500 hover:bg-purple-50'
        }`}
        title="Enhance bullet point"
      >
        <Sparkles className="w-3.5 h-3.5" />
      </button>

      {open && suggestions.length > 0 && (
        <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-semibold text-gray-700">
                Enhancement Suggestions
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => {
              const Icon = typeIcons[s.type];
              const colors = typeColors[s.type];
              const isActionable = s.enhanced !== bullet.trim();

              return (
                <div
                  key={i}
                  className="rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="px-2.5 py-2">
                    <div className="flex items-start gap-2">
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-md shrink-0 mt-0.5 border ${colors}`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 mb-0.5">
                          {s.label}
                        </p>
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          {s.explanation}
                        </p>
                        {isActionable && (
                          <button
                            type="button"
                            onClick={() => handleApply(s.enhanced)}
                            className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-purple-600 hover:text-purple-700 transition-colors"
                          >
                            <ArrowRight className="w-3 h-3" />
                            Apply suggestion
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {open && suggestions.length === 0 && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-3">
          <div className="flex items-center gap-2 text-green-600">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">Looking good!</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            This bullet point follows best practices. No suggestions at this time.
          </p>
        </div>
      )}
    </div>
  );
}
