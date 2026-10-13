//package fabricio.backend.users.application;
//
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import fabricio.backend.shared.security.Role;
//
//@Component
//public class DatabaseSeeder implements CommandLineRunner {
//
//    private final PermissionRepository permissionRepository;
//    private final RolePermissionRepository rolePermissionRepository;
//
//    public DatabaseSeeder(PermissionRepository permissionRepository,
//                          RolePermissionRepository rolePermissionRepository) {
//        this.permissionRepository = permissionRepository;
//        this.rolePermissionRepository = rolePermissionRepository;
//    }
//
//    @Override
//    @Transactional
//    public void run(String... args) throws Exception {
//        // Seed Permissions
//        Permission readGame = getOrCreatePermission("READ_GAME", "Xem thông tin game");
//        Permission uploadGame = getOrCreatePermission("CREATE_GAME", "Đăng game mới");
//        Permission updateGame = getOrCreatePermission("UPDATE_GAME", "Sửa đổi thông tin game");
//        Permission deleteGame = getOrCreatePermission("DELETE_GAME", "Xóa game");
//
//        // Seed RolePermissions for Admin
//        seedRolePermission(Role.Admin, readGame);
//        seedRolePermission(Role.Admin, uploadGame);
//        seedRolePermission(Role.Admin, updateGame);
//        seedRolePermission(Role.Admin, deleteGame);
//
//        // Seed RolePermissions for User
//        seedRolePermission(Role.User, readGame);
//        seedRolePermission(Role.User, uploadGame);
//        seedRolePermission(Role.User, updateGame);
//    }
//
//    private Permission getOrCreatePermission(String name, String description) {
//        return permissionRepository.findByName(name)
//            .orElseGet(() -> permissionRepository.save(
//                Permission.builder()
//                    .name(name)
//                    .description(description)
//                    .build()
//            ));
//    }
//
//    private void seedRolePermission(Role role, Permission permission) {
//        RolePermission.RolePermissionId id = new RolePermission.RolePermissionId(role, permission.getId());
//        if (!rolePermissionRepository.existsById(id)) {
//            rolePermissionRepository.save(
//                RolePermission.builder()
//                    .role(role)
//                    .permissionId(permission.getId())
//                    .permission(permission)
//                    .build()
//            );
//        }
//    }
//}
