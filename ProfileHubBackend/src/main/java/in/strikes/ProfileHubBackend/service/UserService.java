package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.decorators.MapToUserEntity;
import in.strikes.ProfileHubBackend.dto.RegisterRequestDto;
import in.strikes.ProfileHubBackend.dto.RegisterResponseDto;
import in.strikes.ProfileHubBackend.dto.UserLoginResponseDto;
import in.strikes.ProfileHubBackend.entity.AuthProvider;
import in.strikes.ProfileHubBackend.entity.EmailVerification;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.repository.EmailRepository;
import in.strikes.ProfileHubBackend.repository.ProfileRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import jakarta.validation.ValidationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.module.ResolutionException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    private UserRepository userRepository;
   private EmailVerificationService emailVerificationService;
   private MapToUserEntity  mapToUserEntity;
   private ProfileRepository profileRepository;
    public UserService(UserRepository userRepository,
                       EmailVerificationService emailVerificationService,
                       MapToUserEntity  mapToUserEntity,
                       ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.emailVerificationService = emailVerificationService;
        this.mapToUserEntity = mapToUserEntity;
        this.profileRepository = profileRepository;
    }
  public RegisterResponseDto  register(
          RegisterRequestDto registerRequestDto) {
     boolean response=   emailVerificationService
                .verifyOtp(
                        registerRequestDto.getEmail(),
                        registerRequestDto.getOtp()
                );
     if(!response) {
         throw new ValidationException("Invalid OTP");
     }
    User user =mapToUserEntity.requestMapToUser(registerRequestDto);
     return mapToUserEntity.registerUserResponse(user);
  }
  @Transactional
  public UserLoginResponseDto registerOrUpdateUser(String provider,
                                                   OidcUser oidcUser) {
  String subProvider=oidcUser.getSubject();
  AuthProvider provideEnum=AuthProvider.valueOf(provider.toUpperCase());

      Optional<User>existingUser=userRepository
              .findByProviderAndProviderSubject(
              provideEnum,subProvider);
      if(existingUser.isPresent()) {
         return mapToUserEntity.loginUserOauth2(existingUser.get());
      }
      Optional<User> normalRegisterUSer=userRepository
              .findByEmail(oidcUser.getEmail());
          if(normalRegisterUSer.isPresent()) {
              User user=normalRegisterUSer.get();
              normalRegisterUSer.get().setProviderSubject(oidcUser.getSubject());
              normalRegisterUSer.get().setProvider(AuthProvider.GOOGLE);
              normalRegisterUSer.get().setUpdatedAt(LocalDateTime.now());
              if (!profileRepository.existsByUser(user)) {
                  Profile profile = new Profile();
                  profile.setUser(user);
                  profileRepository.save(profile);
              }
              return mapToUserEntity.loginUserOauth2(normalRegisterUSer.get());
      }else{
          User createNewUser=new User();
          createNewUser.setEmail(oidcUser.getEmail());
          createNewUser.setProvider(AuthProvider.GOOGLE);
          createNewUser.setProviderSubject(oidcUser.getSubject());
          createNewUser.setName(oidcUser.getAttribute("name"));
          createNewUser.setCreatedAt(LocalDateTime.now());
          userRepository.save(createNewUser);
              Profile profile = new Profile();
              profile.setUser(createNewUser);

              profileRepository.save(profile);

              return mapToUserEntity.loginUserOauth2(createNewUser);
      }
  }
}
