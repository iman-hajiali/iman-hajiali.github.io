import { MathUtils } from "three";

export type StoryState = {
  phase: number;
  pointerX: number;
  pointerY: number;
  mobile: boolean;
};

// The desk gives way to a second set during the middle chapters.
export function standingAmount(phase: number) {
  return (
    MathUtils.smoothstep(phase, 1.32, 2.08) *
    (1 - MathUtils.smoothstep(phase, 5.55, 6))
  );
}

// One clear gesture during Skills, then both arms return to a relaxed pose.
export function pointingAmount(phase: number) {
  return (
    MathUtils.smoothstep(phase, 1.9, 2.18) *
    (1 - MathUtils.smoothstep(phase, 2.72, 3.08))
  );
}
export const chapterIds = [
  "home",
  "about",
  "skills",
  "experience",
  "foundations",
  "work",
  "contact",
] as const;
// Camera/target tracks are independent of content length. World units, not pixels.
export const shots = [
  { camera: [4.5, 3.8, -7.8], target: [0, 0.32, 0.35] },
  { camera: [3.6, 2.5, 6.0], target: [0.55, 0.85, 0.05] },
  { camera: [-3.2, 3.4, 7.5], target: [0, 0.8, 0.7] },
  { camera: [4.4, 3.4, 7.3], target: [-0.1, 0.85, 0.4] },
  { camera: [1.8, 7.8, 5.8], target: [0, 0.3, 0.5] },
  { camera: [-3.9, 2.8, 7.8], target: [0, 0.85, 0.6] },
  { camera: [4.8, 3.2, 7.7], target: [0.3, 0.55, 0.4] },
] as const;

// Portrait framing is composed independently so the character and the
// relevant objects can share one viewport behind the text.
export const mobileShots = [
  { camera: [1.2, 3.2, -10], target: [0, 0.34, 0.45] },
  { camera: [3.2, 2.8, 8.5], target: [0.1, 0.78, 0.2] },
  { camera: [0, 3.1, 11], target: [-0.15, 0.42, 0.15] },
  { camera: [1, 3.2, 11], target: [0, 0.72, 0.3] },
  { camera: [0.6, 8.8, 8.2], target: [0, 0.35, 0.4] },
  { camera: [-1, 3.4, 11], target: [0, 0.7, 0.2] },
  { camera: [2.2, 3.2, 9.5], target: [0, 0.65, 0.2] },
] as const;
