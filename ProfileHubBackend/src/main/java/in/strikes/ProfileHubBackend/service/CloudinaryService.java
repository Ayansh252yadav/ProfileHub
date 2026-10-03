package in.strikes.ProfileHubBackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;
    public String uploadImage(MultipartFile file) throws IOException {

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "profilehub"
                )
        );

        return result.get("secure_url").toString();
    }
    public String uploadVideo(MultipartFile file) throws IOException {
        Map<String, Object> options = new HashMap<>();
        options.put("resource_type", "video");

        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                options
        );

        return result.get("secure_url").toString();
    }
}
