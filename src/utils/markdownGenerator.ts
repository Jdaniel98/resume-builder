import type { ResumeData } from '../types/resume';

export function generateMarkdown(data: ResumeData): string {
  const sections: string[] = [];

  // Header
  sections.push(`# ${data.personal.fullName || 'Your Name'}`);
  if (data.personal.title) {
    sections.push(`**${data.personal.title}**`);
  }

  // Contact line
  const contactParts = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.website ? `[Website](${data.personal.website})` : '',
    data.personal.linkedin ? `[LinkedIn](${data.personal.linkedin})` : '',
  ].filter(Boolean);
  if (contactParts.length > 0) {
    sections.push(contactParts.join(' | '));
  }

  // Summary
  if (data.personal.summary) {
    sections.push(`## Summary\n\n${data.personal.summary}`);
  }

  // Experience
  const filledExperience = data.experience.filter(
    (exp) => exp.company || exp.role
  );
  if (filledExperience.length > 0) {
    const expLines = ['## Experience'];
    for (const exp of filledExperience) {
      const title = [exp.role, exp.company].filter(Boolean).join(' at ');
      expLines.push(`### ${title}`);
      const meta = [
        exp.startDate || exp.endDate
          ? `*${exp.startDate} – ${exp.endDate}*`
          : '',
        exp.location,
      ]
        .filter(Boolean)
        .join(' | ');
      if (meta) expLines.push(meta);
      const filledBullets = exp.bullets.filter(Boolean);
      if (filledBullets.length > 0) {
        expLines.push(filledBullets.map((b) => `- ${b}`).join('\n'));
      }
    }
    sections.push(expLines.join('\n\n'));
  }

  // Education
  const filledEducation = data.education.filter(
    (edu) => edu.institution || edu.degree
  );
  if (filledEducation.length > 0) {
    const eduLines = ['## Education'];
    for (const edu of filledEducation) {
      if (edu.degree) eduLines.push(`### ${edu.degree}`);
      const meta = [
        edu.institution ? `*${edu.institution}*` : '',
        edu.startDate || edu.endDate
          ? `${edu.startDate} – ${edu.endDate}`
          : '',
      ]
        .filter(Boolean)
        .join(' | ');
      if (meta) eduLines.push(meta);
      if (edu.details) eduLines.push(edu.details);
    }
    sections.push(eduLines.join('\n\n'));
  }

  // Skills
  const filledSkills = data.skills.filter(
    (sg) => sg.category && sg.items.some(Boolean)
  );
  if (filledSkills.length > 0) {
    const skillLines = ['## Skills'];
    for (const group of filledSkills) {
      skillLines.push(
        `**${group.category}:** ${group.items.filter(Boolean).join(', ')}`
      );
    }
    sections.push(skillLines.join('\n\n'));
  }

  // Projects
  const filledProjects = data.projects.filter((p) => p.name);
  if (filledProjects.length > 0) {
    const projLines = ['## Projects'];
    for (const proj of filledProjects) {
      const link = proj.url ? ` ([link](${proj.url}))` : '';
      projLines.push(`### ${proj.name}${link}`);
      if (proj.description) projLines.push(proj.description);
      const techs = proj.technologies.filter(Boolean);
      if (techs.length > 0) {
        projLines.push(`*Technologies: ${techs.join(', ')}*`);
      }
    }
    sections.push(projLines.join('\n\n'));
  }

  return sections.join('\n\n');
}
