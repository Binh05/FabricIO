package fabricio.backend.modules.users.dtos;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String bio;
}
