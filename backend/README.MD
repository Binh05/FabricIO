# FabricIO Backend - Project Structure

Dưới đây là cấu trúc thư mục tiêu chuẩn cho dự án FabricIO Backend (Spring Boot). Hãy tuân thủ cấu trúc này khi thêm các tính năng mới.

```text
src/main/java/fabricio/backend/
├── modules/                  # Chứa các module nghiệp vụ (Business Logic)
│   ├── users/                # Quản lý người dùng
│   │   ├── UserController.java
│   │   ├── IUserService.java
│   │   ├── UserService.java
│   │   ├── UserRepository.java
│   │   ├── entities/
│   │   │   └── UserEntity.java
│   │   ├── dtos/
│   │   │   ├── UserRequest.java
│   │   │   └── UserResponse.java
│   │   └── internal/         # Cung cấp dữ liệu cho các module khác (VD: Auth)
│   │       ├── UserAuthDTO.java
│   │       └── UserInternalService.java
│   │
│   ├── auth/                 # Quản lý xác thực và phân quyền
│   │   ├── AuthController.java
│   │   ├── IAuthService.java
│   │   ├── AuthService.java
│   │   ├── AuthRepository.java
│   │   ├── entities/
│   │   ├── dtos/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── TokenResponse.java
│   │   └── jwt/              # Xử lý JWT Token
│   │       ├── JwtAuthenticationFilter.java
│   │       ├── JwtTokenProvider.java
│   │       └── UserPrincipal.java
│   │
│   ├── games/                # Quản lý sản phẩm/vải
│   │   ├── GameController.java
│   │   ├── IGameService.java
│   │   ├── GameService.java
│   │   ├── GameRepository.java
│   │   ├── entities/
│   │   └── dtos/
│   │
│   ├── interactions/         # Quản lý tương tác (Vibe, Comment, ...)
│   │   └── entities/
│   │
│   └── purchases/            # Quản lý mua sắm
│       └── entities/
│
├── shared/                   # Các thành phần dùng chung toàn dự án
│   ├── base/                 # Các class cơ sở
│   │   ├── BaseEntity.java   (id, createdAt, updatedAt)
│   │   └── ApiResponse.java  (Cấu trúc response chuẩn)
│   │
│   ├── configs/              # Cấu hình hệ thống
│   │   ├── SecurityConfig.java
│   │   └── OpenApiConfig.java (Swagger)
│   │
│   ├── exceptions/           # Xử lý lỗi tập trung
│   │   ├── GlobalExceptionHandler.java
│   │   ├── NotFoundException.java
│   │   ├── BadRequestException.java
│   │   ├── UnauthorizedException.java
│   │   └── ForbiddenException.java
│   │
│   └── enums/                # Các hằng số, Enum dùng chung
│       ├── MediaType.java
│       ├── StatusPurchase.java
│       └── UserRole.java
│
└── BackendApplication.java   # File chạy chính của ứng dụng
```

### Quy tắc quan trọng:
1. **Module hóa:** Mỗi tính năng lớn (User, Auth, Purchase, Game) phải nằm trong module riêng.
2. **Interface first:** Luôn định nghĩa `IService` trước khi triển khai `Service`.
3. **DTO:** Tuyệt đối không trả về `Entity` trực tiếp qua API, luôn sử dụng `DTO` và `Mapper`.
4. **Exception:** Sử dụng các Custom Exception trong `shared/exceptions` thay vì throw các lỗi chung chung.
