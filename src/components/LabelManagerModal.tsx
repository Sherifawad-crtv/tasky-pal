import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '../types';
import { colors, labelPalette, radius, spacing, typography } from '../theme';

type Props = {
  visible: boolean;
  labels: Label[];
  onClose: () => void;
  onCreate: (name: string, color: string) => void;
  onRename: (id: string, name: string) => void;
  onRecolor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
};

export default function LabelManagerModal({
  visible,
  labels,
  onClose,
  onCreate,
  onRename,
  onRecolor,
  onDelete,
}: Props) {
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(labelPalette[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  function handleCreate() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreate(trimmed, newColor);
    setNewName('');
    setNewColor(labelPalette[(labelPalette.indexOf(newColor) + 1) % labelPalette.length]);
  }

  function startEditing(label: Label) {
    setEditingId(label.id);
    setEditingName(label.name);
  }

  function commitEditing() {
    if (editingId && editingName.trim()) {
      onRename(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  }

  function confirmDelete(label: Label) {
    Alert.alert(
      `Delete "${label.name}"?`,
      'Tasks using this label will keep their other labels.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(label.id) },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={typography.subtitle}>Manage Labels</Text>
          <Pressable onPress={onClose} hitSlop={8}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>

        <FlatList
          data={labels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.createRow}>
              <TextInput
                style={styles.createInput}
                placeholder="New label name"
                placeholderTextColor={colors.textFaint}
                value={newName}
                onChangeText={setNewName}
                onSubmitEditing={handleCreate}
                returnKeyType="done"
              />
              <View style={styles.swatch} />
              <Pressable onPress={handleCreate} style={styles.addBtn} hitSlop={8}>
                <Ionicons name="add" size={20} color="#fff" />
              </Pressable>
            </View>
          }
          ListHeaderComponentStyle={{ marginBottom: spacing.md }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Pressable
                style={[styles.colorDot, { backgroundColor: item.color }]}
                onPress={() => {
                  const nextIndex = (labelPalette.indexOf(item.color) + 1) % labelPalette.length;
                  onRecolor(item.id, labelPalette[nextIndex]);
                }}
              />
              {editingId === item.id ? (
                <TextInput
                  style={styles.editInput}
                  value={editingName}
                  onChangeText={setEditingName}
                  onSubmitEditing={commitEditing}
                  onBlur={commitEditing}
                  autoFocus
                  returnKeyType="done"
                />
              ) : (
                <Pressable style={{ flex: 1 }} onPress={() => startEditing(item)}>
                  <Text style={styles.rowText}>{item.name}</Text>
                </Pressable>
              )}
              <Pressable onPress={() => confirmDelete(item)} hitSlop={10}>
                <Ionicons name="trash-outline" size={18} color={colors.textFaint} />
              </Pressable>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No labels yet. Add one above.</Text>
          }
        />
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
  doneText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  listContent: {
    padding: spacing.md,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: spacing.sm,
  },
  swatch: {
    display: 'none',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.sm,
  },
  rowText: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textFaint,
    marginTop: spacing.lg,
  },
});
