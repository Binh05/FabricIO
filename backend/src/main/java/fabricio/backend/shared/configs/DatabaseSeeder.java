package fabricio.backend.shared.configs;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import fabricio.backend.modules.users.PermissionRepository;
import fabricio.backend.modules.users.RolePermissionRepository;
import fabricio.backend.modules.users.entities.Permission;
import fabricio.backend.modules.users.entities.RolePermission;
import fabricio.backend.shared.enums.UserRole;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RolePermissionRepository rolePermissionRepository;

    public DatabaseSeeder(PermissionRepository permissionRepository, 
                          RolePermissionRepository rolePermissionRepository) {
        this.permissionRepository = permissionRepository;
        this.rolePermissionRepository = rolePermissionRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Seed Permissions
        Permission readGame = getOrCreatePermission("READ_GAME", "Xem thông tin game");
        Permission createGame = getOrCreatePermission("CREATE_GAME", "Đăng game mới");
        Permission updateGame = getOrCreatePermission("UPDATE_GAME", "Sửa đổi thông tin game");
        Permission deleteGame = getOrCreatePermission("DELETE_GAME", "Xóa game");

        // Seed RolePermissions for Admin
        seedRolePermission(UserRole.Admin, readGame);
        seedRolePermission(UserRole.Admin, createGame);
        seedRolePermission(UserRole.Admin, updateGame);
        seedRolePermission(UserRole.Admin, deleteGame);

        // Seed RolePermissions for User
        seedRolePermission(UserRole.User, readGame);
        seedRolePermission(UserRole.User, createGame);
        seedRolePermission(UserRole.User, updateGame);
    }

    private Permission getOrCreatePermission(String name, String description) {
        return permissionRepository.findByName(name)
            .orElseGet(() -> permissionRepository.save(
                Permission.builder()
                    .name(name)
                    .description(description)
                    .build()
            ));
    }

    private void seedRolePermission(UserRole role, Permission permission) {
        RolePermission.RolePermissionId id = new RolePermission.RolePermissionId(role, permission.getId());
        if (!rolePermissionRepository.existsById(id)) {
            rolePermissionRepository.save(
                RolePermission.builder()
                    .role(role)
                    .permissionId(permission.getId())
                    .permission(permission)
                    .build()
            );
        }
    }
}
