package fabricio.backend.modules.purchases.entities;

import fabricio.backend.modules.games.entities.Game;
import fabricio.backend.modules.users.entities.User;
import fabricio.backend.shared.enums.StatusPurchase;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "game_purchases",
    indexes = {
        // Kiểm tra user đã mua game chưa
        @Index(name = "idx_game_purchases_buyer_game",    columnList = "buyer_id, game_id"),
        // Tra cứu giao dịch VNPay
        @Index(name = "idx_game_purchases_vnpay_txn_ref", columnList = "vnpay_txn_ref", unique = true)
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GamePurchaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @Column(name = "amount_paid", nullable = false, precision = 18, scale = 2)
    private BigDecimal amountPaid;

    // vnpay | momo | stripe | ...
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StatusPurchase status = StatusPurchase.Pending;

    // Mã giao dịch VNPay (unique để tránh double-process IPN)
    @Column(name = "vnpay_txn_ref", unique = true, length = 100)
    private String vnpayTxnRef;

    // Response code từ VNPay (00 = thành công)
    @Column(name = "vnpay_response_code", length = 10)
    private String vnpayResponseCode;

    @CreatedDate
    @Column(name = "purchased_at", nullable = false, updatable = false)
    private Instant purchasedAt;
}
