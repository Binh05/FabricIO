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
│   │   ├── mappers/          # Chuyển đổi giữa Entity và DTO
│   │   │   └── UserMapper.java
│   │   └── internal/         # Cung cấp dữ liệu cho các module khác (VD: Auth)
│   │       ├── UserAuthDTO.java
│   │       └── UserInternalService.java
│   │
│   ├── auth/                 # Quản lý xác thực và phân quyền
│   │   ├── AuthController.java
│   │   ├── IAuthService.java
│   │   ├── AuthService.java
│   │   ├── dtos/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── TokenResponse.java
│   │   └── jwt/              # Xử lý JWT Token
│   │       ├── JwtAuthenticationFilter.java
│   │       ├── JwtTokenProvider.java
│   │       └── UserPrincipal.java
│   │
│   └── Games/             # (Tương lai) Quản lý sản phẩm/vải
│       ├── GameController.java
│       ├── GameService.java
│       ├── entities/
│       └── dtos/
│
├── shared/                   # Các thành phần dùng chung toàn dự án
│   ├── base/                 # Các class cơ sở
│   │   ├── BaseEntity.java   (id, createdAt, updatedAt)
│   │   ├── ApiResponse.java  (Cấu trúc response chuẩn)
│   │   └── PageResponse.java (Dành cho phân trang)
│   │
│   ├── configs/              # Cấu hình hệ thống
│   │   ├── SecurityConfig.java
│   │   ├── DatabaseConfig.java
│   │   ├── OpenApiConfig.java (Swagger)
│   │   └── MinIO.java (Nếu dùng để upload ảnh)
│   │
│   ├── exceptions/           # Xử lý lỗi tập trung
│   │   ├── GlobalExceptionHandler.java
│   │   ├── NotFoundException.java
│   │   ├── BadRequestException.java
│   │   └── UnauthorizedException.java
│   │
│   ├── utils/                # Các class tiện ích (Helper)
│   │   └── StringUtils.java
│   │
│   └── constants/            # Các hằng số, Enum dùng chung
│       └── AppConstants.java
│
└── BackendApplication.java   # File chạy chính của ứng dụng
```

### Quy tắc quan trọng:
1. **Module hóa:** Mỗi tính năng lớn (User, Auth, Order, Product) phải nằm trong module riêng.
2. **Interface first:** Luôn định nghĩa `IService` trước khi triển khai `Service`.
3. **DTO:** Tuyệt đối không trả về `Entity` trực tiếp qua API, luôn sử dụng `DTO` và `Mapper`.
4. **Exception:** Sử dụng các Custom Exception trong `shared/exceptions` thay vì throw các lỗi chung chung.
