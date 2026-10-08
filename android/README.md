# LinkCam Android

App do celular: captura a câmera, codifica em H.264 e envia ao PC. Recebe os ajustes do PC.

**Stack:** Kotlin · Jetpack Compose · CameraX / Camera2 · MediaCodec · NsdManager (mDNS)

**Mockups:** `../docs/design/02`, `03` e `04` · **Estilo:** `../docs/DESIGN.md`

## Estrutura prevista

```
android/app/src/main/java/dev/norte/linkcam/
├── ui/        Conectar, CameraAoVivo, Ajustes, ComoConectar
├── camera/    abre a câmera e aplica zoom, foco, exposição, lanterna
├── encoder/   MediaCodec H.264 baixa latência
├── net/       servidor TCP, protocolo, descoberta mDNS
└── service/   Foreground Service do streaming
```

Versão mínima sugerida: Android 8.0 (API 26).

Ainda vazio: criado na fase 1 (veja `../docs/ROADMAP.md`).
