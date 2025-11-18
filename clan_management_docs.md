# TÀI LIỆU ĐẶC TẢ HỆ THỐNG WEBSITE QUẢN LÝ CLAN TỐC CHIẾN

**Phiên bản:** 1.0  
**Ngày:** Tháng 11/2025  
**Trạng thái:** Đề xuất

---

## MỦC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Phạm Vi và Mục Tiêu](#2-phạm-vi-và-mục-tiêu)
3. [Vai Trò Người Dùng](#3-vai-trò-người-dùng)
4. [Chức Năng Hệ Thống](#4-chức-năng-hệ-thống)
5. [Kiến Trúc Hệ Thống](#5-kiến-trúc-hệ-thống)
6. [Công Nghệ Sử Dụng](#6-công-nghệ-sử-dụng)
7. [Cơ Sở Dữ Liệu](#7-cơ-sở-dữ-liệu)
8. [Luồng Hoạt Động](#8-luồng-hoạt-động)
9. [Yêu Cầu Phi Chức Năng](#9-yêu-cầu-phi-chức-năng)
10. [Kế Hoạch Triển Khai](#10-kế-hoạch-triển-khai)
11. [Tiêu Chí Nghiệm Thu](#11-tiêu-chí-nghiệm-thu)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Giới thiệu

Hệ thống Website Quản Lý Clan Tốc Chiến là một nền tảng web toàn diện được thiết kế để hỗ trợ việc quản lý, tổ chức và vận hành các hoạt động của Clan trong game Tốc Chiến (Wild Rift). Hệ thống cung cấp các công cụ quản lý thành viên, tổ chức giải đấu Custom, giao tiếp nội bộ và giám sát hoạt động một cách hiệu quả.

### 1.2. Đối tượng sử dụng

- **Leader (Trưởng Clan):** Người quản trị cao nhất với toàn quyền kiểm soát
- **Organizer (Ban Tổ Chức):** Người hỗ trợ tổ chức sự kiện và quản lý hoạt động
- **Member (Thành Viên):** Thành viên thông thường tham gia các hoạt động Clan
- **Moderator (Quản Trị Viên):** Người giám sát chat và xử lý vi phạm nhỏ

---

## 2. PHẠM VI VÀ MỤC TIÊU

### 2.1. Mục tiêu chính

- ✅ Quản lý thành viên Clan một cách có hệ thống
- ✅ Tổ chức và điều phối các trận Custom/Giải đấu
- ✅ Cung cấp kênh giao tiếp nội bộ (Chat, Comment)
- ✅ Hiển thị thông tin Clan, tin tức và Livestream
- ✅ Hỗ trợ phân quyền rõ ràng cho từng vai trò
- ✅ Xử lý báo cáo vi phạm và quản lý kỷ luật

### 2.2. Phạm vi hệ thống

Hệ thống hỗ trợ khoảng **200-500 thành viên** hoạt động đồng thời, có khả năng mở rộng trong tương lai để thêm các tính năng như hệ thống giải đấu nâng cao, điểm thưởng, bảng xếp hạng.

---

## 3. VAI TRÒ NGƯỜI DÙNG

### 3.1. Member (Thành Viên)

**Quyền hạn:**

- Đăng ký và đăng nhập hệ thống
- Xem thông tin Clan, danh sách thành viên
- Xem và đăng ký tham gia các trận Custom
- Đăng ký Custom vào cuối tuần
- Tham gia Chat nhóm và Comment bài viết
- Gửi báo cáo vi phạm
- Nhận thông báo từ hệ thống
- Mời người khác vào Clan (nếu Leader cho phép)

### 3.2. Moderator (Quản Trị Viên)

**Quyền hạn bổ sung:**

- Quản lý Chat (xóa tin nhắn không phù hợp)
- Xử lý các báo cáo vi phạm nhỏ
- Theo dõi và giám sát hoạt động thành viên

### 3.3. Organizer (Ban Tổ Chức)

**Quyền hạn bổ sung:**

- Tạo Custom Room (phòng thi đấu)
- Quản lý và điều phối các trận đấu
- Duyệt đăng ký tham gia Custom
- Quản lý Bracket giải đấu nhỏ
- Cập nhật thông tin Livestream
- Gửi thông báo về sự kiện
- Xử lý báo cáo trong phạm vi Custom

### 3.4. Leader (Trưởng Clan)

**Toàn quyền quản trị:**

- Tất cả quyền của Member, Moderator và Organizer
- Quản lý thành viên (Kick, thay đổi Role)
- Quản lý thông tin Clan (tên, mô tả, banner)
- Tạo và chỉnh sửa Custom Room
- Duyệt đăng ký tham gia Custom
- Xử lý tất cả báo cáo vi phạm
- Gửi thông báo chung cho toàn bộ Clan
- Quản lý tất cả bình luận và nội dung
- Xem Dashboard thống kê chi tiết
- Phân quyền cho Moderator và Organizer
- Duyệt yêu cầu mời thành viên mới

---

## 4. CHỨC NĂNG HỆ THỐNG

### 4.1. Quản lý thành viên

**Chức năng:**

- Đăng ký tài khoản với username và tên ingame
- Đăng nhập đơn giản (không yêu cầu bảo mật phức tạp)
- Hiển thị danh sách thành viên với avatar, role, ngày tham gia
- Hệ thống mời thành viên mới (Member gửi → Leader duyệt)
- Quản lý role: Member, Moderator, Organizer, Leader
- Kick thành viên (chỉ Leader)

### 4.2. Quản lý Custom Room

**Chức năng:**

- Tạo Custom Room với các thông tin:
  - Tiêu đề, mô tả
  - Thời gian tổ chức
  - Số lượng người chơi tối đa
  - Trạng thái (Mở/Đóng/Đang diễn ra)
- Đăng ký tham gia Custom
- Duyệt danh sách đăng ký
- Quản lý Bracket giải đấu
- Theo dõi lịch sử Custom

### 4.3. Thông tin Clan

**Chức năng:**

- Hiển thị thông tin Clan:
  - Tên Clan
  - Banner/Logo
  - Mô tả và giới thiệu
  - Yêu cầu tham gia
- Cập nhật thông tin (chỉ Leader)

### 4.4. Tin tức và Livestream

**Chức năng:**

- Đăng tin tức, thông báo sự kiện
- Embed Livestream từ YouTube/Facebook/Twitch
- Hiển thị lịch Livestream
- Comment và tương tác dưới bài viết

### 4.5. Giao tiếp nội bộ

**4.5.1. Chat Realtime**

- Chat nhóm cho toàn bộ Clan
- Hiển thị tin nhắn theo thời gian thực
- Quản lý tin nhắn (Moderator có thể xóa)

**4.5.2. Bình luận**

- Comment dưới bài viết tin tức
- Quản lý bình luận (Leader/Organizer)

### 4.6. Báo cáo vi phạm

**Chức năng:**

- Thành viên gửi báo cáo về hành vi vi phạm
- Moderator/Organizer/Leader tiếp nhận
- Phân loại: Pending (Chờ xử lý), Reviewed (Đã xem xét)
- Xử lý: Cảnh cáo, cấm tạm thời, kick khỏi Clan

### 4.7. Dashboard thống kê

**Dành cho Leader và Organizer:**

- Tổng số thành viên
- Số lượng Custom đã tổ chức
- Số báo cáo đang chờ xử lý
- Hoạt động gần đây
- Thống kê tham gia Custom

---

## 5. KIẾN TRÚC HỆ THỐNG

Hệ thống được thiết kế theo mô hình **3 tầng** (Three-tier Architecture) với sự tách biệt rõ ràng giữa Frontend, Backend và Database.

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                         │
│              (Frontend - React on Vercel)               │
│                                                           │
│  • Trang Clan Info        • Trang Custom Game           │
│  • Trang Member List      • Trang Đăng ký Custom        │
│  • Dashboard Leader       • Dashboard Organizer         │
│  • Trang Chat/Comment     • Trang Report Vi Phạm        │
│  • Trang Live Info                                       │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                      API LAYER                           │
│           (Backend - Node.js + Express)                  │
│                                                           │
│  API Groups:                                             │
│  • Auth API          • Clan API                          │
│  • Member API        • Custom API                        │
│  • Admin/Leader API  • Comment/Chat API                  │
│  • Report API                                            │
│                                                           │
│  Middleware:                                             │
│  • Role-based Access Control                            │
│  • Input Validation                                      │
│  • Rate Limiting (chống spam)                           │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                        │
│                 (MongoDB Atlas / MySQL)                  │
│                                                           │
│  Collections/Tables:                                     │
│  • users              • clan                             │
│  • members            • custom_rooms                     │
│  • signup_custom      • reports                          │
│  • chat_messages      • announcements                    │
│  • roles              • news                             │
│  • streams            • comments                         │
│  • invitations                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.1. Luồng xử lý dữ liệu

```
User → Frontend (React) → API Server (Express)
     → Database (MongoDB/MySQL) → API Server
     → Frontend (Render) → User
```

---

## 6. CÔNG NGHỆ SỬ DỤNG

### 6.1. Frontend

| Công nghệ            | Mục đích      | Lý do lựa chọn                           |
| -------------------- | ------------- | ---------------------------------------- |
| **ReactJS**          | Framework UI  | Phổ biến, component-based, ecosystem lớn |
| **Vite/CRA**         | Build tool    | Nhanh, hiện đại, dễ setup                |
| **TailwindCSS**      | CSS Framework | Utility-first, responsive nhanh          |
| **Socket.IO Client** | Realtime chat | Hỗ trợ WebSocket tốt                     |

### 6.2. Backend

| Công nghệ      | Mục đích               | Lý do lựa chọn                       |
| -------------- | ---------------------- | ------------------------------------ |
| **Node.js**    | Runtime                | JavaScript full-stack, async I/O     |
| **Express.js** | Web framework          | Nhẹ, linh hoạt, middleware phong phú |
| **Socket.IO**  | Realtime communication | Hỗ trợ WebSocket + fallback          |
| **JWT**        | Authentication         | Stateless, bảo mật cơ bản            |

### 6.3. Database

**Tùy chọn:**

- **MongoDB Atlas** (Khuyến nghị): NoSQL, linh hoạt, dễ scale
- **MySQL/PostgreSQL**: SQL truyền thống, quan hệ chặt chẽ

### 6.4. Deployment

| Thành phần | Platform                             | Lý do                                |
| ---------- | ------------------------------------ | ------------------------------------ |
| Frontend   | **Vercel/Netlify**                   | Deploy nhanh, CDN toàn cầu, miễn phí |
| Backend    | **Vercel Serverless/Render/Railway** | Dễ deploy, auto-scaling              |
| Database   | **MongoDB Atlas/PlanetScale**        | Managed service, backup tự động      |

---

## 7. CƠ SỞ DỮ LIỆU

### 7.1. Sơ đồ quan hệ (ERD)

```
users (1) -----> (N) chat_messages
users (1) -----> (N) comments
users (1) -----> (N) reports (as reporter)
users (1) -----> (N) reports (as target)
users (1) -----> (N) custom_registrations
users (1) -----> (N) invitations (as inviter)
users (1) -----> (N) custom_rooms (as creator)
users (1) -----> (N) news (as creator)

clan (1) -----> (N) users
clan (1) -----> (N) news
clan (1) -----> (N) custom_rooms

custom_rooms (1) -----> (N) custom_registrations
news (1) -----> (N) comments
```

### 7.2. Chi tiết các bảng

#### 7.2.1. Users (Người dùng)

| Trường        | Kiểu dữ liệu | Mô tả                  | Ràng buộc                                    |
| ------------- | ------------ | ---------------------- | -------------------------------------------- |
| id            | BIGINT       | ID người dùng          | PRIMARY KEY, AUTO_INCREMENT                  |
| username      | VARCHAR(50)  | Tên đăng nhập          | UNIQUE, NOT NULL                             |
| ingame_name   | VARCHAR(50)  | Tên trong game         | NOT NULL                                     |
| password_hash | VARCHAR(255) | Mật khẩu đã mã hóa     | NOT NULL                                     |
| role          | ENUM         | Vai trò                | 'leader', 'organizer', 'moderator', 'member' |
| avatar_url    | VARCHAR(255) | Đường dẫn ảnh đại diện | NULL                                         |
| join_date     | DATETIME     | Ngày tham gia          | DEFAULT CURRENT_TIMESTAMP                    |
| clan_id       | BIGINT       | ID Clan                | FOREIGN KEY                                  |

#### 7.2.2. ClanInfo (Thông tin Clan)

| Trường       | Kiểu dữ liệu | Mô tả            | Ràng buộc                   |
| ------------ | ------------ | ---------------- | --------------------------- |
| id           | BIGINT       | ID Clan          | PRIMARY KEY, AUTO_INCREMENT |
| clan_name    | VARCHAR(100) | Tên Clan         | NOT NULL                    |
| description  | TEXT         | Mô tả Clan       | NULL                        |
| requirements | TEXT         | Yêu cầu tham gia | NULL                        |
| banner_url   | VARCHAR(255) | Đường dẫn banner | NULL                        |
| created_at   | DATETIME     | Ngày tạo         | DEFAULT CURRENT_TIMESTAMP   |

#### 7.2.3. CustomRooms (Phòng Custom)

| Trường        | Kiểu dữ liệu | Mô tả             | Ràng buộc                   |
| ------------- | ------------ | ----------------- | --------------------------- |
| id            | BIGINT       | ID Custom         | PRIMARY KEY, AUTO_INCREMENT |
| title         | VARCHAR(200) | Tiêu đề           | NOT NULL                    |
| description   | TEXT         | Mô tả chi tiết    | NULL                        |
| created_by    | BIGINT       | ID người tạo      | FOREIGN KEY (users.id)      |
| schedule_time | DATETIME     | Thời gian tổ chức | NOT NULL                    |
| max_players   | INT          | Số người tối đa   | DEFAULT 10                  |
| status        | ENUM         | Trạng thái        | 'open', 'closed', 'ongoing' |
| created_at    | DATETIME     | Ngày tạo          | DEFAULT CURRENT_TIMESTAMP   |

#### 7.2.4. CustomRegistrations (Đăng ký Custom)

| Trường        | Kiểu dữ liệu | Mô tả             | Ràng buộc                         |
| ------------- | ------------ | ----------------- | --------------------------------- |
| id            | BIGINT       | ID đăng ký        | PRIMARY KEY, AUTO_INCREMENT       |
| user_id       | BIGINT       | ID người đăng ký  | FOREIGN KEY (users.id)            |
| custom_id     | BIGINT       | ID Custom         | FOREIGN KEY (custom_rooms.id)     |
| registered_at | DATETIME     | Thời gian đăng ký | DEFAULT CURRENT_TIMESTAMP         |
| status        | ENUM         | Trạng thái        | 'pending', 'approved', 'rejected' |

#### 7.2.5. Invitations (Lời mời)

| Trường          | Kiểu dữ liệu | Mô tả              | Ràng buộc                         |
| --------------- | ------------ | ------------------ | --------------------------------- |
| id              | BIGINT       | ID lời mời         | PRIMARY KEY, AUTO_INCREMENT       |
| inviter_id      | BIGINT       | ID người mời       | FOREIGN KEY (users.id)            |
| invitee_name    | VARCHAR(50)  | Tên người được mời | NOT NULL                          |
| invitee_contact | VARCHAR(100) | Liên hệ            | NULL                              |
| status          | ENUM         | Trạng thái         | 'pending', 'approved', 'rejected' |
| created_at      | DATETIME     | Ngày tạo           | DEFAULT CURRENT_TIMESTAMP         |

#### 7.2.6. Reports (Báo cáo vi phạm)

| Trường      | Kiểu dữ liệu | Mô tả               | Ràng buộc                         |
| ----------- | ------------ | ------------------- | --------------------------------- |
| id          | BIGINT       | ID báo cáo          | PRIMARY KEY, AUTO_INCREMENT       |
| reporter_id | BIGINT       | ID người báo cáo    | FOREIGN KEY (users.id)            |
| target_id   | BIGINT       | ID người bị báo cáo | FOREIGN KEY (users.id)            |
| content     | TEXT         | Nội dung báo cáo    | NOT NULL                          |
| status      | ENUM         | Trạng thái          | 'pending', 'reviewed', 'resolved' |
| created_at  | DATETIME     | Ngày tạo            | DEFAULT CURRENT_TIMESTAMP         |
| reviewed_by | BIGINT       | ID người xử lý      | FOREIGN KEY (users.id), NULL      |

#### 7.2.7. News (Tin tức)

| Trường     | Kiểu dữ liệu | Mô tả        | Ràng buộc                   |
| ---------- | ------------ | ------------ | --------------------------- |
| id         | BIGINT       | ID tin tức   | PRIMARY KEY, AUTO_INCREMENT |
| title      | VARCHAR(200) | Tiêu đề      | NOT NULL                    |
| content    | TEXT         | Nội dung     | NOT NULL                    |
| created_by | BIGINT       | ID người tạo | FOREIGN KEY (users.id)      |
| created_at | DATETIME     | Ngày tạo     | DEFAULT CURRENT_TIMESTAMP   |
| clan_id    | BIGINT       | ID Clan      | FOREIGN KEY                 |

#### 7.2.8. Streams (Livestream)

| Trường        | Kiểu dữ liệu | Mô tả            | Ràng buộc                       |
| ------------- | ------------ | ---------------- | ------------------------------- |
| id            | BIGINT       | ID stream        | PRIMARY KEY, AUTO_INCREMENT     |
| streamer_name | VARCHAR(100) | Tên streamer     | NOT NULL                        |
| platform      | VARCHAR(50)  | Nền tảng         | 'youtube', 'facebook', 'twitch' |
| stream_url    | VARCHAR(255) | Link stream      | NOT NULL                        |
| schedule_time | DATETIME     | Thời gian stream | NULL                            |
| created_at    | DATETIME     | Ngày tạo         | DEFAULT CURRENT_TIMESTAMP       |

#### 7.2.9. ChatMessages (Tin nhắn)

| Trường     | Kiểu dữ liệu | Mô tả         | Ràng buộc                   |
| ---------- | ------------ | ------------- | --------------------------- |
| id         | BIGINT       | ID tin nhắn   | PRIMARY KEY, AUTO_INCREMENT |
| user_id    | BIGINT       | ID người gửi  | FOREIGN KEY (users.id)      |
| message    | TEXT         | Nội dung      | NOT NULL                    |
| created_at | DATETIME     | Thời gian gửi | DEFAULT CURRENT_TIMESTAMP   |

#### 7.2.10. Comments (Bình luận)

| Trường     | Kiểu dữ liệu | Mô tả            | Ràng buộc                   |
| ---------- | ------------ | ---------------- | --------------------------- |
| id         | BIGINT       | ID comment       | PRIMARY KEY, AUTO_INCREMENT |
| user_id    | BIGINT       | ID người comment | FOREIGN KEY (users.id)      |
| news_id    | BIGINT       | ID bài viết      | FOREIGN KEY (news.id)       |
| message    | TEXT         | Nội dung         | NOT NULL                    |
| created_at | DATETIME     | Thời gian        | DEFAULT CURRENT_TIMESTAMP   |

---

## 8. LUỒNG HOẠT ĐỘNG

### 8.1. Luồng đăng ký thành viên mới

```
1. Member gửi lời mời (nhập tên/contact người mới)
   ↓
2. Lời mời lưu vào DB với status = 'pending'
   ↓
3. Leader nhận thông báo có lời mời mới
   ↓
4. Leader duyệt: Approve hoặc Reject
   ↓
5. Nếu Approve → Tạo tài khoản hoặc gửi link đăng ký
   ↓
6. Người mới đăng ký và tham gia Clan
```

### 8.2. Luồng tổ chức Custom

```
1. Organizer/Leader tạo Custom Room
   ↓
2. Thông tin Custom hiển thị trên trang chủ
   ↓
3. Member xem và đăng ký tham gia
   ↓
4. Đăng ký lưu vào DB với status = 'pending'
   ↓
5. Organizer/Leader duyệt danh sách đăng ký
   ↓
6. Approve/Reject từng người
   ↓
7. Người được duyệt nhận thông báo
   ↓
8. Custom diễn ra theo lịch
   ↓
9. Cập nhật kết quả (nếu có)
```

### 8.3. Luồng xử lý báo cáo vi phạm

```
1. Member gửi báo cáo (chọn người vi phạm + lý do)
   ↓
2. Báo cáo lưu vào DB với status = 'pending'
   ↓
3. Moderator/Organizer/Leader nhận thông báo
   ↓
4. Người có quyền xem chi tiết báo cáo
   ↓
5. Xử lý:
   - Cảnh cáo
   - Cấm chat tạm thời
   - Kick khỏi Clan (chỉ Leader)
   ↓
6. Cập nhật status = 'reviewed' hoặc 'resolved'
   ↓
7. Thông báo cho người báo cáo và người bị báo cáo
```

### 8.4. Luồng Chat Realtime

```
1. User gửi tin nhắn từ Frontend
   ↓
2. Socket.IO emit message lên Server
   ↓
3. Server validate (spam check, quyền gửi)
   ↓
4. Lưu message vào Database
   ↓
5. Server broadcast message đến tất cả client đang online
   ↓
6. Frontend nhận và hiển thị message realtime
```

---

## 9. YÊU CẦU PHI CHỨC NĂNG

### 9.1. Hiệu năng

- **Thời gian tải trang:** < 2 giây (First Contentful Paint)
- **API response time:** < 500ms cho các request thông thường
- **Realtime chat latency:** < 200ms
- **Hỗ trợ 200-500 concurrent users**

### 9.2. Khả năng mở rộng

- Code được tổ chức theo module, dễ maintain
- RESTful API design, chuẩn HTTP methods
- Database schema có thể mở rộng thêm bảng
- Có thể thêm microservices sau này (hệ thống điểm, giải đấu)

### 9.3. Độ tin cậy

- Uptime target: 99% (ngoại trừ maintenance)
- Error logging và monitoring
- Graceful error handling (không crash hệ thống)

### 9.4. Tương thích

- **Desktop:** Chrome, Firefox, Edge, Safari (2 versions gần nhất)
- **Mobile:** Responsive design, hoạt động tốt trên iOS Safari và Chrome Android
- **Độ phân giải:** 320px - 2K

---

## 10. KẾ HOẠCH TRIỂN KHAI

### 10.1. Giai đoạn 1: Backend & Database (ngày 1)

**Công việc:**

- ✅ Setup Node.js + Express project
- ✅ Thiết kế và tạo Database schema
- ✅ Implement Models (ORM/ODM)
- ✅ Xây dựng API endpoints:
  - Auth API (login, register)
  - Clan API (get/update info)
  - Member API (join, invite, role management)
  - Custom API (create, register, manage)
  - Admin/Leader API (reports, kick, role)
  - Comment/Chat API
- ✅ Implement Middleware (authentication, authorization, validation)
- ✅ Setup Socket.IO cho realtime chat
- ✅ Test API bằng Postman/Thunder Client
- ✅ Deploy Backend lên Render/Railway

### 10.2. Giai đoạn 2: Frontend React (ngày 2)

**Công việc:**

- ✅ Setup React project (Vite + TailwindCSS)
- ✅ Xây dựng các trang:
  - Login/Register
  - Clan Info
  - Member List
  - Custom Game (list + detail)
  - Đăng ký Custom cuối tuần
  - Dashboard Leader
  - Dashboard Organizer
  - Chat/Comment
  - Report Vi Phạm
  - Live Info
- ✅ Tích hợp API:
  - Authentication flow
  - Fetch và hiển thị data
  - CRUD operations
- ✅ Implement realtime chat với Socket.IO
- ✅ Xây dựng UI/UX responsive
- ✅ Test trên nhiều thiết bị
- ✅ Deploy Frontend lên Vercel/Netlify

### 10.3. Giai đoạn 3: Hoàn thiện & Kiểm thử (ngày 3)

**Công việc:**

- ✅ Integration testing toàn hệ thống
- ✅ Test phân quyền (Role-based access)
- ✅ Test realtime chat ổn định
- ✅ Test luồng Custom (tạo → đăng ký → duyệt)
- ✅ Test báo cáo và xử lý vi phạm
- ✅ Performance testing và optimization
- ✅ Bug fixing
- ✅ Viết tài liệu hướng dẫn sử dụng
- ✅ Bàn giao cho khách hàng

**Timeline tổng thể:** 5 - 7 ngày

---

## 11. TIÊU CHÍ NGHIỆM THU

### 11.1. Backend

- [ ] Tất cả API endpoints hoạt động đúng chức năng
- [ ] Authentication và Authorization hoạt động chính xác
- [ ] Database schema được implement đầy đủ
- [ ] Socket.IO realtime chat hoạt động ổn định
- [ ] Error handling đúng chuẩn
- [ ] API documentation đầy đủ (Postman/Swagger)
- [ ] Backend được deploy thành công

### 11.2. Frontend

- [ ] Tất cả trang được xây dựng đầy đủ theo thiết kế
- [ ] Responsive design hoạt động tốt trên mobile
- [ ] Tích hợp API thành công, data hiển thị chính xác
- [ ] Realtime chat không có độ trễ đáng kể
- [ ] Navigation và routing hoạt động mượt mà
- [ ] Loading states và error handling rõ ràng
- [ ] Frontend được deploy thành công

### 11.3. Chức năng theo Role

**Member:**

- [ ] Đăng ký và đăng nhập thành công
- [ ] Xem được thông tin Clan, danh sách thành viên
- [ ] Đăng ký Custom thành công
- [ ] Chat realtime hoạt động
- [ ] Gửi báo cáo vi phạm
- [ ] Gửi lời mời thành viên mới

**Organizer:**

- [ ] Tạo Custom Room thành công
- [ ] Quản lý danh sách đăng ký Custom
- [ ] Duyệt/từ chối đăng ký
- [ ] Cập nhật thông tin livestream
- [ ] Xử lý báo cáo trong phạm vi

**Leader:**

- [ ] Quản lý được toàn bộ thành viên (kick, change role)
- [ ] Cập nhật thông tin Clan
- [ ] Duyệt lời mời thành viên mới
- [ ] Xem Dashboard thống kê đầy đủ
- [ ] Xử lý tất cả báo cáo vi phạm
- [ ] Phân quyền cho Organizer/Moderator

### 11.4. Performance

- [ ] Trang load dưới 2 giây
- [ ] API response time < 500ms
- [ ] Realtime chat latency < 200ms
- [ ] Hoạt động ổn định với 100+ users online

### 11.5. Security

- [ ] JWT authentication hoạt động
- [ ] Role-based access control chính xác
- [ ] Input validation trên cả Frontend và Backend
- [ ] HTTPS được áp dụng

---

## 12. RỦI RO VÀ GIẢI PHÁP

### 12.1. Rủi ro kỹ thuật

| Rủi ro                              | Mức độ     | Giải pháp                                                               |
| ----------------------------------- | ---------- | ----------------------------------------------------------------------- |
| Realtime chat bị lag với nhiều user | Trung bình | Implement message pagination, optimize Socket.IO, sử dụng Redis nếu cần |
| Database quá tải                    | Thấp       | Indexing đúng cách, caching, optimize queries                           |
| Frontend quá nặng                   | Trung bình | Code splitting, lazy loading, optimize bundle size                      |
| API bị spam/abuse                   | Trung bình | Rate limiting, CAPTCHA cho đăng ký, monitoring                          |

### 12.2. Rủi ro vận hành

| Rủi ro                        | Mức độ     | Giải pháp                                             |
| ----------------------------- | ---------- | ----------------------------------------------------- |
| Downtime của hosting provider | Thấp       | Chọn provider uy tín (Vercel, Render), có backup plan |
| Database mất data             | Trung bình | Automated backup hàng ngày, có restore procedure      |
| Security breach               | Thấp       | Follow best practices, regular security updates       |

---

## 13. BẢO TRÌ VÀ HỖ TRỢ

### 13.1. Giai đoạn bảo hành

**Bao gồm:**

- Sửa lỗi phát sinh
- Hỗ trợ kỹ thuật qua email/ mes / zalo
- Cập nhật nhỏ theo yêu cầu
- Hướng dẫn sử dụng cho admin

### 13.2. Bảo trì dài hạn (tùy chọn)

**Gói bảo trì hàng tháng có thể bao gồm:**

- Monitoring và báo cáo monthly
- Security updates
- Performance optimization
- Minor feature additions
- Priority support

---

## 14. TÀI LIỆU BÀNG GIAO

Sau khi hoàn thành dự án, leader [khách hàng] sẽ nhận được:

### 14.1. Tài liệu kỹ thuật

- ✅ Source code đầy đủ (Frontend + Backend)
- ✅ Database schema và migration scripts
- ✅ API documentation (Postman collection hoặc Swagger)
- ✅ Deployment guide
- ✅ Environment configuration

### 14.2. Tài liệu người dùng

- ✅ Hướng dẫn sử dụng cho Leader
- ✅ Hướng dẫn sử dụng cho Organizer
- ✅ Hướng dẫn sử dụng cho Member
- ✅ FAQ thường gặp

### 14.3. Tài liệu quản trị

- ✅ Hướng dẫn deploy và update
- ✅ Hướng dẫn backup và restore
- ✅ Hướng dẫn xử lý sự cố thường gặp
- ✅ Contact list hỗ trợ kỹ thuật

---

## 15. PHỤ LỤC

### 15.1. Glossary (Thuật ngữ)

- **Clan:** Nhóm/Guild trong game Tốc Chiến
- **Custom:** Trận đấu tự tổ chức (không phải rank)
- **Ingame name:** Tên hiển thị trong game
- **Bracket:** Sơ đồ thi đấu loại trực tiếp
- **Livestream:** Phát trực tiếp trận đấu
- **Report:** Báo cáo vi phạm quy định

### 15.2. API Endpoints Summary

**Authentication:**

- POST `/api/auth/register` - Đăng ký tài khoản
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/logout` - Đăng xuất

**Clan:**

- GET `/api/clan` - Lấy thông tin Clan
- PUT `/api/clan` - Cập nhật Clan (Leader only)

**Members:**

- GET `/api/members` - Danh sách thành viên
- POST `/api/members/invite` - Mời thành viên
- PUT `/api/members/:id/role` - Đổi role (Leader only)
- DELETE `/api/members/:id` - Kick thành viên (Leader only)

**Custom Rooms:**

- GET `/api/customs` - Danh sách Custom
- POST `/api/customs` - Tạo Custom (Organizer/Leader)
- GET `/api/customs/:id` - Chi tiết Custom
- PUT `/api/customs/:id` - Cập nhật Custom
- DELETE `/api/customs/:id` - Xóa Custom

**Registrations:**

- POST `/api/customs/:id/register` - Đăng ký tham gia
- GET `/api/customs/:id/registrations` - Danh sách đăng ký
- PUT `/api/registrations/:id/approve` - Duyệt đăng ký
- PUT `/api/registrations/:id/reject` - Từ chối đăng ký

**Reports:**

- GET `/api/reports` - Danh sách báo cáo
- POST `/api/reports` - Gửi báo cáo
- PUT `/api/reports/:id` - Xử lý báo cáo

**Chat:**

- Socket.IO event `message:send` - Gửi tin nhắn
- Socket.IO event `message:receive` - Nhận tin nhắn
- GET `/api/chat/history` - Lịch sử chat

**News:**

- GET `/api/news` - Danh sách tin tức
- POST `/api/news` - Tạo tin tức (Leader/Organizer)
- GET `/api/news/:id` - Chi tiết tin tức

**Streams:**

- GET `/api/streams` - Danh sách livestream
- POST `/api/streams` - Thêm livestream (Organizer/Leader)

### 15.3. Database Indexing Strategy

**Recommended indexes:**

```sql [mogoDB]
-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_clan_id ON users(clan_id);
CREATE INDEX idx_users_role ON users(role);

-- Custom Rooms
CREATE INDEX idx_customs_created_by ON custom_rooms(created_by);
CREATE INDEX idx_customs_schedule ON custom_rooms(schedule_time);
CREATE INDEX idx_customs_status ON custom_rooms(status);

-- Registrations
CREATE INDEX idx_registrations_user ON custom_registrations(user_id);
CREATE INDEX idx_registrations_custom ON custom_registrations(custom_id);
CREATE INDEX idx_registrations_status ON custom_registrations(status);

-- Reports
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_target ON reports(target_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Chat Messages
CREATE INDEX idx_chat_created ON chat_messages(created_at DESC);

-- Comments
CREATE INDEX idx_comments_news ON comments(news_id);
```

### 15.4. Environment Variables

**Backend (.env):**

```
PORT=5000
NODE_ENV=production
DATABASE_URL=mongodb://....
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env):**

```
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
VITE_CLOUDINARY_CLOUD_NAME=dlkwv0qaq
VITE_CLOUDINARY_API_KEY=755678696885487
VITE_CLOUDINARY_UPLOAD_PRESET=gym_uploads
VITE_API_URL=http://localhost:5000/api
```

---

## 16. KẾT LUẬN

Hệ thống Website Quản Lý Clan Tốc Chiến được thiết kế với kiến trúc hiện đại, dễ mở rộng và bảo trì. Với đầy đủ các chức năng từ quản lý thành viên, tổ chức sự kiện Custom, giao tiếp nội bộ đến phân quyền chi tiết, hệ thống đáp ứng toàn diện nhu cầu vận hành một Clan chuyên nghiệp.

**Điểm nổi bật:**

- ✅ Phân quyền rõ ràng theo 4 cấp độ (Member, Moderator, Organizer, Leader)
- ✅ Realtime chat cho giao tiếp nhanh chóng
- ✅ Quản lý Custom Room và đăng ký thi đấu
- ✅ Hệ thống báo cáo và xử lý vi phạm
- ✅ Kiến trúc 3 tầng dễ scale và maintain
- ✅ Công nghệ hiện đại, phổ biến (React, Node.js, MongoDB)
- ✅ Deploy nhanh trên các nền tảng cloud uy tín

Hệ thống sẵn sàng đưa vào sử dụng và có thể mở rộng thêm các tính năng như hệ thống giải đấu nâng cao, bảng xếp hạng, điểm thưởng trong tương lai.

---

**Liên hệ hỗ trợ:**

- Email: [tranducanh31032006@gmail.com]
- Documentation: [Link tài liệu chi tiết]
- GitHub Repository: [Link repo code open]

---

_Tài liệu này có thể được cập nhật theo yêu cầu thực tế trong quá trình phát triển._

**Phiên bản:** 1.0  
**Ngày cập nhật cuối:** Tháng 11/2025  
**Người phụ trách:** [StephenDuc -> Developer]
