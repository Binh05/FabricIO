# FabricIO Backend - Project Structure

Dưới đây là cấu trúc thư mục tiêu chuẩn cho dự án FabricIO Backend (Spring Boot). Hãy tuân thủ cấu trúc này khi thêm các tính năng mới.

```text
src/main/java/fabricio/backend/
├── modules/                  # Chứa các module nghiệp vụ (Business Logic)
│   ├── users/                # Quản lý người dùng (Cấu trúc phẳng)
│   │   ├── UserController.java
│   │   ├── IUserService.java
│   │   ├── UserService.java
│   │   ├── UserRepository.java
│   │   ├── entities/
│   │   ├── dtos/
│   │   └── internal/
│   │
│   ├── auth/                 # Quản lý xác thực
│   │   ├── AuthController.java
│   │   ├── IAuthService.java
│   │   ├── AuthService.java
│   │   ├── entities/
│   │   ├── dtos/
│   │   └── jwt/              # Xử lý JWT Token (JwtTokenProvider, UserPrincipal)
│   │
│   ├── games/                # Quản lý Game (Cấu trúc phân lớp sub-folder)
│   │   ├── controllers/      # GameController, GameTagController
│   │   ├── services/         # GameService, GameTagService
│   │   ├── repositories/     # GameRepository, GameTagRepository, ...
│   │   ├── entities/         # Game, GameMedia, GameTag, ...
│   │   └── dtos/             # GameRequest, GameResponse, ...
│   │
│   ├── interactions/         # Quản lý tương tác (Rating, Favorite, Play)
│   │   ├── controllers/      # GameRatingController, ...
│   │   ├── services/         # GameRatingService, ...
│   │   ├── repositories/     # GameRatingRepository, ...
│   │   ├── entities/         # GameRating, GameFavorite, GamePlay
│   │   └── dtos/             # GameRatingRequest, GameRatingResponse, ...
│   │
│   └── purchases/            # Quản lý mua sắm
│       └── entities/         # Purchase, PurchaseDetail
│
├── shared/                   # Các thành phần dùng chung toàn dự án
│   ├── base/                 # Các class cơ sở
│   │   ├── BaseEntity.java   (id, createdAt, updatedAt)
│   │   ├── ApiResponse.java  (Cấu trúc response chuẩn)
│   │   └── PageResponse.java (Cấu trúc phân trang chuẩn)
│   │
│   ├── configs/              # Cấu hình hệ thống (Security, OpenAPI/Swagger)
│   ├── exceptions/           # Xử lý lỗi tập trung (GlobalExceptionHandler, Custom Exceptions)
│   └── enums/                # Các hằng số, Enum dùng chung (UserRole, MediaType, ...)
│
└── BackendApplication.java   # File chạy chính của ứng dụng (Spring Boot Entry Point)
```

### Quy tắc quan trọng:
1. **Module hóa:** Mỗi tính năng lớn (User, Auth, Purchase, Game) phải nằm trong module riêng.
2. **Interface first:** Luôn định nghĩa `IService` trước khi triển khai `Service`.
3. **DTO:** Tuyệt đối không trả về `Entity` trực tiếp qua API, luôn sử dụng `DTO` và `Mapper`.
4. **Exception:** Sử dụng các Custom Exception trong `shared/exceptions` thay vì throw các lỗi chung chung.
