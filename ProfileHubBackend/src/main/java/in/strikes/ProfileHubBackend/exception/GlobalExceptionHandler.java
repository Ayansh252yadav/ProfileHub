package in.strikes.ProfileHubBackend.exception;

import in.strikes.ProfileHubBackend.dto.ExceptionResponseDto;
import in.strikes.ProfileHubBackend.dto.ValidationExceptionResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ValidationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto>
    usernameNotFoundException(
            UsernameNotFoundException exception,
            HttpServletRequest request
    ) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                request.getRequestURI(),
                HttpStatus.UNAUTHORIZED.getReasonPhrase()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseDto);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponseDto>
    resourceNotFoundException(
            ResourceNotFoundException exception,
            HttpServletRequest request) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                request.getRequestURI(),
                HttpStatus.NO_CONTENT.getReasonPhrase()
        );
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(responseDto);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ExceptionResponseDto>
    validationException(ValidationException exception, HttpServletRequest request) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI(),
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(responseDto);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationExceptionResponseDto>
    methodArgumentNotValidException(
            MethodArgumentNotValidException exception,
            HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach((fieldError) -> {
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage());
                });
        ValidationExceptionResponseDto responseDto =
                new ValidationExceptionResponseDto(
                "Validation error",
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI(),
                HttpStatus.BAD_GATEWAY.getReasonPhrase(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseDto);
    }
    @ExceptionHandler(OAuthAccountConflictException.class)
    public ResponseEntity<ExceptionResponseDto>
    oAuthAccountConflictException(OAuthAccountConflictException exception, HttpServletRequest request) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                request.getRequestURI(),
                HttpStatus.BAD_REQUEST.getReasonPhrase()
        );
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(responseDto);
    }
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ExceptionResponseDto> ioException(IOException exception, HttpServletRequest request) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                request.getRequestURI(),
                HttpStatus.NO_CONTENT.getReasonPhrase()
        );
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(responseDto);
    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionResponseDto>
    runtimeException(RuntimeException exception, HttpServletRequest request) {
        ExceptionResponseDto responseDto = new ExceptionResponseDto(
                LocalDateTime.now(),
                exception.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                request.getRequestURI(),
                HttpStatus.NO_CONTENT.getReasonPhrase()
        );
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(responseDto);
    }
}
