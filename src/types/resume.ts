export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: WorkExperience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
}

export type TemplateName = 'classic' | 'modern' | 'minimal';
