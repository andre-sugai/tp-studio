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
  // SIDEBAR COLLAPSE / EXPAND TOGGLE
  // =========================================================================
  const sidebar = document.getElementById('sidebar');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarBrand = document.getElementById('sidebarBrand');
  const SIDEBAR_STORAGE_KEY = 'tp_sidebar_collapsed';

  // Restore saved state from localStorage
  const isSidebarCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  if (isSidebarCollapsed && sidebar) {
    sidebar.classList.add('collapsed');
    if (sidebarToggleBtn) {
      sidebarToggleBtn.setAttribute('title', 'Expandir barra lateral (Ctrl+B)');
      sidebarToggleBtn.setAttribute('aria-label', 'Expandir barra lateral (Ctrl+B)');
    }
  }

  function toggleSidebar() {
    if (!sidebar) return;
    const collapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem(SIDEBAR_STORAGE_KEY, collapsed ? 'true' : 'false');
    
    if (sidebarToggleBtn) {
      const label = collapsed ? 'Expandir barra lateral (Ctrl+B)' : 'Recolher barra lateral (Ctrl+B)';
      sidebarToggleBtn.setAttribute('title', label);
      sidebarToggleBtn.setAttribute('aria-label', label);
    }
  }

  if (sidebarToggleBtn) {
    sidebarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Clicking header while collapsed expands sidebar
  if (sidebarBrand) {
    sidebarBrand.addEventListener('click', (e) => {
      if (sidebar && sidebar.classList.contains('collapsed') && e.target !== sidebarToggleBtn && !sidebarToggleBtn?.contains(e.target)) {
        toggleSidebar();
      }
    });
  }

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      toggleSidebar();
    }
  });

  // Notify components on transition end
  if (sidebar) {
    sidebar.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'width') {
        window.dispatchEvent(new Event('resize'));
        if (typeof canvasEngine !== 'undefined' && canvasEngine && canvasEngine.render) {
          canvasEngine.render();
        }
      }
    });
  }

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
  // MODULE 1.5: QUICK LINKS MANAGER (SITES DE ACESSO RÁPIDO)
  // =========================================================================
  const LINKS_STORAGE_KEY = 'tp_quick_links';

  const defaultQuickLinks = [
    {
      id: 'link_yt_studio',
      title: 'YouTube Studio',
      url: 'https://studio.youtube.com',
      category: 'YouTube',
      description: 'Painel de controle, estatísticas e gerenciamento do canal',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'link_canva',
      title: 'Canva',
      url: 'https://www.canva.com',
      category: 'Design',
      description: 'Criação de banners, elementos e designs rápidos',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'link_chatgpt',
      title: 'ChatGPT',
      url: 'https://chatgpt.com',
      category: 'IA',
      description: 'Roteiros, títulos virais e ideias de conteúdo',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'link_removebg',
      title: 'Remove.bg',
      url: 'https://www.remove.bg',
      category: 'Ferramentas',
      description: 'Removedor automático de fundo de fotos para thumbnails',
      updatedAt: new Date().toISOString()
    }
  ];

  let quickLinks = [];
  let currentLinkCategory = 'all';
  let linkSearchQuery = '';

  // DOM Elements
  const linksGrid = document.getElementById('linksGrid');
  const linkSearchInput = document.getElementById('linkSearchInput');
  const linkCategoryPills = document.getElementById('linkCategoryPills');
  const newLinkBtn = document.getElementById('newLinkBtn');
  const exportLinksBtn = document.getElementById('exportLinksBtn');
  const importLinksBtn = document.getElementById('importLinksBtn');
  const importLinksFileInput = document.getElementById('importLinksFileInput');

  // Modal Elements
  const linkModal = document.getElementById('linkModal');
  const linkModalTitle = document.getElementById('linkModalTitle');
  const closeLinkModalBtn = document.getElementById('closeLinkModalBtn');
  const cancelLinkBtn = document.getElementById('cancelLinkBtn');
  const linkForm = document.getElementById('linkForm');
  const linkIdInput = document.getElementById('linkIdInput');
  const linkUrlInput = document.getElementById('linkUrlInput');
  const linkTitleInput = document.getElementById('linkTitleInput');
  const linkCategoryInput = document.getElementById('linkCategoryInput');
  const linkDescInput = document.getElementById('linkDescInput');

  // Helper: Normalize URL
  function normalizeUrl(url) {
    let clean = (url || '').trim();
    if (!clean) return '';
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    return clean;
  }

  // Helper: Extract domain
  function extractDomain(url) {
    try {
      const parsed = new URL(normalizeUrl(url));
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return url || '';
    }
  }

  // Helper: Get Favicon URL
  function getFaviconUrl(url) {
    const domain = extractDomain(url);
    if (!domain) return '';
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
  }

  // Helper: Auto-suggest title from URL
  function suggestTitleFromUrl(url) {
    const domain = extractDomain(url);
    if (!domain) return '';
    const parts = domain.split('.');
    const name = parts.length > 2 ? parts[parts.length - 2] : parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Load Links from localStorage
  function loadQuickLinks() {
    try {
      const localData = localStorage.getItem(LINKS_STORAGE_KEY);
      if (localData) {
        quickLinks = JSON.parse(localData);
      } else {
        quickLinks = [...defaultQuickLinks];
        saveQuickLinks();
      }
    } catch (e) {
      console.error('Erro ao carregar links:', e);
      quickLinks = [...defaultQuickLinks];
    }
    renderQuickLinks();
  }

  // Save Links to localStorage
  function saveQuickLinks() {
    try {
      localStorage.setItem(LINKS_STORAGE_KEY, JSON.stringify(quickLinks));
    } catch (e) {
      console.error('Erro ao salvar links:', e);
    }
  }

  // Render Quick Links
  function renderQuickLinks() {
    if (!linksGrid) return;
    linksGrid.innerHTML = '';

    const filtered = quickLinks.filter(item => {
      const matchesCategory = currentLinkCategory === 'all' ||
        (item.category && item.category.toLowerCase() === currentLinkCategory.toLowerCase());

      const query = linkSearchQuery.toLowerCase().trim();
      const matchesSearch = !query ||
        item.title.toLowerCase().includes(query) ||
        item.url.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      linksGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; color: var(--text-dim);">
          <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 6px;">Nenhum site encontrado</p>
          <p style="font-size: 0.85rem;">Tente ajustar sua busca ou adicione um novo site clicando no botão acima.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'link-card';

      const domain = extractDomain(item.url);
      const faviconUrl = getFaviconUrl(item.url);

      const descHtml = item.description
        ? `<div class="link-card-desc" title="${escapeHtml(item.description)}">${escapeHtml(item.description)}</div>`
        : `<div class="link-card-desc" style="color: transparent;">-</div>`;

      card.innerHTML = `
        <div>
          <div class="link-card-header">
            <div class="link-card-info">
              <div class="link-favicon-wrapper">
                <img src="${faviconUrl}" alt="${escapeHtml(item.title)}" class="link-favicon" onerror="this.src='icons/icon-32.png'; this.onerror=null;">
              </div>
              <div class="link-card-meta">
                <h3 class="link-card-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h3>
                <span class="link-card-badge">${escapeHtml(item.category || 'Geral')}</span>
              </div>
            </div>
            <div class="link-card-actions">
              <button class="btn btn-secondary btn-xs btn-edit-link" title="Editar Site" data-id="${item.id}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              </button>
              <button class="btn btn-secondary btn-xs btn-delete-link btn-danger-hover" title="Excluir Site" data-id="${item.id}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>

          <div class="link-card-url-row" style="margin-top: 10px;" title="${escapeHtml(item.url)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>${escapeHtml(domain)}</span>
          </div>

          <div style="margin-top: 8px;">
            ${descHtml}
          </div>
        </div>

        <div class="link-card-footer">
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="link-open-btn">
            <span>Abrir Site</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
          <button class="link-copy-btn" title="Copiar Endereço" data-url="${escapeHtml(item.url)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      `;

      // Copy link listener
      const copyBtn = card.querySelector('.link-copy-btn');
      if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(item.url);
            showToast('Link copiado para a Área de Transferência!', 'success');
          } catch (e) {
            showToast('Erro ao copiar link.', 'error');
          }
        });
      }

      // Edit listener
      const editBtn = card.querySelector('.btn-edit-link');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          openEditLinkModal(item.id);
        });
      }

      // Delete listener
      const deleteBtn = card.querySelector('.btn-delete-link');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Deseja realmente excluir "${item.title}"?`)) {
            quickLinks = quickLinks.filter(l => l.id !== item.id);
            saveQuickLinks();
            renderQuickLinks();
            showToast('Site excluído com sucesso!', 'default');
          }
        });
      }

      linksGrid.appendChild(card);
    });
  }

  // Modal Functions
  function openNewLinkModal() {
    if (!linkModal) return;
    linkModalTitle.textContent = 'Adicionar Novo Site';
    linkIdInput.value = '';
    linkUrlInput.value = '';
    linkTitleInput.value = '';
    linkCategoryInput.value = 'Ferramentas';
    linkDescInput.value = '';
    linkModal.classList.remove('hidden');
    setTimeout(() => linkUrlInput.focus(), 50);
  }

  function openEditLinkModal(id) {
    const item = quickLinks.find(l => l.id === id);
    if (!item || !linkModal) return;
    linkModalTitle.textContent = 'Editar Site';
    linkIdInput.value = item.id;
    linkUrlInput.value = item.url;
    linkTitleInput.value = item.title;
    linkCategoryInput.value = item.category || 'Geral';
    linkDescInput.value = item.description || '';
    linkModal.classList.remove('hidden');
    setTimeout(() => linkTitleInput.focus(), 50);
  }

  function closeLinkModal() {
    if (linkModal) linkModal.classList.add('hidden');
  }

  // Auto-fill title from URL if title is blank
  if (linkUrlInput) {
    linkUrlInput.addEventListener('blur', () => {
      if (linkUrlInput.value && !linkTitleInput.value.trim()) {
        linkTitleInput.value = suggestTitleFromUrl(linkUrlInput.value);
      }
    });
  }

  if (newLinkBtn) newLinkBtn.addEventListener('click', openNewLinkModal);
  if (closeLinkModalBtn) closeLinkModalBtn.addEventListener('click', closeLinkModal);
  if (cancelLinkBtn) cancelLinkBtn.addEventListener('click', closeLinkModal);

  if (linkModal) {
    linkModal.addEventListener('click', (e) => {
      if (e.target === linkModal) closeLinkModal();
    });
  }

  if (linkForm) {
    linkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = linkIdInput.value;
      const url = normalizeUrl(linkUrlInput.value);
      const title = linkTitleInput.value.trim();
      const category = linkCategoryInput.value.trim() || 'Geral';
      const description = linkDescInput.value.trim();

      if (!url || !title) {
        showToast('Preencha os campos obrigatórios.', 'error');
        return;
      }

      if (id) {
        // Edit
        const idx = quickLinks.findIndex(l => l.id === id);
        if (idx !== -1) {
          quickLinks[idx] = {
            ...quickLinks[idx],
            title,
            url,
            category,
            description,
            updatedAt: new Date().toISOString()
          };
          showToast('Site atualizado com sucesso!', 'success');
        }
      } else {
        // New
        const newLink = {
          id: 'link_' + Date.now(),
          title,
          url,
          category,
          description,
          updatedAt: new Date().toISOString()
        };
        quickLinks.unshift(newLink);
        showToast('Site adicionado com sucesso!', 'success');
      }

      saveQuickLinks();
      closeLinkModal();
      renderQuickLinks();
    });
  }

  // Search & Category Filter
  if (linkSearchInput) {
    linkSearchInput.addEventListener('input', (e) => {
      linkSearchQuery = e.target.value;
      renderQuickLinks();
    });
  }

  if (linkCategoryPills) {
    linkCategoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.pill');
      if (!pill) return;
      linkCategoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentLinkCategory = pill.getAttribute('data-category');
      renderQuickLinks();
    });
  }

  // Export Links
  if (exportLinksBtn) {
    exportLinksBtn.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quickLinks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `links_canivete_tp_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Backup dos sites exportado com sucesso!', 'success');
    });
  }

  // Import Links
  if (importLinksBtn && importLinksFileInput) {
    importLinksBtn.addEventListener('click', () => importLinksFileInput.click());
    importLinksFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (Array.isArray(imported)) {
            quickLinks = [...imported];
            saveQuickLinks();
            renderQuickLinks();
            showToast(`${imported.length} site(s) importado(s) com sucesso!`, 'success');
          } else {
            showToast('Arquivo JSON inválido.', 'error');
          }
        } catch (err) {
          showToast('Erro ao ler o arquivo JSON.', 'error');
        }
        importLinksFileInput.value = '';
      };
      reader.readAsText(file);
    });
  }

  // Initialize Quick Links
  loadQuickLinks();


  // =========================================================================
  // MODULE 2: THUMBNAIL & IMAGE CREATOR (HTML5 CANVAS ENGINE)
  // =========================================================================
  let canvas = null;
  let ctx = null;
  const canvasViewport = document.getElementById('canvasViewport');
  const canvasWorkspace = document.getElementById('canvasWorkspace');
  const toggleSafeZoneBtn = document.getElementById('toggleSafeZoneBtn');
  const clearCanvasBtn = document.getElementById('clearCanvasBtn');
  const undoBtn = document.getElementById('undoBtn');
  const redoBtn = document.getElementById('redoBtn');
  const exportDropdownWrapper = document.getElementById('exportDropdownWrapper');
  const exportDropdownBtn = document.getElementById('exportDropdownBtn');
  const exportDropdownMenu = document.getElementById('exportDropdownMenu');

  // Shortcuts Modal elements
  const shortcutsModal = document.getElementById('shortcutsModal');
  const shortcutsModalBtn = document.getElementById('shortcutsModalBtn');
  const floatingShortcutsBtn = document.getElementById('floatingShortcutsBtn');
  const closeShortcutsModalBtn = document.getElementById('closeShortcutsModalBtn');
  const dismissShortcutsBtn = document.getElementById('dismissShortcutsBtn');

  function openShortcutsModal() {
    if (shortcutsModal) shortcutsModal.classList.remove('hidden');
  }

  function closeShortcutsModal() {
    if (shortcutsModal) shortcutsModal.classList.add('hidden');
  }

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
      this.canvases = [];
      this.activeCanvasId = null;
      this.canvasCount = 0;

      // Interaction state
      this.isDragging = false;
      this.isResizing = false;
      this.isRotating = false;
      this.activeHandle = null;
      this.dragStartX = 0;
      this.dragStartY = 0;
      this.initialElementState = null;

      // Synced active canvas properties
      this.width = 1280;
      this.height = 720;
      this.bgColor = '#0f172a';
      this.elements = [];
      this.selectedId = null;
      this.history = [];
      this.historyIndex = -1;
      this.showSafeZone = true;

      // Zoom & Pan state
      this.zoomLevel = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.isPanning = false;
      this.isPanMode = false;
      this.panStartX = 0;
      this.panStartY = 0;
      this.isSpacePressed = false;

      this.init();
    }

    getActiveCanvas() {
      return this.canvases.find(c => c.id === this.activeCanvasId) || this.canvases[0];
    }

    init() {
      this.createCanvasBoard('1280x720', null, null, 'Canvas 1');
      this.setupEventListeners();
      this.setupInitialPreset();
      this.updateZoomTransform();
      this.saveHistory();
    }

    createCanvasBoard(preset = '1280x720', x = null, y = null, name = null, initialElements = null) {
      this.canvasCount++;
      const id = `canvas_${this.canvasCount}`;
      const canvasName = name || `Canvas ${this.canvasCount}`;

      let [w, h] = [1280, 720];
      if (preset === '1920x1080') [w, h] = [1920, 1080];
      else if (preset === '1080x1080') [w, h] = [1080, 1080];
      else if (preset === '1080x1920') [w, h] = [1080, 1920];
      else if (preset === '2560x1440') [w, h] = [2560, 1440];

      const DISPLAY_SCALE = 0.55;
      const renderedW = Math.round(w * DISPLAY_SCALE);
      const renderedH = Math.round(h * DISPLAY_SCALE);

      if (x === null || y === null) {
        x = -Math.round(renderedW / 2);
        y = -Math.round(renderedH / 2);
      }

      const boardEl = document.createElement('div');
      boardEl.className = 'canvas-board';
      boardEl.id = `canvasBoard_${id}`;
      boardEl.dataset.canvasId = id;
      boardEl.style.left = `${x}px`;
      boardEl.style.top = `${y}px`;

      boardEl.innerHTML = `
        <!-- FigJam-style 4 Add Buttons -->
        <button class="figjam-add-btn add-top" data-dir="top" title="Criar novo canvas acima">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="figjam-add-btn add-right" data-dir="right" title="Criar novo canvas à direita">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="figjam-add-btn add-bottom" data-dir="bottom" title="Criar novo canvas abaixo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button class="figjam-add-btn add-left" data-dir="left" title="Criar novo canvas à esquerda">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>

        <!-- Attached Tab on top of this Canvas -->
        <div class="canvas-attached-tab">
          <div class="canvas-tab-handle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
            <span class="canvas-name-text">${canvasName}</span>
          </div>

          <select class="form-select canvas-tab-select preset-select">
            <option value="1280x720" ${preset === '1280x720' ? 'selected' : ''}>YouTube Thumbnail</option>
            <option value="1920x1080" ${preset === '1920x1080' ? 'selected' : ''}>Full HD</option>
            <option value="1080x1080" ${preset === '1080x1080' ? 'selected' : ''}>Post Quadrado / Comunidade</option>
            <option value="1080x1920" ${preset === '1080x1920' ? 'selected' : ''}>Shorts / Reels / Stories</option>
            <option value="2560x1440" ${preset === '2560x1440' ? 'selected' : ''}>YouTube Banner / Capa</option>
            <option value="custom" ${preset === 'custom' ? 'selected' : ''}>Personalizado...</option>
          </select>

          <div class="custom-dims-group hidden">
            <input type="number" class="custom-width-input" value="${w}" min="100" max="4000" placeholder="L">
            <span>×</span>
            <input type="number" class="custom-height-input" value="${h}" min="100" max="4000" placeholder="A">
            <button class="btn btn-xs btn-primary apply-custom-btn">OK</button>
          </div>

          <span class="canvas-tab-badge">${w} × ${h} px</span>

          <button class="canvas-close-btn" title="Excluir este canvas" style="display: none;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Canvas Container -->
        <div class="canvas-container" style="width: ${renderedW}px; height: ${renderedH}px; aspect-ratio: ${w}/${h};">
          <canvas class="artboard-canvas" width="${w}" height="${h}"></canvas>
          <div class="safe-zone-overlay ${preset === '1280x720' || preset === '1920x1080' ? 'active' : ''}">
            <div class="yt-time-badge-mock">00:00</div>
          </div>
        </div>
      `;

      if (canvasWorkspace) canvasWorkspace.appendChild(boardEl);

      const canvasEl = boardEl.querySelector('.artboard-canvas');
      const containerEl = boardEl.querySelector('.canvas-container');
      const attachedTab = boardEl.querySelector('.canvas-attached-tab');
      const presetSelect = boardEl.querySelector('.preset-select');
      const customGroup = boardEl.querySelector('.custom-dims-group');
      const customWidthInput = boardEl.querySelector('.custom-width-input');
      const customHeightInput = boardEl.querySelector('.custom-height-input');
      const applyCustomBtn = boardEl.querySelector('.apply-custom-btn');
      const badgeEl = boardEl.querySelector('.canvas-tab-badge');
      const closeBtn = boardEl.querySelector('.canvas-close-btn');
      const safeZoneOverlay = boardEl.querySelector('.safe-zone-overlay');

      const canvasObj = {
        id,
        name: canvasName,
        x,
        y,
        width: w,
        height: h,
        preset,
        bgColor: '#0f172a',
        elements: initialElements || [],
        selectedId: null,
        history: [],
        historyIndex: -1,
        showSafeZone: (w === 1280 && h === 720) || (w === 1920 && h === 1080),
        boardEl,
        containerEl,
        canvasEl,
        ctx: canvasEl.getContext('2d'),
        presetSelect,
        customGroup,
        customWidthInput,
        customHeightInput,
        badgeEl,
        closeBtn,
        safeZoneOverlay
      };

      attachedTab.addEventListener('mousedown', (e) => e.stopPropagation());

      boardEl.querySelectorAll('.figjam-add-btn').forEach(btn => {
        btn.addEventListener('mousedown', (e) => e.stopPropagation());
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.addAdjacentCanvas(id, btn.dataset.dir);
        });
      });

      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'custom') {
          customGroup.classList.remove('hidden');
        } else {
          customGroup.classList.add('hidden');
          const [pw, ph] = val.split('x').map(Number);
          canvasObj.preset = val;
          this.updateCanvasDimensions(id, pw, ph, true);
          showToast(`Tamanho do ${canvasName} alterado para ${pw} × ${ph} px`, 'success');
        }
      });

      applyCustomBtn.addEventListener('click', () => {
        const cw = parseInt(customWidthInput.value, 10) || 1280;
        const ch = parseInt(customHeightInput.value, 10) || 720;
        canvasObj.preset = 'custom';
        this.updateCanvasDimensions(id, cw, ch, true);
        showToast(`Tamanho personalizado: ${cw} × ${ch} px`, 'success');
      });

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteCanvas(id);
      });

      boardEl.addEventListener('mousedown', () => {
        if (this.activeCanvasId !== id) {
          this.setActiveCanvas(id);
        }
      });

      canvasEl.addEventListener('mousedown', (e) => {
        if (this.activeCanvasId !== id) {
          this.setActiveCanvas(id);
        }
        this.handleMouseDown(e);
      });

      this.canvases.push(canvasObj);
      this.setActiveCanvas(id);
      this.updateCanvasCloseButtons();

      return canvasObj;
    }

    updateCanvasCloseButtons() {
      const show = this.canvases.length > 1;
      this.canvases.forEach(c => {
        if (c.closeBtn) c.closeBtn.style.display = show ? 'flex' : 'none';
      });
    }

    setActiveCanvas(canvasId) {
      const c = this.canvases.find(item => item.id === canvasId);
      if (!c) return;

      this.activeCanvasId = c.id;

      // Sync active state variables
      canvas = c.canvasEl;
      ctx = c.ctx;
      this.width = c.width;
      this.height = c.height;
      this.bgColor = c.bgColor;
      this.elements = c.elements;
      this.selectedId = c.selectedId;
      this.history = c.history;
      this.historyIndex = c.historyIndex;
      this.showSafeZone = c.showSafeZone;

      this.canvases.forEach(item => {
        item.boardEl.classList.toggle('active', item.id === c.id);
      });

      this.updateCanvasCloseButtons();

      if (toggleSafeZoneBtn) {
        toggleSafeZoneBtn.classList.toggle('active', this.showSafeZone);
      }

      const canvasBgColorInput = document.getElementById('canvasBgColorInput');
      if (canvasBgColorInput) {
        canvasBgColorInput.value = this.bgColor;
      }

      this.updateInspector();
      this.renderLayers();
      this.updateHistoryButtons();
      this.renderAll();
    }

    getBoardBounds(c) {
      const DISPLAY_SCALE = 0.55;
      const w = Math.max(320, (c.boardEl && c.boardEl.offsetWidth > 0) ? c.boardEl.offsetWidth : Math.round(c.width * DISPLAY_SCALE));
      const h = Math.max(220, (c.boardEl && c.boardEl.offsetHeight > 0) ? c.boardEl.offsetHeight : Math.round(c.height * DISPLAY_SCALE) + 38);
      return {
        id: c.id,
        x: c.x,
        y: c.y,
        w,
        h,
        right: c.x + w,
        bottom: c.y + h,
        cx: c.x + w / 2,
        cy: c.y + h / 2
      };
    }

    checkOverlap(b1, b2, gap = 80) {
      return (
        b1.x < b2.right + gap &&
        b1.right + gap > b2.x &&
        b1.y < b2.bottom + gap &&
        b1.bottom + gap > b2.y
      );
    }

    resolveCollisions(priorityCanvasId = null) {
      const GAP = 80;
      let changed = true;
      let iterations = 0;
      const maxIterations = 35;

      while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        for (let i = 0; i < this.canvases.length; i++) {
          for (let j = 0; j < this.canvases.length; j++) {
            if (i === j) continue;

            const c1 = this.canvases[i];
            const c2 = this.canvases[j];

            const b1 = this.getBoardBounds(c1);
            const b2 = this.getBoardBounds(c2);

            if (this.checkOverlap(b1, b2, GAP)) {
              changed = true;

              // Determine which canvas to push
              let fixed = c1;
              let toPush = c2;

              if (c2.id === priorityCanvasId) {
                fixed = c2;
                toPush = c1;
              } else if (c1.id !== priorityCanvasId) {
                const dist1 = Math.hypot(b1.cx, b1.cy);
                const dist2 = Math.hypot(b2.cx, b2.cy);
                if (dist1 > dist2) {
                  fixed = c2;
                  toPush = c1;
                } else {
                  fixed = c1;
                  toPush = c2;
                }
              }

              const fb = this.getBoardBounds(fixed);
              const pb = this.getBoardBounds(toPush);

              const dx = pb.cx - fb.cx;
              const dy = pb.cy - fb.cy;

              const normX = Math.abs(dx) / ((fb.w + pb.w) / 2);
              const normY = Math.abs(dy) / ((fb.h + pb.h) / 2);

              if (normX > normY) {
                if (dx >= 0) {
                  toPush.x = fb.right + GAP;
                } else {
                  toPush.x = fb.x - pb.w - GAP;
                }
              } else {
                if (dy >= 0) {
                  toPush.y = fb.bottom + GAP;
                } else {
                  toPush.y = fb.y - pb.h - GAP;
                }
              }
            }
          }
        }
      }

      // Sync DOM positions
      this.canvases.forEach(c => {
        if (c.boardEl) {
          c.boardEl.style.left = `${c.x}px`;
          c.boardEl.style.top = `${c.y}px`;
        }
      });
    }

    addAdjacentCanvas(sourceId, direction) {
      const source = this.canvases.find(c => c.id === sourceId);
      if (!source) return;

      const DISPLAY_SCALE = 0.55;
      const GAP = 80;

      const preset = source.preset || '1280x720';
      const w = source.width;
      const h = source.height;

      const sourceBounds = this.getBoardBounds(source);
      const newRenderedW = Math.max(340, Math.round(w * DISPLAY_SCALE));
      const newRenderedH = Math.round(h * DISPLAY_SCALE) + 38;

      let newX = source.x;
      let newY = source.y;

      if (direction === 'right') {
        newX = sourceBounds.right + GAP;
        newY = source.y;
      } else if (direction === 'left') {
        newX = sourceBounds.x - newRenderedW - GAP;
        newY = source.y;
      } else if (direction === 'bottom') {
        newX = source.x;
        newY = sourceBounds.bottom + GAP;
      } else if (direction === 'top') {
        newX = source.x;
        newY = sourceBounds.y - newRenderedH - GAP;
      }

      // Push existing canvases in the expansion direction to make room
      const shiftX = newRenderedW + GAP;
      const shiftY = newRenderedH + GAP;

      this.canvases.forEach(other => {
        if (other.id === source.id) return;
        const ob = this.getBoardBounds(other);

        if (direction === 'right' && ob.x >= sourceBounds.right - 10) {
          other.x += shiftX;
          if (other.boardEl) other.boardEl.style.left = `${other.x}px`;
        } else if (direction === 'left' && ob.right <= sourceBounds.x + 10) {
          other.x -= shiftX;
          if (other.boardEl) other.boardEl.style.left = `${other.x}px`;
        } else if (direction === 'bottom' && ob.y >= sourceBounds.bottom - 10) {
          other.y += shiftY;
          if (other.boardEl) other.boardEl.style.top = `${other.y}px`;
        } else if (direction === 'top' && ob.bottom <= sourceBounds.y + 10) {
          other.y -= shiftY;
          if (other.boardEl) other.boardEl.style.top = `${other.y}px`;
        }
      });

      const newCanvas = this.createCanvasBoard(preset, newX, newY, null, []);

      // Resolve secondary / dimensional overlaps
      this.resolveCollisions(newCanvas.id);

      this.saveHistory();
      this.renderAll();

      const dirName = direction === 'right' ? 'à direita' : direction === 'left' ? 'à esquerda' : direction === 'bottom' ? 'abaixo' : 'acima';
      showToast(`Novo canvas criado ${dirName}!`, 'success');
    }

    deleteCanvas(canvasId) {
      if (this.canvases.length <= 1) {
        showToast('É necessário manter pelo menos um canvas no projeto.', 'warning');
        return;
      }

      const target = this.canvases.find(c => c.id === canvasId);
      if (!target) return;

      if (!confirm(`Deseja realmente excluir "${target.name}"?`)) return;

      target.boardEl.remove();
      this.canvases = this.canvases.filter(c => c.id !== canvasId);

      if (this.activeCanvasId === canvasId) {
        this.setActiveCanvas(this.canvases[0].id);
      } else {
        this.updateCanvasCloseButtons();
      }

      showToast('Canvas removido.', 'info');
    }

    toggleSafeZone() {
      const active = this.getActiveCanvas();
      if (!active) return;
      active.showSafeZone = !active.showSafeZone;
      this.showSafeZone = active.showSafeZone;

      if (toggleSafeZoneBtn) {
        toggleSafeZoneBtn.classList.toggle('active', this.showSafeZone);
      }
      if (active.safeZoneOverlay) {
        active.safeZoneOverlay.classList.toggle('active', this.showSafeZone);
      }
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

    updateCanvasDimensions(targetIdOrW, h = null, repositionElements = false) {
      let c = null;
      let w = 1280;
      let newH = 720;
      let shouldReposition = repositionElements;

      if (typeof targetIdOrW === 'string') {
        c = this.canvases.find(item => item.id === targetIdOrW);
        w = h;
        newH = arguments[2] || 720;
        shouldReposition = Boolean(arguments[3]);
      } else {
        c = this.getActiveCanvas();
        w = targetIdOrW;
        newH = h;
      }

      if (!c) return;

      const oldW = c.width || 1280;
      const oldH = c.height || 720;
      c.width = w;
      c.height = newH;
      c.canvasEl.width = w;
      c.canvasEl.height = newH;

      const DISPLAY_SCALE = 0.55;
      const renderedW = Math.round(w * DISPLAY_SCALE);
      const renderedH = Math.round(newH * DISPLAY_SCALE);

      c.containerEl.style.width = `${renderedW}px`;
      c.containerEl.style.height = `${renderedH}px`;
      c.containerEl.style.aspectRatio = `${w} / ${newH}`;

      if (c.badgeEl) {
        c.badgeEl.textContent = `${w} × ${newH} px`;
      }

      const isYouTube16x9 = (w === 1280 && newH === 720) || (w === 1920 && newH === 1080);
      if (c.safeZoneOverlay) {
        if (!isYouTube16x9) {
          c.safeZoneOverlay.classList.remove('active');
        } else if (c.showSafeZone) {
          c.safeZoneOverlay.classList.add('active');
        }
      }

      if (shouldReposition && (oldW !== w || oldH !== newH) && c.elements.length > 0) {
        const scaleX = w / oldW;
        const scaleY = newH / oldH;
        c.elements.forEach(el => {
          el.x = Math.round(el.x * scaleX);
          el.y = Math.round(el.y * scaleY);
          if (el.type === 'shape' || el.type === 'image') {
            el.width = Math.round(el.width * scaleX);
            el.height = Math.round(el.height * scaleY);
          } else if (el.type === 'text') {
            const fontScale = (scaleX + scaleY) / 2;
            el.fontSize = Math.max(16, Math.round(el.fontSize * fontScale));
          }
        });
      }

      if (this.activeCanvasId === c.id) {
        this.width = w;
        this.height = newH;
      }

      // Push any neighboring canvases if dimensions expanded into them
      this.resolveCollisions(c.id);

      this.saveHistory();
      this.render(c.id);
    }

    // ZOOM & PAN CONTROLS
    updateZoomTransform() {
      const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
      if (canvasWorkspace) {
        canvasWorkspace.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
      }
      if (zoomLevelDisplay) {
        zoomLevelDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
      }
    }

    applyZoom(factor, clientX, clientY) {
      const minZoom = 0.25;
      const maxZoom = 4.0;
      const oldZoom = this.zoomLevel;
      let newZoom = Math.min(Math.max(oldZoom * factor, minZoom), maxZoom);

      if (clientX !== undefined && clientY !== undefined && canvasViewport) {
        const vpRect = canvasViewport.getBoundingClientRect();
        const mouseX = clientX - (vpRect.left + vpRect.width / 2);
        const mouseY = clientY - (vpRect.top + vpRect.height / 2);

        this.panX = mouseX - (mouseX - this.panX) * (newZoom / oldZoom);
        this.panY = mouseY - (mouseY - this.panY) * (newZoom / oldZoom);
      }

      this.zoomLevel = newZoom;
      this.updateZoomTransform();
    }

    zoomIn() {
      this.applyZoom(1.2);
    }

    zoomOut() {
      this.applyZoom(1 / 1.2);
    }

    resetZoom() {
      this.zoomLevel = 1.0;
      this.panX = 0;
      this.panY = 0;
      this.updateZoomTransform();
    }

    setPanMode(enabled) {
      this.isPanMode = enabled;
      const toolPanCanvas = document.getElementById('toolPanCanvas');
      const panModeToggleBtn = document.getElementById('panModeToggleBtn');
      if (toolPanCanvas) toolPanCanvas.classList.toggle('active', this.isPanMode);
      if (panModeToggleBtn) panModeToggleBtn.classList.toggle('active', this.isPanMode);

      const cursor = this.isPanMode ? 'grab' : '';
      if (canvasViewport) canvasViewport.style.cursor = cursor;
      if (canvas) canvas.style.cursor = this.isPanMode ? 'grab' : 'crosshair';
    }

    saveHistory() {
      const active = this.getActiveCanvas();
      if (!active) return;

      if (active.historyIndex < active.history.length - 1) {
        active.history = active.history.slice(0, active.historyIndex + 1);
      }

      const snapshot = {
        width: active.width,
        height: active.height,
        bgColor: active.bgColor,
        preset: active.preset,
        elements: active.elements.map(el => ({ ...el }))
      };

      active.history.push(JSON.stringify(snapshot));
      active.historyIndex++;

      if (active.history.length > 30) {
        active.history.shift();
        active.historyIndex--;
      }

      this.history = active.history;
      this.historyIndex = active.historyIndex;
      this.updateHistoryButtons();
    }

    undo() {
      const active = this.getActiveCanvas();
      if (active && active.historyIndex > 0) {
        active.historyIndex--;
        this.loadSnapshot(active.history[active.historyIndex]);
      }
    }

    redo() {
      const active = this.getActiveCanvas();
      if (active && active.historyIndex < active.history.length - 1) {
        active.historyIndex++;
        this.loadSnapshot(active.history[active.historyIndex]);
      }
    }

    loadSnapshot(snapshotJson) {
      const active = this.getActiveCanvas();
      if (!active) return;

      const data = JSON.parse(snapshotJson);
      active.width = data.width;
      active.height = data.height;
      active.bgColor = data.bgColor;
      active.preset = data.preset || '1280x720';
      active.canvasEl.width = data.width;
      active.canvasEl.height = data.height;

      const DISPLAY_SCALE = 0.55;
      active.containerEl.style.width = `${Math.round(data.width * DISPLAY_SCALE)}px`;
      active.containerEl.style.height = `${Math.round(data.height * DISPLAY_SCALE)}px`;
      active.containerEl.style.aspectRatio = `${data.width} / ${data.height}`;

      if (active.badgeEl) {
        active.badgeEl.textContent = `${data.width} × ${data.height} px`;
      }
      if (active.presetSelect) {
        const key = `${data.width}x${data.height}`;
        const match = Array.from(active.presetSelect.options).some(opt => opt.value === key);
        active.presetSelect.value = match ? key : 'custom';
      }

      // Re-link images
      active.elements = data.elements.map(el => {
        if (el.type === 'image' && el.src) {
          const img = new Image();
          img.src = el.src;
          el.img = img;
        }
        return el;
      });

      this.width = data.width;
      this.height = data.height;
      this.bgColor = data.bgColor;
      this.elements = active.elements;
      this.selectedId = null;
      active.selectedId = null;

      const canvasBgColorInput = document.getElementById('canvasBgColorInput');
      if (canvasBgColorInput) canvasBgColorInput.value = data.bgColor;

      this.render();
      this.updateInspector();
      this.renderLayers();
      this.updateHistoryButtons();
    }

    updateHistoryButtons() {
      const active = this.getActiveCanvas();
      const idx = active ? active.historyIndex : this.historyIndex;
      const len = active ? active.history.length : this.history.length;
      undoBtn.disabled = idx <= 0;
      redoBtn.disabled = idx >= len - 1;
    }
    addElement(el) {
      const active = this.getActiveCanvas();
      if (!active) return;
      const id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      el.id = id;
      active.elements.push(el);
      active.selectedId = id;
      this.selectedId = id;
      this.elements = active.elements;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    getSelected() {
      const active = this.getActiveCanvas();
      if (!active) return null;
      return active.elements.find(el => el.id === active.selectedId);
    }

    deleteSelected() {
      const active = this.getActiveCanvas();
      if (!active || !active.selectedId) return;
      active.elements = active.elements.filter(el => el.id !== active.selectedId);
      active.selectedId = null;
      this.selectedId = null;
      this.elements = active.elements;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    duplicateSelected() {
      const sel = this.getSelected();
      if (!sel) return;
      const active = this.getActiveCanvas();
      const copy = { ...sel };
      copy.id = 'el_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      copy.x += 30;
      copy.y += 30;
      active.elements.push(copy);
      active.selectedId = copy.id;
      this.selectedId = copy.id;
      this.elements = active.elements;
      this.saveHistory();
      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    bringForward() {
      const active = this.getActiveCanvas();
      if (!active) return;
      const index = active.elements.findIndex(el => el.id === active.selectedId);
      if (index !== -1 && index < active.elements.length - 1) {
        const item = active.elements.splice(index, 1)[0];
        active.elements.splice(index + 1, 0, item);
        this.saveHistory();
        this.render();
        this.renderLayers();
      }
    }

    sendBackward() {
      const active = this.getActiveCanvas();
      if (!active) return;
      const index = active.elements.findIndex(el => el.id === active.selectedId);
      if (index > 0) {
        const item = active.elements.splice(index, 1)[0];
        active.elements.splice(index - 1, 0, item);
        this.saveHistory();
        this.render();
        this.renderLayers();
      }
    }

    // MAIN RENDER PIPELINE
    render(canvasId = null, skipSelection = false) {
      const targetId = canvasId || this.activeCanvasId;
      const c = this.canvases.find(item => item.id === targetId);
      if (!c) return;

      const targetCtx = c.ctx;
      targetCtx.clearRect(0, 0, c.width, c.height);

      // 1. Draw Canvas Background
      targetCtx.fillStyle = c.bgColor;
      targetCtx.fillRect(0, 0, c.width, c.height);

      const prevCtx = ctx;
      ctx = targetCtx;

      // 2. Draw Elements in order
      c.elements.forEach(el => {
        targetCtx.save();
        targetCtx.globalAlpha = el.opacity !== undefined ? el.opacity : 1;

        targetCtx.translate(el.x, el.y);
        if (el.rotation) {
          targetCtx.rotate((el.rotation * Math.PI) / 180);
        }

        if (el.type === 'text') {
          this.renderTextElement(el);
        } else if (el.type === 'image') {
          this.renderImageElement(el);
        } else if (el.type === 'shape') {
          this.renderShapeElement(el);
        }

        targetCtx.restore();
      });

      // 3. Draw Selection bounding box only on active canvas
      if (c.id === this.activeCanvasId && c.selectedId && !skipSelection && !this.isExporting) {
        const sel = c.elements.find(el => el.id === c.selectedId);
        if (sel) {
          this.renderSelectionOutline(sel);
        }
      }

      ctx = prevCtx || targetCtx;
    }

    renderAll() {
      this.canvases.forEach(c => this.render(c.id));
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
      const active = this.getActiveCanvas();
      const target = active ? active.canvasEl : canvas;
      if (!target) return { x: 0, y: 0 };
      const rect = target.getBoundingClientRect();
      const scaleX = target.width / rect.width;
      const scaleY = target.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }

    setupEventListeners() {
      // MOUSE WHEEL ZOOM ON CANVAS VIEWPORT
      if (canvasViewport) {
        canvasViewport.addEventListener('wheel', (e) => {
          e.preventDefault();
          const delta = -e.deltaY;
          const factor = delta > 0 
            ? Math.min(1 + delta * 0.0018, 1.3) 
            : Math.max(1 / (1 + (-delta) * 0.0018), 0.7);
          this.applyZoom(factor, e.clientX, e.clientY);
        }, { passive: false });

        // VIEWPORT PANNING (drag on background or middle-click or space)
        canvasViewport.addEventListener('mousedown', (e) => {
          if (e.target === canvasViewport || e.target === canvasWorkspace || e.button === 1 || this.isSpacePressed) {
            this.isPanning = true;
            this.panStartX = e.clientX - this.panX;
            this.panStartY = e.clientY - this.panY;
            canvasViewport.style.cursor = 'grabbing';
            e.preventDefault();
          }
        });
      }

      window.addEventListener('mousemove', (e) => {
        if (this.isPanning) {
          this.panX = e.clientX - this.panStartX;
          this.panY = e.clientY - this.panStartY;
          this.updateZoomTransform();
          return;
        }
        this.handleMouseMove(e);
      });

      window.addEventListener('mouseup', () => {
        if (this.isPanning) {
          this.isPanning = false;
          if (canvasViewport) {
            canvasViewport.style.cursor = this.isSpacePressed ? 'grab' : '';
          }
        }
        this.handleMouseUp();
      });

      // Zoom Controls Buttons
      const zoomInBtn = document.getElementById('zoomInBtn');
      const zoomOutBtn = document.getElementById('zoomOutBtn');
      const zoomResetBtn = document.getElementById('zoomResetBtn');
      const zoomFitBtn = document.getElementById('zoomFitBtn');
      const panModeToggleBtn = document.getElementById('panModeToggleBtn');
      const toolPanCanvas = document.getElementById('toolPanCanvas');

      if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
      if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
      if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.resetZoom());
      if (zoomFitBtn) zoomFitBtn.addEventListener('click', () => this.resetZoom());
      if (panModeToggleBtn) panModeToggleBtn.addEventListener('click', () => this.setPanMode(!this.isPanMode));
      if (toolPanCanvas) toolPanCanvas.addEventListener('click', () => this.setPanMode(!this.isPanMode));

      // Keyboard shortcuts
      window.addEventListener('keydown', (e) => {
        // Only trigger if not focusing an input or textarea
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        if (e.code === 'Space' && !this.isSpacePressed) {
          this.isSpacePressed = true;
          if (canvasViewport) canvasViewport.style.cursor = 'grab';
          if (canvas) canvas.style.cursor = 'grab';
        } else if (e.key === '?' || (e.key === '/' && e.shiftKey) || e.key === 'F1') {
          e.preventDefault();
          openShortcutsModal();
        } else if (e.key === 'Escape') {
          if (shortcutsModal && !shortcutsModal.classList.contains('hidden')) {
            e.preventDefault();
            closeShortcutsModal();
          } else if (this.isPanMode) {
            e.preventDefault();
            this.setPanMode(false);
          }
        } else if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.setPanMode(!this.isPanMode);
        } else if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.setPanMode(false);
        } else if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
          e.preventDefault();
          this.zoomIn();
        } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
          e.preventDefault();
          this.zoomOut();
        } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
          e.preventDefault();
          this.resetZoom();
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
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

      window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
          this.isSpacePressed = false;
          if (!this.isPanning) {
            if (canvasViewport) canvasViewport.style.cursor = this.isPanMode ? 'grab' : '';
            if (canvas) canvas.style.cursor = this.isPanMode ? 'grab' : 'crosshair';
          }
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
      if (this.isPanMode || this.isSpacePressed || e.button === 1) {
        this.isPanning = true;
        this.panStartX = e.clientX - this.panX;
        this.panStartY = e.clientY - this.panY;
        if (canvas) canvas.style.cursor = 'grabbing';
        if (canvasViewport) canvasViewport.style.cursor = 'grabbing';
        return;
      }

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
        // Clicked on empty canvas!
        // Deselect, and immediately start panning the canvas so the user can position it easily
        this.selectedId = null;
        this.isPanning = true;
        this.panStartX = e.clientX - this.panX;
        this.panStartY = e.clientY - this.panY;
        if (canvas) canvas.style.cursor = 'grabbing';
        if (canvasViewport) canvasViewport.style.cursor = 'grabbing';
      }

      this.render();
      this.updateInspector();
      this.renderLayers();
    }

    handleMouseMove(e) {
      if (this.isPanMode || this.isSpacePressed) {
        if (canvas) canvas.style.cursor = this.isPanning ? 'grabbing' : 'grab';
        if (canvasViewport) canvasViewport.style.cursor = this.isPanning ? 'grabbing' : 'grab';
        return;
      }

      const coords = this.getCanvasCoords(e);
      const sel = this.getSelected();

      // Change cursor style based on hover
      if (!this.isDragging && !this.isResizing && !this.isRotating && !this.isPanning) {
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
        canvas.style.cursor = isOverObj ? 'move' : 'crosshair';
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
      const active = this.getActiveCanvas();
      const elements = active ? active.elements : this.elements;
      const selectedId = active ? active.selectedId : this.selectedId;

      layersContainer.innerHTML = '';
      if (!elements || elements.length === 0) {
        layersContainer.innerHTML = `<span style="font-size: 0.75rem; color: var(--text-dim);">Nenhuma camada</span>`;
        return;
      }

      // Render top-to-bottom
      [...elements].reverse().forEach((el) => {
        const item = document.createElement('div');
        item.className = `layer-item ${el.id === selectedId ? 'active' : ''}`;

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
          if (active) active.selectedId = el.id;
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

  // Safe zone guide toggle
  toggleSafeZoneBtn.addEventListener('click', () => {
    canvasEngine.toggleSafeZone();
  });

  // Undo / Redo buttons
  undoBtn.addEventListener('click', () => canvasEngine.undo());
  redoBtn.addEventListener('click', () => canvasEngine.redo());

  // Clear Canvas
  clearCanvasBtn.addEventListener('click', () => {
    const active = canvasEngine.getActiveCanvas();
    if (!active) return;
    if (confirm(`Deseja limpar todos os elementos de "${active.name}"?`)) {
      active.elements = [];
      active.selectedId = null;
      canvasEngine.elements = [];
      canvasEngine.selectedId = null;
      canvasEngine.saveHistory();
      canvasEngine.render();
      canvasEngine.updateInspector();
      canvasEngine.renderLayers();
      showToast(`${active.name} limpo!`, 'success');
    }
  });

  // Shortcuts Modal listeners
  if (shortcutsModalBtn) shortcutsModalBtn.addEventListener('click', openShortcutsModal);
  if (floatingShortcutsBtn) floatingShortcutsBtn.addEventListener('click', openShortcutsModal);
  if (closeShortcutsModalBtn) closeShortcutsModalBtn.addEventListener('click', closeShortcutsModal);
  if (dismissShortcutsBtn) dismissShortcutsBtn.addEventListener('click', closeShortcutsModal);
  if (shortcutsModal) {
    shortcutsModal.addEventListener('click', (e) => {
      if (e.target === shortcutsModal) closeShortcutsModal();
    });
  }

  // Left Tool: Add Text
  toolAddText.addEventListener('click', () => {
    canvasEngine.setPanMode(false);
    const active = canvasEngine.getActiveCanvas();
    const w = active ? active.width : canvasEngine.width;
    const h = active ? active.height : canvasEngine.height;
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
      x: Math.round(w / 2),
      y: Math.round(h / 2),
      rotation: 0,
      opacity: 1
    });
  });

  // Left Tool: Upload Image
  toolUploadImage.addEventListener('click', () => {
    canvasEngine.setPanMode(false);
    imageFileInput.click();
  });
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
    canvasEngine.setPanMode(false);
    const active = canvasEngine.getActiveCanvas();
    const w = active ? active.width : canvasEngine.width;
    const h = active ? active.height : canvasEngine.height;
    canvasEngine.addElement({
      type: 'shape',
      color: '#ff5722',
      width: 450,
      height: 90,
      borderRadius: 14,
      opacity: 1,
      x: Math.round(w / 2),
      y: Math.round(h / 2),
      rotation: 0
    });
  });

  // Background Color Swatches
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      const active = canvasEngine.getActiveCanvas();
      if (active) active.bgColor = color;
      canvasEngine.bgColor = color;
      canvasBgColorInput.value = color;
      canvasEngine.saveHistory();
      canvasEngine.render();
    });
  });

  canvasBgColorInput.addEventListener('input', (e) => {
    const active = canvasEngine.getActiveCanvas();
    if (active) active.bgColor = e.target.value;
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
  function getCleanCanvasDataUrl(targetCanvasId, format = 'image/png', quality = 0.95) {
    const target = canvasEngine.canvases.find(c => c.id === targetCanvasId) || canvasEngine.getActiveCanvas();
    const targetCanvas = target ? target.canvasEl : canvas;
    // Render cleanly without bounding boxes
    canvasEngine.render(target.id, true);
    const dataUrl = targetCanvas.toDataURL(format, quality);
    // Restore selection box
    canvasEngine.render(target.id, false);
    return dataUrl;
  }

  function downloadCanvasImage(targetCanvasId, format = 'png') {
    const target = canvasEngine.canvases.find(c => c.id === targetCanvasId) || canvasEngine.getActiveCanvas();
    if (!target) return;

    let mime = 'image/png';
    let quality = 0.95;
    let ext = 'png';

    if (format === 'jpg' || format === 'jpeg') {
      mime = 'image/jpeg';
      quality = 0.92;
      ext = 'jpg';
    } else if (format === 'webp') {
      mime = 'image/webp';
      quality = 0.92;
      ext = 'webp';
    }

    const dataUrl = getCleanCanvasDataUrl(target.id, mime, quality);
    const a = document.createElement('a');
    a.href = dataUrl;
    const namePrefix = target.name.toLowerCase().replace(/\s+/g, '_');
    a.download = `${namePrefix}_${target.width}x${target.height}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(`Imagem ${ext.toUpperCase()} baixada com sucesso!`, 'success');
  }

  function downloadAllCanvases() {
    if (canvasEngine.canvases.length === 0) return;
    canvasEngine.canvases.forEach((c, index) => {
      setTimeout(() => {
        downloadCanvasImage(c.id, 'png');
      }, index * 250);
    });
    showToast(`Baixando ${canvasEngine.canvases.length} canvas em PNG...`, 'info');
  }

  // Export Dropdown Toggle & Options
  if (exportDropdownBtn && exportDropdownMenu) {
    exportDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !exportDropdownMenu.classList.contains('hidden');
      if (isOpen) {
        exportDropdownMenu.classList.add('hidden');
        if (exportDropdownWrapper) exportDropdownWrapper.classList.remove('open');
      } else {
        exportDropdownMenu.classList.remove('hidden');
        if (exportDropdownWrapper) exportDropdownWrapper.classList.add('open');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (exportDropdownWrapper && !exportDropdownWrapper.contains(e.target)) {
        exportDropdownMenu.classList.add('hidden');
        exportDropdownWrapper.classList.remove('open');
      }
    });

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && exportDropdownMenu && !exportDropdownMenu.classList.contains('hidden')) {
        exportDropdownMenu.classList.add('hidden');
        if (exportDropdownWrapper) exportDropdownWrapper.classList.remove('open');
      }
    });

    async function copyCanvasToClipboard(targetCanvasId) {
      try {
        const target = canvasEngine.canvases.find(c => c.id === targetCanvasId) || canvasEngine.getActiveCanvas();
        if (!target) return;
        const targetCanvas = target.canvasEl;
        canvasEngine.render(target.id, true);
        targetCanvas.toBlob(async (blob) => {
          canvasEngine.render(target.id, false);
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
    }

    // Option items
    exportDropdownMenu.querySelectorAll('.export-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const fmt = item.getAttribute('data-format');
        exportDropdownMenu.classList.add('hidden');
        if (exportDropdownWrapper) exportDropdownWrapper.classList.remove('open');

        if (fmt === 'copy') {
          copyCanvasToClipboard(canvasEngine.activeCanvasId);
        } else if (fmt === 'all') {
          downloadAllCanvases();
        } else {
          downloadCanvasImage(canvasEngine.activeCanvasId, fmt);
        }
      });
    });
  }

});
