import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography } from '../theme';

type Props = {
  name: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
};

// A pill-shaped label chip. Used both as a static tag on a task card
// and as a tappable filter/picker option (pass onPress + selected).
export default function LabelChip({ name, color, selected, onPress, size = 'md' }: Props) {
  const isInteractive = !!onPress;
  const content = (
    <View
      style={[
        styles.chip,
        size === 'sm' && styles.chipSm,
        {
          backgroundColor: selected === false ? 'transparent' : withAlpha(color, 0.15),
          borderColor: color,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text
        style={[
          size === 'sm' ? typography.caption : typography.caption,
          { color, fontWeight: '600' },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  );

  if (!isInteractive) return content;

  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {content}
    </Pressable>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});
