export default {
	async fetch(request) {
		try {
			// URL Browserless API
			const browserlessUrl = 'https://chrome.browserless.io/content?token=RygHgpoxy8J9RQ40abb16d7545855a5d4f16fedfd7';

			// Data yang akan dikirim ke Browserless
			const payload = {
				url: 'http://zhe.ct.ws/api/letv8.php?id=3233353730',
				waitFor: 'networkidle2', // Tunggu hingga jaringan idle
			};

			// Kirim permintaan ke Browserless
			const response = await fetch(browserlessUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			// Ambil konten dari Browserless
			const content = await response.text();

			// Kembalikan respons ke client
			return new Response(content, {
				headers: { 'Content-Type': 'text/html' },
			});
		} catch (error) {
			return new Response(`Error: ${error.message}`, {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		}
	},
};
