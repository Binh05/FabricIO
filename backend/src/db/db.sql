-- Kích hoạt extension để sinh UUID ngẫu nhiên (chỉ cần nếu dùng PG version < 13)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. BẢNG USERS
-- =============================================================================
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       username VARCHAR(50) NOT NULL UNIQUE,
                       hashed_password VARCHAR(255) NOT NULL,
                       email VARCHAR(50) NOT NULL UNIQUE,
                       full_name VARCHAR(255) NOT NULL,
                       bio VARCHAR(200),
                       avatar_url VARCHAR(500),
                       role VARCHAR(20) NOT NULL DEFAULT 'User',
                       is_active BOOLEAN NOT NULL DEFAULT TRUE,
                       is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                       deleted_at TIMESTAMPTZ,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_username ON users(username);

-- =============================================================================
-- 2. BẢNG GAME_TAGS
-- =============================================================================
CREATE TABLE game_tags (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           name VARCHAR(100) NOT NULL,
                           created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT uq_game_tags_name UNIQUE (name)
);

-- =============================================================================
-- 3. BẢNG GAMES
-- =============================================================================
CREATE TABLE games (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       owner_id UUID NOT NULL,
                       title VARCHAR(255) NOT NULL,
                       description TEXT,
                       thumbnail_url VARCHAR(500),
                       game_url VARCHAR(500),
                       status VARCHAR(20) NOT NULL DEFAULT 'Draft',
                       price NUMERIC(19, 2) NOT NULL DEFAULT 0.00,
                       avg_rating INT NOT NULL DEFAULT 0,
                       rating_count INT NOT NULL DEFAULT 0,
                       is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                       deleted_at TIMESTAMPTZ,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_games_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_games_owner_id ON games(owner_id);
CREATE INDEX idx_games_is_deleted ON games(is_deleted);

-- =============================================================================
-- 4. BẢNG GAME_TAG_MAP (N-N giữa Game & GameTag)
-- =============================================================================
CREATE TABLE game_tag_map (
                              game_id UUID NOT NULL,
                              tag_id UUID NOT NULL,

                              PRIMARY KEY (game_id, tag_id),
                              CONSTRAINT fk_game_tag_map_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                              CONSTRAINT fk_game_tag_map_tag FOREIGN KEY (tag_id) REFERENCES game_tags(id) ON DELETE CASCADE
);

-- =============================================================================
-- 5. BẢNG GAME_RATINGS
-- =============================================================================
CREATE TABLE game_ratings (
                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                              game_id UUID NOT NULL,
                              user_id UUID NOT NULL,
                              stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
                              review TEXT,
                              created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                              CONSTRAINT fk_game_ratings_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                              CONSTRAINT fk_game_ratings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================================================
-- 6. BẢNG GAME_PLAYS (Lịch sử session chơi game)
-- =============================================================================
CREATE TABLE game_plays (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            user_id UUID NOT NULL,
                            game_id UUID NOT NULL,
                            duration_seconds INT,
                            played_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                            CONSTRAINT fk_game_plays_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            CONSTRAINT fk_game_plays_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE INDEX idx_game_plays_user_game ON game_plays(user_id, game_id);
CREATE INDEX idx_game_plays_game_time ON game_plays(game_id, played_at);

-- =============================================================================
-- 7. BẢNG GAME_FAVORITES (Danh sách yêu thích)
-- =============================================================================
CREATE TABLE game_favorites (
                                game_id UUID NOT NULL,
                                user_id UUID NOT NULL,
                                created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                PRIMARY KEY (game_id, user_id),
                                CONSTRAINT fk_game_favorites_game FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
                                CONSTRAINT fk_game_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================================================
-- 8. BẢNG SESSIONS
-- =============================================================================
CREATE TABLE sessions (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          user_id UUID NOT NULL,
                          token VARCHAR(512) NOT NULL UNIQUE,
                          expires_at TIMESTAMPTZ,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_token ON sessions(token);