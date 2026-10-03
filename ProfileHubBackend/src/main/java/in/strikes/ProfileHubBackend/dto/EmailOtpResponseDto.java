package in.strikes.ProfileHubBackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmailOtpResponseDto {
    private String otp;
    private String message;
}
