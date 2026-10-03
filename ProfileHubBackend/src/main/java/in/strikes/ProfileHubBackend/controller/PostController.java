package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.PostRequestDto;
import in.strikes.ProfileHubBackend.dto.PostResponseDto;
import in.strikes.ProfileHubBackend.service.PostService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
public class PostController {

    private PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/createPost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponseDto> post(@ModelAttribute PostRequestDto postRequestDto) throws IOException {
      PostResponseDto response=postService.createPost(postRequestDto);
      return ResponseEntity.ok().body(response);
    }
    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable UUID id){
        postService.deletePost(id);
    }
    @GetMapping("/myPosts")
    public ResponseEntity<List<PostResponseDto>> getMyPosts(){
        return ResponseEntity.ok().body(postService.getMyPosts());
    }
    @GetMapping("/allPosts")
    public ResponseEntity<List<PostResponseDto>> getAllPosts(){
        return ResponseEntity.ok().body(postService.getAllPosts());
    }
    @GetMapping("/post/{userId}")
    public ResponseEntity<List<PostResponseDto>> getPostsByUserId(@PathVariable UUID userId){
        return ResponseEntity.ok(postService.getAllPostsByUser(userId));
    }
}
