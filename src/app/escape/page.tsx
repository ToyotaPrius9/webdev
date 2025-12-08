"use client";

import { useEffect, useState } from "react";
import { studentInfo } from "@/config";
type Stage = {
  title: string;
  prompt: string;
  hint?: string;
};

type LeaderboardEntry = {
  id: string;
  timeSeconds: number;
  createdAt: string;
  studentFirstName?: string | null;
};

const STAGES: Stage[] = [
  {
    title: "Stage 1: Hello, World!",
    prompt:
      'Write JavaScript code that prints "Hello world" to the console.',
    hint: `Use console.log("Hello world");`,
  },
  {
    title: "Stage 2: Alert Message",
    prompt:
      'Write JavaScript code that shows an alert popup with the text "Welcome to the escape room!"',
    hint: `Use alert("Welcome to the escape room!");`,
  },
  {
    title: "Stage 3: Make a Function!!!!",
    prompt:
      "Write a JavaScript function named add(a, b) that returns the sum of its two arguments, and then call it once.",
    hint: `Example shape: function add(a, b) { return a + b; }`,
  },
];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString();
}

function validateAnswer(stageIndex: number, answer: string): boolean {
  const lower = answer.toLowerCase();

  switch (stageIndex) {
    case 0:
      return lower.includes("console.log") && lower.includes("hello world");
    case 1:
      return lower.includes("alert(");
    case 2:
      return (
        lower.includes("function") &&
        lower.includes("add") &&
        lower.includes("return")
      );
    default:
      return answer.trim().length > 0;
  }
}

