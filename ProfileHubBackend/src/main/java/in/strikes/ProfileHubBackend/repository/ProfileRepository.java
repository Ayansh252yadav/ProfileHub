package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    Optional<Profile> findByUser(User user);
    boolean existsByUser(User user);
    Optional<Profile> findByUserId(UUID userId);
    List<Profile> findTop20ByUser_NameContainingIgnoreCase(String name);
}
