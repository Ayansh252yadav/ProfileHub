package in.strikes.ProfileHubBackend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class CommentRequestDto {
    private String comment;
}
