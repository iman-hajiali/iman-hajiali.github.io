import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture, Group, MathUtils, SRGBColorSpace } from "three";
import type { RefObject } from "react";
import { resume } from "@/content/resume";
import { Box } from "./shapes";
import type { StoryState } from "./story";

function Panel({
  title,
  detail,
  color,
  index,
}: {
  title: string;
  detail: string;
  color: string;
  index: number;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fbf4e9";
    ctx.fillRect(0, 0, 768, 400);
    ctx.fillStyle = color;
    ctx.fillRect(35, 35, 80, 7);
    ctx.font = "600 25px Arial";
    ctx.fillText(`0${index + 1}`, 670, 60);
    ctx.fillStyle = "#28242a";
    ctx.font = "bold 64px Arial";
    ctx.fillText(title, 35, 193, 698);
    ctx.fillStyle = "#766a63";
    ctx.font = "26px Arial";
    ctx.fillText(detail, 35, 250, 698);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    return map;
  }, [title, detail, color, index]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group>
      <Box size={[1.82, 0.98, 0.07]} color="#e1d1bd" radius={0.035} />
      <mesh position={[0, 0, 0.038]}>
        <planeGeometry args={[1.75, 0.91]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </group>
  );
}

export default function StoryObjects({
  story,
  idle,
}: {
  story: RefObject<StoryState>;
  idle: boolean;
}) {
  const ui = useRef<Group>(null),
    career = useRef<Group>(null),
    work = useRef<Group>(null),
    book = useRef<Group>(null),
    time = useRef(0);
  useFrame((_, delta) => {
    if (idle) time.current += Math.min(delta, 0.05);
    const phase = story.current.phase;
    const strength = (chapter: number) =>
      Math.max(0, 1 - Math.abs(phase - chapter));
    [
      [ui, 2],
      [career, 3],
      [book, 4],
      [work, 5],
    ].forEach(([ref, index]) => {
      const group = (ref as RefObject<Group | null>).current;
      if (!group) return;
      const amount = strength(index as number);
      group.visible = amount > 0.015;
      const baseScale = index === 2 ? 0.7 : index === 4 ? 0.9 : 1;
      group.scale.setScalar(
        Math.max(0.001, MathUtils.smoothstep(amount, 0, 1) * baseScale),
      );
      group.position.y =
        0.8 +
        amount * 0.28 +
        (idle ? Math.sin(time.current * 0.85) * 0.045 : 0);
    });
    if (ui.current) ui.current.rotation.y = Math.sin(time.current * 0.4) * 0.07;
  });
  return (
    <>
      <group ref={ui} position={[0, 1.1, 1.9]} scale={0.001} visible={false}>
        <Box size={[2.4, 1.6, 0.12]} color="#f4e9d9" radius={0.065} />
        <Box
          at={[-0.8, 0, 0.14]}
          size={[0.52, 1.24, 0.1]}
          color="#7b263f"
          radius={0.03}
        />
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            at={[0.3, 0.44 - i * 0.44, 0.2 + i * 0.13]}
            size={[1.35, 0.29, 0.11]}
            color={i === 1 ? "#d98975" : "#fff9ed"}
            radius={0.035}
          />
        ))}
        <group position={[1.25, -0.2, 0.65]} rotation={[0, -0.22, -0.12]}>
          <Box size={[0.67, 1.18, 0.09]} color="#302b2e" radius={0.07} />
          <Box
            at={[0, 0, 0.055]}
            size={[0.57, 1.01, 0.02]}
            color="#e8c3b2"
            radius={0.035}
          />
          <Box
            at={[0, -0.28, 0.07]}
            size={[0.42, 0.11, 0.02]}
            color="#7b263f"
            radius={0.012}
          />
        </group>
      </group>
      <group
        ref={career}
        position={[-0.3, 1.1, 1.65]}
        scale={0.001}
        visible={false}
        rotation={[0, 0.2, 0]}
      >
        {resume.experience.map((job, i) => (
          <group
            key={job.company}
            position={[
              (i % 2) * 1.1 - 0.65,
              0.7 - Math.floor(i / 2) * 0.9,
              i * 0.18,
            ]}
            scale={0.68}
            rotation={[0, 0, i % 2 ? -0.05 : 0.05]}
          >
            <Panel
              title={job.company}
              detail={job.date || job.category}
              index={i}
              color="#7b263f"
            />
          </group>
        ))}
      </group>
      <group
        ref={book}
        position={[0, 1.1, 1.6]}
        scale={0.001}
        visible={false}
        rotation={[-0.75, 0, 0]}
      >
        <group rotation={[0, -0.13, 0]} position={[-0.57, 0, 0]}>
          <Box size={[1.1, 1.5, 0.1]} color="#7b263f" radius={0.03} />
          <Box
            at={[0, 0, 0.075]}
            size={[1.03, 1.42, 0.06]}
            color="#fff7e8"
            radius={0.02}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              at={[0, 0.42 - i * 0.18, 0.11]}
              size={[0.75, 0.018, 0.007]}
              color="#c0ac95"
              radius={0.003}
            />
          ))}
        </group>
        <group rotation={[0, 0.13, 0]} position={[0.57, 0, 0]}>
          <Box size={[1.1, 1.5, 0.1]} color="#7b263f" radius={0.03} />
          <Box
            at={[0, 0, 0.075]}
            size={[1.03, 1.42, 0.06]}
            color="#fff7e8"
            radius={0.02}
          />
          <Box
            at={[0, 0.14, 0.115]}
            size={[0.58, 0.58, 0.02]}
            color="#d8ad88"
            radius={0.01}
          />
        </group>
      </group>
      <group ref={work} position={[0, 1.1, 1.7]} scale={0.001} visible={false}>
        {resume.projects.map((project, i) => (
          <group
            key={project.slug}
            position={[
              (i - 1) * 0.78,
              0.3 - Math.abs(i - 1) * 0.35,
              i === 1 ? 0.45 : 0,
            ]}
            scale={0.72}
            rotation={[0, (1 - i) * 0.3, (1 - i) * 0.08]}
          >
            <Panel
              title={i === 2 ? "IMAN." : project.name}
              detail={project.type}
              color={["#263f36", "#cfa246", "#7b263f"][i]}
              index={i}
            />
          </group>
        ))}
      </group>
    </>
  );
}
