import { useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useResumeStore } from '../../store/useResumeStore';
import { generateMarkdown } from '../../utils/markdownGenerator';

export function ResumePreview() {
  const resumeData = useResumeStore((s) => s.resumeData);
  const templateName = useResumeStore((s) => s.templateName);

  const markdown = useMemo(() => generateMarkdown(resumeData), [resumeData]);

  return (
    <div
      className="resume-preview"
      data-template={templateName}
    >
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
}
