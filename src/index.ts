import puppeteer from 'puppeteer';

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		// Endpoint khusus untuk mengambil respons dari URL target
		if (url.pathname === "/fetch-zhe") {
			// Jalankan Puppeteer untuk mengambil respons
			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			// Buka URL target
			await page.goto('http://zhe.ct.ws/api/letv8.php?id=3233353730', {
				waitUntil: 'networkidle2', // Tunggu hingga jaringan idle
			});

			// Ambil konten halaman
			const content = await page.content();

			// Tutup browser
			await browser.close();

			// Kembalikan respons ke client
			return new Response(content, {
				headers: { 'Content-Type': 'text/html' },
			});
		}

		// Endpoint lain (opsional)
		if (url.pathname === "/api/date") {
			return new Response(new Date().toISOString());
		}

		if (url.pathname === "/api/joke") {
			return fetch("https://icanhazdadjoke.com/", {
				headers: { Accept: "text/plain" },
			});
		}

		if (url.pathname === "/binding") {
			const response = await env.ASSETS.fetch(
				new Request("http://fakehost/blog/hello-world")
			);
			return new HTMLRewriter()
				.on("h1", {
					element(element) {
						element.setInnerContent("Intercept!");
					},
				})
				.transform(response);
		}

		// Default: Ambil dari ASSETS
		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;
