import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../utils/http";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface News {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: any;
}

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const { user } = useAuth();

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    http
      .get("/news")
      .then((res) => setNews(res.data))
      .catch(() => toast.error("Lỗi tải tin tức"))
      .finally(() => setLoading(false));
  };

  const createNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await http.post("/news", form);
      toast.success("Đăng tin tức thành công");
      setShowForm(false);
      setForm({ title: "", content: "" });
      loadNews();
    } catch {
      toast.error("Lỗi đăng tin");
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-600">Đang tải...</div>;

  const canCreate =
    user && (user.role === "leader" || user.role === "organizer");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-red-600">Tin tức Clan</h1>
        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition"
          >
            {showForm ? "Hủy" : "+ Đăng tin"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={createNews}
          className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Tin tức mới
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Tiêu đề
              </label>
              <input
                className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700 font-medium">
                Nội dung
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg transition"
            >
              Đăng tin
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {news.map((n) => (
          <Link
            key={n._id}
            to={`/news/${n._id}`}
            className="block bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-red-500 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-xl mb-2 text-gray-900">
              {n.title}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {n.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString("vi-VN")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
