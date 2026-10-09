# FabricIO Backend — Kiến trúc

Tài liệu này mô tả **kiến trúc đích**, trạng thái hiện tại và các quyết định đã chốt.
Quy tắc bắt buộc cho agent nằm ở `AGENTS.md`.
Mục đánh dấu **[CẦN XÁC NHẬN]** là chỗ chưa chắc chắn, hãy kiểm tra trong code trước khi dựa vào.

## 1. Tổng quan

FabricIO là nền tảng game web: nhà phát triển đăng game (gói zip có `index.html`, được giải nén và upload lên storage), người chơi duyệt, chơi, đánh giá, yêu thích và (sắp tới) mua game.

- Kiểu kiến trúc: **modular monolith**. Một ứng dụng, một database, ranh giới module do **Spring Modulith** kiểm tra tự động.
- Base package: `fabricio.backend`. Main class: `BackendApplication`.
- Stack: Java 21, Gradle, Spring Boot, Spring Data JPA, Spring Security + JWT, Spring Modulith, Lombok (`@Builder`/`@SuperBuilder`), MapStruct **[CẦN XÁC NHẬN]**.
- Khóa chính dạng `UUID`. Entity kế thừa `shared.base.BaseEntity`.
- Dự án làm một mình (Bin05), ưu tiên đơn giản, ít boilerplate.

## 2. Trạng thái hiện tại

- **Đã làm:** đổi cấu trúc thư mục. Các module nằm ngang hàng dưới `fabricio.backend`, mỗi module chia `web/`, `application/`, `domain/`.
- **Chưa làm:** phần lớn thay đổi ở mức code (đổi quan hệ entity sang ID, tạo `*Api`, di chuyển enum, gộp module, migration). Dự kiến làm trong vài ngày tới. Xem mục 8.
- **`purchases`:** chưa implement, hiện chỉ có entity khung `GamePurchaseEntity` (sẽ được viết lại).
- **`ModularityTests.verifyModularity()`:** chưa xanh ở lần chạy gần nhất (xem mục 9). Đây là bình thường trong giai đoạn chuyển đổi.

## 3. Bản đồ module

| Module | Trách nhiệm | Entity (`domain/`) | API công khai (gốc package) | Được phụ thuộc (`allowedDependencies`) |
|---|---|---|---|---|
| `users` | Hồ sơ người dùng, vai trò, quyền | `User`, `Permission`, `RolePermission` | `UserApi`, `UserSummary`, `UserAuthInfo`, `CreateUserCommand` | `shared` |
| `auth` | Đăng ký, đăng nhập, đăng xuất, làm mới token, quản lý phiên | `Session` | chưa có | `users`, `shared` |
| `games` | Danh mục game, media, tag, upload/giải nén gói game, URL mở game, **cộng** đánh giá, yêu thích, lượt chơi (gộp từ `interactions`) | `Game`, `GameMedia`, `GameTag`, `GameTagMap`, `GameRating`, `GameFavorite`, `GamePlay` | `GameApi`, `GameSummary` | `users`, `shared` |
| `purchases` | Mua game, vòng đời đơn mua (chưa implement) | `GamePurchase` (chốt tên khi implement) | `PurchaseApi` (chỉ khi có module gọi) | `games`, `users`, `shared` |
| `shared` | Hạ tầng dùng chung, module `OPEN` | `BaseEntity` | không áp dụng | không phụ thuộc module nào |

Đồ thị phụ thuộc (không được có vòng):

```
auth       → users, shared
games      → users, shared
purchases  → games, users, shared
users      → shared
shared     → (không có)
```

`games → users` tồn tại vì danh sách đánh giá cần hiển thị tên người dùng (qua `UserApi.findSummariesByIds`). Nếu sau này không cần thì bỏ.

## 4. Cấu trúc thư mục đích

```
fabricio.backend/
├── BackendApplication.java
│
├── shared/                          @ApplicationModule(type = OPEN)
│   ├── package-info.java
│   ├── base/                        BaseEntity, ApiResponse, PageResponse
│   ├── configs/                     cấu hình hạ tầng (không chứa logic nghiệp vụ)
│   ├── enums/                       ErrorCode, UserRole (xem mục 6, D5)
│   ├── exceptions/                  AppException, handler
│   ├── security/                    JwtAuthenticationFilter, JwtTokenProvider,
│   │                                UserPrincipal, SecurityConfig
│   └── storage/                     IStorageService + implementation
│
├── users/
│   ├── package-info.java
│   ├── UserApi.java
│   ├── UserSummary.java             record (id, username, fullName, avatarUrl)
│   ├── UserAuthInfo.java            record có passwordHash, CHỈ cho auth
│   ├── CreateUserCommand.java       record
│   ├── web/                         UserController
│   ├── application/                 UserService (implements UserApi), DatabaseSeeder, dto/
│   └── domain/                      User, Permission, RolePermission + repository
│
├── auth/
│   ├── package-info.java
│   ├── web/                         AuthController
│   ├── application/                 AuthService, dto/
│   └── domain/                      Session, SessionRepository (đổi tên từ AuthRepository)
│
├── games/                           (đã gộp interactions)
│   ├── package-info.java
│   ├── GameApi.java
│   ├── GameSummary.java             record
│   ├── web/                         GameController, GameTagController,
│   │                                GameRatingController, GameFavoriteController
│   ├── application/                 GameService (implements GameApi), GameTagService,
│   │                                GameRatingService, GameMapper, dto/
│   └── domain/                      Game, GameMedia, GameTag, GameTagMap,
│                                    GameRating, GameFavorite, GamePlay,
│                                    MediaType (enum) + các repository
│
└── purchases/                       (chưa implement)
    ├── package-info.java
    ├── web/  application/
    └── domain/                      GamePurchase, StatusPurchase (enum) + repository
```

