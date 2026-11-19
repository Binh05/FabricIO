package fabricio.backend.shared.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Component
public class CursorCodec {
    private final ObjectMapper objectMapper;

    public CursorCodec(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String encode(CursorPayload payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(json.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new IllegalStateException("Không thể mã hóa cursor", e);
        }
    }

    public CursorPayload decode(String cursor) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(cursor);
            return objectMapper.readValue(decoded, CursorPayload.class);
        } catch (Exception e) {
            throw new IllegalArgumentException("Cursor không hợp lệ");
        }
    }
}
