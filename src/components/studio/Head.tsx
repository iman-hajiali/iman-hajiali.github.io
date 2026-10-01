import { useEffect, useMemo } from "react";
import {
  Color,
  Float32BufferAttribute,
  MathUtils,
  SphereGeometry,
} from "three";
import { palette } from "./shapes";

// Vertex-painted beard follows the face surface, avoiding detached facial pieces.
export default function Head() {
  const geometry = useMemo(() => {
    const mesh = new SphereGeometry(1, 64, 48);
    const positions = mesh.attributes.position;
    const skin = new Color(palette.skinLight),
      beard = new Color(palette.hair);
    const colors = [];
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i),
        y = positions.getY(i),
        z = positions.getZ(i);
      const cheekLine = -0.31 + Math.abs(x) * 0.29;
      const jawBeard =
        MathUtils.smoothstep(cheekLine - y, -0.055, 0.055) *
        MathUtils.smoothstep(z, -0.54, -0.42);
      const sideburn =
        MathUtils.smoothstep(Math.abs(x), 0.81, 0.9) *
        (1 - MathUtils.smoothstep(y, 0.4, 0.49)) *
        MathUtils.smoothstep(y, -0.36, -0.27) *
        MathUtils.smoothstep(z, -0.26, -0.14);
      const color = skin.clone().lerp(beard, Math.max(jawBeard, sideburn));
      colors.push(color.r, color.g, color.b);
      const jaw = y < -0.25 ? 1 - (Math.abs(y) - 0.25) * 0.08 : 1;
      positions.setX(i, x * jaw);
    }
    mesh.setAttribute("color", new Float32BufferAttribute(colors, 3));
    mesh.computeVertexNormals();
    return mesh;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} scale={[0.59, 0.67, 0.53]} castShadow>
      <meshStandardMaterial vertexColors roughness={0.82} />
    </mesh>
  );
}
