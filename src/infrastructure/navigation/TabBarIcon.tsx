import { Ionicons } from '@expo/vector-icons';

interface TabBarIconProps {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
}

export function TabBarIcon({ name, color, focused }: TabBarIconProps) {
  const iconName = focused
    ? name
    : `${name}-outline` as keyof typeof Ionicons.glyphMap;

  return (
    <Ionicons
      name={iconName}
      size={24}
      color={color}
      accessibilityElementsHidden={true}
      importantForAccessibility="no"
    />
  );
}