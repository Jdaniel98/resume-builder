import type { ResumeData } from '../types/resume';

export const defaultResume: ResumeData = {
  personal: {
    fullName: 'Jane Doe',
    title: 'Senior Software Engineer',
    email: 'jane.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    website: 'https://janedoe.dev',
    linkedin: 'https://linkedin.com/in/janedoe',
    summary:
      'Experienced software engineer with 6+ years building scalable web applications. Passionate about clean code, developer experience, and shipping products that users love.',
  },
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'TechCorp',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jan 2022',
      endDate: 'Present',
      bullets: [
        'Led a team of 4 engineers to rebuild the customer dashboard, improving load time by 60%',
        'Designed and implemented a real-time notification system serving 100k+ users',
        'Mentored junior developers through code reviews and pair programming sessions',
      ],
    },
    {
      id: crypto.randomUUID(),
      company: 'StartupXYZ',
      role: 'Software Engineer',
      location: 'Remote',
      startDate: 'Jun 2019',
      endDate: 'Dec 2021',
      bullets: [
        'Built a React component library used across 5 internal products',
        'Reduced API response times by 40% through query optimization and caching',
        'Implemented CI/CD pipelines that cut deployment time from 45 min to 8 min',
      ],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      location: 'Berkeley, CA',
      startDate: '2015',
      endDate: '2019',
      details: 'Graduated with honors. Focus in distributed systems.',
    },
  ],
  skills: [
    {
      id: crypto.randomUUID(),
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'Go', 'SQL'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Frameworks',
      items: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI'],
    },
    {
      id: crypto.randomUUID(),
      category: 'Tools',
      items: ['Git', 'Docker', 'AWS', 'PostgreSQL', 'Redis'],
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      name: 'DevFlow',
      description:
        'An open-source developer productivity tool that integrates with GitHub to automate code review workflows.',
      url: 'https://github.com/janedoe/devflow',
      technologies: ['TypeScript', 'React', 'Node.js', 'GitHub API'],
    },
  ],
};
