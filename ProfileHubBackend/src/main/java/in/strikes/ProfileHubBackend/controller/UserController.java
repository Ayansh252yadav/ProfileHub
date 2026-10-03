package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.RegisterRequestDto;
import in.strikes.ProfileHubBackend.dto.RegisterResponseDto;
import in.strikes.ProfileHubBackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDto>
    createUser(
            @Valid @RequestBody RegisterRequestDto registerRequestDto
    ) {
        RegisterResponseDto responseDto = userService.register(registerRequestDto);
        return ResponseEntity.ok(responseDto);
    }
}
