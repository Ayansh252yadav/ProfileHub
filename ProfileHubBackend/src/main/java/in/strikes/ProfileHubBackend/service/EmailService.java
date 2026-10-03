package in.strikes.ProfileHubBackend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aayansh.yadav25@gmail.com");
        message.setTo(email);
        message.setSubject("ProfileHub email verification");
        message.setText("""
                          Your ProfileHub verification OTP is:
                                   %s              \s
                This OTP is valid for 5 minutes.              \s
                If you did not request this, please ignore this email.
               \s""".formatted(otp));
        mailSender.send(message);
    }
}
