export const Car = (x: number, y: number, width: number, height: number) => {
  const controls = Controls();

  let speed = 0;
  const acceleration = 0.2;
  const maxSpeed = 3;
  const friction = 0.1;

  let angle = 0;

  return {
    draw: (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-angle);

      ctx.beginPath();
      ctx.rect(-width / 2, -height / 2, width, height);
      ctx.fill();

      ctx.restore();
    },
    update: () => {
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
    },
    y: () => y,
  };
};

const Controls = () => {
  let forward = false;
  let reverse = false;
  let left = false;
  let right = false;

  document.onkeydown = (event) => {
    switch (event.key) {
      case "w":
        forward = true;
        break;
      case "s":
        reverse = true;
        break;
      case "a":
        left = true;
        break;
      case "d":
        right = true;
        break;
    }
  };

  document.onkeyup = (event) => {
    switch (event.key) {
      case "w":
        forward = false;
        break;
      case "s":
        reverse = false;
        break;
      case "a":
        left = false;
        break;
      case "d":
        right = false;
        break;
    }
  };

  return {
    forward: () => forward,
    reverse: () => reverse,
    left: () => left,
    right: () => right,
  };
};
