export default {
	async fetch(request, env) {
		const url = new URL(request.url);

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

		return env.ASSETS.fetch(request);
	},
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;
