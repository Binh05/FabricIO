### Set up:
**install k6**
```
scoop install k6
```

**Lấy ngẫu nhiên 2000 user id:**
```text
docker compose -f backend/docker-compose.dev.yml exec -T postgres psql -U postgres -d fabricio_db -At -c "SELECT id FROM games WHERE is_deleted = false ORDER BY random() LIMIT 2000" | Out-File -Encoding utf8 benchmark\data\game-ids.csv
```

**Lấy danh sách từ khóa:**
```text
docker compose -f backend/docker-compose.dev.yml exec -T postgres psql -U postgres -d fabricio_db -At -c "SELECT w FROM (SELECT regexp_split_to_table(lower(title), '[^a-z0-9]+') AS w FROM games WHERE is_deleted = false) t WHERE length(w) >= 3 AND w !~ '^[0-9]+$' GROUP BY w ORDER BY random() LIMIT 30" | Out-File -Encoding utf8 benchmark\data\keywords.txt
```

### Chạy:

**Chạy thử:**

- Chạy backend

```text
docker compose -f docker-compose.dev.yml up -d
./gradlew bootRun
```
- Chạy k6
```text
k6 run benchmark/k6/games-list.js -e VUS=1 -e WARMUP=1s -e DURATION=5s -e LABEL=smoke -e RUN=1 -e Token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEiLCJpZCI6Ijk2MjM0YWM1LWU0Y2QtNDFlMy04MzU2LWVlZjk5MzY5YjA2YiIsImVtYWlsIjoidXNlcl8xQGV4YW1wbGUuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzkzNzc3NDY1LCJleHAiOjE3OTM3ODM0NjV9.24JIdtjrzW2RZNWhaqjbYq1HwqjP_ROx4dqLwMYE9E0
```

**Build:**
```text
./gradlew clean bootJar
```

**Run:**
```text
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

**Đo:**
```text
powershell -ExecutionPolicy Bypass -File benchmark\run-all.ps1 -Label b0
```

**Đo từng kịch bản:**
```text
powershell -ExecutionPolicy Bypass -File benchmark\run-all.ps1 -Label b3 -Runs 3 -Scenarios @("games-list", "games-list-deep")
```