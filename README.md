# TP Estúdio - Web Dashboard & Estúdio de Thumbnails

Dashboard independente com Gerenciador de Templates de Texto e Criador de Thumbnails para YouTube, pronto para hospedagem no **Netlify**, **Vercel** ou **GitHub Pages**.

---

## 🚀 Como publicar no Netlify

### Opção 1: Arrastar e Soltar (Mais Fácil / Sem Git)
1. Acesse **[app.netlify.com/drop](https://app.netlify.com/drop)** e faça login na sua conta Netlify.
2. Arraste a pasta `tp-dashboard-web` inteira para a área indicada na página.
3. Pronto! O site estará online imediatamente em uma URL HTTPS (ex: `https://canivete-tp.netlify.app`).

### Opção 2: Via Git / GitHub
1. Crie um novo repositório no GitHub (ex: `tp-dashboard`).
2. Inicialize o repositório dentro desta pasta:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of standalone dashboard"
   git branch -M main
   git remote add origin git@github.com:seu-usuario/tp-dashboard.git
   git push -u origin main
   ```
3. No painel do Netlify, clique em **Add new site** > **Import an existing project** > Selecione o repositório do GitHub.
4. Diretório de build: Deixe em branco (ou `.`).
5. Clique em **Deploy site**.

### Opção 3: Via Terminal com Netlify CLI
```bash
npx netlify-cli deploy --prod --dir=.
```

---

## 🛠️ Recursos Incluídos
- **Templates de Texto:** Criar, editar, buscar por categorias (*YouTube, Blog, Afiliados, Geral*), copiar com 1 clique e importar/exportar backup em JSON.
- **Acesso Rápido (Sites & Ferramentas):**
  - Salve sites, ferramentas e canais favoritos com captura automática de favicon.
  - Botão de abrir em nova aba (`target="_blank"`) e copiar link com 1 clique.
  - Filtros dinâmicos por categoria (*YouTube, Ferramentas, IA, Design, Geral*) e busca em tempo real.
  - Importação e exportação de backups em JSON.
- **Criador de Thumbnails & Imagens:**
  - **Aba de Tamanhos Anexada ao Canvas:** Dropdown com presets (*1280×720 YouTube, 1080p, Shorts/Reels 9:16, Banner 2560×1440, Personalizado*) anexado como uma aba diretamente no topo da prancheta de trabalho, acompanhando zoom, deslocamentos e redimensionando a arte em tempo real.
  - **Gradientes Profissionais & Camadas de Fade (v1.20.0):**
    - **Camada de Gradiente Dedicada:** Adicione camadas de gradiente independentes na barra de ferramentas lateral, reposicionáveis e redimensionáveis por transform handles tanto no Criador de Thumbnails quanto no Criador de Carrosséis.
    - **Fade para Transparente Puro:** Gradiente da cor escolhida diretamente para o transparente (`rgba(r, g, b, 0)`), eliminando tons acinzentados ou sujos no fade — ideal para sombras inferiores de leitura de legendas, vinhetas, spotlights e iluminação lateral.
    - **Modo Cor → Transparente ou Duas Cores:** Alterne facilmente entre fade transparente ou transição entre duas tonalidades.
    - **Presets Rápidos de Fade:** *Fade Base 🌑*, *Fade Topo 🌌*, *Fade Lateral 👈*, *Spotlight 💡*, *Glow Fogo 🔥*, *Glow Ciano ⚡*.
    - **Controles Intuitivos:** Direções (↑, ↓, →, ←, ↘, 💡 Radial) com botão de inversão rápida, opacidade percentual, cantos arredondados e botão de ação rápida **Preencher Canvas / Tela**.
    - **Fundo do Canvas & Formas em Gradiente Transparente:** Opção de gradiente transparente estendida também para o fundo do canvas e para tarjas/formas.
    - **Texto em Gradiente:** Gradientes aplicados nas letras com presets prontos (*Fogo 🔥, Ouro ⭐, Neon ⚡, Verde 🍏, Prata 💎, Pink 🌸*) mantendo contorno (*stroke*) e sombra 100% nítidos.
  - **Guias Inteligentes & Alinhamento Magnético (v1.21.0):**
    - **Alinhamento Magnético Dinâmico (Snapping):** Ao arrastar qualquer elemento (texto, imagem, forma ou gradiente), ele é atraído de forma suave e precisa aos centros da tela (`X` e `Y`), às bordas da prancheta e aos centros/bordas de outros elementos da arte.
    - **Linhas Guias Visuais:** Renderizadas em tempo real com destaque em magenta vibrante (`#ff007a`) para o centro do canvas e ciano brilhante (`#00e5ff`) para alinhamento entre elementos.
    - **Totalmente Limpas:** Renderizadas na camada de sobreposição vetorial, desaparecem instantaneamente ao soltar o mouse e nunca aparecem nas exportações de imagem.
    - **Ajuste Livre com Tecla Alt:** Segure a tecla `Alt` durante o arraste para ignorar temporariamente o alinhamento magnético e posicionar livremente pixel a pixel.
  - **Espaçamento entre Linhas / Leading (v1.22.0):**
    - Controle deslizante dinâmico de entrelinha (`0.70x` a `2.50x`) no Criador de Thumbnails e no Criador de Carrosséis.
    - Presets rápidos de 1 clique: **Apertado (0.85x / 0.90x)** (perfeito para títulos empilhados de YouTube em caixa alta), **Justo (1.00x / 1.05x)**, **Padrão (1.15x / 1.18x)** e **Amplo (1.40x / 1.45x)**.
    - Botão de reset rápido `↺` para restauração instantânea do valor padrão.
    - Sincronização automática com a caixa de seleção, tarjas de fundo e multi-canvas conectados.
  - Tipografia de alto impacto (*Bebas Neue, Anton, Montserrat, etc.*) com contorno (*stroke*), sombras e tarjas.
  - Imagens com colagem direta via **Ctrl+V / Cmd+V**, espelhamento e controle de camadas.
  - Guia da **Safe Zone do YouTube** (evita cobrir o selo de duração).
  - **Zoom Fluído & Pan da Área de Trabalho:** Zoom pelo scroll do mouse ou botões flutuantes, e navegação livre pela prancheta (arraste pelo fundo, ferramenta mão `H` ou segurando `Espaço`).
  - **Modal de Atalhos Rápidos:** Visualizador completo de atalhos de teclado e gestos disponível via botão ou pela tecla `?`.
  - Exportação em PNG de alta definição, JPG otimizado e botão de copiar imagem para a Área de Transferência.
- **Criador de Carrosséis (Instagram & YouTube Comunidade):**
  - Criação contínua de múltiplos slides lado a lado para alinhamento panorâmico perfeito.
  - Presets otimizados: **Instagram Retrato (4:5 · 1080×1350)**, **Instagram / YouTube Quadrado (1:1 · 1080×1080)** e **Stories / Reels (9:16 · 1080×1920)**.
  - Gerenciamento ágil de slides: adicionar, duplicar, excluir e reordenar com faixa de miniaturas interativa.
  - Numeração automática inteligente de slides (`1/N`, `2/N`, etc.).
  - CTAs rápidos pré-configurados (*Arraste 👉, Salvar 📌, Gancho 🔥*).
  - Exportação em lote de todos os slides compactados em arquivo **ZIP** de alta resolução, exportação de slide individual (PNG/JPG) e cópia para Área de Transferência.
- **Barra Lateral Retrátil e Fluída:** Recolhimento/expansão animada via botão ou atalho `Ctrl+B` com persistência no navegador.
- **Armazenamento Local:** 100% no navegador via `localStorage` (seus dados ficam salvos sem depender de servidores).
