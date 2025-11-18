# BX Clan — Wild Rift Clan Management (Fullstack)

Hệ thống quản lý Clan Tốc Chiến với đầy đủ tính năng: đăng ký/đăng nhập, quản lý thành viên, Custom Games, tin tức, chat realtime, upload ảnh Cloudinary.

## 🚀 Tính năng chính

### Backend (Node.js + Express + MongoDB + Socket.IO)

- ✅ **Auth**: JWT authentication, register/login/me
- ✅ **Clan**: Quản lý thông tin Clan (Leader only)
- ✅ **Members**: Danh sách thành viên, mời, đổi role, kick (Leader)
- ✅ **Custom Games**: CRUD Custom rooms, đăng ký tham gia, duyệt/từ chối (Organizer/Leader)
- ✅ **News + Comments**: Đăng tin tức và bình luận
- ✅ **Reports**: Báo cáo vi phạm và xử lý (Moderator/Leader)
- ✅ **Chat**: Socket.IO realtime + REST history
- ✅ **Roles**: Leader, Organizer, Moderator, Member với phân quyền rõ ràng

### Frontend (React + TypeScript + TailwindCSS + Socket.IO)

- ✅ **Auth Context**: Quản lý trạng thái đăng nhập global
- ✅ **Protected Routes**: Bảo vệ các trang yêu cầu đăng nhập
- ✅ **Header/Footer**: Component tách riêng, responsive
- ✅ **Pages**: Home, Members, Customs (List/Detail), News (List/Detail), Chat, Profile, Admin
- ✅ **Cloudinary**: Upload avatar trực tiếp từ client
- ✅ **Wild Rift Theme**: Màu đỏ chủ đạo, dark mode

## 📋 Yêu cầu

- **Node.js** 18+
- **MongoDB Atlas** (hoặc MongoDB local)
- **Cloudinary Account** (unsigned upload preset)

## ⚙️ Cài đặt

### 1. Clone repository

```powershell
git clone https://github.com/StephenCStudy/BX-clan.git
cd BX-clan
```

### 2. Cấu hình Backend

Copy file `.env.example` thành `.env`:

```powershell
cd api
copy .env.example .env
```

Chỉnh sửa `api/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here_change_this
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:4173
```

Cài đặt dependencies:

```powershell
npm install
```

Seed dữ liệu mẫu (tạo Clan và Leader account):

```powershell
npm run seed
```

> Tạo leader user: `leader / leader123`

Chạy backend:

```powershell
npm run dev
```

> Backend chạy tại: http://localhost:5000

### 3. Cấu hình Frontend

Copy file `.env.example` thành `.env`:

```powershell
cd ..\client
copy .env.example .env
```

Chỉnh sửa `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

Cài đặt dependencies:

```powershell
npm install
```

Chạy frontend:

```powershell
npm run dev
```

> Frontend chạy tại: http://localhost:5173

## 🎮 Sử dụng

1. Mở browser tại http://localhost:5173
2. **Đăng ký** tài khoản mới hoặc **đăng nhập** với:
   - Username: `leader`
   - Password: `leader123`
3. **Upload avatar** tại trang Profile (Cloudinary)
4. **Tạo Custom Game** (Leader/Organizer)
5. **Chat realtime** với Socket.IO
6. **Quản lý thành viên** tại Admin Dashboard (Leader)

## 📁 Cấu trúc thư mục

```
BX-Clan/
├── api/                      # Backend
│   ├── src/
│   │   ├── app.ts           # Express app setup
│   │   ├── server.ts        # HTTP + Socket.IO server
│   │   ├── config/          # Database connection
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # Error handler
│   │   └── scripts/         # Seed script
│   ├── .env                 # Environment variables
│   └── package.json
├── client/                   # Frontend
│   ├── src/
│   │   ├── App.tsx          # Main app với AuthProvider
│   │   ├── main.tsx         # Entry point
│   │   ├── components/      # Header, Footer, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # All pages
│   │   │   ├── home/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── admin/
│   │   │   ├── MembersPage.tsx
│   │   │   ├── CustomsPage.tsx
│   │   │   ├── CustomDetailPage.tsx
│   │   │   ├── NewsPage.tsx
│   │   │   ├── NewsDetailPage.tsx
│   │   │   └── ChatPage.tsx
│   │   ├── utils/           # http client, Cloudinary upload
│   │   ├── index.css        # Tailwind + theme
│   │   └── theme.css        # CSS variables
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Auth

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `PUT /api/auth/me/avatar` - Cập nhật avatar

