// __tests__/escape-page.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EscapePage from "@/app/escape/page";

beforeEach(() => {
  // default mock for fetch used by leaderboard + save time
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ records: [] }),
  } as any);
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

test("renders welcome screen and leaderboard on first load", async () => {
  render(<EscapePage />);

  expect(
    await screen.findByText(/Welcome to the escape room/i)
  ).toBeInTheDocument();

  expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
});

test("starts game when Enter is clicked and hides leaderboard", async () => {
  render(<EscapePage />);

  const enterButton = await screen.findByRole("button", { name: /enter/i });
  fireEvent.click(enterButton);

  // stage 1 title appears
  expect(
    await screen.findByText(/Stage 1: Hello, World!/i)
  ).toBeInTheDocument();

  // leaderboard should be hidden
  expect(screen.queryByText(/Leaderboard/i)).not.toBeInTheDocument();
});

test("shows feedback on incorrect answer", async () => {
  render(<EscapePage />);

  const enterButton = await screen.findByRole("button", { name: /enter/i });
  fireEvent.click(enterButton);

  const textarea = await screen.findByPlaceholderText(
    /Type your JavaScript code here/i
  );
  fireEvent.change(textarea, { target: { value: "wrong code" } });

  const submitButton = screen.getByRole("button", {
    name: /submit answer/i,
  });
  fireEvent.click(submitButton);

  expect(
    await screen.findByText(/Not quite right yet/i)
  ).toBeInTheDocument();
});

test("user can chicken out and return to start without saving", async () => {
  render(<EscapePage />);

  const enterButton = await screen.findByRole("button", { name: /enter/i });
  fireEvent.click(enterButton);

  const chickenOut = await screen.findByRole("button", {
    name: /chicken out/i,
  });
  fireEvent.click(chickenOut);

  // confirmation shows
  expect(
    await screen.findByText(/Are you sure you wish to give up/i)
  ).toBeInTheDocument();

  const yeahButton = screen.getByRole("button", { name: /Yeah.../i });
  fireEvent.click(yeahButton);

  // back to welcome
  expect(
    await screen.findByText(/Welcome to the escape room/i)
  ).toBeInTheDocument();

  // save-time API must NOT have been called
  // 1 call = initial GET /api/escape-time for leaderboard
  expect(global.fetch).toHaveBeenCalledTimes(1);
});

test("saving time calls POST /api/escape-time", async () => {
  jest.useFakeTimers();

  // first call: initial leaderboard GET
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ records: [] }),
  } as any);

  render(<EscapePage />);

  const enterButton = await screen.findByRole("button", { name: /enter/i });
  fireEvent.click(enterButton);

  // advance timer a bit
  await act(async () => {
    jest.advanceTimersByTime(3000);
  });

  const textarea = await screen.findByPlaceholderText(
    /Type your JavaScript code here/i
  );

  // Stage 1
  fireEvent.change(textarea, {
    target: { value: 'console.log("Hello world")' },
  });
  fireEvent.click(screen.getByRole("button", { name: /submit answer/i }));

  // Stage 2
  fireEvent.change(await screen.findByPlaceholderText(/Type your/i), {
    target: { value: 'alert("Welcome to the escape room!")' },
  });
  fireEvent.click(screen.getByRole("button", { name: /submit answer/i }));

  // Stage 3
  fireEvent.change(await screen.findByPlaceholderText(/Type your/i), {
    target: {
      value: "function add(a, b) { return a + b; } add(1,2);",
    },
  });
  fireEvent.click(screen.getByRole("button", { name: /submit answer/i }));

  // finished screen appears
  expect(
    await screen.findByText(/Congratulations!/i)
  ).toBeInTheDocument();

  // Next two fetches: POST save + GET leaderboard
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true, record: {} }),
  } as any);
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ records: [] }),
  } as any);

  const saveButton = screen.getByRole("button", { name: /save time/i });

  await act(async () => {
    fireEvent.click(saveButton);
  });

  // Expect a POST call to /api/escape-time
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/escape-time",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
  );
});
