import { Car } from "./car";
import { Controls } from "./controls";
import { Road } from "./road";
import { Sensors } from "./sensors";

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

  const otherCars = [
    Car(road.getLaneCenter(0), 0, 30, 50, 2),
    Car(road.getLaneCenter(1), 0, 30, 50, 1.8),
  ];

  const mainCar = Car(road.getLaneCenter(0), 100, 30, 50);
  const sensors = Sensors(mainCar);
  Controls(mainCar);

  const animate = () => {
    canvas.width = canvas.width;

    ctx.save();
    ctx.translate(0, -mainCar.y() + canvas.height * 0.7);

    const obstacles = [...road.borders()];

    road.draw(ctx);
    for (const car of otherCars) {
      car.update([...mainCar.polygonToLineVectorArr()]);
      car.draw(ctx);

      obstacles.push(...car.polygonToLineVectorArr());
    }

    mainCar.update(obstacles);
    sensors.update(obstacles);

    mainCar.draw(ctx);
    sensors.draw(ctx);

    ctx.restore();

    requestAnimationFrame(animate);
  };

  animate();
};

main();
