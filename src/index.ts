import { connect } from "@cloudflare/puppeteer";
import { beforeAll, describe, expect, inject, it } from "vitest";
import type { Browser } from "@cloudflare/puppeteer";

export default {
  async fetch() {
    // Inisialisasi browser Puppeteer
    const browser = await connect({
      browserWSEndpoint: inject("browserWSEndpoint"),
    });
    
    try {
      const page = await browser.newPage();
      
      // Navigasi ke URL target
      await page.goto("http://zhe.ct.ws/api/letv8.php?id=3233353730", {
        waitUntil: "networkidle2",
        timeout: 30000
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
