# Reverse Proxy & API Gateway (Nginx)

Reverse Proxy & SSL Automation (Nginx & Certbot)Thư mục này chứa toàn bộ định nghĩa cấu hình, tệp Docker và hướng dẫn quản lý hệ thống Web Server / Reverse Proxy cho dự án DevTool Fabric (FabricIO) trên môi trường Production (AWS EC2).Hệ thống được thiết kế theo kiến trúc Cloud-Native / Decoupled, bóc tách hoàn toàn tầng tính toán (Compute), tầng lưu trữ (Storage), tầng dữ liệu (Database) và tầng tự động hóa (CI/CD) để tối ưu hiệu năng và chi phí.

### 1. Cấu trúc thư mục dự án trên EC2

```text
/home/ubuntu/app/
├── nginx/
│   └── nginx.conf            # Cấu hình định tuyến Reverse Proxy & SSL cho FE/BE
├── certbot/
│   ├── conf/                 # Nơi lưu trữ chứng chỉ SSL thật do Certbot sinh ra
│   └── www/                  # Thư mục chứa tệp thử thách acme-challenge để xác thực
├── .env                      # Lưu trữ biến môi trường bảo mật (Neon DB, AWS S3 Credentials)
└── docker-compose.yml        # File quản lý cụm Container (Nginx, Certbot, FE, BE)
```

### 2. Sơ đồ kiến trúc Production

Hệ thống tận dụng tối đa tài nguyên từ bên thứ ba (Serverless & Cloud Services) nhằm giảm tải RAM/CPU cho máy chủ AWS EC2, cho phép toàn bộ ứng dụng chạy mượt mà trên các cấu hình máy chủ ảo tối ưu.

```text
                     Internet (Người dùng)
                                     │
                                     ▼ (Cổng 80 -> Tự động Redirect sang 443)
                         ┌───────────────────────┐
                         │   AWS EC2 Instance    │
                         │ ┌───────────────────┐ │
                         │ │    Nginx Proxy    │ │ (Bọc SSL Let's Encrypt)
                         │ └─┬───────────────┬─┘ │
                             │               │
            ┌────────────────┘               └────────────────┐
            ▼ (Định tuyến nội bộ)                            ▼ (Định tuyến nội bộ)
 ┌──────────────────────┐                         ┌──────────────────────┐
 │ Frontend Container   │                         │  Backend Container   │
 │ (React/NextJS)       │                         │ (Java Spring boot)   │
 └──────────────────────┘                         └──────────┬───────────┘
                                                             │
                                      ┌──────────────────────┴──────────────────────┐
                                      ▼ (Kết nối Cloud thông qua SDK)               ▼ (Kết nối qua Connection String Pooler)
                          ┌──────────────────────┐                       ┌──────────────────────┐
                          │    Amazon S3         │                       │    Neon Database     │
                          │ (Media/Static Storage│                       │ (Serverless Postgres)│
                          └──────────────────────┘                       └──────────────────────┘

```

> [!IMPORTANT]
> Tự động hóa CI/CD: Toàn bộ quy trình Build Docker Image và đẩy mã nguồn (CD) được xử lý bởi GitHub Actions Run-time, tự động SSH vào EC2 qua User Credential bí mật để cập nhật hệ thống, EC2 không tốn tài nguyên chạy ngầm như Jenkins.
> Bảo mật mạng nội bộ: Các Container frontend và backend không mở (expose) bất kỳ cổng nào ra Internet thông qua UFW Firewall. Traffic bắt buộc phải đi qua nginx_proxy bọc mã hóa SSL.3.

### Hướng dẫn thiết lập hệ thống

#### Bước 1: Cấu hình Tường lửa (UFW Firewall) trên EC2

Đảm bảo máy chủ chỉ mở các cổng dịch vụ cần thiết để ngăn chặn tấn công dò quét cổng:

```Bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

#### Bước 2: Khởi tạo cấu hình Nginx thô (Chỉ chạy HTTP cổng 80)

Trước khi cấp được SSL, Let's Encrypt cần truy cập vào server của bạn qua cổng 80 để xác thực. Hãy cấu hình file nginx/nginx.conf như sau:

```bash
Nginxevents { worker_connections 1024; }
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
        }
    }

    server {
        listen 80;
        server_name api.your-domain.com;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
        }
    }
}
```

Khởi động container Nginx để sẵn sàng đón nhận request xác thực:

```Bash
docker compose up -d nginx
```

#### Bước 3: Chạy lệnh bẻ gãy Entrypoint để khởi tạo SSL lần đầuDo container certbot có cấu hình lệnh lặp gia hạn tự động, ta cần ép Certbot chạy lệnh cấp mới chứng chỉ độc lập bằng

```bash
flag --entrypoint:Bashdocker compose run --rm --entrypoint "certbot" certbot certonly --webroot --webroot-path=/var/www/certbot --email your-email@gmail.com --agree-tos --no-eff-email -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

