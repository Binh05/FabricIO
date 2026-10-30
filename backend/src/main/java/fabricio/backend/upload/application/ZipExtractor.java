package fabricio.backend.upload.application;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UncheckedIOException;
import java.net.URLConnection;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import fabricio.backend.shared.exceptions.AppException;
import fabricio.backend.shared.exceptions.ErrorCode;
import org.springframework.stereotype.Component;

import fabricio.backend.shared.storage.ObjectStorage;

/**
 * Giải nén zip từ storage rồi ghi lại từng file vào storage. Đọc theo luồng,
 * đếm byte THỰC khi giải nén (chống zip bomb), chặn zip slip, lỗi giữa chừng thì dọn.
 */
@Component
public class ZipExtractor {

    private static final int MAX_ENTRIES = 2_000;
    private static final long MAX_ENTRY_BYTES = 100L * 1024 * 1024;
    private static final long MAX_TOTAL_BYTES = 2 * 1024L * 1024 * 1024;

    public record Result(int files, long totalBytes) {}

    private final ObjectStorage storage;

    public ZipExtractor(ObjectStorage storage) {
        this.storage = storage;
    }

    public Result extract(String zipKey, String destPrefix) {
        List<String> written = new ArrayList<>();
        try (ZipInputStream zip = new ZipInputStream(storage.get(zipKey))) {
            int count = 0;
            long total = 0;
            ZipEntry entry;
            while ((entry = zip.getNextEntry()) != null) {
                if (entry.isDirectory()) continue;
                if (++count > MAX_ENTRIES) throw new AppException(ErrorCode.BAD_REQUEST);

                String relative = safeName(entry.getName());

                // S3 cần biết length trước khi PUT, nên đệm từng entry ra file tạm (có giới hạn).
                Path tmp = Files.createTempFile("zip-entry-", ".part");
                try {
                    long size = copyBounded(zip, tmp, MAX_ENTRY_BYTES);
                    total += size;
                    if (total > MAX_TOTAL_BYTES) throw new AppException(ErrorCode.BAD_REQUEST); // ("Zip too large when extracted");

                    String key = destPrefix + relative;
                    try (InputStream in = Files.newInputStream(tmp)) {
                        storage.put(key, in, size, contentTypeOf(relative));
                    }
                    written.add(key);
                } finally {
                    Files.deleteIfExists(tmp);
                }
            }
            return new Result(written.size(), total);
        } catch (RuntimeException e) {
            written.forEach(storage::delete);
            throw e;
        } catch (IOException e) {
            written.forEach(storage::delete);
            throw new UncheckedIOException(e);
        }
    }

    /** Zip slip: từ chối đường dẫn tuyệt đối, ổ đĩa, null byte và mọi đoạn "..". */
    static String safeName(String raw) {
        String n = raw.replace('\\', '/');
        if (n.startsWith("/") || n.contains("\0") || n.contains(":")) {
            throw new IllegalArgumentException("Illegal zip entry: " + raw);
        }
        for (String segment : n.split("/")) {
            if (segment.equals("..")) throw new IllegalArgumentException("Illegal zip entry: " + raw);
        }
        return n;
    }

    private static long copyBounded(InputStream in, Path target, long max) throws IOException {
        long n = 0;
        byte[] buf = new byte[8192];
        try (OutputStream out = Files.newOutputStream(target)) {
            int r;
            while ((r = in.read(buf)) != -1) {
                n += r;
                if (n > max) throw new AppException(ErrorCode.BAD_REQUEST); //("Zip entry too large");
                out.write(buf, 0, r);
            }
        }
        return n;
    }

    private static String contentTypeOf(String name) {
        String t = URLConnection.guessContentTypeFromName(name);
        return t != null ? t : "application/octet-stream";
    }
}