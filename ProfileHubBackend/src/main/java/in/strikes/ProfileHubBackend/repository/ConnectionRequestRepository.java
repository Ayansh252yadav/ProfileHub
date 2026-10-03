package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.ConnectionRequest;
import in.strikes.ProfileHubBackend.entity.ConnectionRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, UUID> {

    List<ConnectionRequest> findByReceiverIdAndStatus(UUID receiverId, ConnectionRequestStatus status);
    long countByReceiverIdAndStatus(
            UUID receiverId,
            ConnectionRequestStatus status
    );
}
