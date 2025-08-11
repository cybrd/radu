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

  const obstacleCars = [
    Car(road.getLaneCenter(0), 0, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(1), 0, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(1), -300, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(2), -300, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(2), -600, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(3), -600, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(3), -900, 30, 50, Math.random() * 2 + 0.5),
    Car(road.getLaneCenter(4), -900, 30, 50, Math.random() * 2 + 0.5),
  ];

  type MainCar = {
    car: ReturnType<typeof Car>;
    sensors: ReturnType<typeof Sensors>;
    brain: ReturnType<typeof NeutralNetwork>;
  };
  const mainCars: MainCar[] = [];
  const totalCars = 100;
  for (let i = 0; i < totalCars; i++) {
    const car = Car(road.getLaneCenter(2), 100, 30, 50);
    const sensors = Sensors(car);
    const brain = NeutralNetwork([sensors.rayCount, 6, 4]);
    brain.levels.map(randomizeLevel);

    mainCars.push({
      car,
      sensors,
      brain,
    });
  }

  const animate = () => {
    canvas.width = canvas.width;

    ctx.save();

    const furthest = Math.min(...mainCars.map((x) => x.car.y()));
    const bestCarIndex = mainCars.findIndex((x) => x.car.y() === furthest);

    ctx.translate(0, -mainCars[bestCarIndex].car.y() + canvas.height * 0.7);

    const obstacles = [...road.borders()];

    const furthestObstacleCar = Math.min(...obstacleCars.map((x) => x.y()));
    if (furthest < furthestObstacleCar) {
      console.log("obstacleCar created");

      const howMany = Math.round(Math.random() * 5 - 1);
      for (let i = 0; i < howMany; i++) {
        const where = Math.round(Math.random() * 5 - 1);
        obstacleCars.push(
          Car(
            road.getLaneCenter(where),
            furthestObstacleCar - 1000,
            30,
            50,
            Math.random() * 2 + 0.5
          )
        );
      }
    }

    road.draw(ctx);
    for (let i = 0; i < obstacleCars.length; i++) {
      obstacleCars[i].update([]);
      obstacleCars[i].draw(ctx);

      obstacles.push(...obstacleCars[i].polygonToLineVectorArr());

      if (furthest < obstacleCars[i].y() - 500) {
        console.log("obstacleCar deleted");
        obstacleCars.splice(i, 1);
      }
    }

    for (let i = 0; i < totalCars; i++) {
      const readings = mainCars[i].sensors.update(obstacles);
      const offsets = readings.map((x) => (x ? 1 - x.offset : 0));

      const outputs = networkFeedForward(offsets, mainCars[i].brain);
      mainCars[i].car.update(obstacles, outputs);

      mainCars[i].car.draw(ctx);
      mainCars[i].sensors.draw(ctx);
    }

    ctx.restore();

    requestAnimationFrame(animate);
  };

  animate();
};

main();
