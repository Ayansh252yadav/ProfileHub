package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.PostLikeRequestDto;
import in.strikes.ProfileHubBackend.dto.PostLikeResponseDto;
import in.strikes.ProfileHubBackend.service.PostLikesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/likes")
public class PostLikeController {

    private PostLikesService postLikesService;
    public PostLikeController(PostLikesService postLikesService) {
        this.postLikesService = postLikesService;
    }
    @PostMapping("/{postId}")
    public ResponseEntity<Integer> makeLike(@PathVariable UUID postId) {
  return ResponseEntity.ok(postLikesService.postLikes(postId));
    }
    @GetMapping("/getCount/{postId}")
    public ResponseEntity<Integer>getLikeCount(@PathVariable UUID postId) {
        return ResponseEntity.ok(postLikesService.getPostLikes(postId));
    }
}
