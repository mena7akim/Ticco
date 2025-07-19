import {
  Briefcase,
  Coffee,
  Gamepad2,
  Home,
  Car,
  ShoppingBag,
  Utensils,
  GraduationCap,
  Heart,
  Dumbbell,
  Book,
  Music,
  Camera,
  Plane,
  Paintbrush,
  Code,
  Stethoscope,
  Calculator,
  Wrench,
  TreePine,
} from "lucide-react";

export const AVAILABLE_ICONS = [
  { name: "briefcase", component: Briefcase, label: "Work" },
  { name: "coffee", component: Coffee, label: "Coffee" },
  { name: "gamepad2", component: Gamepad2, label: "Gaming" },
  { name: "home", component: Home, label: "Home" },
  { name: "car", component: Car, label: "Travel" },
  { name: "shopping-bag", component: ShoppingBag, label: "Shopping" },
  { name: "utensils", component: Utensils, label: "Food" },
  { name: "graduation-cap", component: GraduationCap, label: "Education" },
  { name: "heart", component: Heart, label: "Health" },
  { name: "dumbbell", component: Dumbbell, label: "Fitness" },
  { name: "book", component: Book, label: "Reading" },
  { name: "music", component: Music, label: "Music" },
  { name: "camera", component: Camera, label: "Photography" },
  { name: "plane", component: Plane, label: "Flying" },
  { name: "paint-brush", component: Paintbrush, label: "Art" },
  { name: "code", component: Code, label: "Coding" },
  { name: "stethoscope", component: Stethoscope, label: "Medical" },
  { name: "calculator", component: Calculator, label: "Finance" },
  { name: "wrench", component: Wrench, label: "Tools" },
  { name: "tree-pine", component: TreePine, label: "Nature" },
] as const;

export const getIconComponent = (iconName: string) => {
  const icon = AVAILABLE_ICONS.find((icon) => icon.name === iconName);
  return icon?.component;
};

export const PREDEFINED_COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#45B7D1", // Blue
  "#96CEB4", // Green
  "#FFEAA7", // Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Mint
  "#F7DC6F", // Light Yellow
  "#BB8FCE", // Purple
  "#85C1E9", // Light Blue
  "#F8C471", // Orange
  "#82E0AA", // Light Green
];
