"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Component, Suspense, useRef, type ReactNode } from "react";
import type { Group } from "three";
import { en } from "@/content/en";

function Fallback() {
  return <div className="scene-fallback">{en.skills.fallback}</div>;
}

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

function Pieces() {
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    time.current += Math.min(delta, 0.05);
    if (!group.current) return;
    group.current.rotation.y = -0.35 + Math.sin(time.current * 0.25) * 0.22;
    group.current.position.y = Math.sin(time.current * 0.65) * 0.06;
  });
  return (
    <group ref={group} rotation={[-0.15, -0.35, 0.05]}>
      <RoundedBox args={[3.1, 2.25, 0.16]} radius={0.12}>
        <meshStandardMaterial color="#eadfce" />
      </RoundedBox>
      <RoundedBox
        args={[0.68, 1.7, 0.13]}
        radius={0.07}
        position={[-1, 0, 0.16]}
      >
        <meshStandardMaterial color="#7b263f" />
      </RoundedBox>
      {[0.57, 0, -0.57].map((y, i) => (
        <RoundedBox
          key={y}
          args={[1.66, 0.38, 0.16]}
          radius={0.065}
          position={[0.3, y, 0.19 + i * 0.06]}
        >
          <meshStandardMaterial color={i === 1 ? "#d98975" : "#fffaf3"} />
        </RoundedBox>
      ))}
    </group>
  );
}

export default function SkillCanvas({ active }: { active: boolean }) {
  return (
    <Boundary>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 38 }}
        fallback={<Fallback />}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 4, 5]} intensity={3} />
        <Suspense fallback={null}>
          <Pieces />
        </Suspense>
      </Canvas>
    </Boundary>
  );
}
