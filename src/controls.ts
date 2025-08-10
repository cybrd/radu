import type { Car } from "./car";

export const Controls = (car: ReturnType<typeof Car>) => {
  document.onkeydown = (event) => {
    switch (event.key) {
      case "w":
        car.setForward(true);
        break;
      case "s":
        car.setReverse(true);
        break;
      case "a":
        car.setLeft(true);
        break;
      case "d":
        car.setRight(true);
        break;
    }
  };

  document.onkeyup = (event) => {
    switch (event.key) {
      case "w":
        car.setForward(false);
        break;
      case "s":
        car.setReverse(false);
        break;
      case "a":
        car.setLeft(false);
        break;
      case "d":
        car.setRight(false);
        break;
    }
  };
};
