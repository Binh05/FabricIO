package fabricio.backend.users;

public record CreateUserCommand(
        String username,
        String email,
        String fullName,
        String passwordHash) {
}