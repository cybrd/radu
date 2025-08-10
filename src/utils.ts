import type { LineVector, Vector } from "./models";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const getIntersection = (line1: LineVector, line2: LineVector) => {
  const x1 = line1[0].x;
  const x2 = line1[1].x;
  const x3 = line2[0].x;
  const x4 = line2[1].x;
  const y1 = line1[0].y;
  const y2 = line1[1].y;
  const y3 = line2[0].y;
  const y4 = line2[1].y;

  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  return {
    x: lerp(x1, x2, ua),
    y: lerp(y1, y2, ua),
    offset: ua,
  };
};

export const isPolygonsIntersect = (polygon1: Vector[], polygon2: Vector[]) => {
  for (let i = 0; i < polygon1.length; i++) {
    for (let j = 0; j < polygon2.length; j++) {
      const touch = getIntersection(
        [polygon1[i], polygon1[(i + 1) % polygon1.length]],
        [polygon2[j], polygon2[(j + 1) % polygon2.length]]
      );

      if (touch) {
        return true;
      }
    }
  }

  return false;
};
