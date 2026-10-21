-- =============================================================================
-- SEED DATA SCRIPT: USERS, TAGS, 10.000 GAMES, MEDIA & TAG MAPS
-- =============================================================================

-- Xóa dữ liệu hiện tại:
TRUNCATE TABLE
    users,
    game_tags,
    games,
    game_tag_map,
    game_ratings,
    game_media,
    game_plays,
    game_favorites,
    sessions
RESTART IDENTITY CASCADE;

-- 1. Sinh 200 Users (làm Owner cho các Game)
INSERT INTO users (id, username, hashed_password, email, full_name, bio, avatar_url, role, is_active, is_deleted, created_at, updated_at)
SELECT
    gen_random_uuid(),
    'user_' || i,
    '$2y$10$.Oa2EZCasYEeRLviBGTUmO4NeWAZvkqQng.YjEmrNztKV9/P/HztS', -- password mặc định Password@123
    'user_' || i || '@example.com',
    (ARRAY['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ'])[floor(random() * 10 + 1)] || ' ' ||
    (ARRAY['Văn', 'Thị', 'Đức', 'Minh', 'Anh', 'Thành', 'Hữu', 'Quang', 'Ngọc', 'Thanh'])[floor(random() * 10 + 1)] || ' ' ||
    (ARRAY['Bình', 'An', 'Nam', 'Hùng', 'Dũng', 'Tuấn', 'Linh', 'Trang', 'Phúc', 'Khánh'])[floor(random() * 10 + 1)],
    'Developer / Gamer #' || i,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user_' || i,
    CASE WHEN i = 1 THEN 'Admin' ELSE 'User' END,
    TRUE,
    FALSE,
    NOW() - (random() * 365 || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 200) AS i
ON CONFLICT (username) DO NOTHING;


-- 2. Sinh 40 Game Tags
INSERT INTO game_tags (id, name, created_at, updated_at)
SELECT
    gen_random_uuid(),
    tag_name,
    NOW(),
    NOW()
FROM (
         VALUES
             ('Action'), ('Adventure'), ('RPG'), ('Strategy'), ('Simulation'),
             ('Puzzle'), ('Platformer'), ('Shooter'), ('Survival'), ('Horror'),
             ('Casual'), ('Arcade'), ('Racing'), ('Sports'), ('Fighting'),
             ('Stealth'), ('Sandbox'), ('Open World'), ('Card Game'), ('Turn-Based'),
             ('Roguelike'), ('Tower Defense'), ('Cyberpunk'), ('Fantasy'), ('Sci-Fi'),
             ('Pixel Art'), ('Multiplayer'), ('Singleplayer'), ('Co-op'), ('Retro'),
             ('Anime'), ('Space'), ('Zombies'), ('Mystery'), ('Tactical'),
             ('Rhythm'), ('Physics'), ('Crafting'), ('Indie'), ('Building')
     ) AS t(tag_name)
    ON CONFLICT (name) DO NOTHING;


-- 3. Tạo Bảng Tạm chứa 10.000 Game IDs và thuộc tính để sinh Media & Tag Map chính xác
CREATE TEMPORARY TABLE temp_inserted_games AS
WITH user_pool AS (
    SELECT id, ROW_NUMBER() OVER () as rn, COUNT(*) OVER () as total_users FROM users
)
SELECT
    gen_random_uuid() AS id,
    u.id AS owner_id,
    -- Tạo tiêu đề đa dạng từ từ khóa để test LIKE %keyword% (ví dụ: Shadow, Cyber, Quest, Runner, ...)
    (ARRAY['Shadow', 'Cyber', 'Legend of', 'Super', 'Ultimate', 'Pixel', 'Dark', 'Space', 'Kingdom', 'Hyper'])[floor(random() * 10 + 1)] || ' ' ||
    (ARRAY['Runner', 'Quest', 'Warrior', 'Tactics', 'Arena', 'Chronicles', 'Empire', 'Escape', 'Simulator', 'Odyssey'])[floor(random() * 10 + 1)] || ' ' ||
    '#' || g.i AS title,
    'Game trải nghiệm đỉnh cao thuộc thể loại ' ||
    (ARRAY['chiến thuật', 'hành động', 'nhập vai', 'sinh tồn', 'đố trí', 'đua xe'])[floor(random() * 6 + 1)] ||
    '. Khám phá thế giới rộng lớn với màn chơi thứ ' || g.i AS description,
    'https://picsum.photos/seed/game_' || g.i || '_thumb/400/225' AS thumbnail_url,
    'https://play.example.com/games/game_' || g.i AS game_url,
    (ARRAY[0.00, 0.00, 4.99, 9.99, 14.99, 19.99, 29.99, 49.99])[floor(random() * 8 + 1)]::NUMERIC(19, 2) AS price,
    floor(random() * 5 + 1)::INT AS avg_rating,
    floor(random() * 500)::INT AS rating_count,
    -- Tỷ lệ ~10% bị soft delete (is_deleted = TRUE)
    (random() < 0.10) AS is_deleted,
    -- Ngày tạo trải đều trong vòng 365 ngày qua
    NOW() - (random() * 365 || ' days')::INTERVAL AS created_at
FROM generate_series(1, 10000) AS g(i)
    JOIN user_pool u ON u.rn = ((g.i - 1) % u.total_users) + 1;


-- Chèn 10.000 bản ghi vào bảng games
INSERT INTO games (id, owner_id, title, description, thumbnail_url, game_url, price, avg_rating, rating_count, is_deleted, deleted_at, created_at, updated_at)
SELECT
    id,
    owner_id,
    title,
    description,
    thumbnail_url,
    game_url,
    price,
    avg_rating,
    rating_count,
    is_deleted,
    CASE WHEN is_deleted THEN created_at + INTERVAL '5 days' ELSE NULL END AS deleted_at,
    created_at,
    created_at AS updated_at
FROM temp_inserted_games;


-- 4. Sinh 3 đến 5 Media cho mỗi Game (Tổng cộng khoảng 30.000 - 50.000 bản ghi media)
INSERT INTO game_media (id, game_id, media_url, media_type, sort_order, created_at, updated_at)
SELECT
    gen_random_uuid(),
    g.id,
    'https://picsum.photos/seed/media_' || g.id || '_' || m.sort_order || '/800/450',
    CASE WHEN m.sort_order = 1 THEN 'Video' ELSE 'Image' END,
    m.sort_order,
    g.created_at,
    g.created_at
FROM temp_inserted_games g
         CROSS JOIN LATERAL (
    SELECT generate_series(1, floor(random() * 3 + 3)::INT) AS sort_order
        ) m;


-- 5. Sinh 2 đến 4 Tag Map cho mỗi Game (Tổng cộng khoảng 20.000 - 40.000 bản ghi mapping)
WITH tag_pool AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn, COUNT(*) OVER () as total_tags FROM game_tags
)
INSERT INTO game_tag_map (game_id, tag_id)
SELECT DISTINCT
    g.id,
    t.id
FROM temp_inserted_games g
         CROSS JOIN LATERAL (
    SELECT floor(random() * t_count.total_tags + 1)::INT AS tag_rn
    FROM (SELECT total_tags FROM tag_pool LIMIT 1) t_count
             CROSS JOIN generate_series(1, floor(random() * 3 + 2)::INT)
        ) rand_tags
         JOIN tag_pool t ON t.rn = rand_tags.tag_rn
    ON CONFLICT (game_id, tag_id) DO NOTHING;


-- Dọn dẹp bảng tạm
DROP TABLE temp_inserted_games;