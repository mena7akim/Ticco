import React from "react";
import { Check } from "lucide-react";
import { PREDEFINED_COLORS } from "@/constants/icons";

interface ColorSelectorProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      {PREDEFINED_COLORS.map((color) => {
        const isSelected = selectedColor === color;

        return (
          <button
            key={color}
            type="button"
            className={`
              relative w-10 h-10 rounded-full border-2 transition-all
              ${
                isSelected
                  ? "border-foreground ring-2 ring-primary ring-offset-2 scale-110"
                  : "border-border hover:scale-105 hover:border-foreground/50"
              }
            `}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />
            )}
          </button>
        );
      })}
    </div>
  );
};
