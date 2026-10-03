package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.EmailOtpResponseDto;
import org.springframework.stereotype.Service;

@Service
public class EmailMapToDtoDecorator {
    public EmailOtpResponseDto mapOtpToResponse(String otp){
        EmailOtpResponseDto emailOtpResponseDto = new EmailOtpResponseDto();
        emailOtpResponseDto.setOtp(otp);
        emailOtpResponseDto.setMessage("Success");
        return emailOtpResponseDto;
    }
}
