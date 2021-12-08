import type { NextPage } from "next";
import Head from "next/head";
import { createRef, FormEvent, useEffect, useState } from "react";
import { TextField, Box } from "@mui/material";
import { getSequence } from "../utils/labouchere";

const containerRef = createRef<HTMLDivElement>();
const outputRef = createRef<HTMLDivElement>();
const winlossRef = createRef<HTMLDivElement>();

const Home: NextPage = () => {
  const [boxes, setBoxes] = useState<Box[]>(getStoredBoxes());
  const [balance, setBalance] = useState<number>(0);
  const [unit, setUnit] = useState<number>(0);
  const [winAmount, setWinAmount] = useState<number>(0);
  const [expectedLosses, setExpectedLosses] = useState<number>(0);
  const [adjustedBalances, setAdjustedBalances] = useState<number[]>([]);
  const [betSequence, setBetSequence] = useState<string>("");
  const [nextMove, setNextMove] = useState<string>("");

  useEffect(() => {
    const betSequenceArray = betSequence.split(/\s/);

    let k = 0;
    let move = betSequenceArray[0];

    for (let i = 0; i < boxes.length; i++) {
      const { name } = boxes[i];

      if (name.toLowerCase() === "lost") {
        const current = betSequenceArray[++k];

        if (current) {
          move = current;
        } else {
          k = 0;
          move = betSequenceArray[k];
        }
      }
    }

    setNextMove(move);
  }, [betSequence, boxes]);

  const {
    labouchereSequence,
    balance: resultBalance,
    win,
    loss,
    movesLeft,
    bet,
  } = getSequence({
    balance,
    losses: expectedLosses,
    winAmount,
    unit,
    streak: boxes.reduce((s, box) => {
      const name = box.name as "Won" | "Lost";

      if (name === "Won") {
        return `${s}w`;
      } else if (name === "Lost") {
        return `${s}l`;
      }

      return "";
    }, ""),
  });

  const currentBalance =
    resultBalance + adjustedBalances.reduce((sum, x) => sum + x, 0);

  const handleBoxClick = (name: "Won" | "Lost") => {
    setBoxes([
      ...boxes,
      {
        name,
      },
    ]);

    const tid = setTimeout(() => {
      containerRef.current?.scrollTo(0, containerRef.current.scrollHeight);
      outputRef.current?.scrollTo(0, outputRef.current.scrollHeight);
      winlossRef.current?.scrollTo(0, winlossRef.current.scrollHeight);
      clearTimeout(tid);
    }, 200);

    const tid2 = setTimeout(() => {
      setStoredBoxes(boxes);
      clearTimeout(tid2);
    }, 500);
  };

  return (
    <div>
      <Head>
        <title>Labouchere Calc</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h4 className="title">Labouchere Calc</h4>

        <footer className="footer">
          <div>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                boxes.pop();
                setBoxes([...boxes]);
                setStoredBoxes([...boxes]);
              }}
            >
              Undo&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
            <a href="https://github.com/mettlex/labouchere-calc">
              &nbsp;| Open-sourced by Mettle X |&nbsp;
            </a>
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setBoxes([]);
                setStoredBoxes([]);
              }}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clear
            </a>
          </div>
        </footer>

        <div className="container" ref={containerRef}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "16ch" },
              }}
              noValidate
              autoComplete="on"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                return false;
              }}
            >
              <TextField
                label="Starting Balance"
                color="info"
                size="small"
                value={(balance && balance.toLocaleString()) || ""}
                focused
                onChange={(event) => {
                  try {
                    const b = parseInt(event.target.value.replace(/,/g, ""));

                    if (isNaN(b)) {
                      setBalance(0);
                      return;
                    }

                    if (b > -1) {
                      setBalance(b);
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Box>

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "10ch" },
              }}
              noValidate
              autoComplete="on"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                return false;
              }}
            >
              <TextField
                type="number"
                label="Unit"
                color="info"
                size="small"
                value={(unit && unit) || ""}
                focused
                onChange={(event) => {
                  try {
                    const u = parseInt(event.target.value);

                    if (isNaN(u)) {
                      setUnit(0);
                      return;
                    }

                    if (u > -1) {
                      setUnit(u);
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Box>

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "13ch" },
              }}
              noValidate
              autoComplete="on"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                return false;
              }}
            >
              <TextField
                label="Win Amount"
                color="success"
                size="small"
                value={(winAmount && winAmount.toLocaleString()) || ""}
                focused
                onChange={(event) => {
                  try {
                    const w = parseInt(event.target.value.replace(/,/g, ""));

                    if (isNaN(w)) {
                      setWinAmount(0);
                      return;
                    }

                    if (w > -1) {
                      setWinAmount(w);
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Box>

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "13ch" },
              }}
              noValidate
              autoComplete="on"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                return false;
              }}
            >
              <TextField
                type="number"
                label="Expected Losses"
                placeholder="optional"
                color="error"
                size="small"
                value={(expectedLosses && expectedLosses) || ""}
                focused
                onChange={(event) => {
                  try {
                    const l = parseInt(event.target.value);

                    if (isNaN(l)) {
                      setExpectedLosses(0);
                      return;
                    }

                    if (l > -1) {
                      setExpectedLosses(l);
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </Box>

            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "95%" },
              }}
              noValidate
              autoComplete="on"
              onSubmit={(event: FormEvent) => {
                event.preventDefault();
                return false;
              }}
            >
              <TextField
                type="text"
                label="Bet Sequence"
                placeholder="optional"
                color="info"
                size="small"
                value={betSequence}
                focused
                onChange={(event) => {
                  setBetSequence(event.target.value);
                }}
              />
            </Box>
          </div>

          <div className="win-loss" ref={winlossRef}>
            {boxes.map(({ name }, i) => {
              return <div key={i}>{name}</div>;
            })}
          </div>

          <div className="output" ref={outputRef}>
            {(!isNaN(currentBalance) &&
              !isNaN(bet) &&
              currentBalance - winAmount < balance && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    gap: "5px",
                  }}
                >
                  <div className="sequence">{labouchereSequence}</div>

                  <div>
                    Current Balance: {currentBalance.toLocaleString()}{" "}
                    <a
                      href="#"
                      style={{ textDecoration: "none", color: "dimgrey" }}
                      onClick={(event) => {
                        event.preventDefault();

                        const answer = prompt(
                          "Add (+) or Deduct (-) from the current balance. Current Balance = Balance + Adjusted Amount",
                        );

                        if (!answer) {
                          return;
                        }

                        const amount = parseInt(answer);

                        if (isNaN(amount)) {
                          return;
                        }

                        adjustedBalances.push(amount);

                        setAdjustedBalances([...adjustedBalances]);
                      }}
                    >
                      (Adjust)
                    </a>
                  </div>
                  <div>Won: {win}</div>
                  <div>Lost: {loss}</div>
                  <div>Moves Left: {movesLeft}</div>
                  <div>
                    Next Bet:{" "}
                    <b>
                      {bet}{" "}
                      {(nextMove && (
                        <>
                          <span>on </span>
                          <span style={{ color: nextMove.toLowerCase() }}>
                            {nextMove}
                          </span>
                        </>
                      )) ||
                        ""}
                    </b>
                  </div>
                </div>
              )) ||
              (win > 0 ? "Congrats!" : "")}
          </div>

          <div className="inputs">
            <div
              className="box red"
              onClick={() => {
                handleBoxClick("Lost");
              }}
            >
              Lost
            </div>

            <div
              className="box green"
              onClick={() => {
                handleBoxClick("Won");
              }}
            >
              Won
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStoredBoxes = (): Box[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const storedBoxesString = window.localStorage.getItem(
    "labouchere-calc-boxes",
  );

  if (!storedBoxesString) return [];

  try {
    const storedBoxes = JSON.parse(storedBoxesString) as Box[];
    return storedBoxes;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const setStoredBoxes = (boxes: Box[]): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem("labouchere-calc-boxes", JSON.stringify(boxes));
  } catch (error) {
    console.error(error);
  }
};

interface Box {
  name: string;
}

export default Home;
