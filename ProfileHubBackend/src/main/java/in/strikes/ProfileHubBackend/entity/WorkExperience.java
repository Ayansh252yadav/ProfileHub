package in.strikes.ProfileHubBackend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@Entity
public class WorkExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
   @Column(nullable = false)
    private String companyName;
   @Column(nullable = false)
    private String position;
   @Column(nullable = false)
    private String year;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;
}
