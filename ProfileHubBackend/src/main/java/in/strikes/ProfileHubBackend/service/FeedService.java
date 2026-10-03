package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.decorators.FeedMapper;
import in.strikes.ProfileHubBackend.dto.FeedResponseDto;
import in.strikes.ProfileHubBackend.entity.Post;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.repository.PostLikeRepository;
import in.strikes.ProfileHubBackend.repository.PostRepository;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {

    private final PostRepository postRepository;
    private final FeedMapper feedMapper;

    public List<FeedResponseDto> getFeed() {
        List<Post>postList = postRepository.findAll();
      return feedMapper.mapFeed(postList);
    }
}
