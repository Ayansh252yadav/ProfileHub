package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.dto.EmailOtpRequestDto;
import in.strikes.ProfileHubBackend.entity.EmailVerification;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.EmailRepository;
import jakarta.validation.constraints.Email;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class EmailVerificationService {
    private EmailService emailService;
    private EmailRepository emailRepository;
    public EmailVerificationService(EmailService emailService,
                                    EmailRepository emailRepository) {
        this.emailService = emailService;
        this.emailRepository = emailRepository;
    }
    private SecureRandom secureRandom = new SecureRandom();
    public String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }
    public String sendOtp(EmailOtpRequestDto emailOtpRequestDto) {
        String otp = generateOtp();
        emailService.sendOtp(emailOtpRequestDto.getEmail(),otp);
      emailRepository.save(
                new EmailVerification(
                        emailOtpRequestDto.getEmail(),
                        otp,
                        LocalDateTime.now().plusMinutes(5)
                )
        );
      return otp;
    }
    public boolean verifyOtp(String email, String otp) {
        EmailVerification existEmail=emailRepository.findByEmail(email)
                .orElseThrow(()->
                        new ResourceNotFoundException("email not valid"));
        if(existEmail.getOtp().equals(otp)
                && existEmail.getExpiresAt().isAfter(LocalDateTime.now())) {
            return true;
        }
        return false;
    }
}
