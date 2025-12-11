export interface CreateDeveloperDTO {
  userId?: string;
  fullName: string;
  title?: string;
  bio?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  location?: string;
  yearsExperience?: number;
  availableForHire?: boolean;
}
