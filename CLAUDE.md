# LinkCam — instruções para o Claude Code

Leia este arquivo inteiro antes de qualquer tarefa. Ele é a fonte de verdade sobre o projeto.

## O que é o LinkCam

App que transforma o celular (Android, depois iPhone) em webcam para o PC, via USB ou Wi-Fi, com foco em criadores de conteúdo: compatível com OBS desde o primeiro dia, controle da câmera do celular pelo PC (zoom, foco, exposição) e baixa latência.

São três programas que conversam entre si:

1. **App do celular** (`android/`, depois `ios/`): captura a câmera, comprime em H.264 e envia ao PC. Recebe comandos de ajuste do PC.
2. **App do PC** (`desktop/`): recebe o vídeo, decodifica, mostra a prévia, expõe uma webcam virtual e manda os ajustes para o celular.
3. **Plugin do OBS** (`obs-plugin/`): fonte nativa no OBS que recebe o vídeo direto, sem passar pela webcam virtual (fase posterior).

O contrato entre eles está em `docs/PROTOCOLO.md` e `protocol/`. Nenhum dos lados inventa mensagem fora desse documento: se precisar de uma nova, atualize o protocolo primeiro.

## Sobre quem está construindo

O dono do projeto (Mike) não é programador de formação e constrói operando IA. Por isso:

- Explique em português simples o que você vai fazer antes de mudanças grandes, e o que fez depois.
- Comandos que ele precisa rodar na máquina dele vêm prontos para copiar, um por linha, dizendo onde rodar (PowerShell, Android Studio etc.).
- Quando algo depender de instalar programa (Android Studio, Rust, OBS), diga exatamente o quê, de onde baixar e como conferir que funcionou.
- Prefira soluções simples e bem documentadas a soluções espertas.
- Escreva comentários no código em português, nomes de variáveis/funções em inglês.

## Stack decidida

| Parte | Tecnologia | Motivo |
|---|---|---|
| Desktop UI | Tauri 2 + React + TypeScript + Tailwind | Mike vem de web; Tauri gera .exe leve |
| Desktop core | Rust (dentro do Tauri) | Rede, decodificação e webcam virtual com desempenho |
| Decodificação | FFmpeg (crate `ffmpeg-next`) com aceleração por hardware quando houver | Padrão da indústria |
| Webcam virtual (Windows) | Softcam (DirectShow) via FFI na fase 2; Media Foundation Virtual Camera (Win 11) depois | Softcam aparece no OBS, Zoom, Meet, Discord |
| Android | Kotlin + Jetpack Compose + CameraX/Camera2 + MediaCodec | Caminho oficial, controle fino de câmera |
| iOS | Swift + SwiftUI + AVFoundation + VideoToolbox | Fase posterior |
| Plugin OBS | C/C++ com `obs-plugintemplate` | Fonte nativa de menor latência |
| Transporte USB | `adb forward` (exige depuração USB ligada) | Mesmo método usado por scrcpy e DroidCam |
| Transporte Wi-Fi | TCP + descoberta por mDNS (`_linkcam._tcp`) | PC aparece sozinho no celular |

Plataforma alvo do desktop: **Windows 10/11 primeiro**. macOS e Linux depois.

## Estrutura de pastas

```
linkcam/
├── CLAUDE.md            ← este arquivo
├── README.md
├── docs/
│   ├── ARQUITETURA.md   ← como as peças se ligam
│   ├── PROTOCOLO.md     ← formato das mensagens celular ↔ PC
│   ├── ROADMAP.md       ← fases com critério de pronto
│   ├── DESIGN.md        ← tokens de cor, componentes, mapa de telas
│   ├── OBS.md           ← estratégia de compatibilidade com OBS
│   ├── PROMPTS.md       ← prompts prontos para cada fase
│   └── design/          ← mockups de referência (PNG)
├── protocol/            ← constantes e schemas compartilhados
├── tools/fake-phone/    ← simulador de celular para testar o PC sem aparelho
├── desktop/             ← app do PC (Tauri)
├── android/             ← app Android
├── ios/                 ← app iOS (fase 6)
└── obs-plugin/          ← plugin nativo do OBS (fase 5)
```

## Como trabalhar

- Siga `docs/ROADMAP.md` **fase por fase**. Não comece uma fase antes da anterior cumprir o critério de pronto.
- Antes de codar uma tela, abra o mockup correspondente em `docs/design/` e siga `docs/DESIGN.md`. A UI deve ficar fiel ao mockup.
- Toda funcionalidade nova termina com um jeito de testar descrito em passos (ex: "conecte o celular, abra o OBS, adicione Dispositivo de Captura de Vídeo, escolha LinkCam").
- Mantenha `docs/ROADMAP.md` atualizado marcando o que foi feito (`[x]`).
- Use git com commits pequenos e mensagens em português ("feat: envio de vídeo H.264 por USB").

## Regras técnicas

- Latência é a métrica principal. Meta: abaixo de 80 ms via USB, abaixo de 150 ms via Wi-Fi, medida pelo PING/PONG do protocolo.
- Nunca bloquear a thread de UI com rede ou decodificação.
- O celular é a fonte da verdade sobre o que a câmera suporta (mensagem `CAPS`). O PC só mostra os controles que o aparelho realmente tem.
- Rotação e espelhamento são aplicados no PC, não no celular (evita re-encode).
- Reconexão automática: se o cabo sair ou o Wi-Fi cair, os dois lados tentam reconectar sem o usuário fazer nada.
- A webcam virtual mostra uma imagem de "aguardando celular" quando não há vídeo, em vez de tela preta ou erro.
- Nada de código de terceiros com licença incompatível. Projetos como scrcpy e o cliente Linux do DroidCam servem de **referência de estudo**; se for copiar código, confira a licença e registre em `THIRD_PARTY.md`.
