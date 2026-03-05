import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';

export function EditorPanel() {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-3 bg-gray-50/50">
      <PersonalInfoForm />
      <ExperienceForm />
      <EducationForm />
      <SkillsForm />
      <ProjectsForm />
      <div className="pb-4" />
    </div>
  );
}
