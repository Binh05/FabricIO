# AGENTS.md — Quy tắc cho agent làm việc trên FabricIO backend

Đọc `ARCHITECTURE.md` trước khi sửa code. Dự án là **modular monolith** dùng **Spring Modulith**; ranh giới module được kiểm tra tự động bằng `ModularityTests`.
Mục đánh dấu **[CẦN XÁC NHẬN]** là chỗ chưa chắc chắn: kiểm tra trong code hoặc hỏi John, đừng đoán.

## 0. Cách làm việc

- Giao tiếp với John bằng **tiếng Việt**. Tên class, method, biến, package bằng **tiếng Anh**.
- Sau mỗi thay đổi động tới package, import hoặc entity, chạy:
  `./gradlew test --tests "*ModularityTests"` (Windows: `gradlew.bat`).
  Không báo "xong" nếu `verifyModularity` đỏ vì lỗi **do bạn gây ra**. Lỗi tồn tại từ trước thì ghi trong `ARCHITECTURE.md` mục 9, đừng giấu.
- Làm từng bước nhỏ, mỗi bước build được. Không refactor ngoài phạm vi được yêu cầu.
- Không thêm thư viện, không đổi version, không đổi schema DB khi chưa hỏi.
- Không tạo API, interface, DTO, event "phòng hờ". Chỉ tạo khi đã có chỗ gọi cụ thể.
- Nếu buộc phải giả định, nêu rõ giả định ở cuối câu trả lời.
- Dùng constructor injection (`@RequiredArgsConstructor`), không field injection.

## 1. Cấu trúc module

- **R1.** Base package `fabricio.backend`. Mỗi package con **trực tiếp** là một module: `users`, `auth`, `games`, `purchases`, `shared`. Không tạo thư mục bọc như `modules/`.
- **R2.** Gốc package của module chỉ chứa: `package-info.java`, `*Api`, record/enum/event công khai. Mọi thứ khác nằm trong `web/`, `application/`, `domain/`. Sub-package là nội bộ.
- **R3.** Hướng phụ thuộc trong module: `web → application → domain`. `domain` không import `web` hay `application`. `application` không import `web`.
- **R4.**
  - `web/`: controller.
  - `application/`: service, mapper, `dto/` (request/response).
  - `domain/`: entity, repository, enum nghiệp vụ.
  - `domain/` để phẳng. Không tạo `entities/`, `repositories/`. Chỉ chia theo aggregate khi vượt khoảng 15 file.
- **R5.** `shared` là module `OPEN`, **không được import module nào khác**. Chỉ chứa hạ tầng thật sự dùng chung (base, config, exception, security, storage, `ErrorCode`, `UserRole`). Không đặt logic nghiệp vụ vào `shared`.
- **R6.** Mỗi module có `package-info.java` với `@ApplicationModule(allowedDependencies = {...})` theo bảng ở `ARCHITECTURE.md` mục 3. Chỉ thêm phụ thuộc khi có chỗ gọi thật. Tuyệt đối không tạo vòng.

## 2. Giao tiếp giữa module

- **R7.** Module khác chỉ được dùng các class ở **gốc package**. Cấm import `..domain..`, `..application..`, `..web..` của module khác.
- **R8.** Dữ liệu qua ranh giới module là record bất biến (`*Summary`, `*Command`, `*Info`) hoặc ID. **Không bao giờ truyền entity.**
- **R9.** Chỉ đưa vào record những trường bên gọi thật sự cần. **Không đưa `passwordHash` vào `UserAuthInfo`.** Dữ liệu nhạy cảm chỉ đi qua record riêng (`UserAuthInfo`) dành cho `auth`.
- **R10.** Lấy dữ liệu nhiều bản ghi thì dùng API theo lô (`findSummariesByIds(Collection<UUID>)`), không gọi trong vòng lặp (tránh N+1).
- **R11.** Module "cao" gọi module "thấp", không đảo lại. Khi module thấp cần hiển thị dữ liệu của module cao, hãy lưu sẵn trong entity của mình (ví dụ `Game.avgRating`) hoặc để module cao tổng hợp.
- **R12.** Event chỉ tạo khi có consumer thật. Class event nằm ở gốc module phát; listener dùng `@ApplicationModuleListener`. Không dùng event để lách vòng phụ thuộc.
- **R13.** Enum xuất hiện trong API công khai thì phải đặt ở **gốc** module, không để trong `domain/`.

## 3. Entity và JPA

