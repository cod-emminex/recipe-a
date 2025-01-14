// src/e2e/__tests__/RecipeFlow.test.js
import { test, expect } from "@playwright/test";

test("complete recipe creation flow", async ({ page }) => {
  await page.goto("/recipes/new");

  // Fill in recipe form
  await page.fill('[name="title"]', "Test Recipe");
  await page.fill('[name="description"]', "Test Description");

  // Submit form
  await page.click('button[type="submit"]');

  // Verify redirect and success
  await expect(page).toHaveURL(/recipes\/\d+/);
  await expect(page.locator("h1")).toContainText("Test Recipe");
});
