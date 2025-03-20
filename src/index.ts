import { connect } from "@cloudflare/puppeteer";

export default {
  async fetch(request) {
    // Inisialisasi browser Puppeteer
    const browser = await connect({
      browserWSEndpoint: "wss://production-sfo.browserless.io/chromium?token=RygHgpoxy8J9RQ40abb16d7545855a5d4f16fedfd7&proxy=residential&proxyCountry=us&proxyStickyt", // Ganti dengan endpoint Browserless atau layanan serupa
    });

    try {
      const page = await browser.newPage();

      // Navigasi ke URL target
      await page.goto("http://zhe.ct.ws/api/letv8.php?id=3233353730", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Ambil konten halaman
      const content = await page.content();

      // Tutup browser
      await browser.close();

      // Return response dalam format HTML
      return new Response(content, {
        headers: { "Content-Type": "text/html" },
      });
    } catch (error) {
      // Handle error
      return new Response(`Error: ${error.message}`, {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  },
};
