package in.strikes.ProfileHubBackend.dto;

import in.strikes.ProfileHubBackend.entity.Post;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class PostLikeResponseDto {
    private UUID LikeId;
    private int NoOFLikes;
}
