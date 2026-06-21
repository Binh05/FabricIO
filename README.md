# FabricIO - Tool Marketplace & Management Platform (DevTool Fabric)

FabricIO (DevTool Fabric) là một nền tảng SaaS toàn diện cung cấp môi trường độc lập (sandboxed), cho phép lưu trữ, thực thi, quản lý và thương mại hóa các công cụ lập trình dưới dạng Micro-services hoặc Scripts. Nền tảng hỗ trợ các nhà phát triển game và công cụ phân phối sản phẩm của họ một cách an toàn và tối ưu.

## 🚀 Tính năng cốt lõi

- **Môi trường Sandbox:** Đảm bảo thực thi các script và micro-services an toàn.
- **Chợ ứng dụng (Marketplace):** Nơi tìm kiếm, đánh giá, yêu thích và mua bán các công cụ/game.
- **Quản lý Media:** Lưu trữ mã nguồn, hình ảnh, video chất lượng cao thông qua Object Storage (MinIO/S3).
- **CI/CD & DevOps:** Tích hợp quy trình kiểm thử tự động và triển khai container hóa qua Jenkins, Docker và Nginx.

---

## 🛠️ Công nghệ sử dụng

### Frontend

- ReactJS, TypeScript
- Tailwind CSS, Shadcn/ui (Avatar, Button, Dialog, Sheet, Sonner, v.v.)
- State Management: Context API (AuthContext, GameContext)

### Backend

- Java, Spring Boot, Gradle (Wrapper v8.x)
- Kiến trúc: Modular Monolith (Module biệt lập: `auth`, `games`, `interactions`, `purchases`, `users`)
- Bảo mật: Spring Security, JWT (JSON Web Token)

### Cơ sở dữ liệu & Lưu trữ

- SQL Server
- Object Storage: MinIO (Môi trường Local/Dev), hỗ trợ AWS S3 API

### DevOps & Infrastructure

- Docker & Docker Compose
- Reverse Proxy: Nginx (Cấu hình Reverse Proxy & SSL)
- CI/CD: Github Action (deploy.yml tự động hóa pipeline)

---

## 📁 Cấu trúc thư mục dự án

```text
FabricIO
├─ backend/                  # Mã nguồn Spring Boot (Java)
│  ├─ src/main/java/fabricio/backend
│  │  ├─ modules/            # Các Business Modules biệt lập
│  │  │  ├─ auth/            # Xác thực, JWT, Session, UserPrincipal
│  │  │  ├─ games/           # Quản lý Games, Tags, Media, Mappers
│  │  │  ├─ interactions/    # Yêu thích, Đánh giá (Rating), Điểm số trung bình
│  │  │  ├─ purchases/       # Quản lý giao dịch, đơn hàng mua game/tool
│  │  │  └─ users/           # Quản lý tài khoản, phân quyền (Role/Permission)
│  │  └─ shared/             # Cấu hình dùng chung (MinIO, S3, Security, Exception, Base)
│  ├─ src/test/              # Unit Test & Mock Factory (AuthServiceTest, GameServiceTest)
│  └─ Dockerfile             # Dockerfile cấu hình build cho Backend
├─ frontend/                 # Mã nguồn ReactJS + Vite + TypeScript
│  ├─ src/
│  │  ├─ components/         # UI Components (auth, common, layouts, games, ui)
│  │  ├─ context/            # AuthContext, GameContext điều phối trạng thái toàn cục
│  │  ├─ hooks/              # Custom hooks (useAuth, useGame, useUser)
│  │  ├─ pages/              # Các trang giao diện chính (Home, Games, Play, Profile, SubmitGame)
│  │  └─ services/           # Axios API Client kết nối đến Backend
│  └─ Dockerfile             # Dockerfile cấu hình build cho Frontend
├─ docker/                   # Môi trường chạy Docker Compose (dev, local, prod)
├─ nginx/                    # Cấu hình Reverse Proxy và SSL Certificate cho Nginx
└─ .github/                  # Pipeline CI/CD tự động hóa (deploy.yml)
```

## 💻 Hướng dẫn chạy trên môi trường phát triển (Dev)

#### Yêu cầu hệ thống

- Docker & Docker Compose (v2)
- Java 17+ (Nếu chạy Backend không qua Docker)
- Node.js 18+ (Nếu chạy Frontend không qua Docker)

#### Các bước khởi động nhanh bằng Docker

**Bước 1: Thiết lập biến môi trường**
Sao chép file cấu hình môi trường mẫu ở cả thư mục frontend và backend:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

**Bước 2: Khởi chạy toàn bộ hệ thống bằng Docker Compose**
Hệ thống hỗ trợ sẵn các file compose tối ưu cho từng môi trường. Để khởi chạy môi trường local, thực hiện lệnh sau:

```bash
docker compose -f docker/docker-compose.local.yml up --build
```

## 🔗 Bản đồ liên kết và Cổng dịch vụ (Ports)

Sau khi hệ thống khởi chạy thành công, bạn có thể truy cập các dịch vụ thông qua các cổng cấu hình sau:
| Thành phần | Dịch vụĐịa chỉ truy cập (URL) | Thông tin bổ sung / Tài khoản mặc định |
| :--------- | :--------- | :------ |
| Cổng Nginx (Proxy chính) | http://localhost:5000 | Điều hướng toàn bộ traffic hệ thống |
| Giao diện React (Frontend) | http://localhost:5173 | Môi trường Vite chạy trực tiếp với HMR |
| API Endpoint (Backend) | http://localhost:8080 | Spring Boot RESTful API |
| Tài liệu Swagger OpenAPI | http://localhost:8080/swagger-ui/index.html | Kiểm tra và test trực tiếp các API Endpoints |
| MinIO Object Console | http://localhost:9001 | User: admin <br> Pass: 12345678 |

## 🧪 Kiểm thử (Testing)

**Kiểm thử Backend (Spring Boot)**
Dự án được cấu hình kiểm thử tự động với `JUnit` và `Mockito`. Để chạy test cho backend, di chuyển vào thư mục backend và chạy:

```bash
cd backend
./gradlew test
```

## 𖦥 Quy ước nhánh

| Nhánh           | Mục đích             |
| --------------- | -------------------- |
| `main`          | Production           |
| `staging`       | Tích hợp, deploy dev |
| `feature/<tên>` | Tính năng mới        |
| `fix/<tên>`     | Sửa lỗi              |
| `hotfix/<tên>`  | Sửa khẩn trên main   |

## 📌 Quy ước Commit Message

Dự án áp dụng tiêu chuẩn Conventional Commits để quản lý lịch sử commit:

```text
<type>(<scope>): <mô tả ngắn bằng tiếng Anh hoặc tiếng Việt>
```

Các type phổ biến:

- `feat: Thêm một tính năng mới (Ví dụ: feat(auth): tích hợp đăng nhập bằng JWT)`

- `fix: Sửa một lỗi/bug (Ví dụ: fix(storage): sửa lỗi upload trùng tên file trên MinIO)`

- `chore: Cập nhật build tool, config, jenkinsfile (Ví dụ: chore(devops): cập nhật bước test trong Jenkinsfile)`

- `refactor: Sửa đổi mã nguồn nhưng không làm thay đổi tính năng hay sửa lỗi.`
