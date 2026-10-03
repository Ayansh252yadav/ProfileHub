package in.strikes.ProfileHubBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class UserLoginResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String token;
    private String message;
}
