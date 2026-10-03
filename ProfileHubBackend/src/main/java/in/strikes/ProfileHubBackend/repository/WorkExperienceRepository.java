package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.Education;
import in.strikes.ProfileHubBackend.entity.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, UUID> {
}
