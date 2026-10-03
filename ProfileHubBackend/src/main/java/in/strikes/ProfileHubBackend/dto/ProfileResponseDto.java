package in.strikes.ProfileHubBackend.dto;

import java.util.List;
import java.util.UUID;

public class ProfileResponseDto {

    private UUID id;          // Profile ID
    private UUID userId;      // User ID

    private String name;
    private String profilePicture;
    private String bio;

    private List<String> skills;
    private List<EducationResponseDto> educations;
    private List<WorkExperienceResponseDto> workExperiences;


    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<EducationResponseDto> getEducations() {
        return educations;
    }

    public void setEducations(List<EducationResponseDto> educations) {
        this.educations = educations;
    }

    public List<WorkExperienceResponseDto> getWorkExperiences() {
        return workExperiences;
    }

    public void setWorkExperiences(
            List<WorkExperienceResponseDto> workExperiences) {
        this.workExperiences = workExperiences;
    }
}