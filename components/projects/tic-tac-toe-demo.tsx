"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

type Cell = "X" | "O" | null;

// Same eight lines as GameController::checkWinner in the original project.
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function checkWinner(board: Cell[]) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return { player: board[a], line: [a, b, c] };
  }
  return null;
}

type Log = { tone: "ok" | "rejected"; text: string };

/**
 * A client-side re-implementation of the game's move endpoint, so visitors
 * can see which requests the real API accepts and which it rejects.
 */
export function TicTacToeDemo() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [log, setLog] = useState<Log>({ tone: "ok", text: "POST /game/new  ->  200, empty board, X to play" });
  const result = checkWinner(board);
  const full = board.every(Boolean);

  function move(index: number) {
    const request = `POST /game/{id}/move { index: ${index} }`;
    if (board[index] !== null || result) {
      setLog({
        tone: "rejected",
        text: `${request}  ->  400 Invalid move (${result ? "game already won" : "cell already filled"})`,
      });
      return;
    }
    const next = [...board];
    next[index] = turn;
    const won = checkWinner(next);
    setBoard(next);
    if (!won) setTurn(turn === "X" ? "O" : "X");
    setLog({ tone: "ok", text: `${request}  ->  200${won ? `, winner ${won.player}` : `, ${turn === "X" ? "O" : "X"} to play`}` });
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setLog({ tone: "ok", text: "POST /game/new  ->  200, empty board, X to play" });
  }

  const statusText = result
    ? `Player ${result.player} wins. Further moves are rejected.`
    : full
      ? "Board full. The original API has no draw state, so start a new game."
      : `Player ${turn} to move.`;

  return (
    <div className="grid gap-8 rounded-2xl border border-line bg-ink-2 p-6 md:grid-cols-2 md:p-10">
      <div>
        <div className="grid aspect-square max-w-sm grid-cols-3 gap-2" role="group" aria-label="Tic Tac Toe board">
          {board.map((cell, index) => {
            const winning = result?.line.includes(index as never);
            return (
              <button
                key={index}
                type="button"
                onClick={() => move(index)}
                aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
                className={`grid place-items-center rounded-xl border text-4xl font-medium transition-colors md:text-5xl ${
                  winning ? "border-accent bg-accent-soft text-accent" : "border-line-strong bg-surface hover:bg-surface-2"
                } ${cell === "O" ? "serif-accent" : ""}`}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="eyebrow">Try the rules</p>
        <p className="text-lg" aria-live="polite">
          {statusText}
        </p>
        <p className="text-fg-muted">
          Click a filled cell or keep playing after a win to see the request the original API would reject. This demo
          runs in your browser and mirrors the server logic; it does not call the real app.
        </p>
        <pre
          className={`overflow-x-auto whitespace-pre-wrap break-words rounded-xl border p-4 font-mono text-xs leading-relaxed ${
            log.tone === "rejected" ? "border-danger/40 text-danger" : "border-line text-success"
          }`}
        >
          {log.text}
        </pre>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-line-strong px-5 text-sm transition-colors hover:border-fg"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          New game
        </button>
      </div>
    </div>
  );
}
