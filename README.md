# Canivete TP - Web Dashboard & Estúdio de Thumbnails

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
  - Tipografia de alto impacto (*Bebas Neue, Anton, Montserrat, etc.*) com contorno (*stroke*), sombras e tarjas.
  - Imagens com colagem direta via **Ctrl+V / Cmd+V**, espelhamento e controle de camadas.
  - Guia da **Safe Zone do YouTube** (evita cobrir o selo de duração).
  - **Zoom Fluído & Pan da Área de Trabalho:** Zoom pelo scroll do mouse ou botões flutuantes, e navegação livre pela prancheta (arraste pelo fundo, ferramenta mão `H` ou segurando `Espaço`).
  - **Modal de Atalhos Rápidos:** Visualizador completo de atalhos de teclado e gestos disponível via botão ou pela tecla `?`.
  - Exportação em PNG de alta definição, JPG otimizado e botão de copiar imagem para a Área de Transferência.
- **Barra Lateral Retrátil e Fluída:** Recolhimento/expansão animada via botão ou atalho `Ctrl+B` com persistência no navegador.
- **Armazenamento Local:** 100% no navegador via `localStorage` (seus dados ficam salvos sem depender de servidores).
