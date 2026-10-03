package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.UserLoginRequestDto;
import in.strikes.ProfileHubBackend.dto.UserLoginResponseDto;
import in.strikes.ProfileHubBackend.entity.CustomUserDetail;
import in.strikes.ProfileHubBackend.service.CustomUserDetailService;
import in.strikes.ProfileHubBackend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/login")
public class LoginAuthController {

    private AuthenticationManager authenticationManager;
    private JwtService jwtService;

    public LoginAuthController(AuthenticationManager authenticationManager,
                               JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<UserLoginResponseDto> loginUser(
            @Valid @RequestBody UserLoginRequestDto userLoginRequestDto
    ) {

        Authentication authenticationRequest =
                UsernamePasswordAuthenticationToken.unauthenticated(
                        userLoginRequestDto.getEmail(),
                        userLoginRequestDto.getPassword()
                );
        Authentication authentication =
                authenticationManager.authenticate(authenticationRequest);
        String token = jwtService.generateToken(authentication);
        CustomUserDetail userDetail = (CustomUserDetail) authentication.getPrincipal();
        UserLoginResponseDto userLoginResponseDto = new UserLoginResponseDto(
                userDetail.getId(),
                userDetail.getName(),
                userDetail.getUsername(),//email
                token,
                "Success"
        );
        return ResponseEntity.ok(userLoginResponseDto);
    }
}
