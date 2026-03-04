export interface ValidationError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

export function validateEmail(value: string): string | null {
  if (!value) return null;
  return EMAIL_REGEX.test(value) ? null : 'Invalid email format';
}

export function validateUrl(value: string): string | null {
  if (!value) return null;
  return URL_REGEX.test(value) ? null : 'URL must start with http:// or https://';
}

export function validateRequired(value: string, fieldName: string): string | null {
  return value.trim() ? null : `${fieldName} is required`;
}

export function validatePersonalInfo(personal: {
  fullName: string;
  email: string;
  website: string;
  linkedin: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameErr = validateRequired(personal.fullName, 'Full Name');
  if (nameErr) errors.push({ field: 'fullName', message: nameErr });

  const emailErr = validateEmail(personal.email);
  if (emailErr) errors.push({ field: 'email', message: emailErr });

  const websiteErr = validateUrl(personal.website);
  if (websiteErr) errors.push({ field: 'website', message: websiteErr });

  const linkedinErr = validateUrl(personal.linkedin);
  if (linkedinErr) errors.push({ field: 'linkedin', message: linkedinErr });

  return errors;
}
