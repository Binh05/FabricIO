package fabricio.backend.games.web;

import java.text.Normalizer;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import fabricio.backend.games.application.GameService;
import fabricio.backend.games.domain.GameRepository.GameSitemapProjection;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SitemapController {

    private final GameService gameService;

    public SitemapController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String getSitemap() {
        List<GameSitemapProjection> games = gameService.getReadyGamesForSitemap();
        StringBuilder xml = new StringBuilder(
            "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
            "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
        );

        for (GameSitemapProjection game : games) {
            String slug = slugify(game.getTitle());
            UUID id = game.getId();
            Instant updatedAt = game.getUpdatedAt();

            xml.append("<url>")
                .append("<loc>")
                .append("https://fabricio.id.vn/games/")
                .append(slug)
                .append("~")
                .append(id)
                .append("</loc>");

            if (updatedAt != null) {
                xml.append("<lastmod>")
                    .append(DateTimeFormatter.ISO_INSTANT.format(updatedAt))
                    .append("</lastmod>");
            }

            xml.append("</url>");
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    private String slugify(String title) {
        if (title == null || title.isBlank()) {
            return "game";
        }

        String normalized = Normalizer.normalize(title, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .replace('đ', 'd')
            .replace('Đ', 'D')
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-+|-+$", "");

        if (normalized.isBlank()) {
            return "game";
        }

        if (normalized.length() > 80) {
            normalized = normalized.substring(0, 80).replaceAll("-+$", "");
        }

        return normalized;
    }
}
