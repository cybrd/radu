import { Car } from "./car";
import {
  Level,
  mutateNetwork,
  networkFeedForward,
  NeutralNetwork,
  randomizeLevel,
} from "./neural-network";
import { Road } from "./road";
import { Sensors } from "./sensors";

let testCount = 0;

const main = (testNumber: number) => {
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
    Car(road.getLaneCenter(2), -500, 30, 50, 1.5),
    Car(road.getLaneCenter(3), -1000, 30, 50, 1.5),
    Car(road.getLaneCenter(4), -1500, 30, 50, 1.5),
  ];

  type MainCar = {
    car: ReturnType<typeof Car>;
    sensors: ReturnType<typeof Sensors>;
    brain: ReturnType<typeof NeutralNetwork>;
  };
  const mainCars: MainCar[] = [];
  const randomCars = 100;
  for (let i = 0; i < randomCars; i++) {
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

  const storage = localStorage.getItem("brain");
  if (storage) {
    const load = JSON.parse(storage) as ReturnType<typeof Level>[][];

    for (let i = 0; i < 20; i++) {
      const car = Car(road.getLaneCenter(2), 100, 30, 50);
      const sensors = Sensors(car);
      const brain = NeutralNetwork([sensors.rayCount, 6, 4]);
      brain.levels = load[i];

      mainCars.push({
        car,
        sensors,
        brain,
      });

      for (let j = 0; j < 10; j++) {
        const car = Car(road.getLaneCenter(2), 100, 30, 50);
        const sensors = Sensors(car);
        const brain = NeutralNetwork([sensors.rayCount, 6, 4]);
        brain.levels = load[i];
        mutateNetwork(brain);

        mainCars.push({
          car,
          sensors,
          brain,
        });
      }
    }

    console.log("loaded");
  }

  document.getElementById("save")?.addEventListener("click", () => {
    const sorted = mainCars.sort((a, b) => a.car.y() - b.car.y());

    const save = [];
    for (let i = 0; i < 20; i++) {
      save.push(sorted[i].brain.levels);
    }

    console.log("saved");
  });

  document.getElementById("discard")?.addEventListener("click", () => {
    localStorage.removeItem("brain");
    console.log("discarded");
  });

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

      const howMany = Math.round(Math.random() * 2 + 2);
      for (let i = 0; i < howMany; i++) {
        const where = Math.round(Math.random() * 5);
        obstacleCars.push(
          Car(
            road.getLaneCenter(where),
            furthestObstacleCar - 500,
            30,
            50,
            Math.random() * 1.5 + 0.5
          )
        );
      }
    }

    road.draw(ctx);
    for (let i = 0; i < obstacleCars.length; i++) {
      obstacleCars[i].update([]);
      obstacleCars[i].draw(ctx);

      obstacles.push(...obstacleCars[i].polygonToLineVectorArr());
    }

    for (let i = 0; i < mainCars.length; i++) {
      const readings = mainCars[i].sensors.update(obstacles);

      if (readings) {
        const offsets = readings.map((x) => (x ? 1 - x.offset : 0));

        const outputs = networkFeedForward(offsets, mainCars[i].brain);
        mainCars[i].car.update(obstacles, outputs);

        if (bestCarIndex === i) {
          mainCars[i].sensors.draw(ctx);
        }
      }

      if (bestCarIndex !== i) {
        mainCars[i].car.draw(ctx, false);
      }
    }
    mainCars[bestCarIndex].car.draw(ctx, true);

    ctx.restore();

    if (testCount === testNumber) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

document.getElementById("restart")?.addEventListener("click", () => {
  testCount++;
  main(testCount);
});

main(testCount);
