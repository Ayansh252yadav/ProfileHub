package in.strikes.ProfileHubBackend.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDto {
    @NotBlank(message = "Required")
    @Size(min = 3, max = 15, message = "Name must be between 3 and 15 characters")
    private String name;
    @Email(message = "Invalid email")
    @NotBlank(message = "Required")
    private String email;
    @Size(min = 3, max = 15, message = "Password must be between 3 and 15 characters")
    private String password;
    @NotBlank(message = "enter otp sent on your email")
    @Size(min = 6,max = 6)
    private String otp;
}
