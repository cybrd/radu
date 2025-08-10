export type Vector = {
  x: number;
  y: number;
};

export type LineVector = [Vector, Vector];

export type VectorWithOffset = {
  x: number;
  y: number;
  offset: number;
};
