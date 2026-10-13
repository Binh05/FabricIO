package fabricio.backend.shared.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

import static fabricio.backend.shared.security.Permission.*;

public enum Role {
    User(EnumSet.of(GAME_CREATE, GAME_DELETE_OWN, GAME_UPDATE_OWN)),
    Admin(EnumSet.allOf(Permission.class));

    private final Set<Permission> permissions;
    private final List<GrantedAuthority> authorities;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority("ROLE_" + name()));
        permissions.forEach(p -> list.add(new SimpleGrantedAuthority(p.name())));
        this.authorities = List.copyOf(list);
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }

    public List<GrantedAuthority> getAuthorities() {
        return authorities;
    }
}
