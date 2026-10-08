# Design

Os mockups em `docs/design/` são a referência visual. Esta página traduz eles em tokens e componentes para o código seguir.

| Arquivo | Tela |
|---|---|
| `01-desktop-principal.png` | Desktop — janela principal |
| `02-mobile-conectar-retrato.png` | Android/iOS — Conectar (retrato) |
| `03-mobile-conectar-paisagem.png` | Android/iOS — Conectar (paisagem) |
| `04-mobile-camera-ao-vivo.png` | Android/iOS — Câmera ao vivo (paisagem) |

## Identidade

Tema escuro, um único verde-água como cor de destaque, muito espaço e tipografia grande nos títulos. A sensação buscada é "ferramenta profissional pronta para usar": nada de gradiente, sombra pesada ou cor sobrando.

## Tokens de cor

Valores amostrados dos mockups. Use sempre o token, nunca o hex direto no componente.

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#121215` | Fundo da janela / tela |
| `surface` | `#1A1D21` | Cartões, selects, segmentos inativos |
| `surface-2` | `#1D2024` | Hover, campos |
| `border` | `#2A2E33` | Bordas de 1 px e divisórias |
| `track` | `#3F4448` | Trilho de slider inativo, toggle desligado |
| `accent` | `#8EE6CD` | Botão principal, segmento ativo, slider, links, ícone do app |
| `accent-fg` | `#0E1412` | Texto sobre o `accent` |
| `success` | `#6BDA6C` | Bolinha "ao vivo", "Excelente", conectado |
| `warning` | `#F2C14E` | Latência instável, bateria baixa |
| `danger` | `#F26B6B` | Erro, conexão ruim |
| `text` | `#F2F4F5` | Texto principal |
| `text-muted` | `#9AA0A6` | Subtítulos, rótulos secundários, rodapé |

Overlays sobre o vídeo (tela Câmera ao vivo, selo "Prévia ao vivo"): `rgba(18,18,21,0.72)` com `backdrop-filter: blur(12px)`.

## Tipografia

Fonte: **Inter** (desktop e Android). Pesos 400, 500, 600, 800.

| Estilo | Tamanho / peso | Exemplo |
|---|---|---|
| `display` | 36 px / 800, tracking -0.02em | "Sua câmera, pronta." |
| `title` | 22 px / 600 | "Ajustes da câmera" |
| `label` | 15 px / 500 | "Resolução", "FPS" |
| `body` | 15 px / 400 | Valores, opções |
| `caption` | 13 px / 400, `text-muted` | Rodapé, subtítulo |
| `button` | 18 px / 600 | "Iniciar webcam" |

No celular, `display` sobe para 40 px e quebra em duas linhas ("Seu celular. / Sua webcam.").

## Espaçamento e forma

- Escala de espaço: 4, 8, 12, 16, 24, 32, 40
- Raio: 8 px (selects, segmentos, cartões), 12 px (prévia de vídeo, botão principal), 999 px (toggles, pílulas, botões redondos)
- Bordas de 1 px `border` em selects, segmentos e cartões
- Desktop: painel de ajustes à direita com ~420 px, separado por divisória vertical

## Componentes

| Componente | Descrição | Onde aparece |
|---|---|---|
| `Select` | Caixa com borda, valor à esquerda, chevron à direita | Resolução, Rotação, seletor de dispositivo |
| `Segmented` | 2+ opções lado a lado; ativa com fundo `accent` | FPS 30/60, Foco Auto/Manual, USB/Wi-Fi |
| `Slider` | Trilho fino, parte preenchida `accent`, bolinha branca, valor à direita | Zoom, Exposição |
| `Toggle` | Pílula; ligado `accent`, desligado `track`; rótulo de estado ao lado | Exposição auto, Espelhar |
| `Stepper` | `−` valor `+` com botões redondos contornados | Zoom e Exposição na tela Câmera ao vivo |
| `PrimaryButton` | Fundo `accent`, ícone ▶ + texto, largura total | Iniciar webcam, Conectar ao PC |
| `StatusBar` | Linha com ícone + texto separados por divisórias | USB conectado · 24 ms · Excelente |
| `LiveBadge` | Pílula escura com bolinha `success` | "Prévia ao vivo" |
| `DeviceRow` | Ícone, nome, tipo de conexão, status | Outros dispositivos, Computador encontrado |
| `NavRail` / `BottomNav` | Conectar / Câmera / Ajustes; item ativo em `accent` com traço embaixo | Lateral (paisagem), inferior (retrato) |
| `OverlayChip` | Pílula translúcida sobre o vídeo | "Meu PC · USB │ 24 ms", "1080p · 30 fps" |

## Telas

### Desktop — Principal
Cabeçalho com título e subtítulo; linha com seletor de dispositivo, descrição e "Gerenciar conexões"; prévia grande 16:9 com selo "Prévia ao vivo"; `StatusBar` embaixo da prévia; "Outros dispositivos" com `DeviceRow` e ações "Adicionar dispositivo", "USB", "Wi-Fi / IP". À direita, "Ajustes da câmera" com Resolução, FPS, Foco, Zoom, Exposição, Rotação, Espelhar e o botão "Iniciar webcam". Rodapé: status da webcam virtual e "Ajustes disponíveis variam por dispositivo".

> O texto "Dados ilustrativos." do rodapé do mockup não vai para o app real.

### Celular — Conectar
Título, prévia da câmera com botão de trocar (Traseira/Frontal), `Segmented` USB/Wi-Fi, "Computador encontrado" com `DeviceRow`, aviso de autorização, botão "Conectar ao PC", link "Como conectar?" e linha "Qualidade da câmera — 1080p · 30 fps". Em paisagem a navegação vira `NavRail` à esquerda e o conteúdo se divide em duas colunas.

### Celular — Câmera ao vivo
Vídeo em tela cheia. Topo: voltar, chip de conexão com latência, chip de qualidade, trocar câmera. Base: barra flutuante com Zoom (stepper), Foco (menu), Exposição (stepper); botão "Encerrar" à direita; botão de girar à esquerda. Para economizar bateria, a prévia escurece após 30 s sem toque, e um toque reacende.

## Estados que faltam desenhar

O código precisa deles, mesmo sem mockup. Seguir o mesmo estilo:

- Nenhum celular conectado (desktop): prévia com ilustração simples e passo a passo curto
- Conectando… (spinner discreto no lugar do selo ao vivo)
- Conexão perdida, tentando reconectar
- Pedido de autorização no celular (diálogo)
- Erro de câmera ocupada
- Tela "Como conectar?" (passos para ligar a Depuração USB)
