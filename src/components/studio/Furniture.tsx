import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, InstancedMesh, MathUtils, Object3D } from "three";
import type { RefObject } from "react";
import { standingAmount, type StoryState } from "./story";
import { Ball, Box, Curve, Limb, palette as p } from "./shapes";

function KeyboardKeys() {
  const keys = useRef<InstancedMesh>(null);
  useEffect(() => {
    if (!keys.current) return;
    const item = new Object3D();
    let index = 0;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 10; col++) {
        item.position.set(-0.49 + col * 0.09, 0.179, 0.4 + row * 0.08);
        item.updateMatrix();
        keys.current.setMatrixAt(index++, item.matrix);
      }
    }
    keys.current.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={keys} args={[undefined, undefined, 30]}>
      <boxGeometry args={[0.072, 0.018, 0.059]} />
      <meshStandardMaterial color="#f9f4e9" roughness={0.76} />
    </instancedMesh>
  );
}

export default function Furniture({
  story,
  idle,
}: {
  story: RefObject<StoryState>;
  idle: boolean;
}) {
  const root = useRef<Group>(null),
    steam = useRef<Group>(null),
    leaves = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (idle) time.current += Math.min(delta, 0.05);
    const stand = standingAmount(story.current.phase);
    if (root.current) {
      root.current.position.x = -stand * 1.3;
      root.current.scale.setScalar(MathUtils.lerp(1, 0.001, stand));
      root.current.visible = stand < 0.999;
    }
    if (steam.current) {
      steam.current.position.y = 0.48 + Math.sin(time.current * 0.8) * 0.04;
      steam.current.rotation.y = Math.sin(time.current * 0.6) * 0.2;
    }
    if (leaves.current)
      leaves.current.rotation.z = Math.sin(time.current * 0.9) * 0.025;
  });
  return (
    <group ref={root}>
      <Box
        at={[0, 0.04, 0.8]}
        size={[3.75, 0.16, 1.65]}
        color={p.cream}
        radius={0.07}
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <Limb
            key={`${x}${z}`}
            from={[x * 1.55, -0.02, 0.8 + z * 0.57]}
            to={[x * 1.7, -1.31, 0.8 + z * 0.66]}
            radius={0.06}
            endRadius={0.08}
            color={p.wood}
          />
        )),
      )}
      {/* Chair and its five wheeled spokes. */}
      <group position={[0.68, 0, -0.8]}>
        <Box
          at={[0, -0.3, 0]}
          size={[1.02, 0.14, 0.83]}
          color="#ddd3c4"
          radius={0.065}
        />
        <Box
          at={[0, 0.27, -0.45]}
          size={[1.02, 1.05, 0.16]}
          rotation={[-0.14, 0, 0]}
          color="#e7dfd3"
          radius={0.075}
        />
        <Box
          at={[0, 0.27, -0.345]}
          size={[0.83, 0.82, 0.07]}
          rotation={[-0.14, 0, 0]}
          color="#b6aca0"
          radius={0.03}
        />
        <Limb
          from={[0, -0.35, 0]}
          to={[0, -1.14, 0]}
          radius={0.065}
          color="#bdb7ae"
        />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i * Math.PI * 2) / 5;
          return (
            <group key={i}>
              <Limb
                from={[0, -1.16, 0]}
                to={[Math.cos(a) * 0.61, -1.21, Math.sin(a) * 0.61]}
                radius={0.045}
                color="#d6cfc4"
              />
              <Ball
                at={[Math.cos(a) * 0.61, -1.29, Math.sin(a) * 0.61]}
                scale={[0.095, 0.075, 0.065]}
                color="#585251"
              />
            </group>
          );
        })}
      </group>
      {/* The monitor faces the character in the first over-the-shoulder shot. */}
      <group position={[-0.87, 0.15, 1.12]} rotation={[0, Math.PI + 0.16, 0]}>
        <Box size={[0.62, 0.05, 0.35]} color="#bdb8b1" radius={0.025} />
        <Box
          at={[0, 0.25, -0.08]}
          size={[0.1, 0.5, 0.08]}
          color="#bdb8b1"
          radius={0.02}
        />
        <Box
          at={[0, 0.79, 0]}
          size={[1.38, 0.92, 0.085]}
          color="#4b4646"
          radius={0.035}
        />
        <Box
          at={[0, 0.79, 0.053]}
          size={[1.29, 0.83, 0.022]}
          color="#f9f0df"
          radius={0.014}
        />
        <Box
          at={[-0.42, 0.81, 0.074]}
          size={[0.3, 0.65, 0.018]}
          color={p.cherry}
          radius={0.008}
        />
        <Box
          at={[0.19, 1.04, 0.078]}
          size={[0.7, 0.12, 0.02]}
          color="#d4b79c"
          radius={0.01}
        />
        <Box
          at={[0.02, 0.8, 0.08]}
          size={[0.32, 0.24, 0.025]}
          color="#d48d79"
          radius={0.015}
        />
        <Box
          at={[0.39, 0.8, 0.08]}
          size={[0.32, 0.24, 0.025]}
          color="#d6c8b4"
          radius={0.015}
        />
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            at={[0.2, 0.59 + i * 0.045, 0.08]}
            size={[0.68, 0.014, 0.02]}
            color="#b9aba0"
            radius={0.006}
          />
        ))}
        <Ball
          at={[0, 0.367, 0.061]}
          scale={[0.018, 0.018, 0.007]}
          color="#cfc5ba"
        />
      </group>
      <Box
        at={[-0.08, 0.151, 0.5]}
        size={[0.96, 0.045, 0.33]}
        color="#d6d0c6"
        radius={0.025}
      />
      <KeyboardKeys />
      <Ball
        at={[0.52, 0.18, 0.54]}
        scale={[0.085, 0.045, 0.13]}
        color="#f5f0e8"
      />
      <group position={[1.3, 0.15, 1.01]} rotation={[0, -0.12, 0]}>
        <Box size={[0.5, 0.04, 0.6]} color={p.cherry} radius={0.015} />
        <Box
          at={[0, 0.032, 0]}
          size={[0.47, 0.026, 0.56]}
          color="#fffaed"
          radius={0.008}
        />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            at={[0, 0.05, -0.17 + i * 0.095]}
            size={[0.33, 0.005, 0.008]}
            color="#cdbba8"
            radius={0.002}
          />
        ))}
        <Limb
          from={[-0.23, 0.062, -0.22]}
          to={[0.22, 0.062, 0.17]}
          radius={0.017}
          color="#453931"
        />
      </group>
      <group position={[-1.42, 0.14, 1.33]}>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.125, 0.11, 0.28, 28]} />
          <meshStandardMaterial color={p.cherry} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.282, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.102, 28]} />
          <meshStandardMaterial color="#51322a" />
        </mesh>
        <mesh
          position={[0.145, 0.15, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <torusGeometry args={[0.082, 0.024, 12, 24]} />
          <meshStandardMaterial color={p.cherry} />
        </mesh>
        <group ref={steam} position={[0, 0.48, 0]}>
          <Curve
            radius={0.009}
            color="#d9c6b3"
            opacity={0.35}
            points={[
              [0, 0, 0],
              [-0.04, 0.12, 0.01],
              [0.04, 0.25, 0],
              [0, 0.39, -0.02],
            ]}
          />
          <Curve
            radius={0.007}
            color="#d9c6b3"
            opacity={0.25}
            points={[
              [0.045, 0.04, 0],
              [0.075, 0.15, 0.01],
              [0.02, 0.32, 0.01],
            ]}
          />
        </group>
      </group>
      <group position={[-1.56, 0.14, 0.22]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.145, 0.32, 24]} />
          <meshStandardMaterial color="#e1d4c1" />
        </mesh>
        <mesh position={[0, 0.325, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.17, 24]} />
          <meshStandardMaterial color="#665040" />
        </mesh>
        <group ref={leaves} position={[0, 0.3, 0]}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = i * 2.4;
            return (
              <group key={i} rotation={[0, a, 0]}>
                <Limb
                  from={[0, 0, 0]}
                  to={[0.23, 0.28 + (i % 3) * 0.09, 0]}
                  radius={0.01}
                  color="#52613b"
                />
                <Ball
                  at={[0.25, 0.35 + (i % 3) * 0.09, 0]}
                  scale={[0.12, 0.25, 0.038]}
                  rotation={[0, 0, -0.65]}
                  color={i % 2 ? "#738457" : "#4c603e"}
                />
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}
