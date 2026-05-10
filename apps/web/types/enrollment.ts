export interface LectureProgress {
  lectureId: string;
  completedAt?: string;
  isCompleted?: boolean;
  progressSec?: number;
  durationSec?: number;
}

export interface EnrolledCourse {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string | null;
  totalLectures?: number;
  instructorName?: string;
  categoryName?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseSlug?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string;
  instructorName?: string;
  enrolledAt: string;
  completedAt?: string | null;
  progress?: number;
  completionPercent?: number;
  lastLectureId?: string | null;
  status?: string;
  course?: EnrolledCourse;
  courseProgress?: {
    completedLectures?: number;
    totalLectures?: number;
    progressPercent?: number;
    lastLectureId?: string | null;
    lastAccessedAt?: string | null;
  };
  lectureProgresses?: LectureProgress[];
}

export interface WishlistCourse {
  id: string;
  slug: string;
  title: string;
  thumbnailUrl?: string | null;
  price?: number;
  compareAtPrice?: number | null;
  averageRating?: number;
  totalStudents?: number;
  studentsCount?: number;
  instructorName?: string;
  level?: string;
  totalLectures?: number;
  durationHours?: number;
  totalDuration?: number;
  categoryName?: string;
}

export interface WishlistItem {
  id: string;
  courseId: string;
  addedAt: string;
  createdAt?: string;
  courseSlug?: string;
  courseTitle?: string;
  courseThumbnailUrl?: string | null;
  course?: WishlistCourse;
}

export interface EnrollmentListResponse {
  items?: Enrollment[];
  data?: Enrollment[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface WishlistListResponse {
  items?: WishlistItem[];
  data?: WishlistItem[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface EnrollmentStatusResponse {
  enrolled: boolean;
}

export interface UpdateProgressDto {
  courseId: string;
  lectureId: string;
  progressSec: number;
  durationSec?: number;
  isCompleted?: boolean;
  totalLectures?: number;
}
