package fabricio.backend.shared.security;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt)) {
            tokenProvider.parse(jwt).ifPresent(claims -> authenticate(claims, request));
        }
        filterChain.doFilter(request, response);
    }

    private void authenticate(Claims claims, HttpServletRequest request) {
        try {
            var principal = new UserPrincipal(
                    UUID.fromString(claims.get("id", String.class)),
                    claims.getSubject(),
                    claims.get("email", String.class),
                    "",
                    Role.valueOf(claims.get("role", String.class)));

            var authentication = new UsernamePasswordAuthenticationToken(
                    principal, null, principal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (RuntimeException ex) {
            logger.warn("Invalid token claims, request stays unauthenticated", ex);
        }
    }
    
    private String getJwtFromRequest(HttpServletRequest request) {
        var bearerToken = request.getHeader("Authorization");
        // Hỗ trợ cả 'Bearer ' và 'bearer '
        if (StringUtils.hasText(bearerToken) && bearerToken.toLowerCase().startsWith("bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

