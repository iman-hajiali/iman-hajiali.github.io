import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Box, palette as p } from "./shapes";
import { standingAmount, type StoryState } from "./story";

export default function GallerySpace({
  story,
}: {
  story: RefObject<StoryState>;
}) {
  const root = useRef<Group>(null);
  useFrame(() => {
    const amount = standingAmount(story.current.phase);
    if (root.current) {
      root.current.visible = amount > 0.015;
      root.current.scale.setScalar(Math.max(0.001, amount));
    }
  });
  return (
    <group ref={root} scale={0.001} visible={false}>
      <Box
        at={[0, -1.44, 0]}
        size={[5.9, 0.08, 4.8]}
        color="#e7d5c5"
        radius={0.04}
      />
      <Box
        at={[1.45, 0.65, -1.9]}
        size={[3.5, 3.8, 0.15]}
        color="#f2e6d8"
        radius={0.09}
      />
      <Box
        at={[1.45, 2.42, -1.78]}
        size={[3.1, 0.06, 0.025]}
        color={p.cherry}
        radius={0.01}
      />
      <Box
        at={[2.58, 0.37, -1.76]}
        size={[0.07, 2.6, 0.03]}
        color="#d6b8a4"
        radius={0.01}
      />
    </group>
  );
}
