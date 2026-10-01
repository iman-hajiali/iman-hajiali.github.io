import { useMemo } from "react";
import { CatmullRomCurve3, Quaternion, Vector3 } from "three";
import { RoundedBox } from "@react-three/drei";

export type V3 = [number, number, number];
export const palette = {
  skin: "#ca9270",
  skinLight: "#dda781",
  hair: "#29211f",
  shirt: "#302d31",
  trousers: "#a18a74",
  cream: "#eee3d1",
  cherry: "#7b263f",
  wood: "#b58c65",
};

export function Ball({
  at = [0, 0, 0],
  scale = [1, 1, 1],
  color,
  rotation = [0, 0, 0],
}: {
  at?: V3;
  scale?: V3;
  color: string;
  rotation?: V3;
}) {
  return (
    <mesh
      position={at}
      scale={scale}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 24, 20]} />
      <meshStandardMaterial color={color} roughness={0.76} />
    </mesh>
  );
}
export function Box({
  at = [0, 0, 0],
  size,
  color,
  rotation = [0, 0, 0],
  radius = 0.04,
}: {
  at?: V3;
  size: V3;
  color: string;
  rotation?: V3;
  radius?: number;
}) {
  return (
    <RoundedBox
      position={at}
      args={size}
      radius={radius}
      smoothness={2}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={0.72} />
    </RoundedBox>
  );
}
export function Limb({
  from,
  to,
  radius,
  color,
  endRadius,
}: {
  from: V3;
  to: V3;
  radius: number;
  color: string;
  endRadius?: number;
}) {
  const transform = useMemo(() => {
    const a = new Vector3(...from),
      b = new Vector3(...to),
      direction = b.clone().sub(a);
    return {
      center: a.add(b).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new Quaternion().setFromUnitVectors(
        new Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [from[0], from[1], from[2], to[0], to[1], to[2]]);
  return (
    <mesh
      position={transform.center}
      quaternion={transform.quaternion}
      castShadow
      receiveShadow
    >
      <cylinderGeometry
        args={[endRadius ?? radius, radius, transform.length, 16]}
      />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}
export function Curve({
  points,
  radius,
  color,
  opacity = 1,
}: {
  points: V3[];
  radius: number;
  color: string;
  opacity?: number;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((p) => new Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow={opacity === 1}>
      <tubeGeometry args={[curve, 24, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        roughness={0.85}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity === 1}
      />
    </mesh>
  );
}
