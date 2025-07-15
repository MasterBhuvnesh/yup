import { useMemo } from "react";
import { PixelRatio, useWindowDimensions } from "react-native";

const BASE_WIDTH = 375;

export function useScaleFont() {
  const { width } = useWindowDimensions();

  return useMemo(
    () => (size: number) => {
      return ((size * width) / BASE_WIDTH) * (1 / PixelRatio.getFontScale());
    },
    [width]
  );
}
