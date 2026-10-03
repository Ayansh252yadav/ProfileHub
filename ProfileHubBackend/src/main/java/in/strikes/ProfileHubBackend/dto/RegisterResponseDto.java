package in.strikes.ProfileHubBackend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class RegisterResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String token;
    private String message;
}
