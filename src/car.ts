import { Controls } from "./controls";

export const Car = (x: number, y: number, width: number, height: number) => {
  const controls = Controls();

  let speed = 0;
  const acceleration = 0.2;
  const maxSpeed = 3;
  const friction = 0.1;

  let angle = 0;

  const update = () => {
    if (controls.forward()) {
      speed += acceleration;
    }

    if (controls.reverse()) {
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

      if (controls.left()) {
        angle += 0.03 * flip;
      }

      if (controls.right()) {
        angle -= 0.03 * flip;
      }
    }

    x -= Math.sin(angle) * speed;
    y -= Math.cos(angle) * speed;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-angle);

    ctx.beginPath();
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fill();

    ctx.restore();
  };

  return {
    draw,
    update,
    y: () => y,
    x: () => x,
    angle: () => angle,
  };
};
