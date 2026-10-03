package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.*;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.service.ProfileService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private ProfileService profileService;


    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping(
            value = "/profile-pic",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadProfilePic(
            @RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = profileService.updateProfilePicture(file);
        return ResponseEntity.ok(Map.of("profile-pic", imageUrl));
    }

    @PostMapping("/skills")
    public ResponseEntity<?> addSkills(@RequestBody SkillsRequestDto skill){
      profileService.addSkill(skill);
      return ResponseEntity.ok().body("success");
    }
    @PostMapping("/education")
    public ResponseEntity<?> addEducation(@RequestBody EducationRequestDto education){
//        System.out.println("======================= controller start =====================");
        profileService.addEducation(education);
//        System.out.println("======================= controller end =====================");
        return ResponseEntity.ok().build();
    }
    @PostMapping("/work-experience")
    public ResponseEntity<?> addWorkExperience(@RequestBody WorkExperienceRequestDto workExperience){
        profileService.addWorkExperience(workExperience);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/bio")
    public ResponseEntity<?> updateBio(@RequestBody BioRequestDto bio){
        profileService.updateBio(bio);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/education/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable("id") UUID educationId){
        profileService.removeEducation(educationId);
        return ResponseEntity.ok().build();
    }
    @DeleteMapping("/work-experience/{id}")
    public ResponseEntity<?> deleteWorkExperience(@PathVariable("id") UUID workExperienceId){
        profileService.removeWorkExperience(workExperienceId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/me")
    public ResponseEntity<ProfileResponseDto> getMyProfile(Authentication authentication){
        System.out.println("AUTHENTICATION = " + authentication);
        System.out.println("NAME = " + authentication.getName());

        ProfileResponseDto response=profileService.getMyProfile();
        System.out.println("PROFILE = " + response);

        return ResponseEntity.ok().body(response);
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllProfiles(){
        List<Profile> profileList=profileService.getAllProfiles();
        return ResponseEntity.ok().body(profileList);
    }
    @GetMapping("/search")
    public ResponseEntity<?> searchProfiles(@RequestParam("name") String name) {
        return ResponseEntity.ok(profileService.searchProfiles(name));
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable UUID id){
        return ResponseEntity.ok().body(profileService.getProfileById(id));
    }
    @DeleteMapping("/skills")
    public ResponseEntity<?> deleteSkill(@RequestBody SkillsRequestDto skill) {
        profileService.removeSkill(skill);
        return ResponseEntity.ok().body("success");
    }

}
