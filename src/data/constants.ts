import type { Teacher, Slot, StatusInfo, StatusKey, DateInfo, TeacherSchedule, FullSchedule } from '../types';

export const TEACHERS: Teacher[] = [
  { id: 'miyake', name: '三宅 悠斗', short: '三宅', avatar: '🧑‍🏫' },
  { id: 'abe', name: '阿部 優希', short: '阿部', avatar: '👩‍🏫' },
  { id: 'ota', name: '太田 梨那', short: '太田', avatar: '👩‍🎓' },
  { id: 'ikeda', name: '池田 大晟', short: '池田', avatar: '🧑‍💼' },
  { id: 'yashiro', name: '矢代 貴司', short: '矢代', avatar: '👨‍🏫' },
];

export const SLOTS: Slot[] = [
  { id: 'day', label: '13:00 – 18:00', tag: '昼の部', icon: '☀️', short: '昼' },
  { id: 'night', label: '18:00 – 21:00', tag: '夜の部', icon: '🌙', short: '夜' },
];

export const STATUSES: StatusInfo[] = [
  { key: 'ok', symbol: '◯', label: '出勤可', color: '#10B981', bg: '#ECFDF5', activeBg: '#D1FAE5', border: '#6EE7B7' },
  { key: 'maybe', symbol: '△', label: '要相談', color: '#F59E0B', bg: '#FFFBEB', activeBg: '#FEF3C7', border: '#FCD34D' },
  { key: 'ng', symbol: '✕', label: '出勤不可', color: '#EF4444', bg: '#FEF2F2', activeBg: '#FEE2E2', border: '#FCA5A5' },
];

export const STATUS_MAP: Record<StatusKey, StatusInfo> = {
  ok: STATUSES[0],
  maybe: STATUSES[1],
  ng: STATUSES[2],
};

function generateDates(): DateInfo[] {
  const dates: DateInfo[] = [];
  const start = new Date(2026, 2, 25);
  const end = new Date(2026, 3, 4);
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const isClosed = d.getMonth() === 2 && d.getDate() === 29;
    dates.push({
      key: `${d.getMonth() + 1}/${d.getDate()}`,
      month: d.getMonth() + 1,
      date: d.getDate(),
      day: dayNames[d.getDay()],
      isSunday: d.getDay() === 0,
      isSaturday: d.getDay() === 6,
      isClosed,
    });
  }
  return dates;
}

export const DATES = generateDates();
export const TOTAL_SLOTS = DATES.filter((d) => !d.isClosed).length * SLOTS.length;

export function initSchedule(): FullSchedule {
  const s = {} as FullSchedule;
  TEACHERS.forEach((t) => {
    s[t.id] = {} as TeacherSchedule;
    DATES.forEach((d) => {
      if (d.isClosed) return;
      SLOTS.forEach((sl) => {
        s[t.id][`${d.key}_${sl.id}`] = null;
      });
    });
  });
  return s;
}
