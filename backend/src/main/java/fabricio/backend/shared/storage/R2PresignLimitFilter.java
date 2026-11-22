package fabricio.backend.shared.storage;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class R2PresignLimitFilter extends OncePerRequestFilter {
    private final R2UsageTracker usage;
    private final StorageProperties storageProperties;
    private final ObjectMapper objectMapper;

    public R2PresignLimitFilter(
            R2UsageTracker usage,
            StorageProperties storageProperties,
            ObjectMapper objectMapper) {
        this.usage = usage;
        this.storageProperties = storageProperties;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())
                || !request.getRequestURI().endsWith("/api/v1/uploads/presign")) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrapped = new ContentCachingRequestWrapper(request, 1024 * 1024);
        byte[] body = wrapped.getInputStream().readAllBytes();
        if (body.length > 0) {
            try {
                JsonNode json = objectMapper.readTree(body);
                JsonNode sizeNode = json.get("size");
                if (sizeNode != null && sizeNode.isIntegralNumber()) {
                    long requestedBytes = sizeNode.longValue();
                    if (usage.wouldExceedLimit(requestedBytes, storageProperties.limitBytes())) {
                        response.setStatus(HttpServletResponse.SC_REQUEST_ENTITY_TOO_LARGE);
                        response.setContentType("application/json");
                        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
                        response.getWriter().write(
                                "{\"code\":413,\"message\":\"Dung lượng lưu trữ R2 đã đạt giới hạn 5GB\",\"data\":null}");
                        return;
                    }
                }
            } catch (JsonProcessingException ignored) {
                // Invalid JSON is handled by the existing request validation/controller flow.
            }
        }

        filterChain.doFilter(wrapped, response);
    }
}
