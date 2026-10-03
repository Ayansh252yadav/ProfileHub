package in.strikes.ProfileHubBackend.dto;

import in.strikes.ProfileHubBackend.entity.ConnectionRequestStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ConnectionResponseDto {

    private UUID requestId;

    private UUID senderId;
    private String senderName;
    private UUID receiverId;
    private String receiverName;
    private ConnectionRequestStatus connectionRequestStatus;
    private LocalDateTime sendAt;
}
