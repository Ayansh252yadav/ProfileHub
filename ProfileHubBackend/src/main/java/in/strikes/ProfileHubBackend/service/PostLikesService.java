package in.strikes.ProfileHubBackend.service;

import com.sun.jdi.request.DuplicateRequestException;
import in.strikes.ProfileHubBackend.dto.PostLikeRequestDto;
import in.strikes.ProfileHubBackend.dto.PostRequestDto;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.PostLikes;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.PostLikeRepository;
import in.strikes.ProfileHubBackend.repository.PostRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class PostLikesService {

    private PostLikeRepository postLikeRepository;
    private UserRepository userRepository;
    private PostRepository postRepository;
    public PostLikesService(PostLikeRepository postLikeRepository,
                            UserRepository userRepository, PostRepository postRepository) {
        this.postLikeRepository = postLikeRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }
    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
       String subject=authentication.getName();
       Optional<User> user=userRepository.findByEmail(subject);
       if(!user.isPresent()){
           user=userRepository.findByProviderSubject(subject);
       }
       return user.orElseThrow(()->new ResourceNotFoundException("user Not found"));
    }
    public int postLikes(UUID postId) {
        Post likedPost=postRepository.findById(postId)
                .orElseThrow(()->new ResourceNotFoundException("Post Not Found"));
        User user=getCurrentUser();
        boolean isAlreadyLiked=postLikeRepository.existsByPostAndUser(likedPost,user);
        if(isAlreadyLiked){
            throw new DuplicateRequestException("post already liked");
        }
        PostLikes postLikes=new PostLikes();
        postLikes.setPost(likedPost);
        postLikes.setUser(user);
        postLikeRepository.save(postLikes);
        int count=(int)postLikeRepository.countByPost(likedPost);
        return count;
    }
    public int getPostLikes(UUID postId) {
        Post post=postRepository.findById(postId).orElseThrow(()->new ResourceNotFoundException("Post Not Found"));
      long count=postLikeRepository.countByPost(post);
      return (int)count;
    }
}
