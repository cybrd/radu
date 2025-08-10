import { Car } from "./car";
import { Road } from "./road";

const main = () => {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  if (!canvas) {
    return;
  }

  canvas.height = window.innerHeight;
  canvas.width = 200;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const road = Road(canvas.width / 2, canvas.width * 0.9, 4);
  const car = Car(road.getLaneCenter(0), 100, 30, 50);

  const animate = () => {
    canvas.width = canvas.width;

    ctx.save();
    ctx.translate(0, -car.y() + canvas.height * 0.7);

    road.draw(ctx);

    car.update();
    car.draw(ctx);

    ctx.restore();

    requestAnimationFrame(animate);
  };

  animate();
};

main();
