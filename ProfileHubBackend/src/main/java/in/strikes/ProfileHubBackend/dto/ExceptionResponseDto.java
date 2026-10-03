package in.strikes.ProfileHubBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ExceptionResponseDto {
    private LocalDateTime timestamp;
    private String message;
    private int status;
    private String path;
    private String error;
}
