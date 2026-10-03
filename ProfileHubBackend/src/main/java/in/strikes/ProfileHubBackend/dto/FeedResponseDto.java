package in.strikes.ProfileHubBackend.dto;

import in.strikes.ProfileHubBackend.entity.MediaType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class FeedResponseDto {
    private UUID postId;

    // Post
    private String title;
    private String body;
    private String media;
    private MediaType mediaType;
    private LocalDateTime createdAt;

    // Author
    private UUID authorId;
    private String authorName;
    private String authorProfilePicture;

    // Social
    private int likeCount;
    private boolean likedByCurrentUser;

    private int commentCount;
   private List<CommentResponseDto> commentResponseDto;

    // Follow
    private boolean followedByCurrentUser;
}
