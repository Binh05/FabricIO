#### Số lượng seed data:
| Entity | Số lượng |
| ------ | -------- |
| User (chủ game) | 200 |
| Game | 10.000 (khoảng 10% đã xóa) |
| Media | 3 đến 5 mỗi game (30.000 đến 50.000) |
| Tag	| 30 đến 50 tag khác nhau |
| Tag map |	2 đến 4 mỗi game (20.000 đến 40.000) |

#### Yêu cầu:

- Sử dụng generate_series
- Tạo vài nghìn game, mỗi game có 3 đến 5 `media` và 2 đến 4 `tag`, trộn lẫn giữa các game để giống dữ liệu thật. Cần có nhiều `media` và `tag` mỗi game, vì chính điều đó làm `N+1` lộ ra.
- `thumbnailUrl`, `gameUrl`, `mediaUrl` có thể là chuỗi giả.
- Cho dữ liệu đủ đa dạng ở `title` để kịch bản tìm kiếm theo `keyword` có ý nghĩa, và nhớ có một phần game ở trạng thái `isDeleted = true`.
- ngày tạo trải đều để sắp xếp theo `createdAt` có ý nghĩa.

#### Kịch bản đo:
Các kịch bản (chạy riêng từng cái, chưa trộn):
- `GET /games` trang đầu, không keyword
- `GET /games` một trang sâu (ví dụ trang 100), để thấy chi phí phân trang
- `GET /games?keyword=...` (tìm kiếm), vì LIKE '%...%' là điểm yếu
- `GET /games/{id}` với id ngẫu nhiên trong tập dữ liệu
- `(Tùy chọn)` `GET /games/{id}/play`, nhẹ nên chỉ cần nếu muốn đủ bộ