package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.PostLikes;
import in.strikes.ProfileHubBackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostLikeRepository  extends JpaRepository<PostLikes, UUID> {

    long countByPost(Post post);

    boolean existsByPostAndUser(Post post, User user);

    boolean existsByUser(User user);
}
