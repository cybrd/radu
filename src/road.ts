import type { LineVector } from "./models";
import { lerp } from "./utils";

export const Road = (x: number, width: number, laneCount = 3) => {
  const left = x - width / 2;
  const right = x + width / 2;

  const infinity = 1000000;
  const top = -infinity;
  const bottom = infinity;

  const topLeft = { x: left, y: top };
  const topRight = { x: right, y: top };
  const bottomLeft = { x: left, y: bottom };
  const bottomRight = { x: right, y: bottom };

  const borders: LineVector[] = [
    [topLeft, bottomLeft],
    [topRight, bottomRight],
  ];

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 5;
    ctx.strokeStyle = "white";

    ctx.setLineDash([20, 20]);
    for (let i = 1; i < laneCount; i++) {
      const x = lerp(left, right, i / laneCount);

      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }

    ctx.setLineDash([]);
    for (const border of borders) {
      ctx.beginPath();
      ctx.moveTo(border[0].x, border[0].y);
      ctx.lineTo(border[1].x, border[1].y);
      ctx.stroke();
    }
  };

  const getLaneCenter = (i: number) => {
    const laneWidth = width / laneCount;

    return left + laneWidth / 2 + Math.min(i, laneCount - 1) * laneWidth;
  };

  return {
    draw,
    getLaneCenter,
    borders: () => borders,
  };
};
