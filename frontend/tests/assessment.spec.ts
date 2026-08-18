import { expect, test } from "@playwright/test";

const apiURL = process.env.PLAYWRIGHT_API_URL ?? `http://${process.env.EC2_HOST ?? "127.0.0.1"}:4080`;

test("server use case: create, read, update, and delete an RSS feed", async ({ request }) => {
  const healthResponse = await request.get(`${apiURL}/health`);
  expect(healthResponse.status()).toBe(200);
  expect((await healthResponse.json()).database).toBe("ok");

  const slug = `playwright-${Date.now()}`;
  const createResponse = await request.post(`${apiURL}/api/feeds`, {
    headers: { "x-client-id": "playwright-server" },
    data: {
      name: "Playwright Test Feed",
      slug,
      sourceUrl: "https://example.com/test-feed.xml",
    },
  });
  expect(createResponse.status()).toBe(201);

  const created = await createResponse.json();
  expect(created.slug).toBe(slug);

  const readResponse = await request.get(`${apiURL}/api/feeds/${slug}`, { headers: { "x-client-id": "playwright-server" } });
  expect(readResponse.ok()).toBeTruthy();
  expect((await readResponse.json()).name).toBe("Playwright Test Feed");

  const updateResponse = await request.patch(`${apiURL}/api/feeds/${slug}`, {
    headers: { "Content-Type": "application/json", "x-client-id": "playwright-server" },
    data: { name: "Updated Playwright Feed" },
  });
  expect(updateResponse.ok()).toBeTruthy();
  expect((await updateResponse.json()).name).toBe("Updated Playwright Feed");

  const deleteResponse = await request.delete(`${apiURL}/api/feeds/${slug}`, { headers: { "x-client-id": "playwright-server" } });
  expect(deleteResponse.status()).toBe(204);
});

test("client use case: view an RSS feed and its original-post action", async ({ page, request }) => {
  const feedsResponse = await request.get(`${apiURL}/api/feeds`, { headers: { "x-client-id": "playwright-client" } });
  expect(feedsResponse.ok()).toBeTruthy();
  const feeds = await feedsResponse.json();
  const feedWithPosts = feeds.find((feed: { items: unknown[] }) => feed.items.length > 0);
  expect(feedWithPosts).toBeTruthy();

  await page.goto("/feeds");
  await expect(page.getByRole("heading", { name: "Feeds / Posts" })).toBeVisible();
  await expect(page.getByLabel("Feed slug")).toBeVisible();
  await expect(page.getByRole("link", { name: /Read original post/ }).first()).toBeVisible();
  await page.getByRole("link", { name: /View feed/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/feeds/${feedWithPosts.slug}$`));
  await expect(page.getByRole("heading", { name: feedWithPosts.name })).toBeVisible();
});