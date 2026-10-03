package in.strikes.ProfileHubBackend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequestDto {
    @NotBlank(message = "required")
    private String email;
    @NotBlank(message = "required")
    private String password;
}
