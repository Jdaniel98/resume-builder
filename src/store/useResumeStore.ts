import { create } from 'zustand';
import type {
  ResumeData,
  TemplateName,
  PersonalInfo,
  WorkExperience,
  Education,
  SkillGroup,
  Project,
} from '../types/resume';
import { defaultResume } from '../data/defaultResume';
import { loadFromLocalStorage, saveToLocalStorage, clearLocalStorage } from '../utils/autosave';

const savedData = loadFromLocalStorage();

interface ResumeStore {
  resumeData: ResumeData;
  templateName: TemplateName;
  darkMode: boolean;

  updatePersonal: (field: keyof PersonalInfo, value: string) => void;

  addExperience: () => void;
  updateExperience: (id: string, updates: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (fromIndex: number, toIndex: number) => void;

  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkillGroup: () => void;
  updateSkillGroup: (id: string, updates: Partial<SkillGroup>) => void;
  removeSkillGroup: (id: string) => void;

  addProject: () => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;

  setTemplate: (name: TemplateName) => void;
  toggleDarkMode: () => void;
  loadFromJson: (data: ResumeData) => void;
  resetToDefault: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: savedData ?? defaultResume,
  templateName: 'classic',
  darkMode: localStorage.getItem('resume-builder-dark') === 'true',

  updatePersonal: (field, value) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personal: { ...state.resumeData.personal, [field]: value },
      },
    })),

  addExperience: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [
          ...state.resumeData.experience,
          {
            id: crypto.randomUUID(),
            company: '',
            role: '',
            location: '',
            startDate: '',
            endDate: '',
            bullets: [''],
          },
        ],
      },
    })),

  updateExperience: (id, updates) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((exp) =>
          exp.id === id ? { ...exp, ...updates } : exp
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((exp) => exp.id !== id),
      },
    })),

  reorderExperience: (fromIndex, toIndex) =>
    set((state) => {
      const arr = [...state.resumeData.experience];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return { resumeData: { ...state.resumeData, experience: arr } };
    }),

  addEducation: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          {
            id: crypto.randomUUID(),
            institution: '',
            degree: '',
            location: '',
            startDate: '',
            endDate: '',
            details: '',
          },
        ],
      },
    })),

  updateEducation: (id, updates) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...updates } : edu
        ),
      },
    })),

  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id),
      },
    })),

  addSkillGroup: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [
          ...state.resumeData.skills,
          { id: crypto.randomUUID(), category: '', items: [''] },
        ],
      },
    })),

  updateSkillGroup: (id, updates) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((sg) =>
          sg.id === id ? { ...sg, ...updates } : sg
        ),
      },
    })),

  removeSkillGroup: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((sg) => sg.id !== id),
      },
    })),

  addProject: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [
          ...state.resumeData.projects,
          {
            id: crypto.randomUUID(),
            name: '',
            description: '',
            url: '',
            technologies: [],
          },
        ],
      },
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((proj) =>
          proj.id === id ? { ...proj, ...updates } : proj
        ),
      },
    })),

  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((proj) => proj.id !== id),
      },
    })),

  setTemplate: (name) => set({ templateName: name }),

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode;
      localStorage.setItem('resume-builder-dark', String(next));
      document.body.classList.toggle('dark-mode', next);
      return { darkMode: next };
    }),

  loadFromJson: (data) => set({ resumeData: data }),

  resetToDefault: () => {
    clearLocalStorage();
    set({ resumeData: defaultResume });
  },
}));

// Auto-save on every resumeData change
useResumeStore.subscribe(
  (state) => saveToLocalStorage(state.resumeData)
);
