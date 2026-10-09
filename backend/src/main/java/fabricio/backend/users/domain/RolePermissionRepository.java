package fabricio.backend.users.domain;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import fabricio.backend.users.domain.RolePermission.RolePermissionId;
import fabricio.backend.shared.enums.UserRole;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, RolePermissionId> {
    List<RolePermission> findByRole(UserRole role);
}
