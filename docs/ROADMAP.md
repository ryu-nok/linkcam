# Roadmap

Cada fase termina com algo que funciona e dá para testar. Só avance quando o **critério de pronto** estiver cumprido. Marque `[x]` conforme for concluindo.

A ordem foi pensada para ter um produto usável o quanto antes: ao fim da **fase 2** você já tem o celular aparecendo como câmera no OBS.

---

## Fase 0 — Fundação

Preparar o terreno para as outras fases andarem rápido.

- [x] Instalar ferramentas no PC: Git, Rust (rustup), Node.js LTS, Android Studio, FFmpeg, OBS Studio
- [x] Criar repositório git e primeiro commit com esta estrutura
- [x] `protocol/`: gerar constantes em Rust e Kotlin a partir de `linkcam-protocol.json`
- [ ] **Simulador de celular** (`tools/fake-phone/`): programa em Rust que se comporta como o app do celular, mandando um vídeo de teste (barras coloridas + relógio) pelo protocolo. Permite construir o app do PC sem depender do celular
- [x] Ligar a "Depuração USB" no celular de teste e confirmar `adb devices`

**Pronto quando:** `adb devices` lista o celular e o simulador roda sem erros.

---

## Fase 1 — Vídeo do celular chegando no PC (USB)

O coração do projeto. Sem UI bonita ainda.

**Android**
- [ ] Projeto Kotlin + Compose criado em `android/`
- [ ] Permissão de câmera e tela simples com prévia e botão "Conectar ao PC"
- [ ] CameraX capturando 1080p30 da câmera traseira
- [ ] MediaCodec codificando H.264 com baixa latência
- [ ] Servidor TCP na porta 47100: `HELLO`, `CAPS`, `VIDEO_CONFIG`, `VIDEO_FRAME`, `PING/PONG`
- [ ] Foreground Service mantendo o envio com a tela apagada

**Desktop**
- [ ] Projeto Tauri 2 + React + TS criado em `desktop/`
- [ ] Core Rust: roda `adb forward`, conecta, lê mensagens, decodifica com FFmpeg
- [ ] Janela simples mostrando o vídeo e a latência em ms

**Pronto quando:** o vídeo do celular aparece na janela do PC via USB com latência abaixo de 100 ms, e funciona com o simulador também.

---

## Fase 2 — Webcam virtual e OBS (primeira versão usável)

- [ ] Integrar Softcam no core Rust (FFI) — webcam "LinkCam" registrada no Windows
- [ ] Botão "Iniciar webcam" liga/desliga a saída
- [ ] Imagem de "Aguardando celular…" quando não há vídeo
- [ ] Rotação (0/90/180/270) e espelhamento aplicados no PC
- [ ] Reconexão automática ao tirar e recolocar o cabo
- [ ] Instalador simples (.msi do Tauri) que registra a webcam virtual

**Pronto quando:** no OBS, "Dispositivo de captura de vídeo" → "LinkCam" mostra o celular. Também aparece no Google Meet e no Discord. Cabo removido e recolocado volta sozinho.

---

## Fase 3 — Controles remotos e UI final

Deixar os dois apps iguais aos mockups.

**Protocolo**
- [ ] `AUTH`, `SET_CONFIG`, `SET_ZOOM`, `SET_FOCUS`, `SET_EXPOSURE`, `SWITCH_CAMERA`, `SET_TORCH`, `STATE`, `ERROR`

**Desktop** (mockup `01-desktop-principal.png`)
- [ ] Layout completo: cabeçalho, seletor de dispositivo, prévia, barra de status, painel "Ajustes da câmera"
- [ ] Resolução, FPS 30/60, Foco Auto/Manual, Zoom, Exposição (auto + EV), Rotação, Espelhar
- [ ] Controles montados a partir do `CAPS` (o que o aparelho não suporta fica oculto)
- [ ] Clicar na prévia foca naquele ponto (`SET_FOCUS` tipo `tap`)
- [ ] Aviso de bateria baixa e aquecimento do celular

**Android** (mockups `02`, `03`, `04`)
- [ ] Tela Conectar (retrato e paisagem) com navegação Conectar / Câmera / Ajustes
- [ ] Tela Câmera ao vivo: status, latência, qualidade, zoom/foco/exposição, encerrar
- [ ] Pedido de autorização "Permitir que Meu PC ajuste a câmera?"
- [ ] Ajustes feitos no celular aparecem no PC (via `STATE`) e vice-versa
- [ ] Tela "Como conectar?" ensinando a ligar a Depuração USB com imagens

**Pronto quando:** cada controle mexido no PC muda a câmera do celular em menos de 200 ms, e os dois apps batem com os mockups.

---

## Fase 4 — Wi-Fi

- [ ] PC escuta na porta 47100 e se anuncia via mDNS (`_linkcam._tcp`)
- [ ] Celular encontra o PC sozinho ("Computador encontrado — Meu PC")
- [ ] Conexão manual por IP como alternativa
- [ ] Bitrate adaptativo: se a latência sobe, reduz bitrate automaticamente
- [ ] Liberar o app no Firewall do Windows durante a instalação
- [ ] "Gerenciar conexões" e "Outros dispositivos" no desktop

**Pronto quando:** em Wi-Fi 5 GHz, 1080p30 roda estável com latência abaixo de 150 ms.

---

## Fase 5 — Plugin nativo do OBS e multicâmera

Detalhes em `docs/OBS.md`.

- [ ] Plugin `obs-plugin/` com a fonte "LinkCam" no OBS
- [ ] App do PC entrega frames ao plugin por memória compartilhada (sem a webcam virtual no meio)
- [ ] Vários celulares ao mesmo tempo, cada um como uma fonte no OBS
- [ ] Controles da câmera nas propriedades da fonte no OBS

**Pronto quando:** dois celulares aparecem como duas fontes no mesmo OBS, com latência menor que pela webcam virtual.

---

## Fase 6 — iPhone

- [ ] App Swift + SwiftUI em `ios/` com as mesmas telas
- [ ] AVFoundation + VideoToolbox (H.264), mesmo protocolo
- [ ] Wi-Fi primeiro; USB via usbmuxd depois
- [ ] Conta Apple Developer para TestFlight e App Store

**Pronto quando:** iPhone funciona em Wi-Fi com as mesmas funções do Android.

---

## Fase 7 — Extras para criadores

- [ ] Microfone do celular como áudio no PC (`AUDIO_CONFIG` / `AUDIO_FRAME`)
- [ ] Saída NDI (OBS e vMix enxergam pela rede)
- [ ] Gravação local em alta qualidade no celular enquanto transmite
- [ ] Presets salvos ("Live", "Reunião", "Gravação")
- [ ] Avaliar UDP com correção de erro se o Wi-Fi não bater a meta de latência via TCP
- [ ] Atualização automática do app do PC
- [ ] Assinatura de código no Windows (evita o aviso do SmartScreen)
- [ ] Versão macOS
- [ ] Publicação na Play Store
