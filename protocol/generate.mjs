// Gera as constantes do protocolo em Rust e Kotlin a partir de linkcam-protocol.json.
//
// Uso (na pasta linkcam/):
//   node protocol/generate.mjs           -> escreve os arquivos gerados
//   node protocol/generate.mjs --check   -> só confere se estão atualizados (erro se não estiverem)
//
// Não edite os arquivos gerados à mão: mude o JSON e rode este script.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const spec = JSON.parse(readFileSync(join(here, "linkcam-protocol.json"), "utf8"));

const RUST_OUT = join(here, "rust", "src", "lib.rs");
const KOTLIN_OUT = join(here, "kotlin", "dev", "norte", "linkcam", "protocol", "Protocol.kt");

const HEADER_NOTE =
  "GERADO AUTOMATICAMENTE por protocol/generate.mjs a partir de protocol/linkcam-protocol.json.\n" +
  "Não edite à mão: altere o JSON e rode `node protocol/generate.mjs`.\n" +
  "Documentação completa: docs/PROTOCOLO.md";

// ---------- utilidades ----------

// "SET_CONFIG" -> "SetConfig"
const pascal = (upper) =>
  upper.toLowerCase().split("_").map((p) => p[0].toUpperCase() + p.slice(1)).join("");

// "version_mismatch" -> "VERSION_MISMATCH"; "720p30" -> "720P30"
const screaming = (s) => s.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

const hex2 = (n) => "0x" + n.toString(16).toUpperCase().padStart(2, "0");

const messageTypes = Object.entries(spec.messageTypes); // [["HELLO", 1], ...]

// Confere o JSON antes de gerar qualquer coisa
function validate() {
  const seen = new Map();
  for (const [name, code] of messageTypes) {
    if (!Number.isInteger(code) || code < 0 || code > 255) {
      throw new Error(`messageTypes.${name} = ${code}: precisa caber em 1 byte (0 a 255)`);
    }
    if (seen.has(code)) {
      throw new Error(`messageTypes.${name} e ${seen.get(code)} usam o mesmo número ${code}`);
    }
    seen.set(code, name);
  }
  const last = spec.latencyQuality[spec.latencyQuality.length - 1];
  if (last.maxMs !== null) {
    throw new Error("latencyQuality: o último item precisa ter maxMs = null (faixa sem limite)");
  }
}

// ---------- Rust ----------

function rust() {
  const doc = HEADER_NOTE.split("\n").map((l) => `//! ${l}`).join("\n");
  const variants = messageTypes.map(([n, c]) => `    ${pascal(n)} = ${hex2(c)},`).join("\n");
  const fromArms = messageTypes.map(([n, c]) => `            ${hex2(c)} => Some(Self::${pascal(n)}),`).join("\n");
  const nameArms = messageTypes.map(([n]) => `            Self::${pascal(n)} => "${n}",`).join("\n");
  const all = messageTypes.map(([n]) => `        Self::${pascal(n)},`).join("\n");
  const flags = Object.entries(spec.flags).map(([n, v]) => `    pub const ${screaming(n)}: u8 = ${hex2(v)};`).join("\n");
  const codecs = Object.entries(spec.codecs).map(([n, v]) => `    pub const ${screaming(n)}: u8 = ${v};`).join("\n");
  const errors = spec.errorCodes.map((e) => `    pub const ${screaming(e)}: &str = "${e}";`).join("\n");
  const errorsAll = spec.errorCodes.map((e) => screaming(e)).join(", ");
  const bitrates = Object.entries(spec.bitratePresetsKbps)
    .map(([k, v]) => `    pub const BITRATE_${screaming(k)}_KBPS: u32 = ${v};`).join("\n");
  const latency = spec.latencyQuality
    .map((q) => `    (${q.maxMs === null ? "None" : `Some(${q.maxMs})`}, "${q.label}"),`).join("\n");

  return `${doc}

/// Versão do protocolo trocada no HELLO.
pub const PROTOCOL_VERSION: u32 = ${spec.protocolVersion};
/// Porta TCP padrão (USB e Wi-Fi).
pub const DEFAULT_PORT: u16 = ${spec.defaultPort};
/// Tipo de serviço anunciado por mDNS no Wi-Fi.
pub const MDNS_SERVICE_TYPE: &str = "${spec.mdnsServiceType}";
/// Tamanho do cabeçalho de cada mensagem: type (1) + flags (1) + length (4).
pub const HEADER_SIZE: usize = ${spec.headerSize};
/// Payload acima disso indica dado corrompido: encerrar a conexão.
pub const MAX_PAYLOAD_BYTES: u32 = ${spec.maxPayloadBytes};
/// Intervalo entre PINGs enviados pelo PC.
pub const PING_INTERVAL_MS: u64 = ${spec.pingIntervalMs};
/// Intervalo entre keyframes do encoder.
pub const KEYFRAME_INTERVAL_SEC: u32 = ${spec.keyframeIntervalSec};

/// Tipo da mensagem (primeiro byte do cabeçalho).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum MessageType {
${variants}
}

impl MessageType {
    /// Todos os tipos conhecidos.
    pub const ALL: [MessageType; ${messageTypes.length}] = [
${all}
    ];

    /// Converte o byte do cabeçalho. \`None\` = tipo desconhecido (deve ser ignorado, não é erro).
    pub fn from_u8(value: u8) -> Option<Self> {
        match value {
${fromArms}
            _ => None,
        }
    }

    pub fn as_u8(self) -> u8 {
        self as u8
    }

    /// Nome como aparece em docs/PROTOCOLO.md (útil em logs).
    pub fn name(self) -> &'static str {
        match self {
${nameArms}
        }
    }
}

/// Bits do byte \`flags\` do cabeçalho.
pub mod flags {
${flags}
}

/// Códigos de codec usados no VIDEO_CONFIG.
pub mod codec {
${codecs}
}

/// Valores do campo \`code\` da mensagem ERROR.
pub mod error_code {
${errors}

    pub const ALL: [&str; ${spec.errorCodes.length}] = [${errorsAll}];
}

/// Bitrate sugerido por resolução e FPS.
pub mod bitrate {
${bitrates}
}

/// Faixas de latência: (limite em ms, exclusivo; rótulo na UI). \`None\` = sem limite.
pub const LATENCY_QUALITY: [(Option<u32>, &str); ${spec.latencyQuality.length}] = [
${latency}
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
`;
}

