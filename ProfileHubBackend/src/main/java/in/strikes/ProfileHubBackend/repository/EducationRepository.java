package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EducationRepository extends JpaRepository<Education, UUID> {
}
