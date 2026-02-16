import { useState, useEffect, useCallback } from 'react';
import type { TeacherId, SlotId, StatusKey, FullSchedule, ShiftPreferenceRow } from '../types';
import { SLOTS, DATES, initSchedule } from '../data/constants';
import { supabase } from '../lib/supabase';

export function useShiftPreferences() {
  const [schedule, setSchedule] = useState<FullSchedule>(initSchedule);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('shift_preferences')
      .select('*');

    if (fetchError) {
      setError('データの読み込みに失敗しました');
      setLoading(false);
      return;
    }

    const fresh = initSchedule();
    for (const row of data as ShiftPreferenceRow[]) {
      if (fresh[row.teacher_id]) {
        const cellKey = `${row.date_key}_${row.slot_id}`;
        if (cellKey in fresh[row.teacher_id]) {
          fresh[row.teacher_id][cellKey] = row.status;
        }
      }
    }
    setSchedule(fresh);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel('shift_preferences_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shift_preferences' },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            const old = payload.old as ShiftPreferenceRow;
            if (old.teacher_id && old.date_key && old.slot_id) {
              setSchedule((prev) => ({
                ...prev,
                [old.teacher_id]: {
                  ...prev[old.teacher_id],
                  [`${old.date_key}_${old.slot_id}`]: null,
                },
              }));
            }
          } else {
            const row = payload.new as ShiftPreferenceRow;
            setSchedule((prev) => ({
              ...prev,
              [row.teacher_id]: {
                ...prev[row.teacher_id],
                [`${row.date_key}_${row.slot_id}`]: row.status,
              },
            }));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAll]);

  const updatePreference = useCallback(
    async (
      teacherId: TeacherId,
      dateKey: string,
      slotId: SlotId,
      status: StatusKey | null,
    ): Promise<string | null> => {
      const cellKey = `${dateKey}_${slotId}`;
      const previousValue = schedule[teacherId]?.[cellKey] ?? null;

      // Optimistic update
      setSchedule((prev) => ({
        ...prev,
        [teacherId]: { ...prev[teacherId], [cellKey]: status },
      }));

      try {
        if (status === null) {
          const { error: delError } = await supabase
            .from('shift_preferences')
            .delete()
            .eq('teacher_id', teacherId)
            .eq('date_key', dateKey)
            .eq('slot_id', slotId);
          if (delError) throw delError;
        } else {
          const { error: upsertError } = await supabase
            .from('shift_preferences')
            .upsert(
              { teacher_id: teacherId, date_key: dateKey, slot_id: slotId, status },
              { onConflict: 'teacher_id,date_key,slot_id' },
            );
          if (upsertError) throw upsertError;
        }
      } catch {
        // Revert on failure
        setSchedule((prev) => ({
          ...prev,
          [teacherId]: { ...prev[teacherId], [cellKey]: previousValue },
        }));
        return '保存に失敗しました。ネットワークを確認してください。';
      }
      return null;
    },
    [schedule],
  );

  const fillAllPreferences = useCallback(
    async (
      teacherId: TeacherId,
      status: StatusKey | null,
    ): Promise<string | null> => {
      const operations: Array<{ date_key: string; slot_id: SlotId }> = [];
      for (const d of DATES) {
        if (d.isClosed) continue;
        for (const sl of SLOTS) {
          operations.push({ date_key: d.key, slot_id: sl.id });
        }
      }

      // Optimistic update
      setSchedule((prev) => {
        const updated = { ...prev[teacherId] };
        for (const op of operations) {
          updated[`${op.date_key}_${op.slot_id}`] = status;
        }
        return { ...prev, [teacherId]: updated };
      });

      try {
        if (status === null) {
          const { error: delError } = await supabase
            .from('shift_preferences')
            .delete()
            .eq('teacher_id', teacherId);
          if (delError) throw delError;
        } else {
          const rows = operations.map((op) => ({
            teacher_id: teacherId,
            date_key: op.date_key,
            slot_id: op.slot_id,
            status,
          }));
          const { error: upsertError } = await supabase
            .from('shift_preferences')
            .upsert(rows, { onConflict: 'teacher_id,date_key,slot_id' });
          if (upsertError) throw upsertError;
        }
      } catch {
        await fetchAll();
        return '一括保存に失敗しました。';
      }
      return null;
    },
    [fetchAll],
  );

  const getStats = useCallback(
    (tid: TeacherId) => {
      const entries = Object.values(schedule[tid]);
      return {
        ok: entries.filter((v) => v === 'ok').length,
        maybe: entries.filter((v) => v === 'maybe').length,
        ng: entries.filter((v) => v === 'ng').length,
        filled: entries.filter((v) => v !== null).length,
      };
    },
    [schedule],
  );

  return { schedule, loading, error, updatePreference, fillAllPreferences, getStats, refetch: fetchAll };
}
