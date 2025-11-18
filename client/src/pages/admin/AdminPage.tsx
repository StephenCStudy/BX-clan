import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../utils/http";
import { toast } from "react-toastify";

type Tab = "overview" | "members" | "customs" | "news" | "reports";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [stats, setStats] = useState({
    members: 0,
    customs: 0,
    news: 0,
    reports: 0,
  });
  const [members, setMembers] = useState<any[]>([]);
  const [customs, setCustoms] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      http.get("/members"),
      http.get("/customs"),
      http.get("/news"),
      http.get("/reports"),
    ])
      .then(([m, c, n, r]) => {
        setStats({
          members: m.data.length,
          customs: c.data.length,
          news: n.data.length,
          reports: r.data.length,
        });
        setMembers(m.data);
        setCustoms(c.data);
        setNews(n.data);
        setReports(r.data);
      })
      .catch(() => {});
  }, []);

  const kickMember = async (id: string) => {
    if (!confirm("Chắc chắn kick?")) return;
    try {
      await http.delete(`/members/${id}`);
      setMembers(members.filter((m) => m._id !== id));
      toast.success("Đã kick");
    } catch {
      toast.error("Lỗi");
    }
  };

  const changeRole = async (id: string, role: string) => {
    try {
      await http.put(`/members/${id}/role`, { role });
      setMembers(members.map((m) => (m._id === id ? { ...m, role } : m)));
      toast.success("Đã đổi role");
    } catch {
      toast.error("Lỗi");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 bg-linear-to-r from-fuchsia-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      {/* Stat Cards - Clickable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-8">
        <button
          onClick={() => setActiveTab("members")}
          className="rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 text-center text-white shadow-lg bg-linear-to-br from-emerald-400 to-emerald-600 hover:from-emerald-500 hover:to-emerald-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold drop-shadow-sm">
            {stats.members}
          </p>
          <p className="mt-1 md:mt-2 opacity-90 font-medium text-xs sm:text-sm md:text-base">
            Thành viên
          </p>
        </button>
        <button
          onClick={() => setActiveTab("customs")}
          className="rounded-xl p-5 text-center text-white shadow-lg bg-linear-to-br from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          <p className="text-4xl font-extrabold drop-shadow-sm">
            {stats.customs}
          </p>
          <p className="mt-2 opacity-90 font-medium">Custom Games</p>
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className="rounded-xl p-5 text-center text-white shadow-lg bg-linear-to-br from-fuchsia-400 to-purple-600 hover:from-fuchsia-500 hover:to-purple-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          <p className="text-4xl font-extrabold drop-shadow-sm">{stats.news}</p>
          <p className="mt-2 opacity-90 font-medium">Tin tức</p>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className="rounded-xl p-5 text-center text-white shadow-lg bg-linear-to-br from-amber-400 to-orange-600 hover:from-amber-500 hover:to-orange-700 transition-all transform hover:scale-105 cursor-pointer"
        >
          <p className="text-4xl font-extrabold drop-shadow-sm">
            {stats.reports}
          </p>
          <p className="mt-2 opacity-90 font-medium">Báo cáo</p>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-indigo-600">
              Biểu đồ hoạt động
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* News Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">
                  Tin tức
                </h3>
                <div className="h-48 flex items-end gap-2">
                  {news.slice(0, 5).map((n, i) => (
                    <div
                      key={n._id}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-linear-to-t from-fuchsia-500 to-purple-500 rounded-t-lg"
                        style={{ height: `${(i + 1) * 20}%` }}
                      />
                      <p className="text-xs mt-1 text-gray-600 truncate w-full text-center">
                        {n.title?.slice(0, 10)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Chart */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">
                  Báo cáo
                </h3>
                <div className="h-48 flex items-end gap-2">
                  {reports.slice(0, 5).map((r, i) => (
                    <div
                      key={r._id}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-linear-to-t from-amber-500 to-orange-500 rounded-t-lg"
                        style={{ height: `${(i + 1) * 20}%` }}
                      />
                      <p className="text-xs mt-1 text-gray-600">{r.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-emerald-600">
            Quản lý thành viên
          </h2>
          <div className="space-y-2 md:space-y-3">
            {members.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <img
                    src={m.avatarUrl || "https://placehold.co/40x40"}
                    alt={m.username}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-emerald-400"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {m.username}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {m.ingameName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m._id, e.target.value)}
                    className="px-1 sm:px-2 py-1 bg-white rounded-lg border-2 border-gray-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    <option value="organizer">Organizer</option>
                    <option value="leader">Leader</option>
                  </select>
                  <button
                    onClick={() => kickMember(m._id)}
                    className="px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm text-white shadow-md bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                  >
                    Kick
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "customs" && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-blue-600">
            Quản lý Custom Games
          </h2>
          <div className="space-y-2 md:space-y-3">
            {customs.map((c) => (
              <Link
                key={c._id}
                to={`/customs/${c._id}`}
                className="block p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-blue-400 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                      {c.description || "Không có mô tả"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                      🕒 {new Date(c.scheduleTime).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      c.status === "open"
                        ? "bg-green-100 text-green-800"
                        : c.status === "ongoing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === "news" && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-purple-600">
            Quản lý Tin tức
          </h2>
          <div className="space-y-2 md:space-y-3">
            {news.map((n) => (
              <Link
                key={n._id}
                to={`/news/${n._id}`}
                className="block p-3 sm:p-4 bg-linear-to-r from-purple-50 to-fuchsia-50 rounded-lg border border-purple-200 hover:border-purple-400 transition cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {n.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                  {n.content}
                </p>
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 md:mb-4 text-orange-600">
            Quản lý Báo cáo vi phạm
          </h2>
          <div className="space-y-2 md:space-y-3">
            {reports.map((r) => (
              <div
                key={r._id}
                className="p-3 rounded-lg border border-amber-200 bg-amber-50"
              >
                <p className="text-xs sm:text-sm text-gray-800">{r.content}</p>
                <p className="text-xs text-amber-700 mt-1">
                  Trạng thái: {r.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
