import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../utils/http";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

interface CustomRoom {
  _id: string;
  title: string;
  description?: string;
  scheduleTime: string;
  maxPlayers: number;
  status: string;
  createdBy: any;
}

export default function CustomsPage() {
  const [customs, setCustoms] = useState<CustomRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduleTime: "",
    maxPlayers: 10,
  });
  const { user } = useAuth();

  useEffect(() => {
    loadCustoms();
  }, []);

  const loadCustoms = () => {
    http
      .get("/customs")
      .then((res) => setCustoms(res.data))
      .catch(() => toast.error("Lỗi tải danh sách"))
      .finally(() => setLoading(false));
  };

  const createCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await http.post("/customs", form);
      toast.success("Tạo Custom thành công");
      setShowForm(false);
      setForm({ title: "", description: "", scheduleTime: "", maxPlayers: 10 });
      loadCustoms();
    } catch {
      toast.error("Lỗi tạo Custom");
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-600">Đang tải...</div>;

  const canCreate =
    user && (user.role === "leader" || user.role === "organizer");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-red-600">Custom Games</h1>
        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition"
          >
            {showForm ? "Hủy" : "+ Tạo Custom"}
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={createCustom}
          className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            Tạo Custom mới
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
                Mô tả
              </label>
              <textarea
                className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Thời gian
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={form.scheduleTime}
                  onChange={(e) =>
                    setForm({ ...form, scheduleTime: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Số người
                </label>
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={form.maxPlayers}
                  onChange={(e) =>
                    setForm({ ...form, maxPlayers: Number(e.target.value) })
                  }
                  min={1}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-lg transition"
            >
              Tạo Custom
            </button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {customs.map((c) => (
          <Link
            key={c._id}
            to={`/customs/${c._id}`}
            className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-red-500 hover:shadow-lg transition block"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-gray-900">{c.title}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  c.status === "open"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : c.status === "ongoing"
                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                    : "bg-gray-100 text-gray-800 border border-gray-300"
                }`}
              >
                {c.status === "open"
                  ? "Mở"
                  : c.status === "ongoing"
                  ? "Đang chơi"
                  : "Đóng"}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {c.description || "Không có mô tả"}
            </p>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-gray-500">
                🕒 {new Date(c.scheduleTime).toLocaleString("vi-VN")}
              </span>
              <span className="text-gray-500">👥 {c.maxPlayers} người</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
