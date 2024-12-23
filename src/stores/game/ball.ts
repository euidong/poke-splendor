const BallTypes = [
  "masterball",
  "ultraball",
  "quickball",
  "healball",
  "greatball",
  "pokeball",
] as const;

type BallType = (typeof BallTypes)[number];

interface IBall {
  type: BallType;
  isSame: (ball: IBall) => boolean;
}

class Ball implements IBall {
  type: BallType;

  constructor(type: BallType) {
    this.type = type;
  }

  isSame = (ball: IBall) => {
    return this.type === ball.type;
  };
}

export type { BallType, IBall };
export { BallTypes, Ball };
