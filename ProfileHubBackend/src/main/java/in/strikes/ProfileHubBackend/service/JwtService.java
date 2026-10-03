package in.strikes.ProfileHubBackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class JwtService {
    @Value("${jwt.issuer}")
    private String issuer;
    @Value("${jwt.expires}")
    private Long expires;
    private JwtEncoder encoder;

    public JwtService(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    public String generateToken(Authentication authentication) {
        Instant issuedAt = Instant.now();

        List<String> authorities =
                authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(issuedAt)
                .expiresAt(
                       issuedAt.plusSeconds(expires)
                )
                .subject(authentication.getName())
                .claim(
                        "authorities",
                        authorities
                )
                .build();
        Jwt jwt = encoder.encode(
                JwtEncoderParameters.from(claims)
        );
        return jwt.getTokenValue();
    }
}
