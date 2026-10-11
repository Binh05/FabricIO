package fabricio.backend.shared.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Optional;

@Component
public class JwtTokenProvider {
    private final SecretKey key;
    private final JwtParser parser;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${APP.JWT.SECRET}") String secret,
            @Value("${APP.JWT.EXPIRATION_MS:600000}") long expirationMs
    ) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.parser = Jwts.parser().verifyWith(key).build();
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserPrincipal principal) {
        Date now = new Date();

        return Jwts.builder()
                .subject(principal.getUsername())
                .claim("id", principal.getId().toString())
                .claim("email", principal.getEmail())
                .claim("role", principal.getRole().name())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
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
