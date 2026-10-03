package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.decorators.ProfileMapperCreate;
import in.strikes.ProfileHubBackend.dto.*;
import in.strikes.ProfileHubBackend.entity.Education;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.entity.WorkExperience;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.EducationRepository;
import in.strikes.ProfileHubBackend.repository.ProfileRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import in.strikes.ProfileHubBackend.repository.WorkExperienceRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {
 private CloudinaryService cloudinaryService;
 private UserRepository userRepository;
 private ProfileRepository profileRepository;
 private WorkExperienceRepository workExperienceRepository;
 private EducationRepository educationRepository;
 private ProfileMapperCreate creator;
    public ProfileService(CloudinaryService cloudinaryService,
                          UserRepository userRepository,
                          ProfileRepository profileRepository,
                          EducationRepository educationRepository,
                          WorkExperienceRepository workExperienceRepository,
                          ProfileMapperCreate creator) {
        this.cloudinaryService = cloudinaryService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.educationRepository=educationRepository;
        this.workExperienceRepository=workExperienceRepository;
        this.creator=creator;
    }
    private User getCurrUser(){
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        String subject = authentication.getName();
        Optional<User> userOptional= userRepository.findByEmail(subject);
        if(userOptional.isEmpty()){
            userOptional=userRepository.findByProviderSubject(subject);
        }
        return userOptional.orElseThrow(
                () -> new ResourceNotFoundException("Current user not found")
        );
    }
    @Transactional
    public Profile getProfileByUser(){
//        System.out.println("========== GET PROFILE START ==========");
        User user = getCurrUser();
//        System.out.println("User found: " + user.getEmail());
     Optional<Profile> profile= profileRepository.findByUser(user);
     if(profile.isPresent()){
         return profile.get();
     }
     Profile newProfile =creator.CreateProfile(user);
     profileRepository.save(newProfile);
        //System.out.println("Profile found: " + profile.get().getId());
        return newProfile;
    }
    public ProfileResponseDto getMyProfile(){
        Profile profile=getProfileByUser();
       return creator.CreateProfileResponseDto(profile);
    }
    @Transactional
    public String updateProfilePicture(MultipartFile file) throws IOException {
        Profile profile = getProfileByUser();
        String imageUrl=cloudinaryService.uploadImage(file);
        profile.setProfilePicture(imageUrl);
        return imageUrl;
    }
    @Transactional
    public void addSkill(SkillsRequestDto sKill){
        Profile profile = getProfileByUser();
        profile.getSkills().add(sKill.getSkill());
    }
    @Transactional
    public void removeSkill(SkillsRequestDto skill){
        Profile profile = getProfileByUser();
        profile.getSkills().remove(skill.getSkill());
    }
    @Transactional
    public void updateBio(BioRequestDto bio){
        Profile profile = getProfileByUser();
        profile.setBio(bio.getBio());
    }
    @Transactional
    public void addEducation(EducationRequestDto education){
//        System.out.println("========== SERVICE START ==========");
//        System.out.println("Before getProfileByUser()");
        Profile profile = getProfileByUser();
//        System.out.println("After getProfileByUser()");
//        System.out.println("Profile ID = " + profile.getId());
        Education currEducationDetail = new Education();
        currEducationDetail.setProfile(profile);
        currEducationDetail.setDegree(education.getDegree());
        currEducationDetail.setSchool(education.getSchool());
        currEducationDetail.setFieldOfStudy(education.getFieldOfStudy());
        profile.getEducations().add(currEducationDetail);
        educationRepository.save(currEducationDetail);
    }
    @Transactional()
    public void removeEducation(UUID educationId){
        Profile profile = getProfileByUser();
        Education education=profile.getEducations()
                        .stream()
                                .filter(e->e.getId().equals(educationId))
                                        .findFirst()
                                                .orElseThrow(()->
                                                        new ResourceNotFoundException("Education not found"));
        profile.getEducations().remove(education);
        educationRepository.delete(education);
    }
    @Transactional
    public void addWorkExperience(WorkExperienceRequestDto workExperience){
        Profile profile = getProfileByUser();
        WorkExperience currWorkExperience = new WorkExperience();
        currWorkExperience.setYear(workExperience.getWorkExperience());
        currWorkExperience.setCompanyName(workExperience.getCompanyName());
        currWorkExperience.setPosition(workExperience.getPositionName());
        currWorkExperience.setProfile(profile);
        profile.getWorkExperiences().add(currWorkExperience);
        workExperienceRepository.save(currWorkExperience);
    }
    @Transactional
    public void removeWorkExperience(UUID workExperienceId){
        Profile profile = getProfileByUser();
      WorkExperience experience=profile.getWorkExperiences()
              .stream()
              .filter(e->e.getId().equals(workExperienceId))
              .findFirst()
              .orElseThrow(()->new ResourceNotFoundException("WorkExperience not found"));
      profile.getWorkExperiences().remove(experience);
      workExperienceRepository.delete(experience);
    }
    public List<Profile> getAllProfiles(){
        return profileRepository.findAll();
    }
    public ProfileResponseDto getProfileById(UUID id){
        Profile profile= profileRepository.findByUserId(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Profile not found")
                );
       return creator.CreateProfileResponseDto(profile);
    }
    public List<ProfileResponseDto> searchProfiles(String name) {

        if (name == null || name.isBlank()) {
            return List.of();
        }

        return profileRepository
                .findTop20ByUser_NameContainingIgnoreCase(name.trim())
                .stream()
                .map(profile->creator.CreateProfileResponseDto(profile))   // ASSUMPTION: use the same mapping your getProfileById uses
                .toList();
    }
}
