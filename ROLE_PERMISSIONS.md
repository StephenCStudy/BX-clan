**Role Permissions & Usage**

Tài liệu này mô tả các role có trong hệ thống và quyền tương ứng, cách seed (tạo) tài khoản `leader` mặc định, và một vài ví dụ API hữu ích để quản lý role.

**Overview:**

- User model có 4 role: `leader`, `organizer`, `moderator`, `member`.
- Middleware kiểm tra quyền: `requireAuth` (cần token JWT) và `requireRoles(...)` (chỉ cho phép các role được liệt kê).

**Leader (quyền cao nhất)**

- Quyền chính:
  - Thay đổi role của thành viên (PUT `/api/members/:id/role`).
  - Xóa thành viên (DELETE `/api/members/:id`).
  - Quản lý registrations, customs, news, reports và streams (hầu hết các endpoint quản trị cho `organizer`/`leader`/`moderator`).
  - Có thể thực hiện tất cả hành động mà `organizer` và `moderator` làm.
- Endpoints liên quan (ví dụ):
  - `PUT /api/members/:id/role` (requireRoles: `leader`, `organizer`, `moderator`)
  - `DELETE /api/members/:id` (requireRoles: `leader`, `organizer`, `moderator`)
  - Nhiều route như `/api/registrations`, `/api/customs`, `/api/news`, `/api/reports`, `/api/streams` có thể cho phép `leader`.

**Organizer**

- Quyền chính:
  - Tạo/điều phối `custom rooms`, quản lý registrations, đăng bài news, tổ chức stream.
  - Duyệt / xử lý đăng ký (registrations).
- Endpoints liên quan (ví dụ):
  - `/api/streams` (requireRoles: `organizer`, `leader`)
  - `/api/registrations` (requireRoles: `organizer`, `leader`, `moderator`)
  - `/api/customs`, `/api/news` (thường cho `organizer`, `leader`, `moderator`).

**Moderator**

- Quyền chính:
  - Xử lý báo cáo (reports), moderating nội dung chat, hỗ trợ ban/kick thành viên.
  - Duyệt báo cáo và thực hiện hành động xử lý.
- Endpoints liên quan (ví dụ):
  - `/api/reports` (requireRoles: `moderator`, `organizer`, `leader`)
  - Một số hành động trong `/api/customs`, `/api/registrations`, `/api/news` có thể cho phép `moderator`.

**Member**

- Quyền chính:

  - Tham gia clan, xem danh sách members, đăng ký tham gia custom games, xem news và thông báo.
  - Không có quyền quản trị: không thể thay role, xóa người khác, hoặc truy cập endpoint quản trị.

- Thay đổi role (ví dụ chuyển user thành `organizer`):

  curl (ví dụ):

  ```bash
  curl -X PUT "http://localhost:5000/api/members/<USER_ID>/role" \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"role":"organizer"}'
  ```

- Ghi chú: endpoint yêu cầu token của một user có role `leader`/`organizer`/`moderator`.

Seeding (tạo leader mặc định)

- Tôi đã thêm logic seed vào `api/src/scripts/seed.ts` để:
  - Xóa dữ liệu cũ.
  - Tạo một `Clan` mặc định ("BX Clan").
  - Tạo 1 tài khoản `leader` với mật khẩu đã hash.
- Mặc định các giá trị:

  - `username`: `leader`
  - `password`: `Leader@1234`
  - `ingameName`: `BX_Leader`
  - `role`: `leader`
  - `rank`: `Grandmaster`
