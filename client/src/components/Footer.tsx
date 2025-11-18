export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm">
              © {new Date().getFullYear()} BX Clan • Wild Rift Vietnam
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="hover:text-red-400 transition">
              Facebook
            </a>
            <a href="#" className="hover:text-red-400 transition">
              Discord
            </a>
            <a href="#" className="hover:text-red-400 transition">
              YouTube
            </a>
          </div>
          <div className="text-sm">
            <p>Made with ❤️ | Chủ đạo màu đỏ</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
