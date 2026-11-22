package fabricio.backend.shared.security;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private static final String AUTH_REGISTER = "/api/v1/auth/register";
    private static final String AUTH_LOGIN = "/api/v1/auth/login";
    private static final String AUTH_REFRESH = "/api/v1/auth/refresh";
    private static final String UPLOAD_PRESIGN = "/api/v1/uploads/presign";
    private static final String UPLOAD_COMPLETE = "/api/v1/uploads/complete";
    private static final String COMMENT_CREATE_PREFIX = "/api/v1/games/";
    private static final String COMMENT_REPLY_PREFIX = "/api/v1/comments/";
    private static final String COMMENT_LIKE_PREFIX = "/api/v1/comments/";
    private static final String RATING_PREFIX = "/api/v1/game/";

    private static final RateLimit AUTH_STRICT = new RateLimit("AUTH_STRICT", 10, Duration.ofMinutes(1));
    private static final RateLimit UPLOAD_PRESIGN_LIMIT = new RateLimit("UPLOAD_PRESIGN_LIMIT", 3, Duration.ofMinutes(1));
    private static final RateLimit UPLOAD_COMPLETE_LIMIT = new RateLimit("UPLOAD_COMPLETE_LIMIT", 30, Duration.ofMinutes(1));
    private static final RateLimit WRITE_ACTION = new RateLimit("WRITE_ACTION", 60, Duration.ofMinutes(1));

    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .maximumSize(100_000)
            .expireAfterAccess(Duration.ofHours(1))
            .build();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        RateLimit rateLimit = rateLimitFor(request);
        if (rateLimit == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = keyFor(request, rateLimit);
        if (key == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Bucket bucket = buckets.get(key, ignored -> createBucket(rateLimit));
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimit.capacity()));
        response.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));
        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
            return;
        }

        long retryAfterSeconds = Math.max(1,
                (probe.getNanosToWaitForRefill() + 999_999_999L) / 1_000_000_000L);
        response.setStatus(429);
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"code\":429,\"message\":\"Too many requests\",\"data\":null}");
    }

    private RateLimit rateLimitFor(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getRequestURI();

        if ("POST".equalsIgnoreCase(method)
                && (AUTH_REGISTER.equals(path) || AUTH_LOGIN.equals(path) || AUTH_REFRESH.equals(path))) {
            return AUTH_STRICT;
        }
        if ("POST".equalsIgnoreCase(method)
                && UPLOAD_PRESIGN.equals(path)) {
            return UPLOAD_PRESIGN_LIMIT;
        }
        if ("POST".equalsIgnoreCase(method)
                && UPLOAD_COMPLETE.equals(path)) {
            return UPLOAD_COMPLETE_LIMIT;
        }
        if ("POST".equalsIgnoreCase(method)
                && (path.startsWith(COMMENT_CREATE_PREFIX) && path.endsWith("/comments")
                || path.startsWith(COMMENT_REPLY_PREFIX) && path.endsWith("/replies")
                || path.startsWith(RATING_PREFIX) && path.endsWith("/ratings"))) {
            return WRITE_ACTION;
        }
        if ("PUT".equalsIgnoreCase(method)
                && path.startsWith(COMMENT_LIKE_PREFIX) && path.endsWith("/like")) {
            return WRITE_ACTION;
        }
        if ("PATCH".equalsIgnoreCase(method) && "/api/v1/user".equals(path)) {
            return WRITE_ACTION;
        }
        return null;
    }

    private String keyFor(HttpServletRequest request, RateLimit rateLimit) {
        if (rateLimit == AUTH_STRICT) {
            return rateLimit.name() + ':' + request.getRemoteAddr();
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        UUID userId = principal.getId();
        return rateLimit.name() + ':' + userId;
    }

    private Bucket createBucket(RateLimit rateLimit) {
        Bandwidth limit = Bandwidth.classic(
                rateLimit.capacity(),
                Refill.greedy(rateLimit.capacity(), rateLimit.period()));
        return Bucket.builder().addLimit(limit).build();
    }

    private record RateLimit(String name, long capacity, Duration period) {
    }
}