Khi màn hình hiển thị thông báo Congratulations! Your certificate and chain have been saved... nghĩa là hệ thống đã có chứng chỉ SSL chính chủ.

#### Bước 4: Viết lại cấu hình Nginx hoàn chỉnh (Bật HTTPS 443)Thay thế toàn bộ nội dung file nginx/nginx.conf thành cấu hình Production tối ưu hóa bảo mật và hỗ trợ kết nối thời gian thực dưới đây:

```Bash
Nginxevents { worker_connections 1024; }

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # 1. Ép buộc chuyển hướng từ HTTP sang HTTPS toàn hệ thống
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com api.your-domain.com;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            return 301 https://$host$request_uri;
        }
    }

    # 2. Cấu hình HTTPS cho FRONTEND
    server {
        listen 443 ssl;
        server_name your-domain.com www.your-domain.com;

        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # 3. Cấu hình HTTPS cho BACKEND
    server {
        listen 443 ssl;
        server_name api.your-domain.com;

        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Cấu hình hỗ trợ WebSockets cho ứng dụng Chat Real-time / Real-time Gateway (nếu có)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
```

#### Bước 5: Tái khởi động cụm Docker Compose để áp dụng SSLBashdocker compose down

```Bash
docker compose up -d
```

### 4. Lệnh quản lý hàng ngày cho Kỹ sư Vận hành

```Bash
# Kiểm tra trạng thái hoạt động của cụm container
docker compose ps

# Xem log trực tiếp của Nginx Proxy để bắt lỗi traffic
docker compose logs -f nginx

# Kiểm tra log của Certbot để theo dõi tác vụ tự động gia hạn
docker compose logs certbot

# Ép hệ thống kiểm tra và thử nghiệm gia hạn SSL ngay lập tức (Dry-run)
docker compose run --rm --entrypoint "certbot" certbot renew --dry-run

# Khởi động lại riêng service Nginx sau khi chỉnh sửa config mà không làm sập FE/BE
docker compose restart nginx
```

### 5. Xử lý sự cố thường gặp (Troubleshooting)

| Triệu chứng                                                                 | Nguyên nhân phổ biến                                                                                                     | Giải pháp xử lý                                                                                                                                                                                                          |
| :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Container `nginx_proxy` sập liên tục** <br>`(Exited (1))`                 | File `nginx.conf` bị sai cú pháp hoặc Nginx cố đọc file chứng chỉ SSL trong khi thư mục `certbot/conf/` đang trống.      | 1. Chạy lệnh `docker compose run --rm nginx nginx -t` để check lỗi cú pháp.<br>2. Chuyển `nginx.conf` về cấu hình thô (Cổng 80) ở Bước 2, chạy lại container rồi tiến hành xin cấp SSL từ đầu.                           |
| **Lỗi `502 Bad Gateway` khi truy cập domain**                               | Container `frontend` hoặc `backend` chưa khởi động xong, bị crash ngầm, hoặc định nghĩa sai cổng gán trong `proxy_pass`. | 1. Chạy `docker compose ps` kiểm tra xem các container core có đang chạy không.<br>2. Kiểm tra lại cổng nội bộ của app trong Docker (ví dụ: backend đang listen đúng cổng `5000` nội bộ mạng `fab-network`).             |
| **Không thể truy cập trang web qua HTTPS** <br>`(Connection Timed Out)`     | Luật tường lửa mạng của nhà cung cấp Cloud (AWS Security Group) hoặc Firewall UFW của hệ điều hành chưa mở cổng 443.     | Vào AWS Console &rarr; EC2 &rarr; Security Groups gắn kèm Instance, kiểm tra xem đã cấu hình Inbound Rules cho phép traffic cổng `443` (HTTPS) và `80` (HTTP) từ nguồn `0.0.0.0/0` chưa. Chạy lại lệnh mở cổng trên UFW. |
| **Upload file lớn qua API bị từ chối** <br>`(413 Request Entity Too Large)` | Nginx cấu hình mặc định giới hạn dung lượng body request truyền tải quá nhỏ (thường là 1MB).                             | Bổ sung thêm tham số `client_max_body_size 50M;` (hoặc dung lượng bạn muốn) vào ngay trong block `http { ... }` hoặc `location / { ... }` của API Backend trong file `nginx.conf` rồi restart lại Nginx.                 |
| **Lỗi kết nối Cơ sở dữ liệu hoặc mất tệp tĩnh**                             | Chuỗi kết nối Neon DB bị ngắt hoặc Access Key của AWS S3 bị thu hồi/hết hạn.                                             | Kiểm tra tệp `.env` tại thư mục gốc của EC2 xem các biến `CONNECTION_STRING`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` có khớp với thông tin trên Dashboard của Neon và IAM User AWS hay không.                      |
