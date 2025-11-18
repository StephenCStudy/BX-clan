import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { upload } from "../../utils";
import { http } from "../../utils/http";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    ingameName: "",
    rank: "",
    lane: "",
  });
  const rankOptions = [
    "Iron",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Diamond",
    "Master",
    "Grandmaster",
    "Challenger",
  ];
  const laneOptions = ["Top", "Jungle", "Mid", "ADC", "Support"];
  const [admins, setAdmins] = useState<
    Array<{ _id: string; username: string }>
  >([]);
  const [selectedAdmin, setSelectedAdmin] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ user?: any; message: string; createdAt?: string }>
  >([]);
  const [text, setText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const SOCKET_URL = useMemo(
    () => import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",
    []
  );

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await upload.image(file);
      await http.put("/auth/me/avatar", { avatarUrl: url });
      await refreshUser();
      toast.success("Cập nhật avatar thành công");
    } catch (err) {
      toast.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    setForm({
      ingameName: user.ingameName || "",
      rank: (user as any).rank || "",
      lane: (user as any).lane || "",
    });
  }, [user]);

  useEffect(() => {
    // Load admins (leaders/organizers)
    http
      .get("/members")
      .then((res) => {
        const list = (res.data || []).filter(
          (m: any) => m.role === "leader" || m.role === "organizer"
        );
        setAdmins(list);
        if (list.length) setSelectedAdmin(list[0]._id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Setup socket for admin chat
    const s = io(SOCKET_URL);
    s.on("message:receive", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
    socketRef.current = s;
    return () => {
      s.disconnect();
    };
  }, [SOCKET_URL]);

  if (!user) return null;

  const completeness = useMemo(() => {
    const filled = [
      form.ingameName || user.ingameName,
      form.rank || (user as any).rank,
      form.lane || (user as any).lane,
      user.avatarUrl,
    ].filter(Boolean).length;
    return Math.round((filled / 4) * 100);
  }, [form.ingameName, form.rank, form.lane, user]);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-5 md:p-6">
      {/* Header banner */}
      <div className="relative mb-6 md:mb-8">
        <div className="h-40 rounded-2xl p-0.5 bg-linear-to-r from-rose-500 via-red-600 to-orange-500 shadow-xl">
          <div className="h-full w-full rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-between px-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow">
                {user.username}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold border-2 ${
                    user.role === "leader"
                      ? "bg-yellow-400/20 text-yellow-100 border-yellow-300/60"
                      : user.role === "organizer"
                      ? "bg-fuchsia-400/20 text-fuchsia-100 border-fuchsia-300/60"
                      : user.role === "moderator"
                      ? "bg-cyan-400/20 text-cyan-100 border-cyan-300/60"
                      : "bg-white/20 text-white border-white/40"
                  }`}
                >
                  {user.role === "leader"
                    ? "👑 Trưởng Clan"
                    : user.role === "organizer"
                    ? "🎯 Ban Tổ Chức"
                    : user.role === "moderator"
                    ? "🛡️ Moderator"
                    : "👤 Thành Viên"}
                </span>
              </div>
              {/* Mobile completeness */}
              <div className="md:hidden mt-3 w-64 max-w-full">
                <div className="text-white text-xs mb-1 flex justify-between">
                  <span>Hồ sơ</span>
                  <span>{completeness}%</span>
                </div>
                <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="hidden md:block w-64">
              <div className="text-white text-sm mb-1 flex justify-between">
                <span>Hoàn thiện hồ sơ</span>
                <span>{completeness}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-5 md:p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start gap-5 md:gap-6">
          <div className="relative">
            <img
              src={user.avatarUrl || "https://placehold.co/120x120"}
              alt="avatar"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-purple-500 shadow-lg"
            />
            <label className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer shadow-md bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={onFile}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-4 md:gap-6 w-full">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Username
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {user.username}
                </p>
              </div>

              {!editing ? (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Tên trong game
                    </label>
                    <p className="text-lg text-gray-800">
                      {form.ingameName || user.ingameName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Rank
                      </label>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-sm">
                        {form.rank || "—"}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Lane
                      </label>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-sm">
                        {form.lane || "—"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-gray-600 font-medium">
                      Tên trong game
                    </label>
                    <input
                      className="w-full p-2.5 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      value={form.ingameName}
                      onChange={(e) =>
                        setForm({ ...form, ingameName: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Rank
                      </label>
                      <select
                        className="w-full p-2.5 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        value={form.rank}
                        onChange={(e) =>
                          setForm({ ...form, rank: e.target.value })
                        }
                      >
                        <option value="">Chọn rank</option>
                        {rankOptions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">
                        Lane
                      </label>
                      <select
                        className="w-full p-2.5 bg-gray-50 rounded-lg border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        value={form.lane}
                        onChange={(e) =>
                          setForm({ ...form, lane: e.target.value })
                        }
                      >
                        <option value="">Chọn lane</option>
                        {laneOptions.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm text-gray-600 font-medium">
                  Vai trò
                </label>
                <span
                  className={`ml-2 inline-block px-3 py-1 rounded-lg text-sm font-semibold border-2 ${
                    user.role === "leader"
                      ? "bg-linear-to-r from-yellow-400 to-amber-500 text-white border-amber-600"
                      : user.role === "organizer"
                      ? "bg-linear-to-r from-purple-400 to-fuchsia-500 text-white border-fuchsia-600"
                      : user.role === "moderator"
                      ? "bg-linear-to-r from-blue-400 to-cyan-500 text-white border-cyan-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {user.role === "leader"
                    ? "👑 Trưởng Clan"
                    : user.role === "organizer"
                    ? "🎯 Ban Tổ Chức"
                    : user.role === "moderator"
                    ? "🛡️ Moderator"
                    : "👤 Thành Viên"}
                </span>
              </div>

              <div className="pt-1 md:pt-2">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded-lg text-white bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow"
                  >
                    Sửa thông tin
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await http.put("/auth/me", form);
                          await refreshUser();
                          toast.success("Đã cập nhật thông tin");
                          setEditing(false);
                        } catch {
                          toast.error("Không thể cập nhật");
                        }
                      }}
                      className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 shadow"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setForm({
                          ingameName: user.ingameName || "",
                          rank: (user as any).rank || "",
                          lane: (user as any).lane || "",
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border"
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Chat */}
            <div className="rounded-xl border-2 border-gray-200 p-4 bg-white w-full">
              <h2 className="text-lg font-bold text-red-600 mb-3">
                Liên hệ quản trị
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <label className="text-sm text-gray-600">Gửi tới:</label>
                <select
                  className="p-2 rounded border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  value={selectedAdmin}
                  onChange={(e) => setSelectedAdmin(e.target.value)}
                >
                  {admins.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="h-56 md:h-60 overflow-y-auto rounded bg-gray-50 p-3 mb-3 space-y-2">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm">
                    Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                  </p>
                )}
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className="bg-white border rounded p-2 text-sm"
                  >
                    <span className="font-semibold text-red-600">
                      {m.user?.username || "Bạn"}
                    </span>
                    : {m.message}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (!text.trim()) return;
                      if (!socketRef.current) return;
                      socketRef.current.emit("message:send", {
                        message: text,
                        to: selectedAdmin,
                      });
                      setText("");
                    }
                  }}
                  className="flex-1 p-2 bg-gray-50 rounded border-2 border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                  placeholder="Nhập tin nhắn..."
                />
                <button
                  onClick={() => {
                    if (!text.trim()) return;
                    if (!socketRef.current) return;
                    socketRef.current.emit("message:send", {
                      message: text,
                      to: selectedAdmin,
                    });
                    setText("");
                  }}
                  className="px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700 shadow"
                >
                  Gửi
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tin nhắn sẽ được gửi tới quản trị viên đã chọn.
              </p>
            </div>
          </div>
        </div>
        {uploading && (
          <p className="mt-4 text-center text-purple-600 font-medium">
            Đang upload...
          </p>
        )}
      </div>
    </div>
  );
}
