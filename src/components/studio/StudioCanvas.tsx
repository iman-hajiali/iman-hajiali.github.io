"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  Suspense,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { MathUtils, PerspectiveCamera, Vector3 } from "three";
import { ContactShadows } from "@react-three/drei";
import RiggedCharacter from "./RiggedCharacter";
import Furniture from "./Furniture";
import GallerySpace from "./GallerySpace";
import StoryObjects from "./StoryObjects";
import { mobileShots, shots, type StoryState } from "./story";

class Boundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    console.error("Studio scene failed", error);
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const reported = useRef(false);
  useFrame(() => {
    if (reported.current) return;
    reported.current = true;
    // This component mounts only after every scene object has resolved.
    // React commits the reveal after this R3F frame finishes drawing.
    onReady();
  });
  return null;
}

function CameraDirector({
  story,
  paused,
}: {
  story: RefObject<StoryState>;
  paused: boolean;
}) {
  const { camera, invalidate, size } = useThree();
  const target = useRef(new Vector3(0, 0.32, 0.35));
  const destination = useRef(new Vector3());
  const look = useRef(new Vector3());
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.setViewOffset(
        size.width,
        size.height,
        size.width > 800 ? -size.width * 0.2 : 0,
        0,
        size.width,
        size.height,
      );
    }
  }, [camera, size.width, size.height]);
  useEffect(() => {
    const refresh = () => invalidate();
    window.addEventListener("scroll", refresh, { passive: true });
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, [invalidate]);
  useFrame((_, delta) => {
    const track = story.current.mobile ? mobileShots : shots;
    const phase = MathUtils.clamp(story.current.phase, 0, track.length - 1);
    const index = Math.floor(phase),
      next = Math.min(index + 1, track.length - 1);
    const blend = MathUtils.smoothstep(phase - index, 0, 1);
    const a = track[index],
      b = track[next];
    const startAngle = Math.atan2(a.camera[0], a.camera[2]);
    const endAngle = Math.atan2(b.camera[0], b.camera[2]);
    const arc =
      MathUtils.euclideanModulo(endAngle - startAngle + Math.PI, Math.PI * 2) -
      Math.PI;
    const angle = startAngle + arc * blend;
    const radius = MathUtils.lerp(
      Math.hypot(a.camera[0], a.camera[2]),
      Math.hypot(b.camera[0], b.camera[2]),
      blend,
    );
    destination.current.set(
      Math.sin(angle) * radius,
      MathUtils.lerp(a.camera[1], b.camera[1], blend),
      Math.cos(angle) * radius,
    );
    const alpha = paused ? 1 : 1 - Math.exp(-delta * 5);
    camera.position.lerp(destination.current, alpha);
    destination.current
      .set(a.target[0], a.target[1], a.target[2])
      .lerp(look.current.set(b.target[0], b.target[1], b.target[2]), blend);
    target.current.lerp(destination.current, alpha);
    camera.lookAt(target.current);
    if (camera instanceof PerspectiveCamera) {
      const zoom = story.current.mobile ? 0.75 : 1.12;
      if (camera.zoom !== zoom) {
        camera.zoom = zoom;
        camera.updateProjectionMatrix();
      }
    }
  });
  return null;
}

export default function StudioCanvas({
  story,
  paused,
  active,
  onReady,
  onFailure,
}: {
  story: RefObject<StoryState>;
  paused: boolean;
  active: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const mobile = story.current.mobile;
  return (
    <Boundary onFailure={onFailure}>
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.25]}
        frameloop={!active ? "never" : paused ? "demand" : "always"}
        camera={{ position: [4.5, 3.8, -7.8], fov: 32, near: 0.1, far: 60 }}
        gl={{
          antialias: !mobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={null}
      >
        <ambientLight intensity={1.25} />
        <hemisphereLight args={["#fff4e5", "#967c62", 1.1]} />
        <directionalLight position={[-3, 7, 5]} intensity={2.5} />
        <directionalLight
          position={[4, 3, -3]}
          intensity={1.5}
          color="#fff0d5"
        />
        <CameraDirector story={story} paused={paused} />
        <Suspense fallback={null}>
          <Furniture story={story} idle={!paused} />
          <GallerySpace story={story} />
          <RiggedCharacter story={story} idle={!paused} />
          <StoryObjects story={story} idle={!paused} />
          {!mobile && (
            <ContactShadows
              position={[0, -1.41, 0.45]}
              opacity={0.32}
              scale={10}
              blur={2.7}
              far={5}
              resolution={128}
              frames={1}
              color="#715c48"
            />
          )}
          <SceneReady onReady={onReady} />
        </Suspense>
      </Canvas>
    </Boundary>
  );
}
