package fabricio.backend.modules.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final String JWT_SECRET = "Mzk4YWYwY2EtNTM0Yi00ZDU0LThmMGYtNzMxOTZkNzVlY2I1Cg==";
    private final long JWT_EXPIRATION = 86400000L;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // 1. Tạo JWT từ UserPrincipal (Tối ưu: tự lấy id và email từ object)
    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        java.util.List<String> auths = principal.getAuthorities().stream()
                .map(org.springframework.security.core.GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toList());

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("id", principal.getId().toString())
                .claim("email", principal.getEmail())
                .claim("role", principal.getRole().name())
                .claim("authorities", auths)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }



    public String getUsernameFromJWT(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public String getIdFromJWT(String token) {
        return getClaimsFromToken(token).get("id", String.class);
    }

    public String getEmailFromJWT(String token) {
        return getClaimsFromToken(token).get("email", String.class);
    }

    public String getRoleFromJWT(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    // Lấy Authorities từ JWT
    @SuppressWarnings("unchecked")
    public java.util.List<String> getAuthoritiesFromJWT(String token) {
        return getClaimsFromToken(token).get("authorities", java.util.List.class);
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // 3. Xác thực JWT
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (Exception ex) {
            // Có thể catch cụ thể: ExpiredJwtException, MalformedJwtException, v.v.
            return false;
        }
    }
}

