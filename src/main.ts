import { Car } from "./car";

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

  const car = Car(100, 100, 30, 50);

  const animate = () => {
    car.update();
    canvas.width = canvas.width;
    car.draw(ctx);
    requestAnimationFrame(animate);
  };

  animate();
};

main();