Ghi chú:

- `domain/` để **phẳng** (không có `entities/`, `repositories/`). Khi vượt khoảng 15 file thì chia theo aggregate (`domain/game/`, `domain/tag/`, `domain/rating/`...), không chia theo loại kỹ thuật.
- Sub-package của module (`web`, `application`, `domain`) là nội bộ theo quy ước của Modulith. Chỉ các class ở gốc package module mới được module khác dùng.

## 5. API công khai giữa module

Chỉ liệt kê API **có người gọi thật**. Trường cụ thể của record điều chỉnh khi implement.

```java
// users — gốc package
public interface UserApi {
    boolean existsById(UUID id);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<UserAuthInfo> findAuthInfoByUsername(String username);   // cho auth
    UserSummary createUser(CreateUserCommand command);                // cho auth (đăng ký)
    Map<UUID, UserSummary> findSummariesByIds(Collection<UUID> ids);  // cho games, purchases
}

// games — gốc package
public interface GameApi {
    boolean existsById(UUID gameId);                                  // cho purchases
    Map<UUID, GameSummary> findSummariesByIds(Collection<UUID> ids); // cho purchases
}
```

Đã bỏ: `GameRatingApi`, `GameRatingSummary`, `IGameRatingInternalService`, `GameApi.updateRatingStats` (không còn cần sau khi gộp `interactions` vào `games`).

## 6. Quyết định kiến trúc

**D1. Modular monolith + Spring Modulith.** Giữ một deployable, ranh giới kiểm bằng test. Chưa tách microservice.

**D2. Tổ chức bên trong module: layer + domain giàu hành vi ("DDD-lite").** Entity JPA đồng thời là model nghiệp vụ và tự giữ luật của nó (`markPaid()`, `assertOwnedBy()`...). Không tách model domain riêng, không có mapper domain↔JPA. Hexagonal/DDD đầy đủ chỉ cân nhắc cho `purchases` khi nghiệp vụ thanh toán đủ phức tạp.

**D3. Gộp `interactions` vào `games`.** Lý do: rating, favorite, play đều là dữ liệu người dùng × game. Tách riêng gây vòng `games ↔ interactions` và buộc `games` mở một thao tác ghi chỉ để phục vụ module khác. Gộp xong, trong cùng module được dùng `@ManyToOne Game`.

**D4. Quan hệ xuyên module chỉ lưu ID.** `Game.ownerId`, `GameRating.userId`, `Session.userId`... là `UUID`. Tên cột DB giữ nguyên. Cần dữ liệu module khác thì gọi `*Api` theo lô.

**D5. Enum thuộc module sở hữu, đặt trong `domain/` của module đó.**
- `MediaType` → `games/domain`.
- `StatusPurchase` → `purchases/domain` (khi implement).
- **Ngoại lệ:** `UserRole` và `ErrorCode` giữ ở `shared/enums`. `UserRole` bị `shared/security` (`UserPrincipal`, `JwtAuthenticationFilter`, `JwtTokenProvider`) dùng, nên nếu chuyển vào `users` thì `shared` phải phụ thuộc `users`, tạo vòng. `ErrorCode` dùng bởi mọi module qua `AppException`.
- Enum nào xuất hiện trong record API công khai thì phải đặt ở **gốc** module, không để trong `domain/`.

**D6. DTO request/response ở `application/dto/`.** Service nhận và trả DTO trực tiếp, nên DTO không thể nằm ở `web/` mà không làm `application` import ngược `web`. Đổi sang model riêng (Command/View) chỉ khi module chuyển lên hexagonal.

**D7. Không tạo interface cho service chỉ có một implementation.** Interface dành cho: ranh giới module (`*Api`), hệ thống bên ngoài (`IStorageService`, cổng thanh toán), framework yêu cầu (Spring Data, MapStruct).

