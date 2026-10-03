package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.dto.PostResponseDto;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends
        JpaRepository<Post, UUID> {

    List<Post> findByAuthor(User user);
    List<Post> findByAuthorOrderByCreatedAtDesc(User author);
    List<Post> findByOrderByCreatedAtDesc();
}
