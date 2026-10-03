package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.CommentResponseDto;
import in.strikes.ProfileHubBackend.dto.FeedResponseDto;
import in.strikes.ProfileHubBackend.entity.*;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class FeedMapper {

  private final PostRepository postRepository;
  private final UserRepository userRepository;
  private final CommentRepository commentRepository;
  private final ProfileRepository profileRepository;
  private final PostLikeRepository postLikeRepository;
  private final CommentMapper commentMapper;

  public User getCurrentUser() {
      SecurityContext securityContext = SecurityContextHolder.getContext();
      Authentication authentication = securityContext.getAuthentication();
      String subject=(String)authentication.getName();
      Optional<User> user=userRepository.findByProviderSubject(subject);
      if(!user.isPresent()) {
          user=userRepository.findByEmail(subject);
      }
      return user.orElseThrow(()->new ResourceNotFoundException("User not found"));
  }

    public List<FeedResponseDto> mapFeed(List<Post> postList) {
        List<FeedResponseDto> feedResponseDtoList=postList
                .stream()
                .map(post ->mapPost(post.getId()))
                .toList();
        return feedResponseDtoList;
    }

    public FeedResponseDto mapPost(UUID postId) {
        Post post=postRepository.findById(postId).orElseThrow(
                ()->new ResourceNotFoundException("post not found")
        );
        User postAuthor=post.getAuthor();
        Profile postProfile=profileRepository.findByUser(postAuthor)
                .orElseThrow(()->new ResourceNotFoundException("profile not found"));

        User loggedInUser=getCurrentUser();
        Boolean isLikedLoggedInUser=postLikeRepository.existsByPostAndUser(post,loggedInUser);
        int likeCount=(int)postLikeRepository.countByPost(post);

        List<Comment> currentPostComment=commentRepository.findAllByPost(post);
        List<CommentResponseDto> commentData=currentPostComment
                .stream()
                .map(currentPost->commentMapper.mapToCommentResponseDto(
                        currentPost,
                        profileRepository.findByUser(currentPost.getUser()).get().getProfilePicture()
                )).collect(Collectors.toList());
        int countComments=currentPostComment.size();


        FeedResponseDto responseDto=new FeedResponseDto(
                postId,
                post.getTitle(),
                post.getBody(),
                post.getMedia(),
                post.getFileType(),
                post.getCreatedAt(),
                postAuthor.getId(),
                postAuthor.getName(),
                postProfile.getProfilePicture(),
                likeCount,
                isLikedLoggedInUser,
                countComments,
                commentData,
                false
        );
        return responseDto;
    }
}
