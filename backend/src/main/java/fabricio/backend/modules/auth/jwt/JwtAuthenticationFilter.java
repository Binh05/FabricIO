package fabricio.backend.modules.auth.jwt;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

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
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Lấy jwt từ request
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                // Tối ưu: Lấy thông tin trực tiếp từ Token Payload, không cần truy vấn Database
                String username = tokenProvider.getUsernameFromJWT(jwt);
                String idStr = tokenProvider.getIdFromJWT(jwt);
                String email = tokenProvider.getEmailFromJWT(jwt);

                if (username != null && idStr != null) {
                    // Tạo UserPrincipal từ thông tin trong Token
                    UserPrincipal userDetails = new UserPrincipal(
                        UUID.fromString(idStr), 
                        username, 
                        email, 
                        "", // Không cần password ở bước này
                        List.of()
                    );

                    UsernamePasswordAuthenticationToken authentication = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception ex) {
            logger.error("Could not set user authentication in security context", ex);
        }

        filterChain.doFilter(request, response);
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

