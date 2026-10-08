# Protocolo

`linkcam-protocol.json` é a fonte única das constantes (tipos de mensagem, porta, versão). As implementações em Rust e Kotlin são **geradas** a partir dele. Swift entra na fase 6.

Documentação completa: `../docs/PROTOCOLO.md`.

## Arquivos

| Caminho | O que é |
|---|---|
| `linkcam-protocol.json` | Fonte da verdade. Edite aqui. |
| `generate.mjs` | Gerador (Node, sem dependências) |
| `rust/` | Crate `linkcam-protocol`, usado pelo desktop e pelo `tools/fake-phone` |
| `kotlin/dev/norte/linkcam/protocol/Protocol.kt` | Constantes para o app Android |

Os arquivos `rust/src/lib.rs` e `Protocol.kt` são gerados: **não edite à mão**.

## Mudou o JSON? Regenere

No PowerShell, na pasta `linkcam/`:

```
node protocol/generate.mjs
```

Para só conferir se os arquivos gerados estão em dia (sem alterar nada):

```
node protocol/generate.mjs --check
```

## Testar

```
cd protocol/rust
```
```
cargo test
```

## Como usar

**Rust** (no `Cargo.toml` de quem usa):

```toml
linkcam-protocol = { path = "../../protocol/rust" }
```

```rust
use linkcam_protocol::{MessageType, DEFAULT_PORT};
```

**Kotlin** (no `android/app/build.gradle.kts`, fase 1):

```kotlin
android { sourceSets["main"].java.srcDir("../../protocol/kotlin") }
```

```kotlin
import dev.norte.linkcam.protocol.MessageType
```
