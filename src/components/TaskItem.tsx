import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Label, Task } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import LabelChip from './LabelChip';

type Props = {
  task: Task;
  labels: Label[];
  onToggleDone: () => void;
  onPress: () => void;
  onDelete: () => void;
};

export default function TaskItem({ task, labels, onToggleDone, onPress, onDelete }: Props) {
  const taskLabels = labels.filter((l) => task.labelIds.includes(l.id));

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Pressable onPress={onToggleDone} hitSlop={10} style={styles.checkboxWrap}>
        <View style={[styles.checkbox, task.done && styles.checkboxDone]}>
          {task.done && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </Pressable>

      <View style={styles.body}>
        <Text
          style={[typography.body, styles.title, task.done && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {!!task.dueDate && (
          <Text style={styles.dueDate}>Due {task.dueDate}</Text>
        )}

        {taskLabels.length > 0 && (
          <View style={styles.labelRow}>
            {taskLabels.map((l) => (
              <LabelChip key={l.id} name={l.name} color={l.color} size="sm" />
            ))}
          </View>
        )}
      </View>

      <Pressable onPress={onDelete} hitSlop={10} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color={colors.textFaint} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkboxWrap: {
    paddingTop: 2,
    marginRight: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  body: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textFaint,
  },
  dueDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  deleteBtn: {
    paddingLeft: spacing.sm,
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
});
