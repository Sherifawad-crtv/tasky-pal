import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label, Task } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import LabelChip from './LabelChip';

type Props = {
  visible: boolean;
  labels: Label[];
  initialTask?: Task | null;
  onClose: () => void;
  onSave: (data: { title: string; notes?: string; labelIds: string[]; dueDate?: string }) => void;
  onManageLabels: () => void;
};

export default function TaskFormModal({
  visible,
  labels,
  initialTask,
  onClose,
  onSave,
  onManageLabels,
}: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setTitle(initialTask?.title ?? '');
      setNotes(initialTask?.notes ?? '');
      setDueDate(initialTask?.dueDate ?? '');
      setSelectedLabelIds(initialTask?.labelIds ?? []);
    }
  }, [visible, initialTask]);

  function toggleLabel(id: string) {
    setSelectedLabelIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      notes: notes.trim() || undefined,
      labelIds: selectedLabelIds,
      dueDate: dueDate.trim() || undefined,
    });
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={typography.subtitle}>{initialTask ? 'Edit Task' : 'New Task'}</Text>
          <Pressable onPress={handleSave} hitSlop={8} disabled={!title.trim()}>
            <Text style={[styles.saveText, !title.trim() && styles.saveTextDisabled]}>Save</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor={colors.textFaint}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Text style={styles.label}>Due date (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2026-09-25"
            placeholderTextColor={colors.textFaint}
            value={dueDate}
            onChangeText={setDueDate}
          />

          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Add details..."
            placeholderTextColor={colors.textFaint}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.labelsHeaderRow}>
            <Text style={styles.label}>Labels</Text>
            <Pressable onPress={onManageLabels} hitSlop={8}>
              <View style={styles.manageRow}>
                <Ionicons name="settings-outline" size={14} color={colors.accent} />
                <Text style={styles.manageText}>Manage</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.labelsWrap}>
            {labels.length === 0 && (
              <Text style={styles.emptyLabelsText}>No labels yet — tap Manage to add one.</Text>
            )}
            {labels.map((l) => (
              <LabelChip
                key={l.id}
                name={l.name}
                color={l.color}
                selected={selectedLabelIds.includes(l.id)}
                onPress={() => toggleLabel(l.id)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  saveText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  saveTextDisabled: {
    color: colors.textFaint,
  },
  scrollContent: {
    padding: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  labelsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  manageText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  labelsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyLabelsText: {
    color: colors.textFaint,
    fontSize: 13,
  },
});
