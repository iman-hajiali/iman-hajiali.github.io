import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, MathUtils } from "three";
import { Ball, Box, Curve, Limb, palette as p } from "./shapes";
import { pointingAmount, standingAmount, type StoryState } from "./story";
import type { RefObject } from "react";
import Head from "./Head";

function Hand({
  watch = false,
  pointFinger,
}: {
  watch?: boolean;
  pointFinger?: RefObject<Group | null>;
}) {
  return (
    <group>
      <Ball scale={[0.13, 0.07, 0.17]} color={p.skinLight} />
      {[0, 1, 2, 3].map((i) => (
        <Ball
          key={i}
          at={[-0.084 + i * 0.054, -0.012, 0.14]}
          scale={[0.027, 0.04, 0.105 - (i === 0 || i === 3 ? 0.02 : 0)]}
          color={p.skinLight}
        />
      ))}
      <Ball
        at={[0.12, -0.005, 0.03]}
        scale={[0.07, 0.047, 0.055]}
        color={p.skin}
      />
      {pointFinger && (
        <group ref={pointFinger} scale={[1, 0.001, 1]}>
          <Ball
            at={[0.035, -0.17, 0.13]}
            scale={[0.028, 0.18, 0.034]}
            color={p.skinLight}
          />
        </group>
      )}
      {watch && (
        <group position={[0, 0, -0.15]}>
          <Box size={[0.24, 0.085, 0.12]} color="#29282a" radius={0.025} />
          <Box
            at={[0, 0.052, 0]}
            size={[0.14, 0.04, 0.14]}
            color="#41434a"
            radius={0.025}
          />
        </group>
      )}
    </group>
  );
}

