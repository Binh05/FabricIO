package fabricio.backend.modules.games;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class GameControllerIT {
    @Autowired
    private MockMvc mockMvc;

    @Test
    void getGames_shouldReturn200() throws Exception {

        mockMvc.perform(
            get("/api/v1/games")
        )
        .andExpect(status().isOk());
    }
}
