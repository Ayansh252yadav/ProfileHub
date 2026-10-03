package in.strikes.ProfileHubBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailOtpRequestDto {
    @NotBlank(message = "required")
    @Email
    private String email;
}
