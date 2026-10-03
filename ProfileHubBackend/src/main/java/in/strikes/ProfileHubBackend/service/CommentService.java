package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.decorators.CommentMapper;
import in.strikes.ProfileHubBackend.dto.CommentRequestDto;
import in.strikes.ProfileHubBackend.dto.CommentResponseDto;
import in.strikes.ProfileHubBackend.entity.Comment;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.Profile;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.CommentRepository;
import in.strikes.ProfileHubBackend.repository.PostRepository;
import in.strikes.ProfileHubBackend.repository.ProfileRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {
    private PostRepository postRepository;
    private CommentRepository commentRepository;
    private UserRepository userRepository;
    private CommentMapper commentMapper;
    private ProfileRepository profileRepository;
    public CommentService(PostRepository postRepository,
                          CommentRepository commentRepository,
                          UserRepository userRepository,
                          CommentMapper commentMapper,
                          ProfileRepository profileRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
        this.profileRepository = profileRepository;
    }
    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        String  subject = authentication.getName();
        Optional<User> user=userRepository.findByEmail(subject);
        if(user.isEmpty()){
           user= userRepository.findByProviderSubject(subject);
        }
        return user.orElseThrow(()->new ResourceNotFoundException("User not found"));
    }
    public String getProfile(){
        User user=getCurrentUser();
        Profile profile=profileRepository.findByUser(user)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));
        return profile.getProfilePicture();
    }
    public CommentResponseDto createComment(UUID postId,CommentRequestDto commentRequestDto){
      Post post=postRepository.findById(postId)
              .orElseThrow(()->new ResourceNotFoundException("Post not found"));
      User user=getCurrentUser();
      String profilePicture=getProfile();
        Comment comment=commentMapper.mapToComment(post,user,commentRequestDto);
        commentRepository.save(comment);
        return commentMapper.mapToCommentResponseDto(comment,profilePicture);
    }
    public List<CommentResponseDto> getComments(UUID postId){
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post not found"));
       List<CommentResponseDto> responseDtos=  commentRepository.findAllByPost(post)
               .stream()
               .map(comment -> commentMapper
                       .mapToCommentResponseDtoList(comment))
               .toList();
       if(responseDtos.isEmpty()){
           return new ArrayList<>();
       }
       return responseDtos;
    }
    public void deleteComment(UUID commentId){
        User owner=getCurrentUser();
       Comment comment=commentRepository.findById(commentId)
               .orElseThrow(()->new ResourceNotFoundException("Comment not found"));
       User requestUser=comment.getUser();
        if(owner.getId().equals(requestUser.getId())){
            commentRepository.deleteById(commentId);
        }else{
            throw  new RuntimeException("You are not allowed to delete this comment");
        }
    }
}
