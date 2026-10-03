package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.dto.ConnectionResponseDto;
import in.strikes.ProfileHubBackend.entity.ConnectionRequest;
import in.strikes.ProfileHubBackend.entity.ConnectionRequestStatus;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.ConnectionRequestRepository;
import in.strikes.ProfileHubBackend.repository.ProfileRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConnectionRequestService {

    private final UserRepository userRepository;
    private final ConnectionRequestRepository connectionRequestRepository;
   private final ProfileRepository profileRepository;

    public User getCurrUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String subject = authentication.getName();
        Optional<User> existingUser = userRepository.findByEmail(subject);
        if (!existingUser.isPresent()) {
            existingUser = userRepository.findByProviderSubject(subject);
        }
        return existingUser.orElseThrow(() -> new ResourceNotFoundException("user not found"));
    }

    public ConnectionResponseDto request(UUID receiverID) {
        System.out.println("receiverID: " + receiverID);
        Profile profileReceiver=profileRepository.findById(receiverID)
                .orElseThrow(() -> new ResourceNotFoundException("profile not found"));
        System.out.println("profileReceiver: " + profileReceiver);
        User receiver =profileReceiver.getUser();
        ConnectionRequest connectionRequest = new ConnectionRequest();
        User sender = getCurrUser();
        connectionRequest.setSender(sender);
        connectionRequest.setReceiver(receiver);
        connectionRequest.setStatus(ConnectionRequestStatus.PENDING);
        ConnectionRequest request = connectionRequestRepository.save(connectionRequest);
        return mapTOResponse(request);
    }

    public List<ConnectionResponseDto> pending() {
        User currUser = getCurrUser();
        return connectionRequestRepository
                .findByReceiverIdAndStatus(currUser.getId(), ConnectionRequestStatus.PENDING)
                .stream()
                .map(this::mapTOResponse)
                .toList();
    }

    public ConnectionResponseDto approve(UUID id, ConnectionRequestStatus status) {
        ConnectionRequest request = connectionRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("connection request not found"));
        if (status == ConnectionRequestStatus.REJECTED) {
            request.setStatus(ConnectionRequestStatus.REJECTED);
        } else if (status == ConnectionRequestStatus.CANCELLED) {
            request.setStatus(ConnectionRequestStatus.CANCELLED);
        } else {
            request.setStatus(ConnectionRequestStatus.ACCEPTED);
        }
        ConnectionRequest savedRequest = connectionRequestRepository.save(request);
        return mapTOResponse(savedRequest);
    }

    public List<ConnectionResponseDto> all() {
        return connectionRequestRepository.findAll()
                .stream()
                .map(this::mapTOResponse)
                .toList();
    }

    public long countConnection() {
        User currUser = getCurrUser();
        return connectionRequestRepository
                .countByReceiverIdAndStatus(currUser.getId(), ConnectionRequestStatus.ACCEPTED);
    }

    public ConnectionResponseDto mapTOResponse(ConnectionRequest request) {
        ConnectionResponseDto connectionResponseDto = new ConnectionResponseDto();
        connectionResponseDto.setRequestId(request.getId());
        connectionResponseDto.setConnectionRequestStatus(request.getStatus());
        connectionResponseDto.setSendAt(request.getSendAt());
        connectionResponseDto.setReceiverId(request.getReceiver().getId());
        connectionResponseDto.setReceiverName(request.getReceiver().getName());
        connectionResponseDto.setSenderId(request.getSender().getId());
        connectionResponseDto.setSenderName(request.getSender().getName());
        return connectionResponseDto;
    }
}
