import { Teacher } from '@/types/user';
import { apiClient } from '@/utils/apiClient';

/**
 * Get a teacher profile by ID
 */
export const getTeacherProfile = async (teacherId: string) => {
  return apiClient.get<Teacher>(`/users/teacher/${teacherId}`);
};

/**
 * Get the current teacher's profile (from auth endpoint)
 */
export const getMyTeacherProfile = async () => {
  return apiClient.get<Teacher>('/auth/me');
};

/**
 * Update a teacher's profile
 */
export const updateTeacherProfile = async (teacherData: Partial<Teacher>) => {
  return apiClient.put<Teacher>('/users/teacher/profile', teacherData);
};

/**
 * Upload a teacher's avatar
 */
export const uploadTeacherAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  
  return apiClient.post<{ avatarUrl: string }>('/auth/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update teacher availability/schedule
 */
export const updateTeacherSchedule = async (teacherId: string, schedule: Array<{day: string, hours: string}>) => {
  return apiClient.put<Teacher>(`/users/availability`, { schedule });
};

/**
 * Add a specialty/subject the teacher can teach
 */
export const addTeacherSpecialization = async (teacherId: string, specialization: string) => {
  return apiClient.post<Teacher>(`/users/teacher/profile`, { 
    specialization: [specialization] 
  });
};

/**
 * Remove a specialty/subject
 */
export const removeTeacherSpecialization = async (teacherId: string, specialization: string) => {
  // Get current profile first, then update without the removed specialization
  const currentProfile = await getTeacherProfile(teacherId);
  const updatedSpecializations = currentProfile.specialization?.filter(spec => spec !== specialization) || [];
  
  return apiClient.put<Teacher>(`/users/teacher/profile`, { 
    specialization: updatedSpecializations 
  });
}; 