import type { LineVector, Vector } from "./models";
import { isPolygonsIntersect } from "./utils";

export const Car = (
  x: number,
  y: number,
  width: number,
  height: number,
  defaultSpeed = 0
) => {
  let speed = 0;
  const acceleration = 0.2;
  let maxSpeed = 3;
  const friction = 0.1;

  let angle = 0;
  let forward = false;
  let reverse = false;
  let left = false;
  let right = false;

  if (defaultSpeed) {
    forward = true;
    maxSpeed = defaultSpeed;
  }

  const move = () => {
    if (forward) {
      speed += acceleration;
    }

    if (reverse) {
      speed -= acceleration;
    }

    if (speed > maxSpeed) {
      speed = maxSpeed;
    }

    if (speed < -maxSpeed / 2) {
      speed = -maxSpeed / 2;
    }

    if (speed > 0) {
      speed -= friction;
    }

    if (speed < 0) {
      speed += friction;
    }

    if (friction > Math.abs(speed)) {
      speed = 0;
    }

    if (speed) {
      const flip = speed > 0 ? 1 : -1;

      if (left) {
        angle += 0.03 * flip;
      }

      if (right) {
        angle -= 0.03 * flip;
      }
    }

    x -= Math.sin(angle) * speed;
    y -= Math.cos(angle) * speed;
  };

  let polygon: Vector[] = [];
  let damaged = false;
  const update = (obstacles: LineVector[]) => {
    if (!damaged) {
      polygon = createPolygon();
      checkDamaged(obstacles);

      move();

      polygon = createPolygon();
      checkDamaged(obstacles);
    }
  };

  const checkDamaged = (obstacles: LineVector[]) => {
    for (const obstacle of obstacles) {
      if (isPolygonsIntersect(polygon, obstacle)) {
        damaged = true;
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    if (damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.beginPath();

    ctx.moveTo(polygon[0].x, polygon[0].y);

    for (let i = 1; i < polygon.length; i++) {
      ctx.lineTo(polygon[i].x, polygon[i].y);
    }

    ctx.fill();
  };

  const createPolygon = () => {
    const points: Vector[] = [];

    const rad = Math.hypot(width, height) / 2;
    const alpha = Math.atan2(width, height);

    points.push({
      x: x - Math.sin(angle - alpha) * rad,
      y: y - Math.cos(angle - alpha) * rad,
    });

    points.push({
      x: x - Math.sin(angle + alpha) * rad,
      y: y - Math.cos(angle + alpha) * rad,
    });

    points.push({
      x: x - Math.sin(angle - alpha + Math.PI) * rad,
      y: y - Math.cos(angle - alpha + Math.PI) * rad,
    });

    points.push({
      x: x - Math.sin(angle + alpha + Math.PI) * rad,
      y: y - Math.cos(angle + alpha + Math.PI) * rad,
    });

    return points;
  };

  const polygonToLineVectorArr = () => {
    const lineVectorArr: LineVector[] = [];

    for (let i = 0; i < polygon.length; i++) {
      lineVectorArr.push([
        { x: polygon[i].x, y: polygon[i].y },
        {
          x: polygon[(i + 1) % polygon.length].x,
          y: polygon[(i + 1) % polygon.length].y,
        },
      ]);
    }

    return lineVectorArr;
  };

  return {
    draw,
    update,
    y: () => y,
    x: () => x,
    angle: () => angle,
    setForward: (x: boolean) => {
      forward = x;
    },
    setReverse: (x: boolean) => {
      reverse = x;
    },
    setLeft: (x: boolean) => {
      left = x;
    },
    setRight: (x: boolean) => {
      right = x;
    },
    polygonToLineVectorArr,
  };
};
