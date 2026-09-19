// Central theme file — change colors/spacing here and they apply app-wide.

export const colors = {
  background: '#F5F6F8',
  surface: '#FFFFFF',
  border: '#E4E6EB',
  textPrimary: '#15181E',
  textSecondary: '#6B7280',
  textFaint: '#9AA1AC',
  accent: '#3F63F6',
  danger: '#E4483C',
  overlay: 'rgba(15, 17, 21, 0.45)',
};

// Palette a task/label color is chosen from. Kept small and distinct
// so chips stay legible against light backgrounds.
export const labelPalette = [
  '#3F63F6', // blue
  '#E4483C', // red
  '#F5A623', // orange
  '#2FB380', // green
  '#9B51E0', // purple
  '#EA4C89', // pink
  '#00A9C7', // teal
  '#7A6B57', // brown
];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};