export default function EscapePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

  // helper: reset everything back to the "Welcome" state
  const resetGameToStart = () => {
    setGameStarted(false);
    setFinished(false);
    setElapsedSeconds(0);
    setCurrentStageIndex(0);
    setCurrentAnswer("");
    setFeedback(null);
    setShowGiveUpConfirm(false);
  };

  // Load leaderboard from API
  async function loadLeaderboard() {
    try {
      setLeaderboardLoading(true);
      setLeaderboardError(null);

      const res = await fetch("/api/escape-time", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await res.json();
      setLeaderboard(data.records ?? []);
    } catch (err) {
      console.error("Error loading leaderboard:", err);
      setLeaderboardError("Failed to load leaderboard.");
    } finally {
      setLeaderboardLoading(false);
    }
  }

  // Load leaderboard on initial mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  // Timer: count UP while the game is running
  useEffect(() => {
    if (!gameStarted || finished) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, finished]);

  const handleEnter = () => {
    setGameStarted(true);
    setFinished(false);
    setCurrentStageIndex(0);
    setElapsedSeconds(0); // start from 0
    setCurrentAnswer("");
    setFeedback(null);
    setShowGiveUpConfirm(false);
  };

  const handleSubmitAnswer = () => {
    const ok = validateAnswer(currentStageIndex, currentAnswer);

    if (!ok) {
      setFeedback("Not quite right yet.... Try again!");
      return;
    }

    const isLastStage = currentStageIndex === STAGES.length - 1;

    if (isLastStage) {
      setFinished(true);
      setGameStarted(false);
      setFeedback("Nice! You cleared all stages");
      setShowGiveUpConfirm(false);
    } else {
      setCurrentStageIndex((prev) => prev + 1);
      setCurrentAnswer("");
      setFeedback("Nice! Moving to the next stage...");
    }
  };

  const handleSaveTime = async () => {
    const timeTakenSeconds = elapsedSeconds;

    try {
      const res = await fetch("/api/escape-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSeconds: timeTakenSeconds,
          studentId: studentInfo.number,           
          studentFirstName: studentInfo.firstname,
          
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Save failed:", data);
        alert("Failed to save time. Please try again.");
        return;
      }

      const data = await res.json();
      console.log("Saved escape time record:", data.record);

      // Refresh leaderboard so this run appears if it's in the top 10
      await loadLeaderboard();

      alert(`Time saved: ${formatTime(timeTakenSeconds)}`);
    } catch (err) {
      console.error("Network error saving time:", err);
      alert("Network error saving time. Please try again.");
    }
  };

  const handleBackToStart = () => {
    resetGameToStart();
  };

  const handleConfirmGiveUp = () => {
    // User clicked "Yeah..." on the confirmation
    resetGameToStart(); // nothing is saved
  };

  const timeTaken = elapsedSeconds;
  const currentStage = STAGES[currentStageIndex];

  return (
    // wrapper that cancels main's padding so bg fills the whole area
    <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-6">
      <div
        className="relative min-h-[70vh] md:min-h-[calc(103vh-160px)] flex items-center justify-center"
        style={{
          backgroundImage: 'url("/bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Timer top-right */}
        {(gameStarted || finished) && (
          <div className="absolute top-4 right-4 z-20">
            <div className="rounded-full px-4 py-2 bg-black/70 text-white text-sm font-mono flex items-center gap-2">
              <span className="font-semibold">
                {finished ? "Final time:" : "Time:"}
              </span>
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
          </div>
        )}

        {/* Main + leaderboard */}
        <div className="relative z-10 max-w-4xl w-full px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {/* Left: main card */}
            <div className="flex-1">
              {/* Intro screen */}
              {!gameStarted && !finished && (
                <div className="text-center md:text-left bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl px-6 py-10">
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-gray-900 dark:text-white">
                    Welcome to the escape room!!
                  </h1>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-6">
                    We&apos;ll track how long you take to solve three JS
                    challenges. Can you really escape this? Run as fast as you can!
                  </p>
                  <button
                    onClick={handleEnter}
                    className="mt-2 inline-flex items-center justify-center px-8 py-3 rounded-md text-lg font-semibold 
                               bg-green-500 hover:bg-green-600 text-white shadow-lg transition-colors"
                  >
                    Enter
                  </button>
                </div>
              )}

              {/* game on */}
              {gameStarted && !finished && (
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-xl px-6 py-8 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                      {currentStage.title}
                    </h2>
                    <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      Stage {currentStageIndex + 1} of {STAGES.length}
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-gray-800 dark:text-gray-200">
                    {currentStage.prompt}
                  </p>

                  {currentStage.hint && (
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 italic">
                      Hint: {currentStage.hint}
                    </p>
                  )}

                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type your JavaScript code here..."
                    className="mt-3 w-full min-h-[180px] rounded-lg border border-gray-300 dark:border-gray-700 
                               bg-gray-50 dark:bg-[#111827] text-sm md:text-base 
                               font-mono text-gray-900 dark:text-gray-100 p-3 focus:outline-none 
                               focus:ring-2 focus:ring-green-500"
                  />

                  {feedback && (
                    <p className="text-sm mt-2 text-green-700 dark:text-green-300">
                      {feedback}
                    </p>
                  )}

                  {/* Actions: Chicken out (left) + Submit (right) */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      type="button"
                      onClick={() => setShowGiveUpConfirm(true)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-md text-xs md:text-sm font-semibold 
                                 bg-gray-500 hover:bg-gray-600 text-white shadow-sm transition-colors"
                    >
                      Chicken out
                    </button>
                    <button
                      onClick={handleSubmitAnswer}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-sm md:text-base font-semibold 
                                 bg-green-500 hover:bg-green-600 text-white shadow-md transition-colors"
                    >
                      Submit Answer
                    </button>
                  </div>

                  {/* giveup */}
                  {showGiveUpConfirm && (
                    <div className="mt-4 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/40 px-4 py-3 text-sm">
                      <p className="text-red-800 dark:text-red-100 mb-3">
                        Are you sure you wish to give up?
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowGiveUpConfirm(false)}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-xs md:text-sm font-semibold 
                                     bg-gray-500 hover:bg-gray-600 text-white shadow-sm transition-colors"
                        >
                          No!
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmGiveUp}
                          className="inline-flex items-center justify-center px-4 py-2 rounded-md text-xs md:text-sm font-semibold 
                                     bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors"
                        >
                          Yeah...
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* finish screen */}
              {finished && (
                <div className="text-center bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl px-6 py-10 space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Congratulations!
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    You successfully escaped by completing all three JavaScript
                    challenges.
                  </p>
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
                    Your time:{" "}
                    <span className="font-mono font-semibold">
                      {formatTime(timeTaken)}
                    </span>
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={handleBackToStart}
                      className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-sm md:text-base font-semibold 
                                 bg-gray-500 hover:bg-gray-600 text-white shadow-md transition-colors"
                    >
                      Back to start
                    </button>
                    <button
                      onClick={handleSaveTime}
                      className="inline-flex items-center justify-center px-8 py-3 rounded-md text-sm md:text-base font-semibold 
                                 bg-green-500 hover:bg-green-600 text-white shadow-lg transition-colors"
                    >
                      Save Time
                    </button>
                  </div>
                </div>
              )}
            </div>

            
            {!gameStarted && (
              <div className="md:w-72 bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-xl px-4 py-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Leaderboard
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  My 5 fastest escape times.
                </p>

                {leaderboardLoading && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Loading...
                  </p>
                )}

                {leaderboardError && !leaderboardLoading && (
                  <p className="text-xs text-red-500">{leaderboardError}</p>
                )}

                {!leaderboardLoading &&
                  !leaderboardError &&
                  leaderboard.length === 0 && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      No completions yet.
                    </p>
                  )}

                {!leaderboardLoading &&
                  !leaderboardError &&
                  leaderboard.length > 0 && (
                    <ol className="mt-2 space-y-2 text-xs">
                      {leaderboard.map((entry, index) => (
                        <li
                          key={entry.id}
                          className="flex flex-col rounded-md bg-gray-100/80 dark:bg-gray-800/80 px-3 py-2"
                        >
                          <span className="font-semibold text-gray-900 dark:text-gray-100">
                            #{index + 1} · {entry.studentFirstName ?? "Anonymous"} · {entry.timeSeconds} seconds
                          </span>
                          <span className="text-[0.7rem] text-gray-600 dark:text-gray-400">
                            {formatDateTime(entry.createdAt)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
