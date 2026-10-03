package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.EducationResponseDto;
import in.strikes.ProfileHubBackend.dto.ProfileResponseDto;
import in.strikes.ProfileHubBackend.dto.WorkExperienceResponseDto;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProfileMapperCreate {

    public Profile CreateProfile(User user) {

        Profile profile = new Profile();

        profile.setUser(user);

        return profile;
    }


    public ProfileResponseDto CreateProfileResponseDto(Profile profile) {

        ProfileResponseDto profileResponseDto =
                new ProfileResponseDto();

        // Profile ID
        profileResponseDto.setId(profile.getId());

        // User ID
        profileResponseDto.setUserId(profile.getUser().getId());

        profileResponseDto.setName(
                profile.getUser().getName()
        );

        profileResponseDto.setProfilePicture(
                profile.getProfilePicture()
        );

        profileResponseDto.setBio(
                profile.getBio()
        );

        profileResponseDto.setSkills(
                profile.getSkills()
        );


        List<EducationResponseDto> educationResponseDtoList =
                profile.getEducations()
                        .stream()
                        .map(education -> {

                            EducationResponseDto educationResponseDto =
                                    new EducationResponseDto();

                            educationResponseDto.setId(
                                    education.getId()
                            );

                            educationResponseDto.setDegree(
                                    education.getDegree()
                            );

                            educationResponseDto.setSchool(
                                    education.getSchool()
                            );

                            educationResponseDto.setFieldOfStudy(
                                    education.getFieldOfStudy()
                            );

                            return educationResponseDto;

                        })
                        .toList();

        profileResponseDto.setEducations(
                educationResponseDtoList
        );


        List<WorkExperienceResponseDto> workExperienceResponseDtoList =
                profile.getWorkExperiences()
                        .stream()
                        .map(workExperience -> {

                            WorkExperienceResponseDto workExperienceResponseDto =
                                    new WorkExperienceResponseDto();

                            workExperienceResponseDto.setId(
                                    workExperience.getId()
                            );

                            workExperienceResponseDto.setCompanyName(
                                    workExperience.getCompanyName()
                            );

                            workExperienceResponseDto.setYear(
                                    workExperience.getYear()
                            );

                            workExperienceResponseDto.setPositionName(
                                    workExperience.getPosition()
                            );

                            return workExperienceResponseDto;

                        })
                        .toList();

        profileResponseDto.setWorkExperiences(
                workExperienceResponseDtoList
        );

        return profileResponseDto;
    }
}