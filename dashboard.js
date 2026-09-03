/**
 * Canivete TP - Dashboard Script
 * Gerenciador de Templates de Texto & Criador de Thumbnails/Imagens para YouTube
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // TOAST NOTIFICATION SYSTEM
  // =========================================================================
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'default', duration = 3500) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // =========================================================================
  // TAB NAVIGATION
  // =========================================================================
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const pane = document.getElementById(targetTab);
      if (pane) pane.classList.add('active');

      if (targetTab === 'thumbnailsTab') {
        canvasEngine.render();
      }
    });
  });

  // =========================================================================
  // MODULE 1: TEXT TEMPLATES MANAGER
  // =========================================================================
  const TEMPLATES_STORAGE_KEY = 'tp_text_templates';

  const defaultTemplates = [
    {
      id: 'tpl_yt_desc_1',
      title: 'Descrição Padrão para YouTube',
      category: 'YouTube',
      tags: ['youtube', 'descrição', 'vídeo', 'redes'],
      content: `🔥 Nesse vídeo você vai aprender o passo a passo completo sobre...

📌 LINKS E RECURSOS MENCIONADOS:
👉 Link 1: https://exemplo.com/recurso1
👉 Link 2: https://exemplo.com/recurso2

🕒 CAPÍTULOS DO VÍDEO:
00:00 - Introdução
01:30 - Passo 1: Primeiros Passos
04:45 - Passo 2: Configuração
08:15 - Dica Bônus & Conclusão

💬 REDES SOCIAIS & CONTATO:
📸 Instagram: @seuperfil
🌐 Blog: https://seublog.com
✉️ Contato comercial: contato@seublog.com

#YouTube #Dicas #Tutoriais`,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tpl_affiliate_1',
      title: 'Bloco de Links de Afiliados',
      category: 'Afiliados',
      tags: ['afiliado', 'monetização', 'vendas', 'links'],
      content: `🛒 EQUIPAMENTOS & FERRAMENTAS QUE RECOMENDO:
🔹 Microfone Utilizado: https://amzn.to/link-exemplo
🔹 Câmera / Webcam: https://amzn.to/link-exemplo
🔹 Melhor Hospedagem com Desconto: https://exemplo.com/cupom

⚠️ Aviso: Comprando através dos links acima, o canal recebe uma pequena comissão sem custo adicional para você!`,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'tpl_blogger_structure',
      title: 'Estrutura de Artigo SEO para Blog',
      category: 'Blog',
      tags: ['blogger', 'seo', 'artigo', 'conteúdo'],
      content: `<h2>O que é [Tema do Artigo]?</h2>
<p>Explicação introdutória clara e direta ao ponto...</p>

<h2>Principais Benefícios</h2>
<ul>
  <li><strong>Ponto 1:</strong> Descrição do benefício</li>
  <li><strong>Ponto 2:</strong> Descrição do benefício</li>
</ul>

<h2>Passo a Passo Como Fazer</h2>
<ol>
  <li>Etapa inicial...</li>
  <li>Execução...</li>
  <li>Conclusão e validação...</li>
</ol>

<h2>Perguntas Frequentes (FAQ)</h2>
<p><strong>Dúvida 1:</strong> Resposta rápida.</p>`,
      updatedAt: new Date().toISOString()
    }
  ];

  let templates = [];
  let currentCategoryFilter = 'all';
  let searchQuery = '';

  // Elements
  const templatesGrid = document.getElementById('templatesGrid');
  const templateSearchInput = document.getElementById('templateSearchInput');
  const categoryPills = document.getElementById('categoryPills');
  const newTemplateBtn = document.getElementById('newTemplateBtn');
  const exportTemplatesBtn = document.getElementById('exportTemplatesBtn');
  const importTemplatesBtn = document.getElementById('importTemplatesBtn');
  const importFileInput = document.getElementById('importFileInput');

  // Modal elements
  const templateModal = document.getElementById('templateModal');
  const templateModalTitle = document.getElementById('templateModalTitle');
  const closeTemplateModalBtn = document.getElementById('closeTemplateModalBtn');
  const cancelTemplateBtn = document.getElementById('cancelTemplateBtn');
  const templateForm = document.getElementById('templateForm');
  const templateIdInput = document.getElementById('templateIdInput');
  const templateTitleInput = document.getElementById('templateTitleInput');
  const templateCategoryInput = document.getElementById('templateCategoryInput');
  const templateTagsInput = document.getElementById('templateTagsInput');
  const templateContentInput = document.getElementById('templateContentInput');

  // Load templates from localStorage
  function loadTemplates() {
    try {
      const localData = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (localData) {
        templates = JSON.parse(localData);
      } else {
        templates = [...defaultTemplates];
        saveTemplates();
      }
    } catch (e) {
      console.error('Erro ao carregar templates:', e);
      templates = [...defaultTemplates];
    }
    renderTemplates();
  }

  // Save templates to localStorage
  function saveTemplates() {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
    } catch (e) {
      console.error('Erro ao salvar templates:', e);
    }
  }

  // Render templates grid
  function renderTemplates() {
    templatesGrid.innerHTML = '';

    const filtered = templates.filter(tpl => {
      const matchesCategory = currentCategoryFilter === 'all' || 
        (tpl.category && tpl.category.toLowerCase() === currentCategoryFilter.toLowerCase());
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        tpl.title.toLowerCase().includes(query) ||
        tpl.content.toLowerCase().includes(query) ||
        (tpl.tags && tpl.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (tpl.category && tpl.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      templatesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-dim);">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">Nenhum template encontrado</p>
          <p style="font-size: 0.85rem;">Tente ajustar sua busca ou crie um novo template clicando no botão acima.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card';

      const tagsHtml = (tpl.tags && tpl.tags.length > 0)
        ? `<div class="template-tags">${tpl.tags.map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join('')}</div>`
        : '';

      card.innerHTML = `
        <div class="template-card-header">
          <span class="template-badge">${escapeHtml(tpl.category || 'Geral')}</span>
          <div class="template-card-actions">
            <button class="btn btn-secondary btn-xs btn-edit" title="Editar Template" data-id="${tpl.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="btn btn-secondary btn-xs btn-delete btn-danger-hover" title="Excluir Template" data-id="${tpl.id}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
        <h3 class="template-card-title">${escapeHtml(tpl.title)}</h3>
        <pre class="template-card-content">${escapeHtml(tpl.content)}</pre>
        ${tagsHtml}
        <div class="template-card-footer">
          <button class="btn-copy" data-id="${tpl.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copiar Texto</span>
          </button>
        </div>
      `;

      // Copy action
      const copyBtn = card.querySelector('.btn-copy');
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(tpl.content);
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Copiado!</span>
          `;
          showToast(`Template "${tpl.title}" copiado para a área de transferência!`, 'success');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copiar Texto</span>
            `;
          }, 2000);
        } catch (err) {
          showToast('Não foi possível copiar o texto automaticamente.', 'error');
        }
      });

      // Edit action
      const editBtn = card.querySelector('.btn-edit');
      editBtn.addEventListener('click', () => openEditModal(tpl));

      // Delete action
      const delBtn = card.querySelector('.btn-delete');
      delBtn.addEventListener('click', async () => {
        if (confirm(`Deseja realmente excluir o template "${tpl.title}"?`)) {
          templates = templates.filter(t => t.id !== tpl.id);
          await saveTemplates();
          renderTemplates();
          showToast('Template excluído com sucesso!', 'success');
        }
      });

      templatesGrid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Modal Open/Close
  function openNewModal() {
    templateModalTitle.textContent = 'Novo Template de Texto';
    templateIdInput.value = '';
    templateTitleInput.value = '';
    templateCategoryInput.value = 'YouTube';
    templateTagsInput.value = '';
    templateContentInput.value = '';
    templateModal.classList.remove('hidden');
    templateTitleInput.focus();
  }

  function openEditModal(tpl) {
    templateModalTitle.textContent = 'Editar Template de Texto';
    templateIdInput.value = tpl.id;
    templateTitleInput.value = tpl.title;
    templateCategoryInput.value = tpl.category || '';
    templateTagsInput.value = (tpl.tags || []).join(', ');
    templateContentInput.value = tpl.content;
    templateModal.classList.remove('hidden');
    templateTitleInput.focus();
  }

  function closeModal() {
    templateModal.classList.add('hidden');
  }

  if (newTemplateBtn) newTemplateBtn.addEventListener('click', openNewModal);
  if (closeTemplateModalBtn) closeTemplateModalBtn.addEventListener('click', closeModal);
  if (cancelTemplateBtn) cancelTemplateBtn.addEventListener('click', closeModal);

  // Close on outside click
  if (templateModal) {
    templateModal.addEventListener('click', (e) => {
      if (e.target === templateModal) closeModal();
    });
  }

  // Form Submit
  if (templateForm) {
    templateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = templateIdInput.value.trim();
      const title = templateTitleInput.value.trim();
      const category = templateCategoryInput.value.trim() || 'Geral';
      const rawTags = templateTagsInput.value.trim();
      const content = templateContentInput.value;

      const tags = rawTags
        ? rawTags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean)
        : [];

      if (!title || !content) {
        showToast('Preencha o título e o conteúdo do template.', 'error');
        return;
      }

      if (id) {
        // Edit existing
        const index = templates.findIndex(t => t.id === id);
        if (index !== -1) {
          templates[index] = {
            ...templates[index],
            title,
            category,
            tags,
            content,
            updatedAt: new Date().toISOString()
          };
          showToast('Template atualizado com sucesso!', 'success');
        }
      } else {
        // Create new
        const newTpl = {
          id: 'tpl_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          title,
          category,
          tags,
          content,
          updatedAt: new Date().toISOString()
        };
        templates.unshift(newTpl);
        showToast('Novo template salvo!', 'success');
      }

      await saveTemplates();
      closeModal();
      renderTemplates();
    });
  }

  // Search & Filter Listeners
  if (templateSearchInput) {
    templateSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTemplates();
    });
  }

  if (categoryPills) {
    categoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategoryFilter = pill.getAttribute('data-category');
      renderTemplates();
    });
  }

  // Export Templates to JSON
  if (exportTemplatesBtn) {
    exportTemplatesBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templates, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `templates_canivete_tp_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup dos templates exportado com sucesso!', 'success');
    });
  }

  // Import Templates from JSON
  if (importTemplatesBtn && importFileInput) {
    importTemplatesBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            // Merge or replace
            const newTemplates = [...imported];
            templates = newTemplates;
            await saveTemplates();
            renderTemplates();
            showToast(`${imported.length} template(s) importado(s) com sucesso!`, 'success');
          } else {
            showToast('Arquivo JSON inválido.', 'error');
          }
        } catch (err) {
          showToast('Erro ao ler o arquivo JSON.', 'error');
        }
        importFileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Initialize Templates
  loadTemplates();


  // =========================================================================
  // MODULE 2: THUMBNAIL & IMAGE CREATOR (HTML5 CANVAS ENGINE)
  // =========================================================================
  const canvas = document.getElementById('mainCanvas');
  const ctx = canvas.getContext('2d');
  const canvasViewport = document.getElementById('canvasViewport');
  const canvasPresetSelect = document.getElementById('canvasPresetSelect');
  const customDimensionsGroup = document.getElementById('customDimensionsGroup');
  const customWidthInput = document.getElementById('customWidthInput');
  const customHeightInput = document.getElementById('customHeightInput');
  const applyCustomDimBtn = document.getElementById('applyCustomDimBtn');
  const toggleSafeZoneBtn = document.getElementById('toggleSafeZoneBtn');
  const safeZoneOverlay = document.getElementById('safeZoneOverlay');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const exportPngBtn = document.getElementById('exportPngBtn');
  const exportJpgBtn = document.getElementById('exportJpgBtn');
  const copyImageBtn = document.getElementById('copyImageBtn');

  // Left tools
  const toolAddText = document.getElementById('toolAddText');
  const toolUploadImage = document.getElementById('toolUploadImage');
  const imageFileInput = document.getElementById('imageFileInput');
  const toolAddBadge = document.getElementById('toolAddBadge');
  const canvasBgColorInput = document.getElementById('canvasBgColorInput');
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  const layersContainer = document.getElementById('layersContainer');

  // Right Inspector
  const emptySelectionMsg = document.getElementById('emptySelectionMsg');
  const textInspector = document.getElementById('textInspector');
  const imageInspector = document.getElementById('imageInspector');
  const shapeInspector = document.getElementById('shapeInspector');
  const elementActionsSection = document.getElementById('elementActionsSection');

  // Text Inspector Fields
  const propTextContent = document.getElementById('propTextContent');
  const propFontFamily = document.getElementById('propFontFamily');
  const propFontSize = document.getElementById('propFontSize');
  const propTextColor = document.getElementById('propTextColor');
  const propTextColorHex = document.getElementById('propTextColorHex');
  const propFontWeight = document.getElementById('propFontWeight');
  const propStrokeEnabled = document.getElementById('propStrokeEnabled');
  const strokeControls = document.getElementById('strokeControls');
  const propStrokeColor = document.getElementById('propStrokeColor');
  const propStrokeWidth = document.getElementById('propStrokeWidth');
  const propStrokeWidthVal = document.getElementById('propStrokeWidthVal');
  const propShadowEnabled = document.getElementById('propShadowEnabled');
  const shadowControls = document.getElementById('shadowControls');
  const propShadowColor = document.getElementById('propShadowColor');
  const propShadowBlur = document.getElementById('propShadowBlur');
  const propShadowBlurVal = document.getElementById('propShadowBlurVal');
  const propShadowOffsetY = document.getElementById('propShadowOffsetY');
  const propShadowOffsetX = document.getElementById('propShadowOffsetX');
  const propTextBgEnabled = document.getElementById('propTextBgEnabled');
  const textBgControls = document.getElementById('textBgControls');
  const propTextBgColor = document.getElementById('propTextBgColor');
  const propTextBgRadius = document.getElementById('propTextBgRadius');
  const propTextBgRadiusVal = document.getElementById('propTextBgRadiusVal');
  const propTextBgPadding = document.getElementById('propTextBgPadding');
  const propTextBgPaddingVal = document.getElementById('propTextBgPaddingVal');

  // Image Inspector Fields
  const propImageOpacity = document.getElementById('propImageOpacity');
  const propImageOpacityVal = document.getElementById('propImageOpacityVal');
  const propImageRadius = document.getElementById('propImageRadius');
  const propImageRadiusVal = document.getElementById('propImageRadiusVal');
  const propImgBorderEnabled = document.getElementById('propImgBorderEnabled');
  const imgBorderControls = document.getElementById('imgBorderControls');
  const propImgBorderColor = document.getElementById('propImgBorderColor');
  const propImgBorderWidth = document.getElementById('propImgBorderWidth');
  const propImgBorderWidthVal = document.getElementById('propImgBorderWidthVal');
  const propImgShadowEnabled = document.getElementById('propImgShadowEnabled');
  const imgShadowControls = document.getElementById('imgShadowControls');
  const propImgShadowColor = document.getElementById('propImgShadowColor');
  const propImgShadowBlur = document.getElementById('propImgShadowBlur');
  const propImgShadowBlurVal = document.getElementById('propImgShadowBlurVal');
  const btnFlipH = document.getElementById('btnFlipH');
  const btnFitCanvas = document.getElementById('btnFitCanvas');

  // Shape Inspector Fields
  const propShapeColor = document.getElementById('propShapeColor');
  const propShapeRadius = document.getElementById('propShapeRadius');
  const propShapeRadiusVal = document.getElementById('propShapeRadiusVal');
  const propShapeOpacity = document.getElementById('propShapeOpacity');
  const propShapeOpacityVal = document.getElementById('propShapeOpacityVal');

  // Layer order actions
  const btnBringForward = document.getElementById('btnBringForward');
  const btnSendBackward = document.getElementById('btnSendBackward');
  const btnDuplicateObj = document.getElementById('btnDuplicateObj');
  const btnDeleteObj = document.getElementById('btnDeleteObj');

  // Style Presets buttons
  const stylePresetBtns = document.querySelectorAll('.style-preset-btn');

  // Canvas State
  class CanvasEngine {
    constructor() {
      this.width = 1280;
      this.height = 720;
      this.bgColor = '#0f172a';
      this.elements = [];
      this.selectedId = null;

      // Interaction state
      this.isDragging = false;
      this.isResizing = false;
      this.isRotating = false;
      this.activeHandle = null;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.initialElementState = null;

      // History
      this.history = [];
      this.historyIndex = -1;

      // Safe zone
      this.showSafeZone = true;

      this.init();
    }

    init() {
      this.updateCanvasDimensions(1280, 720);
      this.setupEventListeners();
      this.setupInitialPreset();
      this.saveHistory();
    }

    setupInitialPreset() {
      // Create welcoming sample elements
      this.addElement({
        type: 'text',
        text: 'COMO CRIAR THUMBNAILS',
        fontFamily: "'Bebas Neue', cursive",
        fontSize: 96,
        fontWeight: '900',
        color: '#ffeb3b',
        strokeEnabled: true,
        strokeColor: '#000000',
        strokeWidth: 14,
        shadowEnabled: true,
        shadowColor: 'rgba(0, 0, 0, 0.8)',
        shadowBlur: 16,
        shadowOffsetX: 0,
        shadowOffsetY: 8,
        bgEnabled: false,
        bgColor: '#dc2626',
        bgRadius: 8,
        bgPadding: 16,
        x: 640,
        y: 280,
        rotation: -2,
        opacity: 1
      });

      this.addElement({
        type: 'text',
        text: 'QUE CHAMAM CLIQUES NO YOUTUBE',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 44,
        fontWeight: '900',
        color: '#ffffff',
        strokeEnabled: false,
        strokeColor: '#000000',
        strokeWidth: 8,
        shadowEnabled: true,
        shadowColor: 'rgba(0, 0, 0, 0.9)',
        shadowBlur: 12,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
        bgEnabled: true,
        bgColor: '#dc2626',
        bgRadius: 10,
        bgPadding: 14,
        x: 640,
        y: 420,
        rotation: 0,
        opacity: 1
      });
    }

    updateCanvasDimensions(w, h) {
      this.width = w;
      this.height = h;
      canvas.width = w;
      canvas.height = h;
      this.render();
    }

    saveHistory() {
      // Cut off redo steps
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }

      const snapshot = {
        width: this.width,
        height: this.height,
        bgColor: this.bgColor,
        elements: this.elements.map(el => ({ ...el }))
      };

      this.history.push(JSON.stringify(snapshot));
      this.historyIndex++;

      // Max 30 states
      if (this.history.length > 30) {
        this.history.shift();
        this.historyIndex--;
      }

      this.updateHistoryButtons();
    }

    undo() {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.loadSnapshot(this.history[this.historyIndex]);
      }
    }

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.loadSnapshot(this.history[this.historyIndex]);
      }
    }

    loadSnapshot(snapshotJson) {
      const data = JSON.parse(snapshotJson);
      this.width = data.width;
      this.height = data.height;
      this.bgColor = data.bgColor;
      canvas.width = data.width;
      canvas.height = data.height;
      canvasBgColorInput.value = data.bgColor;

      // Re-link images
      this.elements = data.elements.map(el => {
        if (el.type === 'image' && el.src) {
          const img = new Image();
          img.src = el.src;
          el.img = img;
        }
        return el;
      });

      this.selectedId = null;
      this.render();
      this.updateInspector();
      this.renderLayers();
      this.updateHistoryButtons();
    }

    updateHistoryButtons() {
      undoBtn.disabled = this.historyIndex <= 0;
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }

    addElement(el) {
      const id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      el.id = id;
      this.elements.push(el);
      this.selectedId = id;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    getSelected() {
      return this.elements.find(el => el.id === this.selectedId);
    }

    deleteSelected() {
      if (!this.selectedId) return;
      this.elements = this.elements.filter(el => el.id !== this.selectedId);
      this.selectedId = null;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    duplicateSelected() {
      const sel = this.getSelected();
      if (!sel) return;
      const copy = { ...sel };
      copy.id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      copy.x += 30;
      copy.y += 30;
      this.elements.push(copy);
      this.selectedId = copy.id;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    bringForward() {
      const index = this.elements.findIndex(el => el.id === this.selectedId);
      if (index !== -1 && index < this.elements.length - 1) {
        const item = this.elements.splice(index, 1)[0];
        this.elements.splice(index + 1, 0, item);
        this.saveHistory();
        this.render();
        this.renderLayers();
      }
    }

    sendBackward() {
      const index = this.elements.findIndex(el => el.id === this.selectedId);
      if (index > 0) {
        const item = this.elements.splice(index, 1)[0];
        this.elements.splice(index - 1, 0, item);
        this.saveHistory();
        this.render();
        this.renderLayers();
      }
    }

    // MAIN RENDER PIPELINE
    render(skipSelection = false) {
      ctx.clearRect(0, 0, this.width, this.height);

      // 1. Draw Canvas Background
      ctx.fillStyle = this.bgColor;
      ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw Elements in order
      this.elements.forEach(el => {
        ctx.save();
        ctx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;

        // Position & Rotate around element center
        ctx.translate(el.x, el.y);
        if (el.rotation) {
          ctx.rotate((el.rotation * Math.PI) / 180);
        }

        if (el.type === 'text') {
          this.renderTextElement(el);
        } else if (el.type === 'image') {
          this.renderImageElement(el);
        } else if (el.type === 'shape') {
          this.renderShapeElement(el);
        }

        ctx.restore();
      });

      // 3. Draw Selection Box & Handles (if not exporting)
      if (!skipSelection && this.selectedId) {
        const sel = this.getSelected();
        if (sel) {
          this.renderSelectionOutline(sel);
        }
      }
    }

    renderTextElement(el) {
      ctx.font = `${el.fontWeight || '900'} ${el.fontSize}px ${el.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = String(el.text || '').split('\n');
      const lineHeight = el.fontSize * 1.15;
      const totalHeight = lines.length * lineHeight;

      // Calculate width & height bounding box
      let maxLineWidth = 0;
      lines.forEach(l => {
        const m = ctx.measureText(l);
        if (m.width > maxLineWidth) maxLineWidth = m.width;
      });

      el.computedWidth = maxLineWidth;
      el.computedHeight = totalHeight;

      // Draw background badge if enabled
      if (el.bgEnabled) {
        const pad = el.bgPadding || 14;
        const bgW = maxLineWidth + pad * 2;
        const bgH = totalHeight + pad * 1.4;
        const rad = el.bgRadius !== undefined ? el.bgRadius : 10;

        ctx.save();
        ctx.fillStyle = el.bgColor || '#dc2626';
        if (el.shadowEnabled) {
          ctx.shadowColor = el.shadowColor || 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = el.shadowBlur || 15;
          ctx.shadowOffsetX = el.shadowOffsetX || 0;
          ctx.shadowOffsetY = el.shadowOffsetY || 6;
        }
        this.roundRect(ctx, -bgW / 2, -bgH / 2, bgW, bgH, rad);
        ctx.fill();
        ctx.restore();
      }

      // Draw lines
      const startY = -(totalHeight / 2) + (lineHeight / 2);

      lines.forEach((line, i) => {
        const currY = startY + i * lineHeight;

        // Shadow
        if (el.shadowEnabled && !el.bgEnabled) {
          ctx.shadowColor = el.shadowColor || 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = el.shadowBlur || 15;
          ctx.shadowOffsetX = el.shadowOffsetX || 0;
          ctx.shadowOffsetY = el.shadowOffsetY || 6;
        } else {
          ctx.shadowColor = 'transparent';
        }

        // Stroke / Outline
        if (el.strokeEnabled && el.strokeWidth > 0) {
          ctx.strokeStyle = el.strokeColor || '#000000';
          ctx.lineWidth = el.strokeWidth * 2;
          ctx.lineJoin = 'round';
          ctx.miterLimit = 2;
          ctx.strokeText(line, 0, currY);
        }

        // Fill Text
        ctx.fillStyle = el.color || '#ffffff';
        ctx.fillText(line, 0, currY);
      });
    }

    renderImageElement(el) {
      if (!el.img || !el.img.complete) return;

      const w = el.width || 300;
      const h = el.height || 200;

      ctx.save();

      // Horizontal / Vertical Flip
      if (el.flipH || el.flipV) {
        ctx.scale(el.flipH ? -1 : 1, el.flipV ? -1 : 1);
      }

      // Shadow
      if (el.shadowEnabled) {
        ctx.shadowColor = el.shadowColor || 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = el.shadowBlur || 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 8;
      }

      // Rounded corners clipping
      if (el.borderRadius && el.borderRadius > 0) {
        this.roundRect(ctx, -w / 2, -h / 2, w, h, el.borderRadius);
        ctx.clip();
      }

      ctx.drawImage(el.img, -w / 2, -h / 2, w, h);

      // Border / Stroke
      if (el.borderEnabled && el.borderWidth > 0) {
        ctx.strokeStyle = el.borderColor || '#ffffff';
        ctx.lineWidth = el.borderWidth;
        this.roundRect(ctx, -w / 2, -h / 2, w, h, el.borderRadius || 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    renderShapeElement(el) {
      const w = el.width || 400;
      const h = el.height || 80;
      const rad = el.borderRadius || 10;

      ctx.save();
      ctx.fillStyle = el.color || '#ff5722';
      this.roundRect(ctx, -w / 2, -h / 2, w, h, rad);
      ctx.fill();
      ctx.restore();
    }

    renderSelectionOutline(el) {
      ctx.save();
      ctx.translate(el.x, el.y);
      if (el.rotation) {
        ctx.rotate((el.rotation * Math.PI) / 180);
      }

      const dims = this.getElementDimensions(el);
      const pad = 8;
      const halfW = dims.w / 2 + pad;
      const halfH = dims.h / 2 + pad;

      // Dashed bounding box
      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-halfW, -halfH, halfW * 2, halfH * 2);
      ctx.setLineDash([]);

      // Corner handles
      const handleSize = 10;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;

      const corners = [
        [-halfW, -halfH],
        [halfW, -halfH],
        [halfW, halfH],
        [-halfW, halfH]
      ];

      corners.forEach(([cx, cy]) => {
        ctx.fillRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
      });

      // Top Rotation handle
      const rotY = -halfH - 24;
      ctx.beginPath();
      ctx.moveTo(0, -halfH);
      ctx.lineTo(0, rotY);
      ctx.strokeStyle = '#ff5722';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, rotY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff5722';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.restore();
    }

    getElementDimensions(el) {
      if (el.type === 'text') {
        const pad = el.bgEnabled ? (el.bgPadding || 14) * 2 : 0;
        return {
          w: (el.computedWidth || 200) + pad,
          h: (el.computedHeight || 80) + pad
        };
      }
      return {
        w: el.width || 300,
        h: el.height || 200
      };
    }

    roundRect(context, x, y, width, height, radius) {
      if (typeof radius === 'undefined') radius = 5;
      if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (let side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      context.beginPath();
      context.moveTo(x + radius.tl, y);
      context.lineTo(x + width - radius.tr, y);
      context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      context.lineTo(x + width, y + height - radius.br);
      context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      context.lineTo(x + radius.bl, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      context.lineTo(x, y + radius.tl);
      context.quadraticCurveTo(x, y, x + radius.tl, y);
      context.closePath();
    }

    // HIT TESTING & INTERACTION
    getCanvasCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    setupEventListeners() {
      canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
      window.addEventListener('mouseup', () => this.handleMouseUp());

      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        // Only trigger if not focusing an input or textarea
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        if (e.key === 'Delete' || e.key === 'Backspace') {
          this.deleteSelected();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault();
          this.redo();
        } else if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
          e.preventDefault();
          this.duplicateSelected();
        } else if (e.key === 'ArrowUp') {
          const sel = this.getSelected();
          if (sel) { sel.y -= e.shiftKey ? 10 : 1; this.render(); }
        } else if (e.key === 'ArrowDown') {
          const sel = this.getSelected();
          if (sel) { sel.y += e.shiftKey ? 10 : 1; this.render(); }
        } else if (e.key === 'ArrowLeft') {
          const sel = this.getSelected();
          if (sel) { sel.x -= e.shiftKey ? 10 : 1; this.render(); }
        } else if (e.key === 'ArrowRight') {
          const sel = this.getSelected();
          if (sel) { sel.x += e.shiftKey ? 10 : 1; this.render(); }
        }
      });

      // CLIPBOARD PASTE LISTENER (Ctrl+V / Cmd+V)
      window.addEventListener('paste', async (e) => {
        // If typing in template modal or form input, allow native paste
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
          if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = (event) => {
              this.addImageFromSrc(event.target.result);
              showToast('Imagem colada com sucesso!', 'success');
            };
            reader.readAsDataURL(blob);
            break;
          }
        }
      });

      // DRAG & DROP ON CANVAS
      canvasViewport.addEventListener('dragover', (e) => {
        e.preventDefault();
        canvasViewport.style.backgroundColor = '#1e293b';
      });

      canvasViewport.addEventListener('dragleave', () => {
        canvasViewport.style.backgroundColor = '';
      });

      canvasViewport.addEventListener('drop', (e) => {
        e.preventDefault();
        canvasViewport.style.backgroundColor = '';
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          const file = e.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
              this.addImageFromSrc(event.target.result);
              showToast('Imagem carregada!', 'success');
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }

    handleMouseDown(e) {
      const coords = this.getCanvasCoords(e);
      this.dragStartX = coords.x;
      this.dragStartY = coords.y;

      const sel = this.getSelected();

      // Check if clicking rotation or resize handle
      if (sel) {
        const handle = this.checkHandleHit(sel, coords.x, coords.y);
        if (handle === 'rotate') {
          this.isRotating = true;
          this.initialElementState = { ...sel };
          return;
        } else if (handle) {
          this.isResizing = true;
          this.activeHandle = handle;
          this.initialElementState = { ...sel };
          return;
        }
      }

      // Check element hits (from top to bottom layer)
      let hitElement = null;
      for (let i = this.elements.length - 1; i >= 0; i--) {
        const el = this.elements[i];
        if (this.isPointInsideElement(el, coords.x, coords.y)) {
          hitElement = el;
          break;
        }
      }

      if (hitElement) {
        this.selectedId = hitElement.id;
        this.isDragging = true;
        this.initialElementState = { ...hitElement };
      } else {
        this.selectedId = null;
      }

      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    handleMouseMove(e) {
      const coords = this.getCanvasCoords(e);
      const sel = this.getSelected();

      // Change cursor style based on hover
      if (!this.isDragging && !this.isResizing && !this.isRotating) {
        if (sel) {
          const handle = this.checkHandleHit(sel, coords.x, coords.y);
          if (handle === 'rotate') {
            canvas.style.cursor = 'grab';
            return;
          } else if (handle) {
            canvas.style.cursor = 'nwse-resize';
            return;
          }
        }

        let isOverObj = false;
        for (let i = this.elements.length - 1; i >= 0; i--) {
          if (this.isPointInsideElement(this.elements[i], coords.x, coords.y)) {
            isOverObj = true;
            break;
          }
        }
        canvas.style.cursor = isOverObj ? 'move' : 'default';
        return;
      }

      if (this.isDragging && sel) {
        const dx = coords.x - this.dragStartX;
        const dy = coords.y - this.dragStartY;
        sel.x = this.initialElementState.x + dx;
        sel.y = this.initialElementState.y + dy;
        this.render();
      } else if (this.isRotating && sel) {
        const angleRad = Math.atan2(coords.y - sel.y, coords.x - sel.x);
        let deg = (angleRad * 180) / Math.PI + 90;
        sel.rotation = Math.round(deg);
        this.render();
      } else if (this.isResizing && sel) {
        const dx = coords.x - this.dragStartX;
        const dy = coords.y - this.dragStartY;

        if (sel.type === 'text') {
          const scaleFactor = 1 + dy / 200;
          sel.fontSize = Math.max(12, Math.min(300, Math.round(this.initialElementState.fontSize * scaleFactor)));
          propFontSize.value = sel.fontSize;
        } else {
          // Image / Shape scale
          const newW = Math.max(40, this.initialElementState.width + dx * 2);
          const ratio = this.initialElementState.width / this.initialElementState.height;
          sel.width = Math.round(newW);
          sel.height = Math.round(newW / ratio);
        }
        this.render();
      }
    }

    handleMouseUp() {
      if (this.isDragging || this.isResizing || this.isRotating) {
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.activeHandle = null;
        this.saveHistory();
      }
    }

    isPointInsideElement(el, px, py) {
      // Untransform point to local coordinates
      const rad = -(el.rotation || 0) * (Math.PI / 180);
      const dx = px - el.x;
      const dy = py - el.y;

      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      const dims = this.getElementDimensions(el);
      const halfW = dims.w / 2;
      const halfH = dims.h / 2;

      return localX >= -halfW && localX <= halfW && localY >= -halfH && localY <= halfH;
    }

    checkHandleHit(el, px, py) {
      const rad = -(el.rotation || 0) * (Math.PI / 180);
      const dx = px - el.x;
      const dy = py - el.y;

      const localX = dx * Math.cos(rad) - dy * Math.sin(rad);
      const localY = dx * Math.sin(rad) + dy * Math.cos(rad);

      const dims = this.getElementDimensions(el);
      const pad = 8;
      const halfW = dims.w / 2 + pad;
      const halfH = dims.h / 2 + pad;

      // Check rotation handle
      const rotY = -halfH - 24;
      const distToRot = Math.hypot(localX - 0, localY - rotY);
      if (distToRot < 14) return 'rotate';

      // Check corner handles
      const handleHitRadius = 14;
      if (Math.hypot(localX - (-halfW), localY - (-halfH)) < handleHitRadius) return 'tl';
      if (Math.hypot(localX - halfW, localY - (-halfH)) < handleHitRadius) return 'tr';
      if (Math.hypot(localX - halfW, localY - halfH) < handleHitRadius) return 'br';
      if (Math.hypot(localX - (-halfW), localY - halfH) < handleHitRadius) return 'bl';

      return null;
    }

    addImageFromSrc(src) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let w = img.naturalWidth || 400;
        let h = img.naturalHeight || 300;

        // Scale down if too big for canvas
        const maxCanvasDim = Math.min(this.width, this.height) * 0.7;
        if (w > maxCanvasDim || h > maxCanvasDim) {
          const scale = maxCanvasDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        this.addElement({
          type: 'image',
          img: img,
          src: src,
          width: w,
          height: h,
          origWidth: img.naturalWidth,
          origHeight: img.naturalHeight,
          x: this.width / 2,
          y: this.height / 2,
          rotation: 0,
          opacity: 1,
          borderRadius: 0,
          borderEnabled: false,
          borderColor: '#ffffff',
          borderWidth: 6,
          shadowEnabled: false,
          shadowColor: 'rgba(0,0,0,0.8)',
          shadowBlur: 20,
          flipH: false,
          flipV: false
        });
      };
      img.src = src;
    }

    // PROPERTIES INSPECTOR SYNC
    updateInspector() {
      const sel = this.getSelected();

      if (!sel) {
        emptySelectionMsg.classList.remove('hidden');
        textInspector.classList.add('hidden');
        imageInspector.classList.add('hidden');
        shapeInspector.classList.add('hidden');
        elementActionsSection.classList.add('hidden');
        return;
      }

      emptySelectionMsg.classList.add('hidden');
      elementActionsSection.classList.remove('hidden');

      if (sel.type === 'text') {
        textInspector.classList.remove('hidden');
        imageInspector.classList.add('hidden');
        shapeInspector.classList.add('hidden');

        propTextContent.value = sel.text || '';
        propFontFamily.value = sel.fontFamily || "'Bebas Neue', cursive";
        propFontSize.value = sel.fontSize || 80;
        propTextColor.value = sel.color || '#ffffff';
        propTextColorHex.textContent = sel.color || '#ffffff';
        propFontWeight.value = sel.fontWeight || '900';

        // Stroke
        propStrokeEnabled.checked = Boolean(sel.strokeEnabled);
        strokeControls.classList.toggle('hidden', !sel.strokeEnabled);
        propStrokeColor.value = sel.strokeColor || '#000000';
        propStrokeWidth.value = sel.strokeWidth || 12;
        propStrokeWidthVal.textContent = sel.strokeWidth || 12;

        // Shadow
        propShadowEnabled.checked = Boolean(sel.shadowEnabled);
        shadowControls.classList.toggle('hidden', !sel.shadowEnabled);
        propShadowColor.value = sel.shadowColor || '#000000';
        propShadowBlur.value = sel.shadowBlur || 15;
        propShadowBlurVal.textContent = sel.shadowBlur || 15;
        propShadowOffsetY.value = sel.shadowOffsetY !== undefined ? sel.shadowOffsetY : 6;
        propShadowOffsetX.value = sel.shadowOffsetX !== undefined ? sel.shadowOffsetX : 0;

        // Bg Badge
        propTextBgEnabled.checked = Boolean(sel.bgEnabled);
        textBgControls.classList.toggle('hidden', !sel.bgEnabled);
        propTextBgColor.value = sel.bgColor || '#dc2626';
        propTextBgRadius.value = sel.bgRadius !== undefined ? sel.bgRadius : 10;
        propTextBgRadiusVal.textContent = sel.bgRadius !== undefined ? sel.bgRadius : 10;
        propTextBgPadding.value = sel.bgPadding !== undefined ? sel.bgPadding : 14;
        propTextBgPaddingVal.textContent = sel.bgPadding !== undefined ? sel.bgPadding : 14;

      } else if (sel.type === 'image') {
        textInspector.classList.add('hidden');
        imageInspector.classList.remove('hidden');
        shapeInspector.classList.add('hidden');

        propImageOpacity.value = Math.round((sel.opacity !== undefined ? sel.opacity : 1) * 100);
        propImageOpacityVal.textContent = propImageOpacity.value;
        propImageRadius.value = sel.borderRadius || 0;
        propImageRadiusVal.textContent = sel.borderRadius || 0;

        propImgBorderEnabled.checked = Boolean(sel.borderEnabled);
        imgBorderControls.classList.toggle('hidden', !sel.borderEnabled);
        propImgBorderColor.value = sel.borderColor || '#ffffff';
        propImgBorderWidth.value = sel.borderWidth || 6;
        propImgBorderWidthVal.textContent = sel.borderWidth || 6;

        propImgShadowEnabled.checked = Boolean(sel.shadowEnabled);
        imgShadowControls.classList.toggle('hidden', !sel.shadowEnabled);
        propImgShadowColor.value = sel.shadowColor || '#000000';
        propImgShadowBlur.value = sel.shadowBlur || 20;
        propImgShadowBlurVal.textContent = sel.shadowBlur || 20;

      } else if (sel.type === 'shape') {
        textInspector.classList.add('hidden');
        imageInspector.classList.add('hidden');
        shapeInspector.classList.remove('hidden');

        propShapeColor.value = sel.color || '#ff5722';
        propShapeRadius.value = sel.borderRadius || 12;
        propShapeRadiusVal.textContent = sel.borderRadius || 12;
        propShapeOpacity.value = Math.round((sel.opacity !== undefined ? sel.opacity : 1) * 100);
        propShapeOpacityVal.textContent = propShapeOpacity.value;
      }
    }

    renderLayers() {
      layersContainer.innerHTML = '';
      if (this.elements.length === 0) {
        layersContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-dim);">Nenhuma camada</span>`;
        return;
      }

      // Render top-to-bottom
      [...this.elements].reverse().forEach((el) => {
        const item = document.createElement('div');
        item.className = `layer-item ${el.id === this.selectedId ? 'active' : ''}`;

        let icon = '📝';
        let label = el.text ? el.text.slice(0, 16) : 'Texto';
        if (el.type === 'image') {
          icon = '🖼️';
          label = 'Imagem';
        } else if (el.type === 'shape') {
          icon = '⬛';
          label = 'Tarja / Forma';
        }

        item.innerHTML = `
          <span class="layer-icon">${icon}</span>
          <span style="flex: 1; margin-left: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(label)}</span>
        `;

        item.addEventListener('click', () => {
          this.selectedId = el.id;
          this.render();
          this.updateInspector();
          this.renderLayers();
        });

        layersContainer.appendChild(item);
      });
    }
  }

  const canvasEngine = new CanvasEngine();

  // Preset Selector change
  canvasPresetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      customDimensionsGroup.classList.remove('hidden');
    } else {
      customDimensionsGroup.classList.add('hidden');
      const [w, h] = val.split('x').map(Number);
      canvasEngine.updateCanvasDimensions(w, h);
    }
  });

  applyCustomDimBtn.addEventListener('click', () => {
    const w = parseInt(customWidthInput.value, 10) || 1280;
    const h = parseInt(customHeightInput.value, 10) || 720;
    canvasEngine.updateCanvasDimensions(w, h);
  });

  // Safe zone guide toggle
  toggleSafeZoneBtn.addEventListener('click', () => {
    canvasEngine.showSafeZone = !canvasEngine.showSafeZone;
    toggleSafeZoneBtn.classList.toggle('active', canvasEngine.showSafeZone);
    safeZoneOverlay.classList.toggle('active', canvasEngine.showSafeZone);
  });

  // Undo / Redo buttons
  undoBtn.addEventListener('click', () => canvasEngine.undo());
  redoBtn.addEventListener('click', () => canvasEngine.redo());

  // Clear Canvas
  clearCanvasBtn.addEventListener('click', () => {
    if (confirm('Deseja limpar todos os elementos do canvas?')) {
      canvasEngine.elements = [];
      canvasEngine.selectedId = null;
      canvasEngine.saveHistory();
      canvasEngine.render();
      canvasEngine.updateInspector();
      canvasEngine.renderLayers();
      showToast('Canvas limpo!', 'success');
    }
  });

  // Left Tool: Add Text
  toolAddText.addEventListener('click', () => {
    canvasEngine.addElement({
      type: 'text',
      text: 'TEXTO DE IMPACTO',
      fontFamily: "'Bebas Neue', cursive",
      fontSize: 80,
      fontWeight: '900',
      color: '#ffffff',
      strokeEnabled: true,
      strokeColor: '#000000',
      strokeWidth: 12,
      shadowEnabled: true,
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 6,
      bgEnabled: false,
      bgColor: '#dc2626',
      bgRadius: 8,
      bgPadding: 14,
      x: canvasEngine.width / 2,
      y: canvasEngine.height / 2,
      rotation: 0,
      opacity: 1
    });
  });

  // Left Tool: Upload Image
  toolUploadImage.addEventListener('click', () => imageFileInput.click());
  imageFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        canvasEngine.addImageFromSrc(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
      imageFileInput.value = '';
    }
  });

  // Left Tool: Add Badge / Shape
  toolAddBadge.addEventListener('click', () => {
    canvasEngine.addElement({
      type: 'shape',
      color: '#ff5722',
      width: 450,
      height: 90,
      borderRadius: 14,
      opacity: 1,
      x: canvasEngine.width / 2,
      y: canvasEngine.height / 2,
      rotation: 0
    });
  });

  // Background Color Swatches
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      canvasEngine.bgColor = color;
      canvasBgColorInput.value = color;
      canvasEngine.saveHistory();
      canvasEngine.render();
    });
  });

  canvasBgColorInput.addEventListener('input', (e) => {
    canvasEngine.bgColor = e.target.value;
    canvasEngine.render();
  });
  canvasBgColorInput.addEventListener('change', () => canvasEngine.saveHistory());

  // Text Property Listeners
  propTextContent.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.text = e.target.value;
      canvasEngine.render();
    }
  });
  propTextContent.addEventListener('change', () => canvasEngine.saveHistory());

  propFontFamily.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.fontFamily = e.target.value;
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propFontSize.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.fontSize = parseInt(e.target.value, 10) || 40;
      canvasEngine.render();
    }
  });
  propFontSize.addEventListener('change', () => canvasEngine.saveHistory());

  propTextColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.color = e.target.value;
      propTextColorHex.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propTextColor.addEventListener('change', () => canvasEngine.saveHistory());

  propFontWeight.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.fontWeight = e.target.value;
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propStrokeEnabled.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.strokeEnabled = e.target.checked;
      strokeControls.classList.toggle('hidden', !e.target.checked);
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propStrokeColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.strokeColor = e.target.value;
      canvasEngine.render();
    }
  });
  propStrokeColor.addEventListener('change', () => canvasEngine.saveHistory());

  propStrokeWidth.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.strokeWidth = parseInt(e.target.value, 10);
      propStrokeWidthVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propStrokeWidth.addEventListener('change', () => canvasEngine.saveHistory());

  propShadowEnabled.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.shadowEnabled = e.target.checked;
      shadowControls.classList.toggle('hidden', !e.target.checked);
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propShadowColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.shadowColor = e.target.value;
      canvasEngine.render();
    }
  });
  propShadowColor.addEventListener('change', () => canvasEngine.saveHistory());

  propShadowBlur.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.shadowBlur = parseInt(e.target.value, 10);
      propShadowBlurVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propShadowBlur.addEventListener('change', () => canvasEngine.saveHistory());

  propShadowOffsetY.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.shadowOffsetY = parseInt(e.target.value, 10) || 0;
      canvasEngine.render();
    }
  });
  propShadowOffsetY.addEventListener('change', () => canvasEngine.saveHistory());

  propShadowOffsetX.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.shadowOffsetX = parseInt(e.target.value, 10) || 0;
      canvasEngine.render();
    }
  });
  propShadowOffsetX.addEventListener('change', () => canvasEngine.saveHistory());

  // Text Background Badge
  propTextBgEnabled.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.bgEnabled = e.target.checked;
      textBgControls.classList.toggle('hidden', !e.target.checked);
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propTextBgColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.bgColor = e.target.value;
      canvasEngine.render();
    }
  });
  propTextBgColor.addEventListener('change', () => canvasEngine.saveHistory());

  propTextBgRadius.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.bgRadius = parseInt(e.target.value, 10);
      propTextBgRadiusVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propTextBgRadius.addEventListener('change', () => canvasEngine.saveHistory());

  propTextBgPadding.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'text') {
      sel.bgPadding = parseInt(e.target.value, 10);
      propTextBgPaddingVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propTextBgPadding.addEventListener('change', () => canvasEngine.saveHistory());

  // Style Presets for YouTube
  stylePresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      const sel = canvasEngine.getSelected();
      if (!sel || sel.type !== 'text') return;

      if (preset === 'yt-yellow') {
        sel.color = '#ffeb3b';
        sel.strokeEnabled = true;
        sel.strokeColor = '#000000';
        sel.strokeWidth = 14;
        sel.shadowEnabled = true;
        sel.shadowColor = 'rgba(0,0,0,0.8)';
        sel.shadowBlur = 16;
        sel.bgEnabled = false;
      } else if (preset === 'yt-white-red') {
        sel.color = '#ffffff';
        sel.strokeEnabled = false;
        sel.shadowEnabled = true;
        sel.shadowColor = 'rgba(0,0,0,0.8)';
        sel.shadowBlur = 12;
        sel.bgEnabled = true;
        sel.bgColor = '#dc2626';
        sel.bgRadius = 10;
        sel.bgPadding = 14;
      } else if (preset === 'yt-green') {
        sel.color = '#00ff66';
        sel.strokeEnabled = true;
        sel.strokeColor = '#000000';
        sel.strokeWidth = 12;
        sel.shadowEnabled = true;
        sel.shadowColor = '#00ff66';
        sel.shadowBlur = 24;
        sel.bgEnabled = false;
      } else if (preset === 'yt-fire') {
        sel.color = '#ff7700';
        sel.strokeEnabled = true;
        sel.strokeColor = '#000000';
        sel.strokeWidth = 14;
        sel.shadowEnabled = true;
        sel.shadowColor = '#ef4444';
        sel.shadowBlur = 22;
        sel.bgEnabled = false;
      }

      canvasEngine.saveHistory();
      canvasEngine.render();
      canvasEngine.updateInspector();
    });
  });

  // Image Property Listeners
  propImageOpacity.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.opacity = parseInt(e.target.value, 10) / 100;
      propImageOpacityVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propImageOpacity.addEventListener('change', () => canvasEngine.saveHistory());

  propImageRadius.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.borderRadius = parseInt(e.target.value, 10);
      propImageRadiusVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propImageRadius.addEventListener('change', () => canvasEngine.saveHistory());

  propImgBorderEnabled.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.borderEnabled = e.target.checked;
      imgBorderControls.classList.toggle('hidden', !e.target.checked);
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propImgBorderColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.borderColor = e.target.value;
      canvasEngine.render();
    }
  });
  propImgBorderColor.addEventListener('change', () => canvasEngine.saveHistory());

  propImgBorderWidth.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.borderWidth = parseInt(e.target.value, 10);
      propImgBorderWidthVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propImgBorderWidth.addEventListener('change', () => canvasEngine.saveHistory());

  propImgShadowEnabled.addEventListener('change', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.shadowEnabled = e.target.checked;
      imgShadowControls.classList.toggle('hidden', !e.target.checked);
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  propImgShadowColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.shadowColor = e.target.value;
      canvasEngine.render();
    }
  });
  propImgShadowColor.addEventListener('change', () => canvasEngine.saveHistory());

  propImgShadowBlur.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.shadowBlur = parseInt(e.target.value, 10);
      propImgShadowBlurVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propImgShadowBlur.addEventListener('change', () => canvasEngine.saveHistory());

  btnFlipH.addEventListener('click', () => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.flipH = !sel.flipH;
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  btnFitCanvas.addEventListener('click', () => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'image') {
      sel.x = canvasEngine.width / 2;
      sel.y = canvasEngine.height / 2;
      sel.width = canvasEngine.width;
      sel.height = canvasEngine.height;
      sel.rotation = 0;
      canvasEngine.saveHistory();
      canvasEngine.render();
    }
  });

  // Shape Property Listeners
  propShapeColor.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'shape') {
      sel.color = e.target.value;
      canvasEngine.render();
    }
  });
  propShapeColor.addEventListener('change', () => canvasEngine.saveHistory());

  propShapeRadius.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'shape') {
      sel.borderRadius = parseInt(e.target.value, 10);
      propShapeRadiusVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propShapeRadius.addEventListener('change', () => canvasEngine.saveHistory());

  propShapeOpacity.addEventListener('input', (e) => {
    const sel = canvasEngine.getSelected();
    if (sel && sel.type === 'shape') {
      sel.opacity = parseInt(e.target.value, 10) / 100;
      propShapeOpacityVal.textContent = e.target.value;
      canvasEngine.render();
    }
  });
  propShapeOpacity.addEventListener('change', () => canvasEngine.saveHistory());

  // Layer & Object Actions
  btnBringForward.addEventListener('click', () => canvasEngine.bringForward());
  btnSendBackward.addEventListener('click', () => canvasEngine.sendBackward());
  btnDuplicateObj.addEventListener('click', () => canvasEngine.duplicateSelected());
  btnDeleteObj.addEventListener('click', () => canvasEngine.deleteSelected());

  // EXPORT ACTIONS
  function getCleanCanvasDataUrl(format = 'image/png', quality = 0.95) {
    // Render cleanly without bounding boxes
    canvasEngine.render(true);
    const dataUrl = canvas.toDataURL(format, quality);
    // Restore selection box
    canvasEngine.render(false);
    return dataUrl;
  }

  exportPngBtn.addEventListener('click', () => {
    const dataUrl = getCleanCanvasDataUrl('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `thumbnail_yt_${canvasEngine.width}x${canvasEngine.height}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Thumbnail PNG baixada em alta resolução!', 'success');
  });

  exportJpgBtn.addEventListener('click', () => {
    const dataUrl = getCleanCanvasDataUrl('image/jpeg', 0.92);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `thumbnail_yt_${canvasEngine.width}x${canvasEngine.height}_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Thumbnail JPG baixada com sucesso!', 'success');
  });

  copyImageBtn.addEventListener('click', async () => {
    try {
      canvasEngine.render(true);
      canvas.toBlob(async (blob) => {
        canvasEngine.render(false);
        if (!blob) {
          showToast('Erro ao gerar imagem.', 'error');
          return;
        }
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Imagem copiada para a área de transferência! (Pode colar no WhatsApp, Discord, etc.)', 'success');
      }, 'image/png');
    } catch (err) {
      console.error('Erro ao copiar imagem:', err);
      showToast('Não foi possível copiar a imagem diretamente.', 'error');
    }
  });

});
