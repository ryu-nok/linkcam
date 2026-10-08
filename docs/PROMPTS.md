# Prompts prontos para o Claude Code

Abra o terminal na pasta `linkcam/`, rode `claude` e cole um prompt por vez. Espere cada um terminar e testar antes de mandar o próximo.

---

## Primeira sessão

```
Leia o CLAUDE.md e todos os arquivos em docs/. Depois me diga, em português simples,
o que você entendeu do projeto, quais programas eu preciso instalar no Windows para
a fase 0 e como confirmar que cada um foi instalado. Não escreva código ainda.
```

## Fase 0

```
Vamos fazer a fase 0 do docs/ROADMAP.md. Inicialize o git, crie um .gitignore
adequado para Rust, Node, Android e Swift, e gere as constantes do protocolo em
Rust e Kotlin a partir de protocol/linkcam-protocol.json.
```

```
Crie o simulador de celular em tools/fake-phone/ (Rust), seguindo docs/PROTOCOLO.md:
ele escuta na porta 47100, responde HELLO e CAPS, e manda vídeo H.264 de teste
(barras coloridas com relógio) em 1080p30. Me explique como rodar.
```

## Fase 1

```
Fase 1, parte Android: crie o projeto em android/ com Kotlin, Jetpack Compose e
CameraX. Uma tela simples com a prévia da câmera e o botão "Conectar ao PC".
Ao tocar, inicia um Foreground Service que escuta na porta 47100 e envia
H.264 conforme docs/PROTOCOLO.md (HELLO, CAPS, VIDEO_CONFIG, VIDEO_FRAME, PING/PONG).
Me diga passo a passo como abrir no Android Studio e instalar no celular.
```

```
Fase 1, parte desktop: crie o app em desktop/ com Tauri 2, React, TypeScript e Tailwind.
O core Rust roda adb forward tcp:47100 tcp:47100, conecta, decodifica com ffmpeg-next
e mostra o vídeo numa janela simples com a latência em ms. Teste primeiro contra o
tools/fake-phone e depois contra o celular.
```

## Fase 2

```
Fase 2: integre o Softcam ao core Rust para registrar a webcam virtual "LinkCam"
no Windows. Siga docs/OBS.md (caminho 1): resolução fixa durante a sessão,
imagem "Aguardando celular…" quando não houver vídeo, rotação e espelho no PC,
reconexão automática. Me passe o roteiro de teste no OBS e no Google Meet.
```

## Fase 3

```
Fase 3, desktop: refaça a UI para ficar fiel a docs/design/01-desktop-principal.png
seguindo docs/DESIGN.md (tokens, componentes, tipografia). Implemente os comandos
SET_* e STATE do protocolo e monte os controles a partir do CAPS.
```

```
Fase 3, Android: refaça as telas conforme docs/design/02, 03 e 04 e docs/DESIGN.md.
Implemente o pedido de autorização (AUTH), a aplicação de zoom/foco/exposição/lanterna,
o envio de STATE quando algo muda e a tela "Como conectar?".
```

## Fase 4

```
Fase 4 do roadmap: Wi-Fi. O PC escuta na 47100 e se anuncia por mDNS (_linkcam._tcp),
o celular descobre e conecta, com opção de IP manual. Adicione bitrate adaptativo
e a regra de firewall no instalador.
```

## Quando algo der errado

```
Deu este erro: [cole o erro]. Explique em português simples o que significa,
corrija e me diga como testar de novo.
```

```
Atualize o docs/ROADMAP.md marcando o que já foi feito e me diga o próximo passo.
```
