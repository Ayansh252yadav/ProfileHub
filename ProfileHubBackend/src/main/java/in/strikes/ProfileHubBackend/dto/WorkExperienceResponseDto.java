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
public class WorkExperienceResponseDto {
    private UUID id;
    private String companyName;
    private String positionName;
    private String year;
}
