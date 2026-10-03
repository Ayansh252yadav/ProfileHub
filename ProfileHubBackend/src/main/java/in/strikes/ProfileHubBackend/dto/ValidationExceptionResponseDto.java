package in.strikes.ProfileHubBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ValidationExceptionResponseDto {
    private String message;
    private LocalDateTime timestamp;
    private int statusCode;
    private String path;
    private String error;
    private Map<String, String> fieldErrors;
}
