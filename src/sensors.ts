import type { Car } from "./car";
import type { LineVector, Vector } from "./models";
import { getIntersection, lerp } from "./utils";

export const Sensors = (car: ReturnType<typeof Car>) => {
  const rayCount = 5;
  const rayLength = 100;
  const raySpread = Math.PI / 2;

  const rays: LineVector[] = [];
  const readings: (Vector | false | undefined)[] = [];

  const castRays = () => {
    rays.length = 0;

    for (let i = 0; i < rayCount; i++) {
      const rayAngle =
        lerp(raySpread / 2, -raySpread / 2, i / (rayCount - 1)) + car.angle();

      const start = { x: car.x(), y: car.y() };
      const end = {
        x: car.x() - Math.sin(rayAngle) * rayLength,
        y: car.y() - Math.cos(rayAngle) * rayLength,
      };

      rays.push([start, end]);
    }
  };

  const update = (borders: LineVector[]) => {
    castRays();

    readings.length = 0;
    for (const ray of rays) {
      readings.push(getReading(ray, borders));
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";

    for (let i = 0; i < rayCount; i++) {
      const end = readings[i] || rays[i][1];

      ctx.beginPath();
      ctx.strokeStyle = "yellow";
      ctx.moveTo(rays[i][0].x, rays[i][0].y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(rays[i][1].x, rays[i][1].y);
      ctx.stroke();
    }
  };

  const getReading = (ray: LineVector, borders: LineVector[]) => {
    const touches: Vector[] = [];

    for (const border of borders) {
      const touch = getIntersection(ray, border);

      if (touch) {
        touches.push(touch);
      }
    }

    if (!touches.length) {
      return false;
    }

    const offsets = touches.map((x) => Number(x.offset));
    const nearest = Math.min(...offsets);

    return touches.find((x) => x.offset === nearest);
  };

  return {
    update,
    draw,
  };
};
