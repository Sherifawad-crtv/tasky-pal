import AsyncStorage from '@react-native-async-storage/async-storage';
import { Label, Task } from './types';

const TASKS_KEY = '@tasklabels/tasks';
const LABELS_KEY = '@tasklabels/labels';

export async function loadTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function loadLabels(): Promise<Label[]> {
  try {
    const raw = await AsyncStorage.getItem(LABELS_KEY);
    return raw ? (JSON.parse(raw) as Label[]) : [];
  } catch {
    return [];
  }
}

export async function saveLabels(labels: Label[]): Promise<void> {
  await AsyncStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

export const DEFAULT_LABELS: Label[] = [
  { id: 'university', name: 'University', color: '#3F63F6' },
  { id: 'freelance', name: 'Freelance Gig', color: '#2FB380' },
  { id: 'personal', name: 'Personal', color: '#F5A623' },
];
