package fabricio.backend.games.application;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fabricio.backend.games.application.dtos.GameTagRequest;
import fabricio.backend.games.application.dtos.GameTagResponse;
import fabricio.backend.games.domain.GameTag;
import fabricio.backend.games.domain.GameTagRepository;
import fabricio.backend.games.domain.exception.GameErrorCode;
import fabricio.backend.games.domain.exception.GameException;

@ExtendWith(MockitoExtension.class)
class GameTagServiceTest {

    @Mock
    private GameTagRepository gameTagRepository;

    @InjectMocks
    private GameTagService gameTagService;

    private UUID tagId;
    private GameTag mockTag;

    @BeforeEach
    void setUp() {
        tagId = UUID.randomUUID();
        mockTag = GameTag.builder()
                .name("Action")
                .build();
        mockTag.setId(tagId);
    }

    // ==================== GET ALL TAGS ====================

    @Test
    @DisplayName("getAllTags: trả về danh sách tag response")
    void getAllTags_success() {
        when(gameTagRepository.findAll()).thenReturn(List.of(mockTag));

        List<GameTagResponse> tags = gameTagService.getAllTags();

        assertEquals(1, tags.size());
        assertEquals("Action", tags.get(0).getName());
        assertEquals(tagId, tags.get(0).getId());
    }

    // ==================== GET TAG BY ID ====================

    @Test
    @DisplayName("getTagById: thành công khi tìm thấy tag")
    void getTagById_success() {
        when(gameTagRepository.findById(tagId)).thenReturn(Optional.of(mockTag));

        GameTagResponse response = gameTagService.getTagById(tagId);

        assertNotNull(response);
        assertEquals(tagId, response.getId());
        assertEquals("Action", response.getName());
    }

    @Test
    @DisplayName("getTagById: ném TAG_NOT_FOUND khi không tìm thấy tag")
    void getTagById_notFound_throwsException() {
        when(gameTagRepository.findById(tagId)).thenReturn(Optional.empty());

        GameException ex = assertThrows(GameException.class, () -> gameTagService.getTagById(tagId));

        assertEquals(GameErrorCode.TAG_NOT_FOUND.name(), ex.getCode());
    }

    // ==================== CREATE TAG ====================

    @Test
    @DisplayName("createTag: tạo mới tag khi tên chưa tồn tại")
    void createTag_success() {
        GameTagRequest request = new GameTagRequest("RPG");
        when(gameTagRepository.existsByName("RPG")).thenReturn(false);
        when(gameTagRepository.save(any(GameTag.class))).thenAnswer(inv -> {
            GameTag tag = inv.getArgument(0);
            tag.setId(UUID.randomUUID());
            return tag;
        });

        GameTagResponse response = gameTagService.createTag(request);

        assertNotNull(response);
        assertEquals("RPG", response.getName());
        assertNotNull(response.getId());
    }

    @Test
    @DisplayName("createTag: ném TAG_NAME_EXISTED khi tên đã tồn tại")
    void createTag_duplicateName_throwsException() {
        GameTagRequest request = new GameTagRequest("Action");
        when(gameTagRepository.existsByName("Action")).thenReturn(true);

        GameException ex = assertThrows(GameException.class, () -> gameTagService.createTag(request));

        assertEquals(GameErrorCode.TAG_NAME_EXISTED.name(), ex.getCode());
        verify(gameTagRepository, never()).save(any());
    }

    // ==================== UPDATE TAG ====================

    @Test
    @DisplayName("updateTag: cập nhật tên tag khi tên mới hợp lệ")
    void updateTag_success() {
        GameTagRequest request = new GameTagRequest("Adventure");
        when(gameTagRepository.findById(tagId)).thenReturn(Optional.of(mockTag));
        when(gameTagRepository.existsByNameAndIdNot("Adventure", tagId)).thenReturn(false);
        when(gameTagRepository.save(mockTag)).thenReturn(mockTag);

        GameTagResponse response = gameTagService.updateTag(tagId, request);

        assertNotNull(response);
        assertEquals("Adventure", response.getName());
        assertEquals("Adventure", mockTag.getName());
    }

    @Test
    @DisplayName("updateTag: ném TAG_NOT_FOUND khi không tìm thấy tag")
    void updateTag_notFound_throwsException() {
        GameTagRequest request = new GameTagRequest("Adventure");
        when(gameTagRepository.findById(tagId)).thenReturn(Optional.empty());

        GameException ex = assertThrows(GameException.class, () -> gameTagService.updateTag(tagId, request));

        assertEquals(GameErrorCode.TAG_NOT_FOUND.name(), ex.getCode());
    }

    @Test
    @DisplayName("updateTag: ném TAG_NAME_EXISTED khi tên mới trùng với tag khác")
    void updateTag_duplicateName_throwsException() {
        GameTagRequest request = new GameTagRequest("ExistingTag");
        when(gameTagRepository.findById(tagId)).thenReturn(Optional.of(mockTag));
        when(gameTagRepository.existsByNameAndIdNot("ExistingTag", tagId)).thenReturn(true);

        GameException ex = assertThrows(GameException.class, () -> gameTagService.updateTag(tagId, request));

        assertEquals(GameErrorCode.TAG_NAME_EXISTED.name(), ex.getCode());
        verify(gameTagRepository, never()).save(any());
    }

    // ==================== DELETE TAG ====================

    @Test
    @DisplayName("deleteTag: xóa tag khi tồn tại")
    void deleteTag_success() {
        when(gameTagRepository.existsById(tagId)).thenReturn(true);

        gameTagService.deleteTag(tagId);

        verify(gameTagRepository).deleteById(tagId);
    }

    @Test
    @DisplayName("deleteTag: ném TAG_NOT_FOUND khi tag không tồn tại")
    void deleteTag_notFound_throwsException() {
        when(gameTagRepository.existsById(tagId)).thenReturn(false);

        GameException ex = assertThrows(GameException.class, () -> gameTagService.deleteTag(tagId));

        assertEquals(GameErrorCode.TAG_NOT_FOUND.name(), ex.getCode());
        verify(gameTagRepository, never()).deleteById(any());
    }
}
