export interface DeveloperResponseDTO {
  id: string;
  userId: string | null;
  fullName: string;
  title: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  resumeUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  websiteUrl: string | null;
  location: string | null;
  yearsExperience: number | null;
  availableForHire: boolean;
  createdAt: Date;
  updatedAt: Date;
}
