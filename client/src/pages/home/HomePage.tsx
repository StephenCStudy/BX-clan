import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

type Clan = { clanName: string; description?: string; bannerUrl?: string };
type News = { _id: string; title: string; content: string; createdAt: string };

export default function HomePage() {
  const [clan, setClan] = useState<Clan | null>(null);
  const { user } = useAuth();
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [news, setNews] = useState<News[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/clan`);
        setClan(res.data);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/news`);
        const items: News[] = res.data || [];
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNews(items);
      } catch {
        setNews([]);
      } finally {
        setLoadingNews(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-red-50 via-white to-gray-50">
        <div className="absolute inset-0 bg-linear-to-br from-red-600/10 via-transparent to-black/5" />
        <img
          src={
            clan?.bannerUrl ||
            "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?q=80&w=2069&auto=format&fit=crop"
          }
          alt="banner"
          className="w-full h-72 object-cover opacity-20"
        />
        <div className="absolute inset-0 max-w-6xl mx-auto px-4 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-600 drop-shadow">
            {clan?.clanName || "BX Clan"}
          </h1>
          <p className="mt-3 text-gray-700 max-w-2xl font-medium">
            {clan?.description ||
              "Clan Tốc Chiến • Tốc độ – Chiến thắng – Đoàn kết"}
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to={user ? "/customs" : "/register"}
              className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {user ? "Xem Custom Games" : "Tham gia ngay"}
            </Link>
            <Link
              to="/members"
              className="px-6 py-3 rounded-lg bg-black hover:bg-gray-900 text-white font-bold transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Xem thành viên
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-red-600">
            Thông báo mới nhất
          </h2>
          <Link
            to="/news"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Xem tất cả
          </Link>
        </div>
        {loadingNews ? (
          <div className="text-gray-500">Đang tải tin tức...</div>
        ) : news.length === 0 ? (
          <div className="text-gray-500">Chưa có thông báo nào.</div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 8).map((n) => (
              <Link
                key={n._id}
                to={`/news/${n._id}`}
                className="block bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-red-500 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg md:text-xl text-gray-900">
                      {n.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-3 mt-1">
                      {n.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {new Date(n.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
