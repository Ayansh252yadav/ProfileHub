package in.strikes.ProfileHubBackend.dto;

import in.strikes.ProfileHubBackend.entity.MediaType;
import in.strikes.ProfileHubBackend.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class PostResponseDto {
    UUID id;
    private String title;
    private String body;
    private String media;
    private MediaType mediaType;
    private User user;
    private LocalDateTime createdOn;
    private LocalDateTime updatedOn;
}
