export type TeacherId = 'miyake' | 'abe' | 'ota' | 'ikeda' | 'yashiro';

export type SlotId = 'day' | 'night';

export type StatusKey = 'ok' | 'maybe' | 'ng';

export interface Teacher {
  id: TeacherId;
  name: string;
  short: string;
  avatar: string;
}

export interface Slot {
  id: SlotId;
  label: string;
  tag: string;
  icon: string;
  short: string;
}

export interface StatusInfo {
  key: StatusKey;
  symbol: string;
  label: string;
  color: string;
  bg: string;
  activeBg: string;
  border: string;
}

export interface DateInfo {
  key: string;
  month: number;
  date: number;
  day: string;
  isSunday: boolean;
  isSaturday: boolean;
  isClosed: boolean;
}

export type CellKey = `${string}_${SlotId}`;

export type TeacherSchedule = Record<string, StatusKey | null>;
export type FullSchedule = Record<TeacherId, TeacherSchedule>;

export interface ShiftPreferenceRow {
  id: string;
  teacher_id: TeacherId;
  date_key: string;
  slot_id: SlotId;
  status: StatusKey;
  updated_at: string;
}

export interface TeacherStats {
  ok: number;
  maybe: number;
  ng: number;
  filled: number;
}
