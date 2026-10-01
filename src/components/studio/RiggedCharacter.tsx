"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  AnimationMixer,
  Bone,
  Group,
  Interpolant,
  MathUtils,
  Mesh,
  Quaternion,
  Vector3,
} from "three";
import { pointingAmount, standingAmount, type StoryState } from "./story";

const keyframes = [18, 56, 130, 178, 190, 207, 292] as const;
const headYawAxis = new Vector3(0, 0, 1);
const headPitchAxis = new Vector3(1, 0, 0);

function frameForPhase(phase: number) {
  const index = Math.floor(MathUtils.clamp(phase, 0, keyframes.length - 1));
  const next = Math.min(index + 1, keyframes.length - 1);
  return MathUtils.lerp(keyframes[index], keyframes[next], phase - index);
}

function restoreRotation(
  bone: Bone | undefined,
  track: Interpolant | undefined,
  time: number,
) {
  if (!bone || !track) return;
  const value = track.evaluate(time);
  bone.quaternion.set(value[0], value[1], value[2], value[3]);
}

export default function RiggedCharacter({
  story,
  idle,
}: {
  story: RefObject<StoryState>;
  idle: boolean;
}) {
  const asset = useGLTF("/models/iman-scroll-character-optimized.glb");
  const figure = useMemo(() => cloneSkeleton(asset.scene), [asset.scene]);
  const mixer = useMemo(() => new AnimationMixer(figure), [figure]);
  const root = useRef<Group>(null);
  const clock = useRef(0);
  const gaze = useRef({ x: 0, y: 0 });
  const correction = useRef(new Quaternion());
  const bones = useMemo(
    () => ({
      head: figure.getObjectByName("head") as Bone | undefined,
      shoulder: figure.getObjectByName("upper_arm.R") as Bone | undefined,
      forearm: figure.getObjectByName("forearm.R") as Bone | undefined,
      hand: figure.getObjectByName("hand.R") as Bone | undefined,
    }),
    [figure],
  );
  const rotationTracks = useMemo(() => {
    const clip = asset.animations[0];
    const get = (name: string) =>
      clip?.tracks
        .find((track) => track.name.endsWith(`${name}.quaternion`))
        ?.InterpolantFactoryMethodLinear();
    return {
      head: get("head"),
      shoulder: get("upper_arm.R"),
      forearm: get("forearm.R"),
      hand: get("hand.R"),
    };
  }, [asset.animations]);
  const relaxed = useRef<{
    shoulder: Quaternion;
    forearm: Quaternion;
    hand: Quaternion;
  } | null>(null);

  useEffect(() => {
    figure.traverse((item) => {
      if (item instanceof Mesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
    const clip = asset.animations[0];
    if (!clip) return;
    const action = mixer.clipAction(clip);
    action.play();
    mixer.setTime((178 - 1) / 30);
    if (bones.shoulder && bones.forearm && bones.hand) {
      relaxed.current = {
        shoulder: bones.shoulder.quaternion.clone(),
        forearm: bones.forearm.quaternion.clone(),
        hand: bones.hand.quaternion.clone(),
      };
    }
    mixer.setTime((keyframes[0] - 1) / 30);
    return () => {
      action.stop();
      mixer.uncacheAction(clip);
    };
  }, [asset.animations, bones, figure, mixer]);

  useFrame((_, delta) => {
    if (idle) clock.current += Math.min(delta, 0.05);
    const phase = story.current.phase;
    const stand = standingAmount(phase);
    const stillChapter = Math.abs(phase - Math.round(phase)) < 0.025;
    const sway = idle && stillChapter ? Math.sin(clock.current * 1.1) : 0;
    const idleFrames = phase < 1.5 || phase > 5.6 ? 8 : 3;
    const time = (frameForPhase(phase) + sway * idleFrames - 1) / 30;
    mixer.setTime(time);
    // Explicitly restore these bone tracks; repeated additive gestures must
    // never accumulate into a twisted head or arm at a stationary scroll point.
    restoreRotation(bones.head, rotationTracks.head, time);
    restoreRotation(bones.shoulder, rotationTracks.shoulder, time);
    restoreRotation(bones.forearm, rotationTracks.forearm, time);
    restoreRotation(bones.hand, rotationTracks.hand, time);

    // Soften the pre-authored pointing pose without creating extra DOM or animation tracks.
    const gesture = pointingAmount(phase);
    if (relaxed.current && gesture > 0) {
      bones.shoulder?.quaternion.slerp(relaxed.current.shoulder, gesture * 0.5);
      bones.forearm?.quaternion.slerp(relaxed.current.forearm, gesture * 0.32);
      bones.hand?.quaternion.slerp(relaxed.current.hand, gesture * 0.2);
    }
    if (bones.hand && idle && stand > 0.8 && gesture > 0.1) {
      correction.current.setFromAxisAngle(
        headYawAxis,
        Math.sin(clock.current * 2.1) * 0.035 * gesture,
      );
      bones.hand.quaternion.multiply(correction.current);
    }
    const followsPointer =
      idle && !story.current.mobile && phase > 0.5 && phase < 5.7;
    const follow = 1 - Math.exp(-Math.min(delta, 0.05) * 5);
    gaze.current.x = MathUtils.lerp(
      gaze.current.x,
      followsPointer ? story.current.pointerX * 0.11 : 0,
      follow,
    );
    gaze.current.y = MathUtils.lerp(
      gaze.current.y,
      followsPointer ? -story.current.pointerY * 0.07 : 0,
      follow,
    );
    if (bones.head) {
      correction.current.setFromAxisAngle(headYawAxis, gaze.current.x);
      bones.head.quaternion.multiply(correction.current);
      correction.current.setFromAxisAngle(headPitchAxis, gaze.current.y);
      bones.head.quaternion.multiply(correction.current);
    }

    if (root.current) {
      root.current.position.set(
        MathUtils.lerp(0.68, -1.18, stand),
        MathUtils.lerp(-0.05, -0.05, stand) +
          (idle ? stand * Math.sin(clock.current * 1.4) * 0.006 : 0),
        MathUtils.lerp(-0.66, 0.08, stand),
      );
      root.current.rotation.y = -stand * 0.12;
    }
  });

  return (
    <group ref={root} position={[0.68, -0.05, -0.66]} scale={2.7}>
      <primitive object={figure} />
    </group>
  );
}
