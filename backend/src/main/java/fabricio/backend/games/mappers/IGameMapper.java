package fabricio.backend.games.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import fabricio.backend.games.dtos.GameRequest;
import fabricio.backend.games.entities.Game;

@Mapper(componentModel = "spring")
public interface IGameMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "gameUrl", ignore = true)
    @Mapping(target = "thumbnailUrl", ignore = true)
    @Mapping(target = "ownerId", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    Game toEntity(GameRequest entity);
}
