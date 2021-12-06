interface GetSequenceProps {
  balance: number;
  unit: number;
  losses: number;
  winAmount: number;

  streak: string;
}

interface GetSequenceReturnType {
  win: number;
  loss: number;
  movesLeft: number;
  balance: number;
  labouchereSequence: string;
  bet: number;
}

export const getSequence = ({
  balance,
  losses,
  winAmount,
  streak,
  unit,
}: GetSequenceProps): GetSequenceReturnType => {
  if (winAmount < 1 || unit < 1 || unit > winAmount || balance < 1) {
    return {
      win: 0,
      loss: 0,
      movesLeft: 0,
      balance,
      labouchereSequence: "",
      bet: 0,
    };
  }

  let moves = Math.ceil(winAmount / unit);

  // fail at:
  // wins + moves ≤ loss * 2
  if (losses > 0) {
    while (moves < losses * 4 && unit !== 1) {
      unit = Math.max(Math.floor(unit / 2), 1);
      moves = Math.ceil(winAmount / unit);
    }
  }

  /**
   * @type {number[]}
   */
  let labouchereArray = new Array(moves).fill(unit);

  const win = streak.replace(/[^w]/gi, "").length;
  const loss = streak.replace(/[^l]/gi, "").length;

  let bet = unit * 2;

  for (let i = 0; i < streak.length; i++) {
    if (streak[i].toLowerCase() === "w") {
      const a = labouchereArray.pop();
      const b = labouchereArray.shift();

      balance += a + b;

      bet = labouchereArray[0] + labouchereArray[labouchereArray.length - 1];
    } else if (streak[i].toLowerCase() === "l") {
      if (labouchereArray.length === 1) {
        bet = labouchereArray[0];
        labouchereArray.push(bet);
        balance -= bet;
      } else {
        const lost =
          labouchereArray[0] + labouchereArray[labouchereArray.length - 1];

        labouchereArray.push(lost);

        balance -= lost;

        bet = labouchereArray[0] + lost;
      }
    }
  }

  let labouchereSequence = labouchereArray
    .reverse()
    .reduce((s, x) => `${x}-${s}`, "");

  labouchereSequence = labouchereSequence.substr(
    0,
    labouchereSequence.length - 1,
  );

  return {
    win,
    loss,
    movesLeft: labouchereArray.length,
    balance,
    labouchereSequence,
    bet,
  };
};
