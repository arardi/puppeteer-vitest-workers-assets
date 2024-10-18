import { connect } from "@cloudflare/puppeteer";
import { fetchMock, SELF } from "cloudflare:test";
import { beforeAll, describe, expect, inject, it } from "vitest";
import type { Browser, HTTPRequest } from "@cloudflare/puppeteer";

const interceptRequest = async (request: HTTPRequest) => {
	const miniflareRequest = new Request(request.url(), {
		method: request.method(),
		body: request.postData(),
	});
	const response = await SELF.fetch(miniflareRequest);
	const arrayBuffer = await response.arrayBuffer();

	await request.respond({
		body: Buffer.from(arrayBuffer),
		headers: Object.fromEntries(response.headers.entries()),
		status: response.status,
	});
};

describe("Puppeteer", () => {
	let browser: Browser;

	beforeAll(async () => {
		browser = await connect({
			browserWSEndpoint: inject("browserWSEndpoint"),
		});
	});

	it("can fetch static assets", async () => {
		const page = await browser.newPage();

		page.setRequestInterception(true);
		page.on("request", interceptRequest);

		await page.goto("http://fakehost/blog/hello-world");

		const contentSelector = await page.locator("text/blog post").waitHandle();
		const content = await contentSelector?.evaluate((el) => el.textContent);
		expect(content).toMatchInlineSnapshot(`"This is a blog post."`);
	});

	it("can fetch a Worker", async () => {
		const page = await browser.newPage();

		page.setRequestInterception(true);
		page.on("request", interceptRequest);

		await page.goto("http://fakehost/api/date");

		expect(await page.content()).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
		);

		// Alternatively...

		const response = await SELF.fetch("http://fakehost/api/date");

		expect(await response.text()).toMatch(
			/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/
		);
	});

	it("can fetch a Worker and mock it's dependencies", async () => {
		fetchMock.activate();
		fetchMock.disableNetConnect();

		fetchMock
			.get("https://icanhazdadjoke.com")
			.intercept({ path: "/" })
			.reply(
				200,
				"My dog used to chase people on a bike a lot. It got so bad I had to take his bike away."
			);

		const page = await browser.newPage();

		page.setRequestInterception(true);
		page.on("request", interceptRequest);

		await page.goto("http://fakehost/api/joke");

		expect(await page.content()).toContain(
			"My dog used to chase people on a bike a lot. It got so bad I had to take his bike away."
		);

		// Alternatively...

		fetchMock
			.get("https://icanhazdadjoke.com")
			.intercept({ path: "/" })
			.reply(
				200,
				"My dog used to chase people on a bike a lot. It got so bad I had to take his bike away."
			);

		const response = await SELF.fetch("http://fakehost/api/joke");

		expect(await response.text()).toEqual(
			"My dog used to chase people on a bike a lot. It got so bad I had to take his bike away."
		);

		fetchMock.assertNoPendingInterceptors();
	});

	it("can fetch a Worker which binds to assets", async () => {
		const page = await browser.newPage();

		page.setRequestInterception(true);
		page.on("request", interceptRequest);

		await page.goto("http://fakehost/binding");

		const contentSelector = await page.locator("text/blog post").waitHandle();
		const content = await contentSelector?.evaluate((el) => el.textContent);
		expect(content).toMatchInlineSnapshot(`"This is a blog post."`);

		const titleSelector = await page.locator("text/Intercept").waitHandle();
		const title = await titleSelector?.evaluate((el) => el.textContent);
		expect(title).toMatchInlineSnapshot(`"Intercept!"`);
	});

	it("can fetch and 404 correctly", async () => {
		const page = await browser.newPage();

		page.setRequestInterception(true);
		page.on("request", interceptRequest);

		await page.goto("http://fakehost/non-existent");

		const titleSelector = await page.locator("text/404").waitHandle();
		const title = await titleSelector?.evaluate((el) => el.textContent);
		expect(title).toMatchInlineSnapshot(`"404 Not Found"`);
	});
});
