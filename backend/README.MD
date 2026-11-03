# FabricIO Backend - Project Structure

Dưới đây là cấu trúc thư mục tiêu chuẩn cho dự án FabricIO Backend (Spring Boot). Hãy tuân thủ cấu trúc này khi thêm các tính năng mới.

```text
src/main/java/fabricio/backend/
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

## Các test

### Unit Test

1. login success
2. login wrong password
3. refresh success
4. refresh invalid token
5. register success
6. register duplicate email
7. create game success
8. search game with keyword
9. search game pagination
10. get game by id
11. get game not found

### Integration Test

1. GET /games

###
Chạy dự án:
```text
.\gradlew bootRun
```

Server chạy tại:
http://localhost:8080/swagger-ui/index.html

Chạy test kiểm tra modules:
```text
./gradlew clean test --tests fabricio.backend.ModularityTests --info      
```

Xem báo cáo các test đã chạy:
```text
*/FabricIO/backend/build/reports/tests/test/index.html
```