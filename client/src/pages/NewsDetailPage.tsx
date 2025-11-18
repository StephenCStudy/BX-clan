import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../utils/http";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";

interface Comment {
  _id: string;
  user: any;
  message: string;
  createdAt: string;
}

interface Registration {
  _id: string;
  user: {
    _id: string;
    username: string;
    ingameName: string;
    avatarUrl?: string;
  };
  status: string;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [news, setNews] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showRegForm, setShowRegForm] = useState(false);
  const [regForm, setRegForm] = useState({
    ingameName: "",
    lane: "",
    rank: "",
  });
  const laneOptions = [
    { key: "Top", icon: "🗡️", label: "Top" },
    { key: "Jungle", icon: "🌿", label: "Jungle" },
    { key: "Mid", icon: "🔮", label: "Mid" },
    { key: "ADC", icon: "🏹", label: "ADC" },
    { key: "Support", icon: "✨", label: "Support" },
  ];
  const rankOptions = [
    { key: "Iron", icon: "⛓️", label: "Iron" },
    { key: "Bronze", icon: "🪙", label: "Bronze" },
    { key: "Silver", icon: "🥈", label: "Silver" },
    { key: "Gold", icon: "🥇", label: "Gold" },
    { key: "Platinum", icon: "💠", label: "Platinum" },
    { key: "Diamond", icon: "💎", label: "Diamond" },
    { key: "Master", icon: "🧙", label: "Master" },
    { key: "Grandmaster", icon: "🏆", label: "Grandmaster" },
    { key: "Challenger", icon: "👑", label: "Challenger" },
  ];
  const [teams, setTeams] = useState<string[][]>([]);
  const canManage =
    user && (user.role === "leader" || user.role === "organizer");

  useEffect(() => {
    if (!id) return;
    http
      .get(`/news/${id}`)
      .then((res) => setNews(res.data))
      .catch(() => toast.error("Lỗi tải tin"));

    http
      .get(`/news/${id}/comments`)
      .then((res) => setComments(res.data))
      .catch(() => {});

    http
      .get(`/news/${id}/registrations`)
      .then((res) => {
        setRegistrations(res.data || []);
        if (user)
          setHasRegistered(
            res.data?.some((r: Registration) => r.user._id === user.id) || false
          );
        if (user)
          setRegForm((f) => ({ ...f, ingameName: user.ingameName || "" }));
      })
      .catch(() => setRegistrations([]));

    setLoading(false);
  }, [id]);

  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const res = await http.post(`/news/${id}/comments`, { message });
      setComments([...comments, res.data]);
      setMessage("");
    } catch {
      toast.error("Lỗi gửi bình luận");
    }
  };

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.ingameName || !regForm.lane || !regForm.rank) {
      toast.error("Vui lòng nhập đủ Ingame, Lane, Rank");
      return;
    }
    try {
      await http.post(`/news/${id}/register`, regForm);
      toast.success("Đã đăng ký tham gia");
      const res = await http.get(`/news/${id}/registrations`);
      setRegistrations(res.data || []);
      setHasRegistered(true);
      setShowRegForm(false);
    } catch {
      toast.error("Đăng ký thất bại");
    }
  };

  const approve = async (regId: string) => {
    try {
      await http.put(`/registrations/${regId}/approve`);
      setRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, status: "approved" } : r))
      );
      toast.success("Đã duyệt");
    } catch {
      toast.error("Lỗi duyệt");
    }
  };

  const reject = async (regId: string) => {
    try {
      await http.put(`/registrations/${regId}/reject`);
      setRegistrations((prev) =>
        prev.map((r) => (r._id === regId ? { ...r, status: "rejected" } : r))
      );
      toast.success("Đã từ chối");
    } catch {
      toast.error("Lỗi từ chối");
    }
  };

  const shuffle = (arr: any[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const splitTeams = () => {
    const pool = registrations.filter((r) => r.status === "approved");
    const useList = pool.length ? pool : registrations;
    if (useList.length < 10) {
      const missing = 10 - useList.length;
      toast.error(`Thiếu ${missing} người để đủ 10`);
    }
    const shuffled = shuffle(useList);
    const chunked: string[][] = [];
    for (let i = 0; i < shuffled.length; i += 5) {
      const chunk = shuffled.slice(i, i + 5).map((r) => r.user.username);
      if (chunk.length) chunked.push(chunk);
    }
    setTeams(chunked);
  };

  const createCustomsFromTeams = async () => {
    if (!news || teams.length === 0) return;
    try {
      for (let i = 0; i < teams.length; i++) {
        const members = teams[i];
        await http.post("/customs", {
          title: `${news.title} - Team ${i + 1}`,
          description: `Thành viên: ${members.join(", ")}`,
          scheduleTime: new Date().toISOString(),
          maxPlayers: 5,
          status: "open",
        });
      }
      toast.success(`Đã tạo ${teams.length} custom mới`);
    } catch {
      toast.error("Không thể tạo custom tự động");
    }
  };

  if (loading || !news)
    return <div className="text-center py-10">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <BackButton />
      </div>
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-4 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {news.title}
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          {new Date(news.createdAt).toLocaleString("vi-VN")}
        </p>
        <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {news.content}
        </div>
      </div>

      {/* Registration CTA / Form */}
      {user && !hasRegistered && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6 shadow-lg">
          {!showRegForm ? (
            <button
              onClick={() => setShowRegForm(true)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow"
            >
              🎮 Đăng ký tham gia
            </button>
          ) : (
            <form onSubmit={register} className="space-y-4">
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Tên trong game
                </label>
                <input
                  className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={regForm.ingameName}
                  onChange={(e) =>
                    setRegForm({ ...regForm, ingameName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700 font-medium">
                  Lane
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {laneOptions.map((l) => (
                    <button
                      key={l.key}
                      type="button"
                      onClick={() => setRegForm({ ...regForm, lane: l.key })}
                      className={`px-2 py-2 rounded-lg border-2 text-sm ${
                        regForm.lane === l.key
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <span className="block text-lg">{l.icon}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Rank
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 appearance-none"
                    value={regForm.rank}
                    onChange={(e) =>
                      setRegForm({ ...regForm, rank: e.target.value })
                    }
                  >
                    <option value="">Chọn rank</option>
                    {rankOptions.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.icon} {r.label}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ▾
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition"
                >
                  Lưu đăng ký
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegForm(false)}
                  className="px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">
          Bình luận ({comments.length})
        </h2>

        {user && (
          <form onSubmit={postComment} className="mb-6">
            <textarea
              className="w-full p-3 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 mb-2"
              placeholder="Viết bình luận..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-medium text-white shadow-md bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              Gửi
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c._id}
              className="flex gap-3 p-3 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
            >
              <img
                src={c.user?.avatarUrl || "https://placehold.co/40x40"}
                alt={c.user?.username}
                className="w-10 h-10 rounded-full border-2 border-indigo-400"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm text-indigo-700">
                  {c.user?.username}
                </p>
                <p className="text-gray-800 text-sm mt-1">{c.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(c.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {canManage && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-lg mt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            👥 Quản lý đăng ký ({registrations.length})
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={splitTeams}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              🔀 Sắp xếp đội
            </button>
            {teams.length > 0 && (
              <button
                onClick={createCustomsFromTeams}
                className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
              >
                ⚙️ Tạo custom tự động
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {registrations.map((r) => (
              <div
                key={r._id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded border"
              >
                <img
                  src={r.user.avatarUrl || "https://placehold.co/40x40"}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{r.user.username}</div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      r.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : r.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => approve(r._id)}
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => reject(r._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      ✗
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {teams.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Đề xuất đội hình
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {teams.map((t, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="font-bold mb-2">Đội {idx + 1}</div>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {t.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {registrations.length < 10 && (
                <div className="mt-3 text-sm text-red-600">
                  Thiếu {10 - registrations.length} người. Bạn có thể cập nhật
                  thông báo để kêu gọi thêm.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
