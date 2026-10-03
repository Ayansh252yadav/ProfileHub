package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.FeedResponseDto;
import in.strikes.ProfileHubBackend.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/allFeed")
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    @GetMapping
    public ResponseEntity<List<FeedResponseDto>> getFeed() {
        return ResponseEntity.ok().body(feedService.getFeed());
    }
}
