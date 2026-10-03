package in.strikes.ProfileHubBackend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EducationResponseDto {
    private UUID id;
    private String school;
    private String degree;
    private String fieldOfStudy;
}
