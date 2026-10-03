package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.RegisterRequestDto;
import in.strikes.ProfileHubBackend.dto.RegisterResponseDto;
import in.strikes.ProfileHubBackend.dto.UserLoginResponseDto;
import in.strikes.ProfileHubBackend.entity.AuthProvider;
import in.strikes.ProfileHubBackend.entity.CustomUserDetail;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import in.strikes.ProfileHubBackend.service.JwtService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MapToUserEntity {
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private UserRepository userRepository;
    public MapToUserEntity(PasswordEncoder passwordEncoder,
                           JwtService jwtService,
                           UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    public User requestMapToUser(RegisterRequestDto registerRequestDto) {
       User user = new User();
       user.setEmail(registerRequestDto.getEmail());
       String password = passwordEncoder.encode(registerRequestDto.getPassword());
       user.setPassword(password);
       user.setName(registerRequestDto.getName());
       user.setCreatedAt(LocalDateTime.now());
       user.setProvider(AuthProvider.LOCAL);
       return userRepository.save(user);
    }
    public RegisterResponseDto  registerUserResponse(User user) {
        RegisterResponseDto registerResponseDto = new RegisterResponseDto();
        registerResponseDto.setEmail(user.getEmail());
        registerResponseDto.setName(user.getName());
        registerResponseDto.setId(user.getId());

        CustomUserDetail userDetail=new CustomUserDetail(user);

        Authentication authentication= UsernamePasswordAuthenticationToken.authenticated(
                userDetail,
                null,
                userDetail.getAuthorities()
        );
       String token = jwtService.generateToken(authentication);
       registerResponseDto.setToken(token);
        registerResponseDto.setMessage("registration successful");
        return registerResponseDto;
    }
    public UserLoginResponseDto loginUserOauth2(User user){
        CustomUserDetail userDetail=new CustomUserDetail(user);
        Authentication authentication= UsernamePasswordAuthenticationToken.authenticated(
                userDetail,
                null,
                userDetail.getAuthorities()
        );
        UserLoginResponseDto responseDto=new UserLoginResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                jwtService.generateToken(authentication),
                "success"
        );
        return responseDto;
    }
}
