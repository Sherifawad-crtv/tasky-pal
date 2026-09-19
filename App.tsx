import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Label, Task } from './src/types';
import {
  DEFAULT_LABELS,
  loadLabels,
  loadTasks,
  saveLabels,
  saveTasks,
} from './src/storage';
import { colors, radius, spacing, typography } from './src/theme';
import LabelChip from './src/components/LabelChip';
import TaskItem from './src/components/TaskItem';
import TaskFormModal from './src/components/TaskFormModal';
import LabelManagerModal from './src/components/LabelManagerModal';

const ALL_FILTER = '__all__';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [activeFilter, setActiveFilter] = useState<string>(ALL_FILTER);
  const [hideDone, setHideDone] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [labelManagerVisible, setLabelManagerVisible] = useState(false);

  // Load persisted data once on mount.
  useEffect(() => {
    (async () => {
      const [storedTasks, storedLabels] = await Promise.all([loadTasks(), loadLabels()]);
      setTasks(storedTasks);
      setLabels(storedLabels.length > 0 ? storedLabels : DEFAULT_LABELS);
      setLoaded(true);
    })();
  }, []);

  // Persist whenever data changes (skip the initial empty render).
  useEffect(() => {
    if (loaded) saveTasks(tasks);
  }, [tasks, loaded]);

  useEffect(() => {
    if (loaded) saveLabels(labels);
  }, [labels, loaded]);

  const visibleTasks = useMemo(() => {
    let result = tasks;
    if (activeFilter !== ALL_FILTER) {
      result = result.filter((t) => t.labelIds.includes(activeFilter));
    }
    if (hideDone) {
      result = result.filter((t) => !t.done);
    }
    return [...result].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
  }, [tasks, activeFilter, hideDone]);

  const remainingCount = tasks.filter((t) => !t.done).length;

  function openNewTaskForm() {
    setEditingTask(null);
    setFormVisible(true);
  }

  function openEditTaskForm(task: Task) {
    setEditingTask(task);
    setFormVisible(true);
  }

  function handleSaveTask(data: { title: string; notes?: string; labelIds: string[]; dueDate?: string }) {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      );
    } else {
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: data.title,
        notes: data.notes,
        labelIds: data.labelIds,
        dueDate: data.dueDate,
        done: false,
        createdAt: Date.now(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setFormVisible(false);
    setEditingTask(null);
  }

  function toggleDone(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function createLabel(name: string, color: string) {
    const newLabel: Label = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      color,
    };
    setLabels((prev) => [...prev, newLabel]);
  }

  function renameLabel(id: string, name: string) {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  }

  function recolorLabel(id: string, color: string) {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, color } : l)));
  }

  function deleteLabel(id: string) {
    setLabels((prev) => prev.filter((l) => l.id !== id));
    setTasks((prev) =>
      prev.map((t) => ({ ...t, labelIds: t.labelIds.filter((lid) => lid !== id) }))
    );
    if (activeFilter === id) setActiveFilter(ALL_FILTER);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />

        <View style={styles.header}>
          <View>
            <Text style={typography.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left
            </Text>
          </View>
          <Pressable onPress={() => setHideDone((v) => !v)} hitSlop={8} style={styles.hideDoneBtn}>
            <Ionicons
              name={hideDone ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.filterBarWrap}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: ALL_FILTER, name: 'All', color: colors.textSecondary }, ...labels]}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.filterBar}
            renderItem={({ item }) => (
              <LabelChip
                name={item.name}
                color={item.color}
                selected={activeFilter === item.id}
                onPress={() => setActiveFilter(item.id)}
              />
            )}
          />
          <Pressable onPress={() => setLabelManagerVisible(true)} hitSlop={8} style={styles.manageLabelsBtn}>
            <Ionicons name="pricetags-outline" size={16} color={colors.accent} />
          </Pressable>
        </View>

        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              labels={labels}
              onToggleDone={() => toggleDone(item.id)}
              onPress={() => openEditTaskForm(item)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          ListEmptyComponent={
            loaded ? (
              <View style={styles.emptyState}>
                <Ionicons name="checkmark-done-circle-outline" size={40} color={colors.textFaint} />
                <Text style={styles.emptyText}>
                  {activeFilter === ALL_FILTER ? 'No tasks yet. Add your first one!' : 'No tasks with this label.'}
                </Text>
              </View>
            ) : null
          }
        />

        <Pressable style={styles.fab} onPress={openNewTaskForm}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>

        <TaskFormModal
          visible={formVisible}
          labels={labels}
          initialTask={editingTask}
          onClose={() => {
            setFormVisible(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          onManageLabels={() => setLabelManagerVisible(true)}
        />

        <LabelManagerModal
          visible={labelManagerVisible}
          labels={labels}
          onClose={() => setLabelManagerVisible(false)}
          onCreate={createLabel}
          onRename={renameLabel}
          onRecolor={recolorLabel}
          onDelete={deleteLabel}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  hideDoneBtn: {
    padding: 6,
  },
  filterBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterBar: {
    paddingRight: spacing.sm,
    alignItems: 'center',
  },
  manageLabelsBtn: {
    padding: 8,
    marginRight: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyText: {
    color: colors.textFaint,
    marginTop: spacing.sm,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});
