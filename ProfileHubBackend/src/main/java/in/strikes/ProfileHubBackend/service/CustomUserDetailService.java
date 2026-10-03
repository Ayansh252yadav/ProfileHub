package in.strikes.ProfileHubBackend.service;

import in.strikes.ProfileHubBackend.entity.AuthProvider;
import in.strikes.ProfileHubBackend.entity.CustomUserDetail;
import in.strikes.ProfileHubBackend.entity.User;
import in.strikes.ProfileHubBackend.exception.OAuthAccountConflictException;
import in.strikes.ProfileHubBackend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailService implements UserDetailsService {
    private UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(
            String identifier
    ) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(identifier)
                .orElseThrow(() -> new UsernameNotFoundException(identifier));
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new OAuthAccountConflictException(
                    "This email is registered with " + user.getProvider().name()
                            + ". Please continue with google " + user.getProvider().name() + " to sign in."
            );
        }
        return new CustomUserDetail(user);
    }
}
