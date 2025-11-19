// utils/callBackend.js

/**
 * Gọi backend Render với retry nếu backend chưa awake
 * @param {string} url - URL endpoint backend Render
 * @param {number} retries - số lần thử (mặc định 5)
 * @param {number} delay - thời gian chờ giữa các lần thử (ms, mặc định 1000)
 * @returns {Promise<any>}
 */
export async function callBackend(url, retries = 5, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // timeout 5s

      const res = await fetch(url, { signal: controller.signal });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      return data; // thành công, trả về dữ liệu
    } catch (err) {
      console.log(`Call backend failed (attempt ${i + 1}):`, err.message);
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw new Error("Backend not ready after multiple attempts");
      }
    }
  }
}
