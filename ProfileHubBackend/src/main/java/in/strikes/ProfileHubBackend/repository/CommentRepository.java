package in.strikes.ProfileHubBackend.repository;

import in.strikes.ProfileHubBackend.entity.Comment;
import in.strikes.ProfileHubBackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {

    List<Comment>findAllByPost(Post post);

    long countAllByPost(Post post);
}
