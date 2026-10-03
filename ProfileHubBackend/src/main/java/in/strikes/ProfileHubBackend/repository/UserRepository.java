package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.AuthProvider;
import in.strikes.ProfileHubBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
   Optional<User> findByProviderAndProviderSubject(AuthProvider provider, String subject);
   Optional<User> findByProviderSubject(String subject);
}