### Clan

- `GET /api/clan` - Thông tin Clan
- `PUT /api/clan` - Cập nhật Clan (Leader)

### Members

- `GET /api/members` - Danh sách thành viên
- `POST /api/members/invite` - Mời thành viên
- `PUT /api/members/:id/role` - Đổi role (Leader)
- `DELETE /api/members/:id` - Kick (Leader)

### Custom Games

- `GET /api/customs` - Danh sách Custom
- `POST /api/customs` - Tạo Custom (Organizer/Leader)
- `GET /api/customs/:id` - Chi tiết Custom
- `PUT /api/customs/:id` - Cập nhật Custom
- `DELETE /api/customs/:id` - Xóa Custom

### Registrations

- `POST /api/registrations/:customId/register` - Đăng ký Custom
- `GET /api/registrations/:customId/registrations` - Danh sách đăng ký
- `PUT /api/registrations/:id/approve` - Duyệt
- `PUT /api/registrations/:id/reject` - Từ chối

### News

- `GET /api/news` - Danh sách tin tức
- `POST /api/news` - Đăng tin (Organizer/Leader)
- `GET /api/news/:id` - Chi tiết tin
- `GET /api/news/:id/comments` - Comments
- `POST /api/news/:id/comments` - Thêm comment

### Reports

- `GET /api/reports` - Danh sách báo cáo (Mod+)
- `POST /api/reports` - Gửi báo cáo
- `PUT /api/reports/:id` - Xử lý báo cáo

### Chat

- `GET /api/chat/history` - Lịch sử chat
- Socket.IO events:
  - `message:send` - Gửi tin nhắn
  - `message:receive` - Nhận tin nhắn

## 🎨 Theme & Design

- **Màu chủ đạo**: Đỏ (#8B0000, #b91c1c)
- **Background**: Dark (#0b0b0d, #111118)
- **Accent**: Red shades
- **Font**: Poppins (headings), Inter (body)
- **Responsive**: Mobile-first, breakpoints md/lg

## 🛠️ Tech Stack

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- Socket.IO (realtime chat)
- JWT (authentication)
- bcryptjs (password hashing)

**Frontend:**

- React 19 + TypeScript
- React Router v6
- TailwindCSS v4
- Axios
- Socket.IO Client
- React Toastify

**DevOps:**

- MongoDB Atlas
- Cloudinary
- (Deploy: Vercel/Render)

## 📝 Notes

- **CORS**: Đã cấu hình cho `localhost:5173` và `localhost:4173`
- **JWT Expiry**: Mặc định 7 ngày
- **Socket.IO**: Tự động reconnect nếu mất kết nối
- **Cloudinary**: Unsigned upload, không cần backend proxy
- **Roles**:
  - `leader` - Toàn quyền
  - `organizer` - Tạo Custom, News
  - `moderator` - Quản lý chat, reports
  - `member` - Quyền cơ bản

## 🐛 Troubleshooting

**Backend không kết nối MongoDB:**

- Kiểm tra `MONGO_URI` trong `.env`
- Whitelist IP trong MongoDB Atlas

**Frontend không gọi API:**

- Kiểm tra `VITE_API_URL` trong `client/.env`
- Đảm bảo backend đang chạy

**Chat không hoạt động:**

- Kiểm tra `VITE_SOCKET_URL`
- Đảm bảo user đã đăng nhập

**Cloudinary upload lỗi:**

- Kiểm tra `VITE_CLOUDINARY_*` variables
- Đảm bảo upload preset là **unsigned**

## 📄 License

MIT

---

**Made with ❤️ | Chủ đạo màu đỏ | Wild Rift Vietnam**