export default function Character({
  story,
  idle,
}: {
  story: RefObject<StoryState>;
  idle: boolean;
}) {
  const root = useRef<Group>(null),
    seated = useRef<Group>(null),
    standing = useRef<Group>(null);
  const torso = useRef<Group>(null),
    head = useRef<Group>(null),
    eyes = useRef<Group>(null),
    leftArm = useRef<Group>(null),
    arm = useRef<Group>(null),
    typing = useRef<Group>(null),
    rightHand = useRef<Group>(null),
    pointFinger = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (idle) time.current += Math.min(delta, 0.05);
    const t = time.current,
      phase = story.current.phase;
    const hello = MathUtils.smoothstep(phase, 5.5, 6);
    const stand = standingAmount(phase);
    const point = pointingAmount(phase);
    if (root.current) {
      root.current.position.set(
        MathUtils.lerp(0.68, -1.18, stand) +
          (idle ? stand * Math.sin(t * 0.75) * 0.026 : 0),
        -0.03 + stand * 0.78 + (idle ? stand * Math.sin(t * 1.4) * 0.009 : 0),
        MathUtils.lerp(-0.12, 0.08, stand),
      );
      root.current.rotation.y = stand * -0.12;
      root.current.rotation.z = idle ? stand * Math.sin(t * 0.72) * 0.016 : 0;
    }
    if (seated.current)
      seated.current.scale.setScalar(Math.max(0.001, 1 - stand));
    if (standing.current)
      standing.current.scale.setScalar(Math.max(0.001, stand));
    if (torso.current) {
      torso.current.scale.y = 1 + (idle ? Math.sin(t * 1.7) * 0.008 : 0);
      torso.current.rotation.z = idle ? stand * Math.sin(t * 0.72) * 0.014 : 0;
    }
    if (head.current) {
      head.current.rotation.y = MathUtils.damp(
        head.current.rotation.y,
        0.22 +
          point * 0.23 +
          story.current.pointerX * 0.1 +
          Math.sin(t * 0.7) * 0.025,
        5,
        delta,
      );
      head.current.rotation.z = idle ? Math.sin(t * 0.6) * 0.025 : 0;
    }
    const blink =
      idle && t % 4.7 > 4.48
        ? Math.sin((((t % 4.7) - 4.48) / 0.22) * Math.PI)
        : 0;
    if (eyes.current) eyes.current.scale.y = 1 - blink * 0.96;
    if (leftArm.current) {
      leftArm.current.rotation.x = stand * 0.73;
      leftArm.current.rotation.z = idle
        ? stand * Math.sin(t * 0.85) * 0.035
        : 0;
    }
    if (arm.current) {
      arm.current.rotation.z =
        point * 1.35 +
        hello * (1.95 + Math.sin(t * 4.8) * 0.1) +
        (idle ? stand * (1 - point) * Math.sin(t * 0.95 + 1) * 0.028 : 0);
      arm.current.rotation.x = stand * 0.7 + hello * -0.35;
    }
    if (rightHand.current) rightHand.current.rotation.z = -point * 0.12;
    if (pointFinger.current)
      pointFinger.current.scale.y = Math.max(0.001, point);
    if (typing.current)
      typing.current.position.y =
        -0.41 + (idle ? (1 - stand) * Math.sin(t * 5.2) * 0.007 : 0);
  });
  return (
    <group ref={root} position={[0.68, -0.03, -0.12]}>
      {/* A hierarchical joint rig: torso, head, eyelids and independent arms. */}
      <group ref={torso}>
        <Ball at={[0, 0.35, 0]} scale={[0.48, 0.6, 0.32]} color={p.shirt} />
        <Box
          at={[0, -0.13, 0.03]}
          size={[0.72, 0.2, 0.5]}
          color={p.shirt}
          radius={0.08}
        />
        <Limb
          from={[0, 0.74, 0]}
          to={[0, 0.98, 0]}
          radius={0.19}
          color={p.skin}
        />
        <group position={[0, 1.39, 0.01]} ref={head} rotation={[0, 0.22, 0]}>
          <Head />
          {[-1, 1].map((side) => (
            <group key={side}>
              <Ball
                at={[side * 0.59, -0.01, 0]}
                scale={[0.13, 0.21, 0.115]}
                color={p.skin}
              />
              <Ball
                at={[side * 0.625, -0.005, 0.068]}
                scale={[0.064, 0.125, 0.034]}
                color="#b7795c"
              />
              <Ball
                at={[side * 0.245, 0.17, 0.445]}
                scale={[0.19, 0.158, 0.063]}
                color={p.skin}
              />
            </group>
          ))}
          <group ref={eyes} position={[0, 0.14, 0.468]}>
            {[-1, 1].map((side) => (
              <group
                key={side}
                position={[side * 0.245, 0, 0]}
                rotation={[0, side * 0.1, 0]}
              >
                <Ball scale={[0.153, 0.116, 0.052]} color="#fff8ef" />
                <Ball
                  at={[0.008, 0, 0.042]}
                  scale={[0.073, 0.082, 0.021]}
                  color="#5b3829"
                />
                <Ball
                  at={[0.009, 0, 0.061]}
                  scale={[0.039, 0.056, 0.012]}
                  color="#1d1716"
                />
                <Ball
                  at={[-0.011, 0.029, 0.073]}
                  scale={[0.018, 0.019, 0.005]}
                  color="#fffdf4"
                />
              </group>
            ))}
          </group>
          {[-1, 1].map((side) => (
            <Curve
              key={side}
              color={p.hair}
              radius={0.053}
              points={[
                [side * 0.08, 0.355, 0.472],
                [side * 0.24, 0.385, 0.497],
                [side * 0.41, 0.325, 0.422],
              ]}
            />
          ))}
          <Ball
            at={[0, -0.06, 0.535]}
            scale={[0.092, 0.148, 0.11]}
            color={p.skin}
          />
          <Ball
            at={[0, -0.135, 0.594]}
            scale={[0.105, 0.069, 0.067]}
            color={p.skinLight}
          />
          <Curve
            color={p.hair}
            radius={0.045}
            points={[
              [-0.23, -0.255, 0.498],
              [-0.12, -0.215, 0.551],
              [0, -0.23, 0.57],
              [0.12, -0.215, 0.551],
              [0.23, -0.255, 0.498],
            ]}
          />
          <Curve
            color="#130f10"
            radius={0.018}
            points={[
              [-0.17, -0.3, 0.467],
              [0, -0.345, 0.475],
              [0.17, -0.3, 0.467],
            ]}
          />
          {/* Swept sculpted locks preserve the approved dark, side-swept hairstyle. */}
          <Ball
            at={[0, 0.46, -0.1]}
            scale={[0.6, 0.285, 0.51]}
            color={p.hair}
          />
          {Array.from({ length: 8 }, (_, i) => (
            <group key={i}>
              <Ball
                at={[
                  -0.38 + i * 0.105,
                  0.61 + Math.sin((i / 8) * Math.PI) * 0.055,
                  0.045,
                ]}
                scale={[0.095, 0.16, 0.42]}
                rotation={[-0.2, -0.35, -0.25]}
                color={i % 2 ? "#332825" : "#29211f"}
              />
            </group>
          ))}
        </group>
        <group ref={leftArm} position={[-0.37, 0.62, 0]}>
          <Limb
            from={[0, 0, 0]}
            to={[-0.22, -0.49, 0.38]}
            radius={0.17}
            endRadius={0.2}
            color={p.shirt}
          />
          <Ball
            at={[-0.2, -0.46, 0.4]}
            scale={[0.13, 0.13, 0.13]}
            color={p.skin}
          />
          <Limb
            from={[-0.2, -0.46, 0.4]}
            to={[-0.24, -0.41, 0.65]}
            radius={0.11}
            endRadius={0.09}
            color={p.skin}
          />
          <group ref={typing} position={[-0.24, -0.41, 0.65]}>
            <Hand watch />
          </group>
        </group>
        <group ref={arm} position={[0.38, 0.61, 0]}>
          <Limb
            from={[0, 0, 0]}
            to={[0.2, -0.43, 0.27]}
            radius={0.17}
            endRadius={0.19}
            color={p.shirt}
          />
          <Ball
            at={[0.2, -0.43, 0.29]}
            scale={[0.13, 0.13, 0.13]}
            color={p.skin}
          />
          <Limb
            from={[0.2, -0.43, 0.29]}
            to={[0.08, -0.4, 0.62]}
            radius={0.11}
            endRadius={0.09}
            color={p.skin}
          />
          <group ref={rightHand} position={[0.08, -0.4, 0.65]}>
            <Hand pointFinger={pointFinger} />
          </group>
        </group>
      </group>
      <group ref={seated}>
        {[-1, 1].map((side) => (
          <group key={side}>
            <Limb
              from={[side * 0.25, -0.22, 0]}
              to={[side * 0.31, -0.39, 0.62]}
              radius={0.23}
              endRadius={0.21}
              color={p.trousers}
            />
            <Ball
              at={[side * 0.31, -0.4, 0.62]}
              scale={[0.21, 0.22, 0.22]}
              color={p.trousers}
            />
            <Limb
              from={[side * 0.31, -0.4, 0.62]}
              to={[side * 0.33, -1.04, 0.73]}
              radius={0.2}
              endRadius={0.16}
              color={p.trousers}
            />
            <Ball
              at={[side * 0.33, -1.13, 0.9]}
              scale={[0.24, 0.16, 0.39]}
              color={p.cream}
            />
            <Box
              at={[side * 0.33, -1.235, 0.92]}
              size={[0.44, 0.07, 0.69]}
              color="#d8cab6"
              radius={0.03}
            />
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                at={[side * 0.33, -1.014, 0.91 + i * 0.075]}
                size={[0.25, 0.016, 0.021]}
                radius={0.005}
                color="#fff4e1"
              />
            ))}
          </group>
        ))}
      </group>
      <group ref={standing} scale={0.001}>
        {[-1, 1].map((side) => (
          <group key={side}>
            <Limb
              from={[side * 0.23, -0.24, 0]}
              to={[side * 0.27, -1.04, 0.02]}
              radius={0.23}
              endRadius={0.2}
              color={p.trousers}
            />
            <Ball
              at={[side * 0.27, -1.05, 0.02]}
              scale={[0.2, 0.2, 0.2]}
              color={p.trousers}
            />
            <Limb
              from={[side * 0.27, -1.05, 0.02]}
              to={[side * 0.3, -1.88, 0.05]}
              radius={0.19}
              endRadius={0.14}
              color={p.trousers}
            />
            <Ball
              at={[side * 0.3, -1.99, 0.23]}
              scale={[0.24, 0.15, 0.39]}
              color={p.cream}
            />
            <Box
              at={[side * 0.3, -2.08, 0.24]}
              size={[0.44, 0.07, 0.69]}
              color="#d8cab6"
              radius={0.03}
            />
          </group>
        ))}
      </group>
    </group>
  );
}