// ---------- Kotlin ----------

function kotlin() {
  const doc = HEADER_NOTE.split("\n").map((l) => ` * ${l}`).join("\n");
  const variants = messageTypes.map(([n, c]) => `    ${n}(${hex2(c)}),`).join("\n").replace(/,$/, ";");
  const flags = Object.entries(spec.flags).map(([n, v]) => `    const val ${screaming(n)}: Int = ${hex2(v)}`).join("\n");
  const codecs = Object.entries(spec.codecs).map(([n, v]) => `    const val ${screaming(n)}: Int = ${v}`).join("\n");
  const errors = spec.errorCodes.map((e) => `    const val ${screaming(e)}: String = "${e}"`).join("\n");
  const errorsAll = spec.errorCodes.map((e) => screaming(e)).join(", ");
  const bitrates = Object.entries(spec.bitratePresetsKbps)
    .map(([k, v]) => `    const val BITRATE_${screaming(k)}_KBPS: Int = ${v}`).join("\n");
  const latency = spec.latencyQuality
    .map((q) => `        ${q.maxMs === null ? "null" : q.maxMs} to "${q.label}",`).join("\n");

  return `/*
${doc}
 */
package dev.norte.linkcam.protocol

object Protocol {
    /** Versão do protocolo trocada no HELLO. */
    const val VERSION: Int = ${spec.protocolVersion}
    /** Porta TCP padrão (USB e Wi-Fi). */
    const val DEFAULT_PORT: Int = ${spec.defaultPort}
    /** Tipo de serviço anunciado por mDNS no Wi-Fi. */
    const val MDNS_SERVICE_TYPE: String = "${spec.mdnsServiceType}"
    /** Tamanho do cabeçalho de cada mensagem: type (1) + flags (1) + length (4). */
    const val HEADER_SIZE: Int = ${spec.headerSize}
    /** Payload acima disso indica dado corrompido: encerrar a conexão. */
    const val MAX_PAYLOAD_BYTES: Int = ${spec.maxPayloadBytes}
    /** Intervalo entre PINGs enviados pelo PC. */
    const val PING_INTERVAL_MS: Long = ${spec.pingIntervalMs}L
    /** Intervalo entre keyframes do encoder. */
    const val KEYFRAME_INTERVAL_SEC: Int = ${spec.keyframeIntervalSec}
}

/** Tipo da mensagem (primeiro byte do cabeçalho). */
enum class MessageType(val code: Int) {
${variants}

    companion object {
        private val byCode = entries.associateBy { it.code }

        /** Converte o byte do cabeçalho. null = tipo desconhecido (deve ser ignorado, não é erro). */
        fun fromCode(code: Int): MessageType? = byCode[code and 0xFF]
    }
}

/** Bits do byte flags do cabeçalho. */
object Flags {
${flags}
}

/** Códigos de codec usados no VIDEO_CONFIG. */
object Codec {
${codecs}
}

/** Valores do campo code da mensagem ERROR. */
object ErrorCode {
${errors}

    val ALL: List<String> = listOf(${errorsAll})
}

/** Bitrate sugerido por resolução e FPS. */
object Bitrate {
${bitrates}
}

object LatencyQuality {
    /** Faixas: (limite em ms, exclusivo; rótulo na UI). null = sem limite. */
    val RANGES: List<Pair<Int?, String>> = listOf(
${latency}
    )

    /** Rótulo de qualidade para uma latência em ms (ex: 24 -> "Excelente"). */
    fun label(latencyMs: Int): String =
        RANGES.first { (maxMs, _) -> maxMs == null || latencyMs < maxMs }.second
}
`;
}

// ---------- escrita / conferência ----------

validate();

const outputs = [
  [RUST_OUT, rust()],
  [KOTLIN_OUT, kotlin()],
];

const check = process.argv.includes("--check");
let outdated = 0;

for (const [path, content] of outputs) {
  const rel = path.slice(here.length + 1).replaceAll("\\", "/");
  if (check) {
    const current = existsSync(path) ? readFileSync(path, "utf8").replaceAll("\r\n", "\n") : null;
    if (current !== content) {
      console.error(`DESATUALIZADO: protocol/${rel}`);
      outdated++;
    } else {
      console.log(`ok: protocol/${rel}`);
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
    console.log(`gerado: protocol/${rel}`);
  }
}

if (outdated > 0) {
  console.error("Rode `node protocol/generate.mjs` para atualizar.");
  process.exit(1);
}
