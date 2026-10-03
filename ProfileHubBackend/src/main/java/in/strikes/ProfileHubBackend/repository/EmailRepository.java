package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.EmailVerification;
import jakarta.validation.constraints.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EmailRepository extends JpaRepository<EmailVerification, UUID> {
    Optional<EmailVerification> findByEmail(String email);
}