**D8. Hạ tầng bảo mật ở `shared/security`.** Filter, token provider, `UserPrincipal`, `SecurityConfig` bị mọi module dùng. `auth` chỉ giữ logic đăng nhập/đăng ký/phiên.

**D9. `Game.avgRating` và `Game.ratingCount` lưu sẵn trong entity.** `GameRatingService` cập nhật bằng `game.updateRatingStats(avg, count)` trong cùng transaction. Danh sách game đọc điểm trực tiếp, không truy vấn thêm.

**D10. `DatabaseSeeder` thuộc `users`** (nó seed `Permission` và `RolePermission`), không đặt ở `shared`.

## 7. Đổi tên đã chốt

| Hiện tại | Đổi thành | Lý do |
|---|---|---|
| `GamePlayResponse` (DTO URL mở `index.html`) | `GameLaunchResponse` | Tránh nhầm với bản ghi lượt chơi |
| `getGamePlayUrl` | `getLaunchUrl` | Đồng nhất |
| `GamePlay` (bản ghi lượt chơi) | giữ `GamePlay`, hoặc `GamePlaySession` nếu có lưu thời lượng **[CẦN XÁC NHẬN]** | |
| `IGameMapper` | `GameMapper` | Bỏ tiền tố `I` |
| `AuthRepository` | `SessionRepository` nếu nó quản lý `Session` **[CẦN XÁC NHẬN]** | Tên đúng với nội dung |
| `exitsByEmail` | `existsByEmail` | Lỗi chính tả trong hợp đồng API |
| `IUserInternalService`, `UserAuthDTO` (package `users.internal`) | `UserApi`, `UserAuthInfo` ở gốc `users` | `internal` trong Modulith nghĩa là ẩn với module khác |

## 8. Việc cần làm (theo thứ tự)

1. Gộp `interactions` vào `games` (move `domain`, `application`, `web`). Xóa `GameRatingApi`, `GameRatingSummary`, `IGameRatingInternalService`.
2. Chuyển security hạ tầng sang `shared/security`; chuyển `DatabaseSeeder` vào `users/application`.
3. Tạo `UserApi`, `UserSummary`, `UserAuthInfo`, `CreateUserCommand` ở gốc `users`; xóa package `users.internal`.
4. Đổi quan hệ xuyên module sang `UUID`: `Game.ownerId`, `GameRating/GameFavorite/GamePlay.user`, `Session.user`. Quan hệ tới `Game` trong `games` giữ `@ManyToOne`.
5. Thêm `Game.avgRating`, `Game.ratingCount` kèm migration và câu lệnh tính lại từ bảng rating hiện có. `GameService.mapToGameResponse` đọc từ `Game`.
6. Chuyển enum: `MediaType` → `games/domain`.
7. Thêm `package-info.java` cho mọi module, chạy `verifyModularity()` đến khi xanh, rồi khai báo `allowedDependencies` theo mục 3.
8. Đổi tên theo mục 7; xóa `IGameService`, `IGameTagService`, `IGameRatingService`.
9. Sửa test: tên file `ModuleStructureTest.java` thành `ModularityTests.java`, đổi `varifyModularity` thành `verifyModularity`.
10. (Tùy chọn) Tách `GameService` thành CRUD và `GameMediaService` (upload, giải nén) để dễ khoanh vùng lỗi upload.
11. Implement `purchases` theo mẫu `games`. Đây là nơi thử nghiệm entity có hành vi (`markPaid`, `markFailed`) và cân nhắc hexagonal.

## 9. Vi phạm đã biết (từ lần chạy `verifyModularity()` gần nhất)

Xóa dòng khi đã sửa.

- `shared.configs.DatabaseSeeder` phụ thuộc `users` (repository, entity) → chuyển vào `users`.
- `shared.configs.SecurityConfig` phụ thuộc `auth.jwt.JwtAuthenticationFilter` → chuyển filter/provider/principal sang `shared/security`.
- `GamePurchaseEntity` giữ entity `Game` và `User`.
- `Game.ownerId` có kiểu `User`.
- `GameFavorite`, `GamePlay`, `GameRating` giữ entity `User`; trước khi gộp còn giữ `Game`.
- `GameService` dùng `UserRepository` và `IGameRatingInternalService`; `GameRatingService` dùng `GameRepository`, `UserRepository`.
- Vòng `games ↔ interactions` (hết khi gộp module).
- Có thể còn vi phạm khác: log lần chạy gần nhất bị cắt.

## 10. Câu hỏi mở

- MapStruct có đang dùng không? Phiên bản Spring Boot / Spring Modulith? **[CẦN XÁC NHẬN]**
- Công cụ migration (Flyway/Liquibase) hay `ddl-auto`? Loại database? **[CẦN XÁC NHẬN]**
- Các trường thật của `GamePlay` (có lưu thời lượng không)? **[CẦN XÁC NHẬN]**
- `GameSummary`, `UserSummary` cần những trường nào? Chốt khi có module gọi thật.
