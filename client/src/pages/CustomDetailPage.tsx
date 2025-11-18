import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../utils/http";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import { toast } from "react-toastify";

interface Custom {
  _id: string;
  title: string;
  description: string;
  scheduleTime: string;
  maxPlayers: number;
  status: string;
  createdBy: { username: string };
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

export default function CustomDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [custom, setCustom] = useState<Custom | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const canManage =
    user && (user.role === "leader" || user.role === "organizer");

  useEffect(() => {
    (async () => {
      try {
        const [res1, res2] = await Promise.all([
          http.get(`/customs/${id}`),
          canManage
            ? http.get(`/registrations/${id}/registrations`)
            : Promise.resolve({ data: [] }),
        ]);
        setCustom(res1.data);
        setRegistrations(res2.data);
        if (user) {
          setHasRegistered(
            res2.data.some((r: Registration) => r.user._id === user.id)
          );
          setRegForm((prev) => ({
            ...prev,
            ingameName: user.ingameName || "",
          }));
        }
      } catch {
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, canManage]);

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.ingameName || !regForm.lane || !regForm.rank) {
      toast.error("Vui lòng nhập đủ Ingame, Lane, Rank");
      return;
    }
    try {
      await http.post(`/registrations/${id}/register`, regForm);
      toast.success("Đăng ký thành công!");
      window.location.reload();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Đăng ký thất bại");
    }
  };

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (!custom) return <div className="text-center py-10">Không tìm thấy</div>;

  const approvedPlayers = registrations.filter((r) => r.status === "approved");
  const teamA = approvedPlayers.slice(0, 5);
  const teamB = approvedPlayers.slice(5, 10);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Title Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-red-600">
          <h1 className="text-3xl font-bold text-red-600 mb-2">
            {custom.title}
          </h1>
          <p className="text-gray-600 mb-4">{custom.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              📅 {new Date(custom.scheduleTime).toLocaleString("vi-VN")}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              👥 {approvedPlayers.length}/{custom.maxPlayers} players
            </span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                custom.status === "open"
                  ? "bg-green-100 text-green-700"
                  : custom.status === "ongoing"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {custom.status === "open"
                ? "🟢 Mở"
                : custom.status === "ongoing"
                ? "🔵 Đang chơi"
                : "⚫ Đóng"}
            </span>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Teams & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Formation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                ⚔️ Đội hình thi đấu
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Team A */}
                <div className="bg-red-50 rounded-lg p-4 border-2 border-red-200">
                  <h3 className="font-bold text-red-700 mb-3 text-center">
                    🔴 ĐỘI ĐỎ
                  </h3>
                  <div className="space-y-2">
                    {teamA.length > 0 ? (
                      teamA.map((r) => (
                        <div
                          key={r._id}
                          className="flex items-center gap-2 bg-white p-2 rounded"
                        >
                          <img
                            src={
                              r.user.avatarUrl || "https://placehold.co/40x40"
                            }
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              {r.user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r.user.ingameName}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        Chưa có thành viên
                      </div>
                    )}
                  </div>
                </div>

                {/* Team B */}
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <h3 className="font-bold text-blue-700 mb-3 text-center">
                    🔵 ĐỘI XANH
                  </h3>
                  <div className="space-y-2">
                    {teamB.length > 0 ? (
                      teamB.map((r) => (
                        <div
                          key={r._id}
                          className="flex items-center gap-2 bg-white p-2 rounded"
                        >
                          <img
                            src={
                              r.user.avatarUrl || "https://placehold.co/40x40"
                            }
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              {r.user.username}
                            </div>
                            <div className="text-xs text-gray-500">
                              {r.user.ingameName}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400 py-4">
                        Chưa có thành viên
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📊 Thống kê trận đấu
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600">
                    {teamA.length}
                  </div>
                  <div className="text-sm text-gray-600">Đội Đỏ</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-gray-800">VS</div>
                  <div className="text-sm text-gray-600">Đối đầu</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {teamB.length}
                  </div>
                  <div className="text-sm text-gray-600">Đội Xanh</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-center text-gray-500 text-sm">
                  🏆 Biểu đồ tỷ lệ thắng sẽ hiển thị sau trận
                </div>
              </div>
            </div>

            {/* Video/Livestream */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📺 Video / Livestream
              </h2>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🎥</div>
                  <div>Stream sẽ bắt đầu khi trận đấu diễn ra</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Chat & Registrations */}
          <div className="space-y-6">
            {/* Register Button / Form */}
            {user && custom.status === "open" && !hasRegistered && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {!showRegForm ? (
                  <button
                    onClick={() => setShowRegForm(true)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg hover:shadow-xl"
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
                            onClick={() =>
                              setRegForm({ ...regForm, lane: l.key })
                            }
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

            {hasRegistered && (
              <div className="bg-green-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="text-center text-green-700 font-semibold">
                  ✅ Bạn đã đăng ký!
                </div>
              </div>
            )}

            {/* Chat Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                💬 Thảo luận
              </h2>
              <div className="h-64 bg-gray-50 rounded-lg p-3 overflow-y-auto mb-3">
                <div className="text-center text-gray-400 text-sm">
                  Chat trận đấu (tính năng đang phát triển)
                </div>
              </div>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
