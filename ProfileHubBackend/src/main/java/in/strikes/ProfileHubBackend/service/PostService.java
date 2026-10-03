package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.decorators.PostMapper;
import in.strikes.ProfileHubBackend.dto.PostRequestDto;
import in.strikes.ProfileHubBackend.dto.PostResponseDto;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.ResourceNotFoundException;
import in.strikes.ProfileHubBackend.repository.PostRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {
    private PostRepository postRepository;
    private UserRepository userRepository;
    private PostMapper postMapper;
    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       PostMapper postMapper) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.postMapper = postMapper;
    }
    private User getCurrUser(){
        Authentication authentication = SecurityContextHolder
                .getContext().getAuthentication();
        String subject = authentication.getName();
        Optional<User> existingUser = userRepository.findByEmail(subject);
        if(existingUser.isEmpty()){
            existingUser=userRepository.findByProviderSubject(subject);
        }
        return existingUser.orElseThrow(
                ()->new  ResourceNotFoundException("user not exist")
        );
    }
    public PostResponseDto createPost(PostRequestDto postRequestDto) throws IOException {
       User user = getCurrUser();
      Post post=postMapper.mapToPostEntity(postRequestDto,user);
      postRepository.save(post);
      return postMapper.mapToPostResponseDto(post);
    }
    public  void deletePost(UUID id) {
        Post post = postRepository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("resource not found")
        );
        User user=getCurrUser();
        if(post.getAuthor().equals(user)){
            postRepository.delete(post);
        }
    }
    public List<PostResponseDto> getMyPosts(){
        User user = getCurrUser();
        List<PostResponseDto> responseDtos=postRepository.findByAuthorOrderByCreatedAtDesc(user)
                .stream()
                .map(post -> postMapper.mapToPostResponseDto(post))
                .toList();
        return responseDtos;
    }
    public List<PostResponseDto> getAllPosts() {
       List<PostResponseDto>response= postRepository.findByOrderByCreatedAtDesc()
                .stream()
               .map(post -> postMapper
                        .mapToPostResponseDto(post))
               .toList();
       return response;
    }
    public List<PostResponseDto> getAllPostsByUser(UUID userId) {
        User user=userRepository.findById(userId).orElseThrow(
                ()->new ResourceNotFoundException("user not exist")
        );
        List<Post> post=postRepository.findByAuthor(user);
        List<PostResponseDto>response=post
                .stream()
                .map(postMapper::mapToPostResponseDto)
                .toList();
        return response;
    }
}
