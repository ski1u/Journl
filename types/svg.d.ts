declare module "*.svg" {
	import type React from "react";
	import type { SvgProps } from "react-native-svg";
	const content: React.FC<SvgProps>;
	export default content;
}

declare module "expo-blur" {
  import * as React from "react"
  import { ViewProps } from "react-native"

  export interface BlurViewProps extends ViewProps {
    intensity?: number
    tint?: "light" | "dark" | "default"
    experimentalBlurMethod?: "dimezisBlurView" | "none"
  }

  export const BlurView: React.ComponentType<BlurViewProps>
}