- **R14.** Quan hệ **xuyên module chỉ lưu ID** (`UUID userId`, `UUID gameId`). Cấm `@ManyToOne`, `@OneToMany`, `@OneToOne` sang entity của module khác. Khi đổi sang ID, **giữ nguyên tên cột**.
- **R15.** Trong **cùng module** được dùng `@ManyToOne` (ví dụ `GameRating → Game` trong `games`). Mặc định `FetchType.LAZY`.
- **R16.** Entity chứa luật nghiệp vụ của chính nó (`assertOwnedBy`, `changePrice`, `markPaid`...), không rải trong service. Không thêm setter cho trường có luật (`ownerId`, `price`, `status`, số liệu rating).
- **R17.** Cấm JPQL/native query join sang bảng của module khác.
- **R18.** Mọi thay đổi schema (thêm cột, đổi quan hệ) phải có **migration** và **backfill dữ liệu cũ** (ví dụ tính lại `avgRating` từ bảng rating). Không dựa vào `ddl-auto` để đổi schema. Công cụ migration: **[CẦN XÁC NHẬN]**.
- **R19.** Enum thuộc module sở hữu, đặt ở `domain/` của module đó: `MediaType` → `games`, `StatusPurchase` → `purchases`. **Ngoại lệ ở `shared/enums`:** `ErrorCode`, `UserRole` (vì `shared/security` dùng, chuyển đi sẽ làm `shared` phụ thuộc module).

## 4. Web và DTO

- **R20.** Controller mỏng: lấy principal, gọi service, bọc kết quả bằng `ApiResponse`. Không logic nghiệp vụ, không dùng repository trực tiếp.
- **R21.** Request/Response DTO nằm ở `application/dto/`. Không đưa kiểu web (`HttpServletRequest`, `ResponseEntity`) vào DTO hay service. Ngoại lệ tạm chấp nhận: `MultipartFile`.
- **R22.** Người dùng hiện tại lấy từ `@AuthenticationPrincipal UserPrincipal`. **Không** tin `userId` do client gửi trong body/path để xác định quyền.
- **R23.** Kiểm tra quyền sở hữu bằng phương thức của entity (`game.assertOwnedBy(userId)`).
- **R24.** Lỗi nghiệp vụ: `throw new AppException(ErrorCode.X)`. Thêm mã mới vào `shared/enums/ErrorCode`. Không ném `RuntimeException` trần cho lỗi nghiệp vụ.

## 5. Interface

- **R25.** Chỉ tạo interface khi có một trong:
  1. ranh giới module (`*Api`);
  2. hệ thống bên ngoài (storage, cổng thanh toán, email);
  3. có từ hai implementation thật trở lên;
  4. framework yêu cầu (Spring Data repository, MapStruct mapper).
- **R26.** **Không** tạo `IXxxService` cho service chỉ có một implementation. Controller inject thẳng class service.
- **R27.** Code mới không dùng tiền tố `I` (`GameApi`, `GameMapper`). Tên cũ `IStorageService` giữ nguyên cho đến khi John yêu cầu đổi.

## 6. Đặt tên

- Entity: danh từ số ít (`Game`, `GameRating`).
- DTO: `XxxRequest`, `XxxResponse`. URL mở game: `GameLaunchResponse` (không dùng chữ "Play" cho URL, vì `GamePlaySession` là bản ghi lượt chơi).
- Record qua ranh giới module: `XxxSummary`, `XxxCommand`, `XxxInfo`.
- API công khai: `XxxApi`, đặt ở gốc package module.
- Method API mô tả việc nó làm, không nhắc tên bên gọi (`createUser`, không `createUser`).
- Test kiến trúc: class `ModularityTests`, method `verifyModularity`.

## 7. Test

- `ModularityTests.verifyModularity` phải xanh trước khi merge.
- Luật nghiệp vụ trong entity: viết unit test thuần Java, không dùng `@SpringBootTest`.
- **Không sửa test hay nới `allowedDependencies` để vượt qua lỗi ranh giới.** Sửa code cho đúng ranh giới.

## 8. Những điều cấm

- Import entity/repository/service nội bộ của module khác.
- `@ManyToOne` sang entity module khác.
- Để `shared` import bất kỳ module nghiệp vụ nào.
- Tạo package `internal` để "công khai cho module khác" (trong Modulith `internal` nghĩa là ẩn).
- Đưa `passwordHash`, token hoặc dữ liệu nhạy cảm vào record dùng chung.
- Thêm `package-info.java` với `allowedDependencies` rộng hơn mức cần.
- Để lại code chết, interface thừa, DTO không ai dùng sau khi refactor.

## 9. Checklist trước khi báo hoàn thành

- [ ] `./gradlew build` thành công.
- [ ] `verifyModularity` không có lỗi mới do thay đổi của bạn.
- [ ] Không có import chéo vào `domain`, `application`, `web` của module khác.
- [ ] Không còn quan hệ JPA xuyên module mới.
- [ ] Thay đổi schema (nếu có) đã kèm migration và backfill.
- [ ] Không thêm interface một-implementation, không thêm API chưa có người gọi.
- [ ] Đã cập nhật `ARCHITECTURE.md` (mục 4 nếu đổi cấu trúc, mục 8 và 9 nếu hoàn thành hoặc phát hiện việc mới).
- [ ] Đã nêu rõ mọi giả định.
