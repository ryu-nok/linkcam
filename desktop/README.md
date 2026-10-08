# LinkCam Desktop

App do PC: recebe o vídeo do celular, mostra a prévia, controla a câmera e expõe a webcam virtual.

**Stack:** Tauri 2 · React · TypeScript · Tailwind · Rust · FFmpeg (`ffmpeg-next`) · Softcam

**Mockup:** `../docs/design/01-desktop-principal.png` · **Estilo:** `../docs/DESIGN.md`

## Estrutura prevista

```
desktop/
├── src/                  UI React
│   ├── screens/          Principal, GerenciarConexoes, Ajustes
│   ├── components/       Select, Segmented, Slider, Toggle, StatusBar, DeviceRow...
│   ├── styles/tokens.css tokens de cor e tipografia do DESIGN.md
│   └── lib/ipc.ts        comandos e eventos do core Rust
└── src-tauri/src/
    ├── net/              adb, cliente TCP, mDNS, protocolo
    ├── video/            decoder, rotação, espelho
    ├── vcam/             webcam virtual (Softcam)
    ├── obs_bridge/       memória compartilhada para o plugin OBS (fase 5)
    └── main.rs
```

Ainda vazio: criado na fase 1 (veja `../docs/ROADMAP.md`).
