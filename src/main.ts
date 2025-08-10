import { Car } from "./car";
import {
  networkFeedForward,
  NeutralNetwork,
  randomizeLevel,
} from "./neural-network";
import { Road } from "./road";
import { Sensors } from "./sensors";

const main = () => {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  if (!canvas) {
    return;
  }

  canvas.height = window.innerHeight;
  canvas.width = 300;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const road = Road(canvas.width / 2, canvas.width * 0.9, 5);

  const otherCars = [
    Car(road.getLaneCenter(0), 0, 30, 50, 2),
    Car(road.getLaneCenter(1), 0, 30, 50, 1.8),
  ];

  const mainCar = Car(road.getLaneCenter(2), 100, 30, 50);
  const sensors = Sensors(mainCar);

  const brain = NeutralNetwork([sensors.rayCount, 6, 4]);
  brain.levels.map(randomizeLevel);

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

    const readings = sensors.update(obstacles);
    const offsets = readings.map((x) => (x ? 1 - x.offset : 0));

    const outputs = networkFeedForward(offsets, brain);
    mainCar.update(obstacles, outputs);

    mainCar.draw(ctx);
    sensors.draw(ctx);

    ctx.restore();

    requestAnimationFrame(animate);
  };

  animate();
};

main();
