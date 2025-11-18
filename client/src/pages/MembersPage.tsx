import { useEffect, useRef, useState } from "react";
import { http } from "../utils/http";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

interface Member {
  _id: string;
  username: string;
  ingameName: string;
  role: string;
  avatarUrl?: string;
  joinDate: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Member | null>(null);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    http
      .get("/members")
      .then((res) => setMembers(res.data))
      .catch(() => toast.error("Lỗi tải danh sách"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="text-center py-10 text-gray-600">Đang tải...</div>;

  const isLeader = user?.role === "leader";

  const viewMember = (m: Member) => setSelected(m);

  const kickMember = async (m: Member) => {
    if (!confirm(`Kick ${m.username} khỏi clan?`)) return;
    try {
      await http.post(`/members/${m._id}/kick`);
      setMembers((prev) => prev.filter((x) => x._id !== m._id));
    } catch (e) {
      toast.error("Không kick được thành viên này");
    }
  };

  const deleteMember = async (m: Member) => {
    if (!confirm(`Xóa tài khoản ${m.username}? Hành động không thể hoàn tác.`))
      return;
    try {
      await http.delete(`/members/${m._id}`);
      setMembers((prev) => prev.filter((x) => x._id !== m._id));
    } catch (e) {
      toast.error("Không xóa được tài khoản này");
    }
  };

  const exportMembers = () => {
    try {
      const rows = members.map((m) => ({
        Username: m.username,
        IngameName: m.ingameName,
        Role: m.role,
        JoinDate: new Date(m.joinDate).toISOString().slice(0, 10),
      }));
      const sheet = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, sheet, "Members");
      XLSX.writeFile(
        wb,
        `members_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      toast.success("Đã xuất Excel");
    } catch (e) {
      toast.error("Xuất Excel thất bại");
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (!json.length) {
        toast.error("File rỗng hoặc không hợp lệ");
        return;
      }
      // Normalize keys
      const payload = json.map((r) => ({
        username: r.Username || r.username,
        ingameName: r.IngameName || r.ingameName || "",
        role: r.Role || r.role || "member",
      }));
      // Try bulk endpoint first
      try {
        await http.post("/members/bulk", { members: payload });
      } catch {
        // Fallback: per-row create
        for (const row of payload) {
          try {
            await http.post("/members", row);
          } catch {}
        }
      }
      const res = await http.get("/members");
      setMembers(res.data);
      toast.success(`Đã nhập ${payload.length} dòng`);
    } catch (err) {
      toast.error("Nhập dữ liệu thất bại");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const roleBadge = (role: string) => (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium border ${
        role === "leader"
          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
          : role === "organizer"
          ? "bg-purple-100 text-purple-800 border-purple-300"
          : role === "moderator"
          ? "bg-blue-100 text-blue-800 border-blue-300"
          : "bg-gray-100 text-gray-800 border-gray-300"
      }`}
    >
      {role}
    </span>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
          Thành viên Clan ({members.length})
        </h1>
        {(user?.role === "leader" || user?.role === "organizer") && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportMembers}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow"
              title="Xuất Excel"
            >
              ⬇️ Xuất Excel
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow"
              title="Nhập dữ liệu từ Excel"
            >
              ⬆️ Nhập dữ liệu
            </button>
            <Link
              to="/admin"
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold shadow"
            >
              Quản lý
            </Link>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border-2 border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Thành viên
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tên trong game
              </th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tham gia
              </th>
              {isLeader && (
                <th className="px-2 sm:px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((m) => (
              <tr key={m._id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={m.avatarUrl || "https://placehold.co/64x64"}
                      alt={m.username}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-red-600"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        {m.username}
                      </div>
                      <div className="text-xs text-gray-500 md:hidden">
                        {m.ingameName}
                      </div>
                      <div className="hidden md:block text-xs text-gray-500">
                        ID: {m._id.slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-gray-800">
                  {m.ingameName}
                </td>
                <td className="hidden sm:table-cell px-2 sm:px-4 py-3">
                  {roleBadge(m.role)}
                </td>
                <td className="hidden lg:table-cell px-4 py-3 text-gray-700">
                  {new Date(m.joinDate).toLocaleDateString("vi-VN")}
                </td>
                {isLeader && (
                  <td className="px-2 sm:px-4 py-3">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() => viewMember(m)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white border-2 border-gray-300 hover:border-gray-400 rounded-lg text-gray-800 text-xs sm:text-sm font-medium transition"
                        title="Xem"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => kickMember(m)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded-lg text-xs sm:text-sm font-semibold transition"
                        title="Kick khỏi clan"
                      >
                        Kick
                      </button>
                      <button
                        onClick={() => deleteMember(m)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-bold transition"
                        title="Xóa tài khoản"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border-2 border-gray-200">
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Thông tin thành viên
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
              >
                Đóng
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selected.avatarUrl || "https://placehold.co/96x96"}
                  alt={selected.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
                />
                <div>
                  <div className="text-lg font-semibold">
                    {selected.username}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selected.ingameName}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  Vai trò: {roleBadge(selected.role)}
                </div>
                <p>
                  Tham gia:{" "}
                  {new Date(selected.joinDate).toLocaleDateString("vi-VN")}
                </p>
                <p className="text-gray-500">ID: {selected._id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
