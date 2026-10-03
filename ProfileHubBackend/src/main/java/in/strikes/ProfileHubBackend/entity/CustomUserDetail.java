package in.strikes.ProfileHubBackend.entity;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class CustomUserDetail implements UserDetails {
    User user;
  public CustomUserDetail(User user) {
      this.user = user;
  }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    @Override
    public @Nullable String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }
    @Override
    public boolean isEnabled(){
    return user.isEnabled();
    }
    public UUID getId() {
        return user.getId();
    }
    public String getName() {
        return user.getName();
    }

}
