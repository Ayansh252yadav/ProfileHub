package in.strikes.ProfileHubBackend.dto;

import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CommentResponseDto {
    private UUID id;
    private String comment;
    private UUID postId;
    private UUID userId;
    private String userName;
    private String profilePicture;
}
