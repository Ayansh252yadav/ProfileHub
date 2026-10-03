package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.decorators.EmailMapToDtoDecorator;
import in.strikes.ProfileHubBackend.dto.EmailOtpRequestDto;
import in.strikes.ProfileHubBackend.dto.EmailOtpResponseDto;
import in.strikes.ProfileHubBackend.entity.EmailVerification;
import in.strikes.ProfileHubBackend.service.EmailService;
import in.strikes.ProfileHubBackend.service.EmailVerificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mailotp")
public class EmailController {
    private EmailVerificationService emailVerificationService;
    private EmailMapToDtoDecorator  emailMapToDtoDecorator;
    public EmailController(EmailVerificationService emailVerificationService,
                           EmailMapToDtoDecorator emailMapToDtoDecorator) {
        this.emailVerificationService = emailVerificationService;
        this.emailMapToDtoDecorator = emailMapToDtoDecorator;
    }
    @PostMapping
    public ResponseEntity<String> sendOtp(
            @RequestBody EmailOtpRequestDto emailOtpRequestDto){
        emailVerificationService
              .sendOtp(emailOtpRequestDto);
      return ResponseEntity
              .status(HttpStatus.OK)
              .body(
                  "Otp sent to "+emailOtpRequestDto.getEmail()
              );
    }
}
