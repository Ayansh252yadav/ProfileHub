package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.CommentRequestDto;
import in.strikes.ProfileHubBackend.dto.CommentResponseDto;
import in.strikes.ProfileHubBackend.entity.Comment;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.CommentRepository;
import in.strikes.ProfileHubBackend.repository.ProfileRepository;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
   private ProfileRepository profileRepository;
   public CommentMapper(
                        ProfileRepository profileRepository) {
       this.profileRepository = profileRepository;
   }
    public Comment mapToComment(Post post, User user, CommentRequestDto commentRequestDto){
        Comment comment=new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setComment(commentRequestDto.getComment());
        return comment;
    }
    public CommentResponseDto mapToCommentResponseDto(Comment comment,String profilePicture){
        CommentResponseDto commentResponseDto=new CommentResponseDto();
        commentResponseDto.setComment(comment.getComment());
        commentResponseDto.setPostId(comment.getPost().getId());
        commentResponseDto.setUserId(comment.getUser().getId());
        commentResponseDto.setUserName(comment.getUser().getName());
        commentResponseDto.setProfilePicture(profilePicture);
        commentResponseDto.setId(comment.getId());
        return commentResponseDto;
    }
    public CommentResponseDto mapToCommentResponseDtoList(Comment comment){
        User user=comment.getUser();
        Profile profile=profileRepository.findByUser(user).orElseThrow(()->new ResourceNotFoundException("User not found"));
        String profilePicture=profile.getProfilePicture();
        CommentResponseDto commentResponseDto=new CommentResponseDto();
        commentResponseDto.setComment(comment.getComment());
        commentResponseDto.setPostId(comment.getPost().getId());
        commentResponseDto.setUserId(comment.getUser().getId());
        commentResponseDto.setUserName(comment.getUser().getName());
        commentResponseDto.setProfilePicture(profilePicture);
        commentResponseDto.setId(comment.getId());
        return commentResponseDto;
    }
}
