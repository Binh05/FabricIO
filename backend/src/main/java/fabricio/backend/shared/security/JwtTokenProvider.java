package fabricio.backend.shared.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtTokenProvider {
    private final SecretKey key;
    private final JwtParser parser;
    private final String JWT_SECRET = "Mzk4YWYwY2EtNTM0Yi00ZDU0LThmMGYtNzMxOTZkNzVlY2I1Cg==";
    private final long JWT_EXPIRATION = (long) (10 * 60 * 1000);

    public JwtTokenProvider() {
        key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(JWT_SECRET));
        parser = Jwts.parser().verifyWith(key).build();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("id", principal.getId().toString())
                .claim("email", principal.getEmail())
                .claim("role", principal.getRole().name())
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Optional<Claims> parse(String token) {
        try {
            return Optional.of(parser.parseSignedClaims(token).getPayload());
        }
        catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }
}
