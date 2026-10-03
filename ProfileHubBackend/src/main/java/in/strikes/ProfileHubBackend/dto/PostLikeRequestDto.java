package in.strikes.ProfileHubBackend.dto;

import lombok.Getter;

import java.util.UUID;

@Getter
public class PostLikeRequestDto {
    private UUID postId;
}
