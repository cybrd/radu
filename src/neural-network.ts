import { lerp } from "./utils";

export const NeutralNetwork = (neuronCounts: number[]) => {
  const levels = [];

  for (let i = 0; i < neuronCounts.length - 1; i++) {
    levels.push(Level(neuronCounts[i], neuronCounts[i + 1]));
  }

  return { levels };
};

export const networkFeedForward = (
  givenInputs: number[],
  network: ReturnType<typeof NeutralNetwork>
) => {
  let outputs = levelFeedForward(givenInputs, network.levels[0]);

  for (let i = 1; i < network.levels.length; i++) {
    outputs = levelFeedForward(outputs, network.levels[i]);
  }

  return outputs;
};

export const Level = (inputCount: number, outputCount: number) => {
  const inputs = new Array<number>(inputCount);
  const outputs = new Array<number>(outputCount);
  const biases = new Array<number>(outputCount);

  const weights = [];
  for (let i = 0; i < inputCount; i++) {
    weights[i] = new Array<number>(outputCount);
  }

  return {
    inputs,
    outputs,
    biases,
    weights,
  };
};

export const randomizeLevel = (level: ReturnType<typeof Level>) => {
  for (let i = 0; i < level.inputs.length; i++) {
    for (let j = 0; j < level.outputs.length; j++) {
      level.weights[i][j] = Math.random() * 2 - 1;
    }
  }

  for (let i = 0; i < level.biases.length; i++) {
    level.biases[i] = Math.random() * 2 - 1;
  }
};

const levelFeedForward = (
  givenInputs: number[],
  level: ReturnType<typeof Level>
) => {
  for (let i = 0; i < level.inputs.length; i++) {
    level.inputs[i] = givenInputs[i];
  }

  for (let i = 0; i < level.outputs.length; i++) {
    let sum = 0;

    for (let j = 0; j < level.inputs.length; j++) {
      sum += level.inputs[j] * level.weights[j][i];
    }

    if (sum > level.biases[i]) {
      level.outputs[i] = 1;
    } else {
      level.outputs[i] = 0;
    }
  }

  return level.outputs;
};

export const mutateNetwork = (
  network: ReturnType<typeof NeutralNetwork>,
  amount = 0.1
) => {
  const cloned = JSON.parse(JSON.stringify(network.levels)) as ReturnType<
    typeof Level
  >[];

  cloned.forEach((level) => {
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
    }

    for (let i = 0; i < level.weights.length; i++) {
      for (let j = 0; j < level.weights[i].length; j++) {
        level.weights[i][j] = lerp(
          level.weights[i][j],
          Math.random() * 2 - 1,
          amount
        );
      }
    }
  });

  network.levels = cloned;
};
