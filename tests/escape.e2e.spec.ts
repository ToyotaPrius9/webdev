import { test, expect } from "@playwright/test";

test.describe("Escape Room", () => {
  test("shows welcome screen and leaderboard", async ({ page }) => {
    await page.goto("/escape");

    // heading text
    await expect(
      page.getByRole("heading", { name: /welcome to the escape room/i })
    ).toBeVisible();

    // leaderboard visible
    await expect(page.getByText(/Leaderboard/i)).toBeVisible();

    // start button
    await expect(page.getByRole("button", { name: /enter/i })).toBeVisible();
  });

  test("user can start game, chicken out, and return to intro", async ({
    page,
  }) => {
    await page.goto("/escape");

    // Start the game
    await page.getByRole("button", { name: /enter/i }).click();

    // stage 1
    await expect(
      page.getByText(/Stage 1: Hello, World!/i)
    ).toBeVisible();

    // leaderboard disappears when playing
    await expect(page.getByText(/Leaderboard/i)).toHaveCount(0);

    // "chicken out"
    await page.getByRole("button", { name: /chicken out/i }).click();

    // confirmation dialog appears
    await expect(
      page.getByText(/Are you sure you wish to give up/i)
    ).toBeVisible();

    // confirm chicken
    await page.getByRole("button", { name: /Yeah\.\.\./i }).click();

    // back to welcome
    await expect(
      page.getByRole("heading", { name: /welcome to the escape room/i })
    ).toBeVisible();

    // leaderboard visible
    await expect(page.getByText(/Leaderboard/i)).toBeVisible();
  });

  test("user completes all 3 stages, saves time, and goes back to start", async ({
    page,
  }) => {
    await page.goto("/escape");

    // start
    await page.getByRole("button", { name: /enter/i }).click();

    const textarea = page.getByPlaceholder("Type your JavaScript code here...");

    // --- stage 1 ---
    await expect(
      page.getByText(/Stage 1: Hello, World!/i)
    ).toBeVisible();

    await textarea.fill('console.log("Hello world");');
    await page.getByRole("button", { name: /submit answer/i }).click();

    // --- stage 2 ---
    await expect(
      page.getByText(/Stage 2: Alert Message/i)
    ).toBeVisible();

    await textarea.fill('alert("Welcome to the escape room!");');
    await page.getByRole("button", { name: /submit answer/i }).click();

    // --- stage 3 ---
    await expect(
      page.getByText(/Stage 3: Make a Function/i)
    ).toBeVisible();

    await textarea.fill(
      "function add(a, b) { return a + b; } add(1, 2);"
    );
    await page.getByRole("button", { name: /submit answer/i }).click();

    // finis screen
    await expect(
      page.getByText(/Congratulations!/i)
    ).toBeVisible();
    await expect(
      page.getByText(/You successfully escaped/i)
    ).toBeVisible();

    // handle browser alert ("Time saved: ...")
    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    // wait for POST /api/escape-time 
    const saveButton = page.getByRole("button", { name: /save time/i });

    const [response] = await Promise.all([
      page.waitForResponse((res) =>
        res.url().includes("/api/escape-time") &&
        res.request().method() === "POST"
      ),
      saveButton.click(),
    ]);

    await expect(response.ok()).toBeTruthy();

    // see "Back to start"
    const backButton = page.getByRole("button", { name: /back to start/i });
    await backButton.click();

    // back to welcome 
    await expect(
      page.getByRole("heading", { name: /welcome to the escape room/i })
    ).toBeVisible();
    await expect(page.getByText(/Leaderboard/i)).toBeVisible();
  });
});
