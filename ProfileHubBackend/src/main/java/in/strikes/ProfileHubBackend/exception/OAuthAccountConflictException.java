package in.strikes.ProfileHubBackend.exception;

public class OAuthAccountConflictException extends RuntimeException {
    public OAuthAccountConflictException(String message) {
    super(message);
    }
}
