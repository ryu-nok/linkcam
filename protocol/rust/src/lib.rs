//! GERADO AUTOMATICAMENTE por protocol/generate.mjs a partir de protocol/linkcam-protocol.json.
//! Não edite à mão: altere o JSON e rode `node protocol/generate.mjs`.
//! Documentação completa: docs/PROTOCOLO.md

/// Versão do protocolo trocada no HELLO.
pub const PROTOCOL_VERSION: u32 = 1;
/// Porta TCP padrão (USB e Wi-Fi).
pub const DEFAULT_PORT: u16 = 47100;
/// Tipo de serviço anunciado por mDNS no Wi-Fi.
pub const MDNS_SERVICE_TYPE: &str = "_linkcam._tcp.local.";
/// Tamanho do cabeçalho de cada mensagem: type (1) + flags (1) + length (4).
pub const HEADER_SIZE: usize = 6;
/// Payload acima disso indica dado corrompido: encerrar a conexão.
pub const MAX_PAYLOAD_BYTES: u32 = 8388608;
/// Intervalo entre PINGs enviados pelo PC.
pub const PING_INTERVAL_MS: u64 = 1000;
/// Intervalo entre keyframes do encoder.
pub const KEYFRAME_INTERVAL_SEC: u32 = 2;

/// Tipo da mensagem (primeiro byte do cabeçalho).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum MessageType {
    Hello = 0x01,
    Caps = 0x02,
    Auth = 0x03,
    SetConfig = 0x10,
    SetZoom = 0x11,
    SetFocus = 0x12,
    SetExposure = 0x13,
    SwitchCamera = 0x14,
    SetTorch = 0x15,
    RequestKeyframe = 0x16,
    State = 0x20,
    Error = 0x21,
    Ping = 0x30,
    Pong = 0x31,
    VideoConfig = 0x40,
    VideoFrame = 0x41,
    AudioConfig = 0x50,
    AudioFrame = 0x51,
    Bye = 0xFF,
}

impl MessageType {
    /// Todos os tipos conhecidos.
    pub const ALL: [MessageType; 19] = [
        Self::Hello,
        Self::Caps,
        Self::Auth,
        Self::SetConfig,
        Self::SetZoom,
        Self::SetFocus,
        Self::SetExposure,
        Self::SwitchCamera,
        Self::SetTorch,
        Self::RequestKeyframe,
        Self::State,
        Self::Error,
        Self::Ping,
        Self::Pong,
        Self::VideoConfig,
        Self::VideoFrame,
        Self::AudioConfig,
        Self::AudioFrame,
        Self::Bye,
    ];

    /// Converte o byte do cabeçalho. `None` = tipo desconhecido (deve ser ignorado, não é erro).
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
            0x01 => Some(Self::Hello),
            0x02 => Some(Self::Caps),
            0x03 => Some(Self::Auth),
            0x10 => Some(Self::SetConfig),
            0x11 => Some(Self::SetZoom),
            0x12 => Some(Self::SetFocus),
            0x13 => Some(Self::SetExposure),
            0x14 => Some(Self::SwitchCamera),
            0x15 => Some(Self::SetTorch),
            0x16 => Some(Self::RequestKeyframe),
            0x20 => Some(Self::State),
            0x21 => Some(Self::Error),
            0x30 => Some(Self::Ping),
            0x31 => Some(Self::Pong),
            0x40 => Some(Self::VideoConfig),
            0x41 => Some(Self::VideoFrame),
            0x50 => Some(Self::AudioConfig),
            0x51 => Some(Self::AudioFrame),
            0xFF => Some(Self::Bye),
            _ => None,
        }
    }

    pub fn as_u8(self) -> u8 {
        self as u8
    }

    /// Nome como aparece em docs/PROTOCOLO.md (útil em logs).
    pub fn name(self) -> &'static str {
        match self {
            Self::Hello => "HELLO",
            Self::Caps => "CAPS",
            Self::Auth => "AUTH",
            Self::SetConfig => "SET_CONFIG",
            Self::SetZoom => "SET_ZOOM",
            Self::SetFocus => "SET_FOCUS",
            Self::SetExposure => "SET_EXPOSURE",
            Self::SwitchCamera => "SWITCH_CAMERA",
            Self::SetTorch => "SET_TORCH",
            Self::RequestKeyframe => "REQUEST_KEYFRAME",
            Self::State => "STATE",
            Self::Error => "ERROR",
            Self::Ping => "PING",
            Self::Pong => "PONG",
            Self::VideoConfig => "VIDEO_CONFIG",
            Self::VideoFrame => "VIDEO_FRAME",
            Self::AudioConfig => "AUDIO_CONFIG",
            Self::AudioFrame => "AUDIO_FRAME",
            Self::Bye => "BYE",
        }
    }
}

/// Bits do byte `flags` do cabeçalho.
pub mod flags {
    pub const KEYFRAME: u8 = 0x01;
}

/// Códigos de codec usados no VIDEO_CONFIG.
pub mod codec {
    pub const H264: u8 = 1;
}

/// Valores do campo `code` da mensagem ERROR.
pub mod error_code {
    pub const VERSION_MISMATCH: &str = "version_mismatch";
    pub const NOT_AUTHORIZED: &str = "not_authorized";
    pub const CAMERA_BUSY: &str = "camera_busy";
    pub const UNSUPPORTED_CONFIG: &str = "unsupported_config";
    pub const ENCODER_FAILED: &str = "encoder_failed";
    pub const INTERNAL: &str = "internal";

    pub const ALL: [&str; 6] = [VERSION_MISMATCH, NOT_AUTHORIZED, CAMERA_BUSY, UNSUPPORTED_CONFIG, ENCODER_FAILED, INTERNAL];
}

/// Bitrate sugerido por resolução e FPS.
pub mod bitrate {
    pub const BITRATE_720P30_KBPS: u32 = 4000;
    pub const BITRATE_720P60_KBPS: u32 = 6000;
    pub const BITRATE_1080P30_KBPS: u32 = 8000;
    pub const BITRATE_1080P60_KBPS: u32 = 12000;
}

/// Faixas de latência: (limite em ms, exclusivo; rótulo na UI). `None` = sem limite.
pub const LATENCY_QUALITY: [(Option<u32>, &str); 4] = [
    (Some(50), "Excelente"),
    (Some(120), "Boa"),
    (Some(250), "Instável"),
    (None, "Ruim"),
];

/// Rótulo de qualidade para uma latência em ms (ex: 24 -> "Excelente").
pub fn latency_label(latency_ms: u32) -> &'static str {
    for (max_ms, label) in LATENCY_QUALITY {
        match max_ms {
            Some(max) if latency_ms < max => return label,
            Some(_) => continue,
            None => return label,
        }
    }
    unreachable!("a última faixa de LATENCY_QUALITY não tem limite")
}
