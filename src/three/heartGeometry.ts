import * as THREE from "three";

/**
 * Builds a smooth, centred 3D heart geometry via an extruded bezier shape.
 * Cached at module scope so multiple hearts share one geometry (perf).
 */
function createHeartGeometry(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;

  shape.moveTo(x + 0, y + 0.5);
  shape.bezierCurveTo(x + 0, y + 0.5, x - 0.5, y + 1, x - 1, y + 1);
  shape.bezierCurveTo(x - 2, y + 1, x - 2, y - 0.25, x - 2, y - 0.25);
  shape.bezierCurveTo(x - 2, y - 1, x - 1, y - 1.6, x + 0, y - 2.2);
  shape.bezierCurveTo(x + 1, y - 1.6, x + 2, y - 1, x + 2, y - 0.25);
  shape.bezierCurveTo(x + 2, y - 0.25, x + 2, y + 1, x + 1, y + 1);
  shape.bezierCurveTo(x + 0.5, y + 1, x + 0, y + 0.5, x + 0, y + 0.5);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.9,
    bevelEnabled: true,
    bevelSegments: 8,
    bevelSize: 0.3,
    bevelThickness: 0.3,
    curveSegments: 32,
  });

  geometry.center();
  // Shape is already drawn point-down / lobes-up, i.e. the right way up in
  // Three.js (Y-up) — so no extra Z rotation is needed.
  geometry.computeVertexNormals();
  return geometry;
}

export const heartGeometry = createHeartGeometry();
