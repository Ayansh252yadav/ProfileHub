package in.strikes.ProfileHubBackend.decorators;

import in.strikes.ProfileHubBackend.dto.PostRequestDto;
import in.strikes.ProfileHubBackend.dto.PostResponseDto;
import in.strikes.ProfileHubBackend.entity.MediaType;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.repository.PostRepository;
import in.strikes.ProfileHubBackend.service.CloudinaryService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class PostMapper {
    private CloudinaryService cloudinaryService;
    public PostMapper(
                      CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    public Post mapToPostEntity(PostRequestDto postRequestDto, User user) throws IOException {
        Post post = new Post();
        post.setAuthor(user);
        post.setTitle(postRequestDto.getTitle());
        MultipartFile media = postRequestDto.getMedia();

        if (media != null && !media.isEmpty()) {
            String contentType = media.getContentType();
            if (contentType != null && contentType.startsWith("image/")) {
                String imageUrl=cloudinaryService.uploadImage(media);
                post.setMedia(imageUrl);
                post.setFileType(MediaType.IMAGE);
            } else if (contentType != null && contentType.startsWith("video/")) {
                String videoUrl=cloudinaryService.uploadVideo(media);
                post.setMedia(videoUrl);
                post.setFileType(MediaType.VIDEO);
            } else {
                System.out.println("Unsupported media type");
            }
        }
        post.setBody(postRequestDto.getBody());
        post.setCreatedAt(LocalDateTime.now());
        return post;
    }


    public PostResponseDto  mapToPostResponseDto(Post post) {
        PostResponseDto postResponseDto = new PostResponseDto();
        postResponseDto.setId(post.getId());
        postResponseDto.setTitle(post.getTitle());
        postResponseDto.setMedia(post.getMedia());
        postResponseDto.setBody(post.getBody());
        postResponseDto.setUser(post.getAuthor());
        postResponseDto.setMediaType(post.getFileType());
        postResponseDto.setCreatedOn(post.getCreatedAt());
        postResponseDto.setUpdatedOn(post.getUpdatedAt());
        return postResponseDto;
    }
}
