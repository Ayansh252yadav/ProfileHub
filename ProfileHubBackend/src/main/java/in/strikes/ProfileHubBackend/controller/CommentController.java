package in.strikes.ProfileHubBackend.controller;

import in.strikes.ProfileHubBackend.dto.CommentRequestDto;
import in.strikes.ProfileHubBackend.dto.CommentResponseDto;
import in.strikes.ProfileHubBackend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private CommentService commentService;
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
    @PostMapping("/create/{id}")
    public ResponseEntity<CommentResponseDto> createComment(
            @PathVariable UUID id, @RequestBody CommentRequestDto commentRequestDto){
      CommentResponseDto responseDto=commentService.createComment(id,commentRequestDto);
      return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }
    @GetMapping("/{id}")
    public ResponseEntity<List<CommentResponseDto>> getComment(@PathVariable UUID id){
        List<CommentResponseDto> responseDto=commentService.getComments(id);
     return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable UUID id){
        commentService.deleteComment(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
