package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.ConnectionResponseDto;
import in.strikes.ProfileHubBackend.entity.ConnectionRequestStatus;
import in.strikes.ProfileHubBackend.service.ConnectionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/connection")
@RequiredArgsConstructor
public class ConnectionRequestController {

    private final ConnectionRequestService connectionRequestService;

    @PostMapping("/request/{id}")
   public ResponseEntity<ConnectionResponseDto> requestConnection(
           @PathVariable UUID id) {
        ConnectionResponseDto connectionResponseDto =
                connectionRequestService.request(id);
        return ResponseEntity.ok(connectionResponseDto);
    }

    @GetMapping("/pendingRequest")
    public ResponseEntity<List<ConnectionResponseDto>> pendingRequest() {
    List<ConnectionResponseDto> responseDtos=connectionRequestService.pending();
    return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/approved/{status}/{id}")
    public ResponseEntity<ConnectionResponseDto> approve(
            @PathVariable UUID id , @PathVariable ConnectionRequestStatus status) {
        ConnectionResponseDto connectionResponseDto =connectionRequestService.approve(id,status);
        return ResponseEntity.ok(connectionResponseDto);
    }
    @GetMapping
    public ResponseEntity<List<ConnectionResponseDto>> all() {
        List<ConnectionResponseDto> responseDtos=connectionRequestService.all();
        return ResponseEntity.ok(responseDtos);
    }
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        long countConnection=connectionRequestService.countConnection();
        return ResponseEntity.ok(countConnection);
    }
}
