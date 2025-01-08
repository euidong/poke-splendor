import { BallType, BallTypes } from "./ball";

interface IBallCollection {
  balls: { [key in BallType]: number };
  isSame: (ballCollection: IBallCollection) => boolean;
  deepCopy: () => IBallCollection;
  hasMinus: () => boolean;

  "+": (bc: IBallCollection) => IBallCollection;
  "-": (bc: IBallCollection) => IBallCollection;
  "<": (bc: IBallCollection) => boolean;
  ">": (bc: IBallCollection) => boolean;
  "==": (bc: IBallCollection) => boolean;
  "!=": (bc: IBallCollection) => boolean;
  ">=": (bc: IBallCollection) => boolean;
  "<=": (bc: IBallCollection) => boolean;
  "-=": (bc: IBallCollection) => IBallCollection;
  "+=": (bc: IBallCollection) => IBallCollection;
}

class BallCollection implements IBallCollection {
  balls: { [key in BallType]: number };

  constructor(balls: { [key in BallType]: number }) {
    this.balls = balls;
  }

  isSame = (bc: IBallCollection) => {
    return this["=="](bc);
  };

  hasMinus = () => {
    BallTypes.forEach((ballType) => {
      if (this.balls[ballType] < 0) return true;
    });
    return false;
  };

  deepCopy = () => {
    return new BallCollection({
      ...this.balls,
    });
  };

  "+" = (bc: IBallCollection) => {
    const nbc = this.deepCopy();
    BallTypes.forEach((ballType) => {
      nbc.balls[ballType] += bc.balls[ballType];
    });
    return nbc;
  };

  // ignore under than 0.
  "-" = (bc: IBallCollection) => {
    const nbc = this.deepCopy();
    BallTypes.forEach((ballType) => {
      if (nbc.balls[ballType] < bc.balls[ballType]) nbc.balls[ballType] = 0;
      else nbc.balls[ballType] -= bc.balls[ballType];
    });
    return nbc;
  };

  "<" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] >= bc.balls[ballType]) {
        return false;
      }
    }
    return true;
  };

  ">" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] <= bc.balls[ballType]) {
        return false;
      }
    }
    return true;
  };

  "==" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] !== bc.balls[ballType]) {
        return false;
      }
    }
    return true;
  };

  "!=" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] !== bc.balls[ballType]) {
        return true;
      }
    }
    return false;
  };

  ">=" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] < bc.balls[ballType]) {
        return false;
      }
    }
    return true;
  };

  "<=" = (bc: IBallCollection) => {
    for (let ballType of BallTypes) {
      if (this.balls[ballType] > bc.balls[ballType]) {
        return false;
      }
    }
    return true;
  };

  "+=" = (bc: IBallCollection) => {
    return this["+"](bc);
  };

  "-=" = (bc: IBallCollection) => {
    return this["-"](bc);
  };
}

export type { IBallCollection };
export { BallCollection };
