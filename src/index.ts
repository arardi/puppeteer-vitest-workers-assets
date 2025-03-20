import puppeteer from 'puppeteer';

export default {
	async fetch(request) {
		// Jalankan Puppeteer untuk mengambil respons dari URL target
		const browser = await puppeteer.launch({
			args: ['--no-sandbox', '--disable-setuid-sandbox'], // Tambahkan argumen untuk menghindari sandbox
		});
		const page = await browser.newPage();

		try {
			// Buka URL target
			await page.goto('http://zhe.ct.ws/api/letv8.php?id=3233353730', {
				waitUntil: 'networkidle2', // Tunggu hingga jaringan idle
			});

			// Ambil konten halaman
			const content = await page.content();

			// Kembalikan respons ke client
			return new Response(content, {
				headers: { 'Content-Type': 'text/html' },
			});
		} catch (error) {
			// Tangani error jika terjadi kesalahan
			return new Response(`Error: ${error.message}`, {
				status: 500,
				headers: { 'Content-Type': 'text/plain' },
			});
		} finally {
			// Tutup browser setelah selesai
			await browser.close();
		}
	},
};
