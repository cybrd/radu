export const Controls = () => {
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
