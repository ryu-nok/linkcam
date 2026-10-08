/*
 * GERADO AUTOMATICAMENTE por protocol/generate.mjs a partir de protocol/linkcam-protocol.json.
 * Não edite à mão: altere o JSON e rode `node protocol/generate.mjs`.
 * Documentação completa: docs/PROTOCOLO.md
 */
package dev.norte.linkcam.protocol

object Protocol {
    /** Versão do protocolo trocada no HELLO. */
    const val VERSION: Int = 1
    /** Porta TCP padrão (USB e Wi-Fi). */
    const val DEFAULT_PORT: Int = 47100
    /** Tipo de serviço anunciado por mDNS no Wi-Fi. */
    const val MDNS_SERVICE_TYPE: String = "_linkcam._tcp.local."
    /** Tamanho do cabeçalho de cada mensagem: type (1) + flags (1) + length (4). */
    const val HEADER_SIZE: Int = 6
    /** Payload acima disso indica dado corrompido: encerrar a conexão. */
    const val MAX_PAYLOAD_BYTES: Int = 8388608
    /** Intervalo entre PINGs enviados pelo PC. */
    const val PING_INTERVAL_MS: Long = 1000L
    /** Intervalo entre keyframes do encoder. */
    const val KEYFRAME_INTERVAL_SEC: Int = 2
}

/** Tipo da mensagem (primeiro byte do cabeçalho). */
enum class MessageType(val code: Int) {
    HELLO(0x01),
    CAPS(0x02),
    AUTH(0x03),
    SET_CONFIG(0x10),
    SET_ZOOM(0x11),
    SET_FOCUS(0x12),
    SET_EXPOSURE(0x13),
    SWITCH_CAMERA(0x14),
    SET_TORCH(0x15),
    REQUEST_KEYFRAME(0x16),
    STATE(0x20),
    ERROR(0x21),
    PING(0x30),
    PONG(0x31),
    VIDEO_CONFIG(0x40),
    VIDEO_FRAME(0x41),
    AUDIO_CONFIG(0x50),
    AUDIO_FRAME(0x51),
    BYE(0xFF);

    companion object {
        private val byCode = entries.associateBy { it.code }

        /** Converte o byte do cabeçalho. null = tipo desconhecido (deve ser ignorado, não é erro). */
        fun fromCode(code: Int): MessageType? = byCode[code and 0xFF]
    }
}

/** Bits do byte flags do cabeçalho. */
object Flags {
    const val KEYFRAME: Int = 0x01
}

/** Códigos de codec usados no VIDEO_CONFIG. */
object Codec {
    const val H264: Int = 1
}

/** Valores do campo code da mensagem ERROR. */
object ErrorCode {
    const val VERSION_MISMATCH: String = "version_mismatch"
    const val NOT_AUTHORIZED: String = "not_authorized"
    const val CAMERA_BUSY: String = "camera_busy"
    const val UNSUPPORTED_CONFIG: String = "unsupported_config"
    const val ENCODER_FAILED: String = "encoder_failed"
    const val INTERNAL: String = "internal"

    val ALL: List<String> = listOf(VERSION_MISMATCH, NOT_AUTHORIZED, CAMERA_BUSY, UNSUPPORTED_CONFIG, ENCODER_FAILED, INTERNAL)
}

/** Bitrate sugerido por resolução e FPS. */
object Bitrate {
    const val BITRATE_720P30_KBPS: Int = 4000
    const val BITRATE_720P60_KBPS: Int = 6000
    const val BITRATE_1080P30_KBPS: Int = 8000
    const val BITRATE_1080P60_KBPS: Int = 12000
}

object LatencyQuality {
    /** Faixas: (limite em ms, exclusivo; rótulo na UI). null = sem limite. */
    val RANGES: List<Pair<Int?, String>> = listOf(
        50 to "Excelente",
        120 to "Boa",
        250 to "Instável",
        null to "Ruim",
    )

    /** Rótulo de qualidade para uma latência em ms (ex: 24 -> "Excelente"). */
    fun label(latencyMs: Int): String =
        RANGES.first { (maxMs, _) -> maxMs == null || latencyMs < maxMs }.second
}
