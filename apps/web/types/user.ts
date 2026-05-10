export interface UserPreferences {
  favoriteCategories?: string[];
  learningGoal?: string;
  learningGoals?: string[];
  preferredLanguage?: string;
  topics?: string[];
}

export interface InstructorProfile {
  id?: string;
  displayName: string;
  title?: string;
  about?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  totalStudents?: number;
  totalCourses?: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpsertInstructorProfileDto {
  displayName: string;
  title?: string;
  about?: string;
  websiteUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
}

export interface UserProfile {
  id: string;
  authId?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  headline?: string;
  phone?: string;
  phoneNumber?: string;
  country?: string;
  language?: string;
  bio?: string;
  avatarUrl?: string | null;
  website?: string;
  preferences?: UserPreferences;
  instructorProfile?: InstructorProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileDto {
  fullName?: string;
  headline?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  language?: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName?: string;
  role?: string;
  roles?: string[];
  status: string;
  isEmailVerified?: boolean;
  isInstructor?: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
  instructorProfile?: InstructorProfile | null;
}

export interface AdminUserListResponse {
  items?: AdminUser[];
  data?: AdminUser[];
  total?: number;
  page?: number;
  limit?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
