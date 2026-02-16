import { useState } from 'react';
import type { TeacherId } from '../types';
import { TEACHERS } from '../data/constants';

const STORAGE_KEY = 'shift_selected_teacher';

export function useTeacherAuth() {
  const [teacherId, setTeacherId] = useState<TeacherId | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TEACHERS.some((t) => t.id === stored)) {
      return stored as TeacherId;
    }
    return null;
  });

  const selectTeacher = (id: TeacherId) => {
    localStorage.setItem(STORAGE_KEY, id);
    setTeacherId(id);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTeacherId(null);
  };

  return { teacherId, selectTeacher, logout };
}
