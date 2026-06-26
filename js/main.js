document.addEventListener("DOMContentLoaded", () => {
  initSiteLoader();
  initTheme();
  initPage();
  initSearch();
  initNavDropdown();
  initRouter();
  initFABs();
});

function debounce(callback, delay = 160) {
  let timerId;
  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => callback(...args), delay);
  };
}

function onScrollRaf(callback) {
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      callback();
      ticking = false;
    });
  }, { passive: true });
}

function initSiteLoader() {
  const loader = document.getElementById("site-loader");
  if (!loader) return;

  let released = false;
  const releaseLoader = () => {
    if (released) return;
    released = true;
    loader.classList.add("is-hidden");
    loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      loader.remove();
    }, 500);
  };

  if (document.readyState === "complete") {
    window.setTimeout(releaseLoader, 250);
  } else {
    window.addEventListener("load", () => {
      window.setTimeout(releaseLoader, 250);
    }, { once: true });
  }

  window.setTimeout(releaseLoader, 2500);
}

function initNavDropdown() {
  const dropBtn = document.getElementById('nav-dropbtn');
  const dropdown = document.querySelector('.nav-dropdown');
  
  if (dropBtn && dropdown) {
    const closeDropdown = () => {
      dropdown.classList.remove('active');
      dropBtn.setAttribute('aria-expanded', 'false');
    };
    const toggleDropdown = () => {
      const isOpen = dropdown.classList.toggle('active');
      dropBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    dropBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDropdown();
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });
  }
}

function initTheme() {
  const themeToggle = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  const htmlElement = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const prismTheme = document.getElementById("prism-theme");
  
  htmlElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    if (sunIcon && moonIcon) {
      if (theme === "dark") {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      }
    }
  }

  // Update Giscus theme if exists
  const iframe = document.querySelector('iframe.giscus-frame');
  if (iframe) {
    iframe.contentWindow.postMessage({
      giscus: { setConfig: { theme: theme } }
    }, 'https://giscus.app');
  }
}

function initPage() {
  // Convert rich markdown code fences before syntax highlighting and copy controls.
  initMermaidDiagrams();
  initRichMarkdownBlocks();

  // Prism Re-highlight
  if (window.Prism) {
    Prism.highlightAll();
  }
  initSemanticCodeHighlight();

  // Load Giscus Comments
  loadGiscus();

  // Initialize Sidebar Features
  initSidebar();

  // Initialize Category Tree
  initCategoryTree();

  // Initialize rich article display helpers
  initHeadingAnchors();
  initStandaloneLinkCards();

  // Initialize Code Copy Buttons
  initCodeCopy();

  // Initialize Image Zoom
  initImageZoom();

  // Initialize Admonitions/Blockquotes
  initBlockquotes();

  // Mark SiYuan-specific placeholder blocks after callouts are upgraded.
  initSiyuanPlaceholders();

  // Initialize Tables and Embeds
  initTablesAndEmbeds();

  // TOC Highlighting
  const tocLinks = document.querySelectorAll(".toc-container a");
  const sections = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).filter(h => h.id);
  
  if (tocLinks.length > 0) {
    onScrollRaf(() => {
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY >= sectionTop - 120) {
          current = section.getAttribute("id");
        }
      });

      tocLinks.forEach(link => {
        link.classList.remove("active");
        let href = link.getAttribute("href");
        try {
          href = decodeURIComponent(href);
        } catch(e) {}
        if (href === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // Smooth Scroll
  tocLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      // Only apply smooth scroll if it's an anchor link starting with #
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) {
        // This is a real page link, let the browser handle it natively
        return;
      }

      e.preventDefault();
      let targetId = href.substring(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch(e) {}
      const target = document.getElementById(targetId);
      if (target) {
        const targetPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition - 80,
          behavior: "smooth"
        });
      }
    });
  });
}

function initSidebar() {
  // Mobile TOC Toggle (Left Sidebar)
  const tocToggleLeft = document.getElementById("toc-toggle-left");
  const sidebarLeft = document.querySelector(".post-sidebar-left");
  
  if (tocToggleLeft && sidebarLeft) {
    tocToggleLeft.addEventListener("click", () => {
      sidebarLeft.classList.toggle("show-toc");
    });

    sidebarLeft.addEventListener("click", (e) => {
      if (e.target === sidebarLeft) {
        sidebarLeft.classList.remove("show-toc");
      }
    });
  }

  // Mobile TOC Toggle (Right Sidebar)
  const tocToggleRight = document.getElementById("toc-toggle-right");
  const sidebarRight = document.querySelector(".post-sidebar-right");
  
  if (tocToggleRight && sidebarRight) {
    tocToggleRight.addEventListener("click", () => {
      sidebarRight.classList.toggle("show-toc");
    });

    sidebarRight.addEventListener("click", (e) => {
      if (e.target === sidebarRight) {
        sidebarRight.classList.remove("show-toc");
      }
    });
  }

  // Subcategory collapsible logic - delegate to left sidebar
  if (sidebarLeft) {
    sidebarLeft.removeEventListener("click", handleSidebarClick);
    sidebarLeft.addEventListener("click", handleSidebarClick);
  } else {
    const tocContainer = document.querySelector('.toc-container');
    if (tocContainer) {
      tocContainer.removeEventListener("click", handleSidebarClick);
      tocContainer.addEventListener("click", handleSidebarClick);
    }
  }

  function handleSidebarClick(e) {
    const title = e.target.closest('.toc-subcategory-title');
    if (title) {
      const group = title.closest(".toc-subcategory-group");
      if (group) {
        group.classList.toggle("open");
      }
    }
  }
}

function initCategoryTree() {
  const toggleElements = document.querySelectorAll('.category-header, .subcategory-title');
  if (toggleElements.length > 0) {
    toggleElements.forEach(el => {
      const toggleFn = (e) => {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') {
          return;
        }
        if (e.type === 'keydown') {
          e.preventDefault();
        }
        
        e.stopPropagation(); // 阻止事件冒泡，防止点击二级分类时触发一级分类的折叠
        
        const group = el.closest('.subcategory-group') || el.closest('.category-group');
        if (group) {
          const isOpen = group.classList.toggle('open');
          el.setAttribute('aria-expanded', isOpen);
        }
      };
      
      el.addEventListener('click', toggleFn);
      el.addEventListener('keydown', toggleFn);
    });
  }
}

function initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");

  if (searchInput) {
    searchInput.setAttribute("aria-busy", "true");
    searchResults.setAttribute("role", "listbox");
    // Determine searchIndexUrl from window object, or default to root
    const searchIndexUrl = (window.siteConfig && window.siteConfig.searchIndexUrl) ? window.siteConfig.searchIndexUrl : "/index.json";
    const rootUrl = searchIndexUrl.replace("index.json", "");
    
    fetch(searchIndexUrl)
      .then(response => {
        if (!response.ok) throw new Error("Search index fetch failed");
        return response.json();
      })
      .then(data => {
        const fuse = new Fuse(data, {
          keys: [
            { name: "title", weight: 0.45 },
            { name: "content", weight: 0.4 },
            { name: "summary", weight: 0.1 },
            { name: "tags", weight: 0.05 }
          ],
          includeMatches: true,
          threshold: 0.3,
          minMatchCharLength: 2
        });

        searchInput.setAttribute("aria-busy", "false");
        const runSearch = debounce((query) => {
          searchInput.classList.remove("is-searching");
          if (query.length > 0) {
            const results = fuse.search(query);
            displayResults(results, query);
          } else {
            searchResults.style.display = "none";
          }
        });

        searchInput.addEventListener("input", (e) => {
          const query = e.target.value.trim();
          if (query.length > 0) {
            searchInput.classList.add("is-searching");
          }
          runSearch(query);
        });

        // Hide results when clicking outside
        document.addEventListener("click", (e) => {
          if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = "none";
          }
        });
      })
      .catch(error => {
        console.error("Error loading search index:", error);
        searchInput.placeholder = "搜索不可用...";
        searchInput.disabled = true;
        searchInput.setAttribute("aria-busy", "false");
      });

    function displayResults(results, query) {
      searchResults.innerHTML = "";
      if (results.length === 0) {
        const empty = document.createElement("div");
        empty.className = "search-state search-empty";
        empty.textContent = `没有找到 “${query}”`;
        searchResults.appendChild(empty);
        searchResults.style.display = "block";
        return;
      }

      const fragment = document.createDocumentFragment();
      results.slice(0, 10).forEach(result => {
        const a = document.createElement("a");
        
        let linkUrl = result.item.permalink;
        if (linkUrl.startsWith("/") && rootUrl) {
          linkUrl = rootUrl + linkUrl.substring(1);
        }
        a.href = linkUrl;
        
        const title = document.createElement("strong");
        title.className = "search-result-title";
        title.textContent = result.item.title || "Untitled";
        const snippet = document.createElement("small");
        snippet.className = "search-result-content";
        snippet.textContent = createSearchSnippet(result, query);
        a.appendChild(title);
        a.appendChild(snippet);
        fragment.appendChild(a);
      });

      searchResults.appendChild(fragment);
      searchResults.style.display = "block";
    }
  }
}

function normalizeSearchText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function createSearchSnippet(result, query) {
  const item = result.item || {};
  const content = normalizeSearchText(item.content || item.summary || "");
  if (!content) return "暂无正文摘要";

  const contentMatch = (result.matches || []).find(match => match.key === "content")
    || (result.matches || []).find(match => match.key === "summary");
  const matchIndex = contentMatch && contentMatch.indices && contentMatch.indices.length
    ? contentMatch.indices[0][0]
    : content.toLowerCase().indexOf((query || "").toLowerCase());

  if (matchIndex < 0) {
    return content.length > 120 ? `${content.slice(0, 120)}...` : content;
  }

  const start = Math.max(0, matchIndex - 42);
  const end = Math.min(content.length, matchIndex + Math.max(query.length, 12) + 78);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < content.length ? "..." : "";
  return `${prefix}${content.slice(start, end)}${suffix}`;
}

function loadGiscus() {
  const commentsContainer = document.getElementById('comments');
  const giscusContainer = document.getElementById('giscus-container');
  
  if (commentsContainer && giscusContainer) {
    giscusContainer.innerHTML = ''; // clear previous
    giscusContainer.classList.remove('is-loaded', 'is-error');

    const status = document.createElement('p');
    status.className = 'giscus-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = commentsContainer.dataset.mapping === 'pathname'
      ? '留言板加载中...'
      : '评论区加载中...';
    giscusContainer.appendChild(status);

    const showGiscusError = message => {
      giscusContainer.classList.add('is-error');
      status.className = 'giscus-status is-error';
      status.textContent = message;
    };
    
    const gConfig = (window.SiteConfig && window.SiteConfig.giscus) ? window.SiteConfig.giscus : null;
    if (!gConfig || !gConfig.repo || !gConfig.repoId || !gConfig.category || !gConfig.categoryId) {
      showGiscusError('评论配置缺失，请检查站点配置。');
      return;
    }
    if (gConfig.enabled === false) {
      status.className = 'giscus-status giscus-local-notice';
      status.textContent = '本地预览不加载评论，发布后自动启用。';
      return;
    }

    const observer = new MutationObserver(() => {
      if (!giscusContainer.querySelector('iframe.giscus-frame')) return;
      window.clearTimeout(timeout);
      giscusContainer.classList.add('is-loaded');
      status.remove();
      observer.disconnect();
    });
    observer.observe(giscusContainer, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => {
      if (giscusContainer.querySelector('iframe.giscus-frame')) return;
      observer.disconnect();
      showGiscusError('评论区加载较慢，请刷新页面或稍后再试。');
    }, 12000);

    const script = document.createElement('script');
    script.src = "https://giscus.app/client.js";
    script.onerror = () => {
      window.clearTimeout(timeout);
      observer.disconnect();
      showGiscusError('评论区加载失败，请检查网络后刷新页面。');
    };

    script.setAttribute("data-repo", gConfig.repo);
    script.setAttribute("data-repo-id", gConfig.repoId); 
    script.setAttribute("data-category", gConfig.category);
    script.setAttribute("data-category-id", gConfig.categoryId); 

    const mapping = commentsContainer.dataset.mapping || "pathname";
    const term = commentsContainer.dataset.term || "";
    script.setAttribute("data-mapping", mapping === "specific" && !term ? "pathname" : mapping);
    if (term) {
      script.setAttribute("data-term", term);
    }
    
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", document.documentElement.getAttribute("data-theme") || "light");
    script.setAttribute("data-lang", "zh-CN");
    script.crossOrigin = "anonymous";
    script.async = true;
    giscusContainer.appendChild(script);
  }
}

function initRouter() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transitionDelay = prefersReducedMotion ? 0 : 180;

  document.body.classList.add("page-ready");

  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-leaving", "loading-page");
    NProgress.done();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || !shouldAnimateNavigation(event, link)) return;

    event.preventDefault();
    navigate(link.href, transitionDelay);
  });
}

function shouldAnimateNavigation(event, link) {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (link.target && link.target !== "_self") return false;
  if (link.hasAttribute("download")) return false;

  const href = link.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;

  const nextUrl = new URL(link.href, window.location.href);
  if (nextUrl.origin !== window.location.origin) return false;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const nextPath = `${nextUrl.pathname}${nextUrl.search}`;
  if (currentPath === nextPath && nextUrl.hash) return false;

  return true;
}

// Simple NProgress mock implementation
const NProgress = {
  start: () => {
    let np = document.getElementById('nprogress');
    if (!np) {
      np = document.createElement('div');
      np.id = 'nprogress';
      np.innerHTML = '<div class="bar"><div class="peg"></div></div>';
      document.body.appendChild(np);
    }
    const bar = np.querySelector('.bar');
    bar.style.width = '10%';
    setTimeout(() => { bar.style.width = '40%'; }, 200);
    setTimeout(() => { bar.style.width = '80%'; }, 500);
  },
  done: () => {
    const np = document.getElementById('nprogress');
    if (np) {
      const bar = np.querySelector('.bar');
      bar.style.width = '100%';
      setTimeout(() => { np.remove(); }, 300);
    }
  }
};

function shouldWrapCodeText(text, language = '') {
  const normalized = (text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return false;

  const lines = (text || '').split(/\r?\n/).filter(line => line.trim());
  const textLanguages = new Set(['', 'text', 'txt', 'plain', 'plaintext']);
  if (textLanguages.has(language)) return true;

  const cjkCount = (normalized.match(/[\u3400-\u9fff]/g) || []).length;
  const proseLike = cjkCount >= 8 || /[，。！？；：、]/.test(normalized);
  if (!proseLike) return false;

  const codeSignals = [
    /[{};]/g,
    /\b(if|for|while|switch|return|import|from|def|class|function|const|let|var)\b/g,
    /\b(int|char|void|bool|BOOL|unsigned|struct|DWORD|BYTE)\b/g,
    /[=<>()[\]]/g,
    /\/\/|\/\*|\*\/|=>|::|__fastcall/g,
  ].reduce((count, pattern) => count + ((text || '').match(pattern) || []).length, 0);

  return codeSignals <= Math.max(1, Math.floor(lines.length / 2));
}

function getCodeLanguage(code) {
  const className = code.className || '';
  const languageMatch = className.match(/language-([\w-]+)/);
  return languageMatch ? languageMatch[1].toLowerCase() : '';
}

function setCodeLanguage(code, language) {
  if (!code || !language) return;

  Array.from(code.classList).forEach(className => {
    if (className.startsWith('language-')) {
      code.classList.remove(className);
    }
  });

  code.classList.add(`language-${language}`);
  code.dataset.lang = language;
  code.setAttribute('data-lang', language);
}

function markIdaPseudocode(code) {
  if (!code) return;

  code.classList.add('ida-pseudocode');
  const pre = code.closest('pre');
  if (pre) {
    pre.classList.add('ida-pseudocode-block');
  }
}

function looksLikeIdaPseudocode(text) {
  const source = text || '';
  if (!source.trim()) return false;

  let score = 0;
  if (/\b__(?:int\d+|fastcall|cdecl|stdcall|thiscall|usercall)\b|\b_(?:BYTE|WORD|DWORD|QWORD|BOOL)\b|BYREF/.test(source)) score += 2;
  if (/\bsub_[0-9A-Fa-f]+|qmemcpy|__isoc99_scanf|std::|::/.test(source)) score += 1;
  if (/\b(?:int|void|char|bool|BOOL|size_t|unsigned|signed|const|struct)\b[^{;\n]*\([^)]*\)\s*\{/.test(source)) score += 2;
  if (/[{};]/.test(source) && /\b(?:if|for|while|return|else|switch)\b/.test(source)) score += 1;
  if (/\*+\s*\(?\s*(?:_BYTE|_DWORD|_QWORD|char|int|void)|\[[re]?[bs]p[+-]/i.test(source)) score += 1;
  if (/^\s*(?:def|from|import|class)\s+/m.test(source) && !/[{};]/.test(source)) score -= 2;

  return score >= 3;
}

function looksLikeAssembly(text) {
  const source = text || '';
  if (!source.trim()) return false;

  const lines = source.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (!lines.length) return false;

  const mnemonicPattern = /\b(?:aaa|aad|aam|aas|adc|add|align|and|call|cbw|cdq|clc|cld|cli|cmc|cmp|cmps?|cmpsb|cmpsd|cmpsw|cwd|daa|das|db|dd|dec|div|dq|dt|dw|endp|enter|equ|hlt|idiv|imul|in|inc|int|into|iret|ja|jae|jb|jbe|jc|jcxz|je|jecxz|jg|jge|jl|jle|jmp|jna|jnae|jnb|jnbe|jnc|jne|jng|jnge|jnl|jnle|jno|jnp|jns|jnz|jo|jp|jpe|jpo|js|jz|lahf|lea|leave|lods?|lodsb|lodsd|lodsw|loop|loope|loopne|loopnz|loopz|mov|movs?|movsb|movsd|movsw|movsx|movzx|mul|neg|nop|not|or|out|pop|popa|popad|popf|popfd|proc|push|pusha|pushad|pushf|pushfd|rcl|rcr|resb|resd|resq|resw|ret|retn|retf|rol|ror|sahf|sal|sar|sbb|scas?|scasb|scasd|scasw|section|segment|set[a-z]+|shl|shld|shr|shrd|stos?|stosb|stosd|stosw|sub|test|times|xadd|xchg|xlat|xor)\b/i;
  const asmLinePattern = /^\s*(?:[.$A-Za-z_][\w.$]*:)?(?:[0-9A-Fa-f]{6,16}\s+)?[A-Za-z][A-Za-z0-9.]*\b/;
  const addressLinePattern = /^\s*(?:[.$A-Za-z_][\w.$]*:)?[0-9A-Fa-f]{6,16}\s+/;
  const hasAddressLine = lines.some(line => addressLinePattern.test(line));

  if (!hasAddressLine && /[{};]/.test(source) && /\b(?:return|sizeof|printf|scanf|for|while|if|else)\b/.test(source)) {
    return false;
  }

  const asmLines = lines.filter(line => mnemonicPattern.test(line) && asmLinePattern.test(line)).length;
  if (asmLines === 0) return false;

  let score = asmLines;
  if (hasAddressLine) score += 2;
  if (/\b(?:e?[abcd]x|e?[sd]i|e?[sb]p|r(?:[0-9]+|[abcd]x|[sd]i|[sb]p)|[abcd][lh])\b/i.test(source)) score += 1;
  if (/\b(?:byte|word|dword|qword|xmmword|ymmword)\s+ptr\b/i.test(source)) score += 1;
  if (/\[[^\]\n]+\]/.test(source)) score += 1;
  if (/^\s*(?:def|from|import|class)\s+/m.test(source) && !addressLinePattern.test(source)) score -= 2;

  return score >= 3;
}

function normalizeCodeLanguage(code, language) {
  const text = code.textContent || '';
  const normalizedLanguage = language === 'py' ? 'python' : language;

  if (looksLikeAssembly(text)) {
    setCodeLanguage(code, 'nasm');
    return 'nasm';
  }

  if (looksLikeIdaPseudocode(text)) {
    setCodeLanguage(code, 'c');
    markIdaPseudocode(code);
    return 'c';
  }

  if (normalizedLanguage && normalizedLanguage !== language) {
    setCodeLanguage(code, normalizedLanguage);
  }

  return normalizedLanguage;
}

function isAssemblyLanguage(language) {
  return ['asm', 'assembly', 'nasm', 'x86asm', 'x86-asm'].includes(language);
}

function isIdaGeneratedFunctionName(value) {
  return /^sub_[0-9A-Fa-f]+$/i.test((value || '').trim());
}

function isIdaGlobalName(value) {
  return /^(?:(?:byte|word|dword|qword|xmmword|ymmword|oword|stru|asc|off|unk|loc)_[0-9A-Fa-f]+|a[A-Z0-9_][A-Za-z0-9_]*_[0-9A-Fa-f]+)$/i.test((value || '').trim());
}

function initSemanticCodeHighlight() {
  const codeBlocks = document.querySelectorAll('.post-content pre code, .page-content pre code');
  codeBlocks.forEach(code => {
    if (code.dataset.semanticHighlight === 'done') return;
    if (code.classList.contains('language-mermaid')) return;

    const language = getCodeLanguage(code);
    if (isAssemblyLanguage(language)) {
      highlightAssemblyCode(code);
      code.dataset.semanticHighlight = 'done';
      return;
    }

    if (!['c', 'cpp', 'c++', 'python', 'py', 'javascript', 'js', 'typescript', 'ts'].includes(language)) return;

    highlightCodeIdentifiers(code, language);
    code.dataset.semanticHighlight = 'done';
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function highlightAssemblyCode(code) {
  const source = code.textContent || '';
  if (!source.trim()) return;

  const opcodePattern = /\b(?:aaa|aad|aam|aas|adc|add|align|and|call|cbw|cdq|clc|cld|cli|cmc|cmp|cmps?|cmpsb|cmpsd|cmpsw|cwd|daa|das|db|dd|dec|div|dq|dt|dw|endp|enter|equ|hlt|idiv|imul|in|inc|int|into|iret|ja|jae|jb|jbe|jc|jcxz|je|jecxz|jg|jge|jl|jle|jmp|jna|jnae|jnb|jnbe|jnc|jne|jng|jnge|jnl|jnle|jno|jnp|jns|jnz|jo|jp|jpe|jpo|js|jz|lahf|lea|leave|lods?|lodsb|lodsd|lodsw|loop|loope|loopne|loopnz|loopz|mov|movs?|movsb|movsd|movsw|movsx|movzx|mul|neg|nop|not|or|out|pop|popa|popad|popf|popfd|proc|push|pusha|pushad|pushf|pushfd|rcl|rcr|resb|resd|resq|resw|ret|retn|retf|rol|ror|sahf|sal|sar|sbb|scas?|scasb|scasd|scasw|section|segment|set[a-z]+|shl|shld|shr|shrd|stos?|stosb|stosd|stosw|sub|test|times|xadd|xchg|xlat|xor)\b/gi;
  const numberPattern = /\b(?:0x[0-9A-Fa-f]+|[0-9A-Fa-f]{4,16}h|[0-9A-Fa-f]{6,16}|[0-9]+)\b/g;
  const stringPattern = /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
  const tokenPattern = new RegExp(`${stringPattern.source}|${numberPattern.source}|${opcodePattern.source}`, 'gi');

  code.innerHTML = source.split(/(\r?\n)/).map(part => {
    if (/^\r?\n$/.test(part)) return part;

    const commentStart = part.indexOf(';');
    const codePart = commentStart >= 0 ? part.slice(0, commentStart) : part;
    const commentPart = commentStart >= 0 ? part.slice(commentStart) : '';

    let cursor = 0;
    let html = '';
    codePart.replace(tokenPattern, (...args) => {
      const match = args[0];
      const offset = args[args.length - 2];
      html += escapeHtml(codePart.slice(cursor, offset));

      let tokenClass = '';
      if (/^["']/.test(match)) {
        tokenClass = 'asm-string';
      } else if (/^(?:0x[0-9A-Fa-f]+|[0-9A-Fa-f]{4,16}h|[0-9A-Fa-f]{6,16}|[0-9]+)$/i.test(match)) {
        tokenClass = 'asm-number';
      } else {
        tokenClass = 'asm-keyword';
      }

      html += `<span class="token semantic-token ${tokenClass}">${escapeHtml(match)}</span>`;
      cursor = offset + match.length;
      return match;
    });

    html += escapeHtml(codePart.slice(cursor));
    if (commentPart) {
      html += `<span class="token semantic-token asm-comment">${escapeHtml(commentPart)}</span>`;
    }
    return html;
  }).join('');
}

function highlightCodeIdentifiers(code, language) {
  const idaLike = code.classList.contains('ida-pseudocode');
  const reservedWords = new Set([
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    'goto', 'sizeof', 'typedef', 'struct', 'union', 'enum', 'class', 'public', 'private', 'protected',
    'new', 'delete', 'try', 'catch', 'throw', 'this', 'true', 'false', 'null', 'NULL', 'nullptr',
    'def', 'import', 'from', 'as', 'with', 'pass', 'yield', 'lambda', 'global', 'nonlocal', 'and',
    'or', 'not', 'in', 'is', 'None', 'True', 'False', 'const', 'let', 'var', 'function'
  ]);
  const typeWords = new Set([
    'void', 'char', 'short', 'int', 'long', 'float', 'double', 'signed', 'unsigned', 'bool', 'BOOL',
    'BYTE', 'WORD', 'DWORD', 'QWORD', '_BYTE', '_WORD', '_DWORD', '_QWORD', '__int8', '__int16',
    '__int32', '__int64', 'size_t', 'ssize_t', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t',
    'int8_t', 'int16_t', 'int32_t', 'int64_t', 'wchar_t', 'FILE', 'HWND', 'HANDLE', 'LPVOID',
    'CHAR', 'WCHAR', 'LPSTR', 'LPCSTR', 'LPWSTR', 'LPCWSTR', 'LRESULT', 'WPARAM', 'LPARAM',
    '_BOOL1', '_BOOL2', '_BOOL4', '_BOOL8', '_OWORD', '_LONGLONG', '__m128', '__m128i',
    '__m256', '__m256i', 'CPPEH_RECORD'
  ]);
  const callingConventions = new Set([
    '__fastcall', '__cdecl', '__stdcall', '__thiscall', '__usercall', '__noreturn', '__spoils'
  ]);
  const functionPrefixes = /^(?:sub|loc|off|byte|word|dword|qword|unk|j|j_|main|check|judge|encrypt|decrypt|calc|printf|puts|strlen|scanf|sprintf|qmemcpy|memcpy|strcmp|strncmp|malloc|free|print|range|len|bytes|enumerate)$/i;
  const identifierPattern = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
  const cLike = ['c', 'cpp', 'c++'].includes(language);

  code.querySelectorAll('.token.keyword, .token.builtin, .token.constant').forEach(token => {
    const value = token.textContent.trim();
    if (typeWords.has(value)) {
      token.classList.add('type');
    }
    if (callingConventions.has(value)) {
      token.classList.add('calling-convention');
    }
  });

  if (idaLike) {
    code.querySelectorAll('.token.function, .token.builtin, .token.constant, .token.variable, .token.symbol').forEach(token => {
      if (isIdaGeneratedFunctionName(token.textContent)) {
        token.classList.add('ida-sub-function');
      }
      if (isIdaGlobalName(token.textContent)) {
        token.classList.add('ida-global');
      }
    });
  }

  const walker = document.createTreeWalker(
    code,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.nodeValue || !identifierPattern.test(node.nodeValue)) {
          identifierPattern.lastIndex = 0;
          return NodeFilter.FILTER_REJECT;
        }
        identifierPattern.lastIndex = 0;

        let parent = node.parentElement;
        while (parent && parent !== code) {
          if (parent.classList.contains('semantic-token')) return NodeFilter.FILTER_REJECT;
          if (parent.classList.contains('token')) {
            const ignoredToken = ['comment', 'string', 'char', 'number', 'function', 'keyword', 'builtin', 'class-name', 'operator', 'punctuation'];
            if (ignoredToken.some(token => parent.classList.contains(token))) {
              return NodeFilter.FILTER_REJECT;
            }
          }
          if (/(^|\s)(c|c1|cm|cp|cpf|s|s1|s2|sa|sb|sc|sd|se|sh|si|sx|mi|mf|mh|mo)(\s|$)/.test(parent.className || '')) {
            return NodeFilter.FILTER_REJECT;
          }
          parent = parent.parentElement;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    const text = node.nodeValue;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    text.replace(identifierPattern, (word, offset) => {
      if (offset > cursor) {
        fragment.appendChild(document.createTextNode(text.slice(cursor, offset)));
      }

      const tokenClass = getSemanticTokenClass(word, text.slice(offset + word.length), {
        cLike,
        reservedWords,
        typeWords,
        callingConventions,
        functionPrefixes,
        idaLike
      });

      if (tokenClass) {
        const span = document.createElement('span');
        span.className = `token semantic-token ${tokenClass}`;
        span.textContent = word;
        fragment.appendChild(span);
      } else {
        fragment.appendChild(document.createTextNode(word));
      }

      cursor = offset + word.length;
      return word;
    });

    if (cursor < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }

    node.parentNode.replaceChild(fragment, node);
  });
}

function getSemanticTokenClass(word, followingText, context) {
  const { cLike, reservedWords, typeWords, callingConventions, functionPrefixes, idaLike } = context;

  if (callingConventions.has(word)) return 'calling-convention';
  if (typeWords.has(word)) return 'type';
  if (reservedWords.has(word)) return 'keyword';
  if (idaLike && isIdaGlobalName(word)) {
    return 'ida-global';
  }
  if (/^\s*\(/.test(followingText) && !['if', 'for', 'while', 'switch', 'return', 'sizeof'].includes(word)) {
    return 'function';
  }
  if (cLike && functionPrefixes.test(word) && /^\s*(?:\(|;|,|\[|$)/.test(followingText)) {
    return 'function';
  }
  if (/^(?:v\d+|a\d+|i|j|k|argc|argv|envp|result|flag|target|buffer|Buffer|Str|Src|Size|Block|this|ptr|count|key|ms_exc|flOldProtect)$/i.test(word)) {
    return 'variable';
  }

  return '';
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_error) {
      // Fall through to the selection-based copy path used by older WebViews.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const previousRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
    if (selection) {
      selection.removeAllRanges();
      if (previousRange) {
        selection.addRange(previousRange);
      }
    }
  }

  return copied;
}

async function navigate(url, delay = 180) {
  document.body.classList.add("page-leaving", "loading-page");
  NProgress.start();

  window.setTimeout(() => {
    window.location.assign(url);
  }, delay);
}

function initCodeBlockFolding(wrapper, pre) {
  if (!wrapper || !pre || wrapper.dataset.foldReady === 'true') return;

  const setFolded = (folded) => {
    wrapper.classList.toggle('is-code-collapsed', folded);
    wrapper.setAttribute('aria-expanded', folded ? 'false' : 'true');
    wrapper.title = folded ? '双击展开代码块' : '双击折叠代码块';
  };

  const toggleFold = () => {
    setFolded(!wrapper.classList.contains('is-code-collapsed'));
  };

  wrapper.dataset.foldReady = 'true';
  wrapper.setAttribute('aria-expanded', 'true');
  wrapper.title = '双击折叠代码块';

  wrapper.addEventListener('dblclick', (event) => {
    if (event.target.closest('button, a, input, textarea, select')) return;
    toggleFold();
  });

  wrapper.addEventListener('keydown', (event) => {
    if (!['Enter', ' '].includes(event.key)) return;
    if (event.target.closest('button, a, input, textarea, select')) return;
    event.preventDefault();
    toggleFold();
  });

  wrapper.tabIndex = 0;
}

function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('.post-content pre, .page-content pre');
  
  codeBlocks.forEach(pre => {
    // 避免重复添加
    if (pre.parentElement.classList.contains('code-block-wrapper')) {
      initCodeBlockFolding(pre.parentElement, pre);
      return;
    }

    // 提取语言信息
    let lang = '';
    const codeEl = pre.querySelector('code');
    if (codeEl && codeEl.className) {
      const match = codeEl.className.match(/language-(\w+)/);
      if (match) {
        lang = match[1];
      }
    }
    
    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    if (lang) {
      wrapper.setAttribute('data-lang', lang);
    }
    if (pre.classList.contains('rich-code-terminal')) {
      wrapper.classList.add('code-terminal');
    }
    if (pre.classList.contains('rich-code-filetree')) {
      wrapper.classList.add('code-filetree');
    }
    if (pre.classList.contains('code-text-wrap')) {
      wrapper.classList.add('code-text-wrap');
    }
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    initCodeBlockFolding(wrapper, pre);

    // 创建复制按钮
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.textContent = '复制';
    copyBtn.setAttribute('aria-label', '复制代码');
    
    wrapper.appendChild(copyBtn);

    // 绑定点击事件
    copyBtn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      let textToCopy = '';
      
      if (code) {
        const clone = code.cloneNode(true);
        const lineNumbers = clone.querySelector('.line-numbers-rows');
        if (lineNumbers) {
          lineNumbers.remove();
        }
        textToCopy = clone.textContent;
      } else {
        const clone = pre.cloneNode(true);
        const lineNumbers = clone.querySelector('.line-numbers-rows');
        if (lineNumbers) {
          lineNumbers.remove();
        }
        textToCopy = clone.textContent;
      }

      try {
        const copied = await copyTextToClipboard(textToCopy);
        if (!copied) {
          throw new Error('Copy command was not accepted.');
        }
        copyBtn.textContent = '已复制';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.textContent = '复制';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        copyBtn.textContent = '失败';
        setTimeout(() => {
          copyBtn.textContent = '复制';
        }, 2000);
      }
    });
  });
}

function initMermaidDiagrams() {
  const mermaidBlocks = document.querySelectorAll('.post-content pre code.language-mermaid, .page-content pre code.language-mermaid');
  mermaidBlocks.forEach(code => {
    const pre = code.closest('pre');
    if (!pre || pre.classList.contains('is-mermaid-source')) return;

    const diagram = document.createElement('div');
    diagram.className = 'mermaid';
    diagram.textContent = code.textContent.trim();
    pre.replaceWith(diagram);
  });

  if (window.mermaid && document.querySelector('.mermaid')) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'strict'
    });
    window.mermaid.run({ querySelector: '.mermaid' });
  }
}

function initRichMarkdownBlocks() {
  const wrappers = document.querySelectorAll('.post-content pre, .page-content pre');
  wrappers.forEach(pre => {
    const code = pre.querySelector('code');
    if (!code) return;
    const className = code.className || '';
    const languageMatch = className.match(/language-([\w-]+)/);
    let language = languageMatch ? languageMatch[1].toLowerCase() : '';
    language = normalizeCodeLanguage(code, language);

    const isTerminalBlock = code.classList.contains('language-terminal')
      || code.classList.contains('language-console')
      || code.classList.contains('language-shell-session');
    const isPowerShellBlock = code.classList.contains('language-powershell');
    const isFileTreeBlock = code.classList.contains('language-filetree')
      || code.classList.contains('language-tree');

    if (isTerminalBlock || ['terminal', 'console', 'shell-session'].includes(language)) {
      pre.dataset.prompt = '$';
    }
    if (isPowerShellBlock || language === 'powershell') {
      pre.dataset.prompt = 'PS>';
    }
    if (pre.dataset.prompt) {
      pre.classList.add('rich-code-terminal');
    }
    if (isFileTreeBlock || language === 'filetree' || language === 'tree') {
      pre.classList.add('rich-code-filetree');
    }
    if (!isTerminalBlock && !isPowerShellBlock && !isFileTreeBlock && shouldWrapCodeText(code.textContent, language)) {
      pre.classList.add('code-text-wrap');
    }
  });

  document.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
    const pre = wrapper.querySelector('pre');
    if (!pre) return;
    if (pre.classList.contains('rich-code-terminal')) {
      wrapper.classList.add('code-terminal');
    }
    if (pre.classList.contains('rich-code-filetree')) {
      wrapper.classList.add('code-filetree');
    }
    if (pre.classList.contains('code-text-wrap')) {
      wrapper.classList.add('code-text-wrap');
    }
  });

  document.querySelectorAll('.post-content dl, .page-content dl').forEach(list => {
    list.classList.add('definition-list-card');
  });
}

function initHeadingAnchors() {
  const headings = document.querySelectorAll('.post-content h1[id], .post-content h2[id], .post-content h3[id], .post-content h4[id], .post-content h5[id], .post-content h6[id]');
  headings.forEach(heading => {
    if (heading.querySelector('.heading-anchor, .anchor')) return;

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor anchor';
    anchor.href = `#${heading.id}`;
    anchor.setAttribute('aria-label', `链接到 ${heading.textContent.trim()}`);
    anchor.textContent = '#';
    heading.appendChild(anchor);
  });
}

function initStandaloneLinkCards() {
  const paragraphs = document.querySelectorAll('.post-content p, .page-content p');
  paragraphs.forEach(paragraph => {
    if (paragraph.classList.contains('standalone-link-card')) return;
    const links = paragraph.querySelectorAll('a[href]');
    if (links.length !== 1) return;

    const link = links[0];
    const normalizedText = paragraph.textContent.replace(/\s+/g, ' ').trim();
    if (normalizedText !== link.textContent.replace(/\s+/g, ' ').trim()) return;

    let url;
    try {
      url = new URL(link.href, window.location.href);
    } catch (_error) {
      return;
    }
    if (!/^https?:$/.test(url.protocol)) return;

    paragraph.classList.add('standalone-link-card');
    link.classList.add('standalone-link-main');
    link.setAttribute('target', link.hostname === window.location.hostname ? '_self' : '_blank');
    link.setAttribute('rel', 'noopener');

    const domain = document.createElement('span');
    domain.className = 'standalone-link-domain';
    domain.textContent = url.hostname.replace(/^www\./, '');
    link.appendChild(domain);
  });
}

function initImageZoom() {
  const zoomSelector = '.post-figure img:not(.no-zoom), .post-content img:not(.no-zoom), .page-content img:not(.no-zoom)';
  const zoomOptions = {
    margin: 24,
    background: 'var(--bg-color)',
    scrollOffset: 0,
  };

  const setupMediumZoom = () => {
    if (typeof mediumZoom === 'undefined') return;

    const zoom = mediumZoom(zoomSelector, zoomOptions);
    const baseTransforms = new WeakMap();
    const baseRects = new WeakMap();
    let openedImages = [];
    let zoomScale = 1;
    let zoomActive = false;
    let panX = 0;
    let panY = 0;
    let touchY = null;
    const dragState = {
      active: false,
      pointerId: null,
      x: 0,
      y: 0,
      suppressClick: false,
    };

    const minScale = 1;
    const maxScale = 4;
    const wheelSensitivity = 0.0022;
    const touchSensitivity = 0.0035;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const hasActiveZoom = () => zoomActive || document.body.classList.contains('medium-zoom--opened');

    const registerOpenedImages = () => {
      openedImages = Array.from(document.querySelectorAll('.medium-zoom-image--opened'));
      openedImages.forEach(image => {
        if (!baseTransforms.has(image)) {
          baseTransforms.set(image, image.style.transform || '');
        }
        if (!baseRects.has(image)) {
          const rect = image.getBoundingClientRect();
          baseRects.set(image, {
            width: rect.width,
            height: rect.height,
          });
        }
        image.style.transformOrigin = 'center center';
      });
    };

    const getPanBounds = () => {
      const image = openedImages[0];
      const rect = image ? baseRects.get(image) : null;
      const width = rect?.width || 0;
      const height = rect?.height || 0;

      return {
        x: Math.max(0, (width * zoomScale - window.innerWidth + 48) / 2),
        y: Math.max(0, (height * zoomScale - window.innerHeight + 48) / 2),
      };
    };

    const clampPan = () => {
      if (zoomScale <= minScale) {
        panX = 0;
        panY = 0;
        return;
      }

      const bounds = getPanBounds();
      panX = clamp(panX, -bounds.x, bounds.x);
      panY = clamp(panY, -bounds.y, bounds.y);
    };

    const applyZoomTransform = () => {
      registerOpenedImages();
      clampPan();
      openedImages.forEach(image => {
        const baseTransform = baseTransforms.get(image) || '';
        image.classList.toggle('image-zoom-pannable', zoomScale > minScale);
        image.style.transform = zoomScale <= minScale
          ? baseTransform
          : `${baseTransform} translate(${panX / zoomScale}px, ${panY / zoomScale}px) scale(${zoomScale})`;
      });
      document.body.classList.toggle('image-zoom-can-pan', hasActiveZoom() && zoomScale > minScale);
    };

    const resetZoomScale = () => {
      openedImages.forEach(image => {
        if (!baseTransforms.has(image)) return;
        image.style.transform = baseTransforms.get(image) || '';
        image.style.transformOrigin = '';
        image.classList.remove('image-zoom-pannable');
        baseTransforms.delete(image);
        baseRects.delete(image);
      });

      openedImages = [];
      zoomScale = 1;
      panX = 0;
      panY = 0;
      touchY = null;
      dragState.active = false;
      dragState.pointerId = null;
      dragState.suppressClick = false;
      document.body.classList.remove('image-zoom-can-pan', 'image-zoom-panning');
    };

    const updateScale = deltaY => {
      const nextScale = clamp(zoomScale - deltaY, minScale, maxScale);
      if (Math.abs(nextScale - zoomScale) < 0.001) return;

      zoomScale = nextScale;
      applyZoomTransform();
    };

    const startPan = event => {
      if (!hasActiveZoom() || zoomScale <= minScale) return;
      const image = event.target.closest?.('.medium-zoom-image--opened');
      if (!image) return;

      event.preventDefault();
      event.stopPropagation();

      dragState.active = true;
      dragState.pointerId = event.pointerId;
      dragState.x = event.clientX;
      dragState.y = event.clientY;
      dragState.suppressClick = false;
      document.body.classList.add('image-zoom-panning');
      try {
        image.setPointerCapture?.(event.pointerId);
      } catch (_error) {
        // Some embedded browsers reject synthetic or already-captured pointers.
      }
    };

    const movePan = event => {
      if (!dragState.active || event.pointerId !== dragState.pointerId) return;

      event.preventDefault();
      event.stopPropagation();

      const deltaX = event.clientX - dragState.x;
      const deltaY = event.clientY - dragState.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 2) {
        dragState.suppressClick = true;
      }

      dragState.x = event.clientX;
      dragState.y = event.clientY;
      panX += deltaX;
      panY += deltaY;
      applyZoomTransform();
    };

    const endPan = event => {
      if (!dragState.active || event.pointerId !== dragState.pointerId) return;

      event.preventDefault();
      event.stopPropagation();

      dragState.active = false;
      dragState.pointerId = null;
      document.body.classList.remove('image-zoom-panning');
    };

    zoom.on('open', () => {
      zoomActive = true;
      zoomScale = 1;
      panX = 0;
      panY = 0;
      touchY = null;
    });

    zoom.on('opened', () => {
      zoomActive = true;
      zoomScale = 1;
      panX = 0;
      panY = 0;
      window.requestAnimationFrame(registerOpenedImages);
    });

    zoom.on('close', () => {
      zoomActive = false;
      touchY = null;
    });

    zoom.on('closed', () => {
      zoomActive = false;
      resetZoomScale();
    });

    window.addEventListener('wheel', event => {
      if (!hasActiveZoom()) return;

      event.preventDefault();
      updateScale(event.deltaY * wheelSensitivity);
    }, { passive: false, capture: true });

    window.addEventListener('pointerdown', startPan, { passive: false, capture: true });
    window.addEventListener('pointermove', movePan, { passive: false, capture: true });
    window.addEventListener('pointerup', endPan, { passive: false, capture: true });
    window.addEventListener('pointercancel', endPan, { passive: false, capture: true });

    window.addEventListener('click', event => {
      if (!dragState.suppressClick) return;
      if (!event.target.closest?.('.medium-zoom-image--opened')) return;

      event.preventDefault();
      event.stopPropagation();
      dragState.suppressClick = false;
    }, { capture: true });

    window.addEventListener('touchstart', event => {
      if (!hasActiveZoom() || event.touches.length !== 1) return;
      touchY = event.touches[0].clientY;
    }, { passive: true, capture: true });

    window.addEventListener('touchmove', event => {
      if (!hasActiveZoom() || dragState.active || event.touches.length !== 1 || touchY === null) return;

      event.preventDefault();
      const currentY = event.touches[0].clientY;
      updateScale((currentY - touchY) * touchSensitivity);
      touchY = currentY;
    }, { passive: false, capture: true });
  };

  if (typeof mediumZoom !== 'undefined') {
    setupMediumZoom();
  } else {
    // Dynamically load medium-zoom if not present
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/dist/medium-zoom.min.js';
    script.onload = setupMediumZoom;
    document.body.appendChild(script);
  }
}

function initFABs() {
  const fabContainer = document.getElementById('fab-container');
  const backToTopBtn = document.getElementById('back-to-top');
  const fontSizeToggle = document.getElementById('font-size-toggle');

  if (fabContainer) {
    onScrollRaf(() => {
      if (window.scrollY > 300) {
        fabContainer.classList.add('show');
      } else {
        fabContainer.classList.remove('show');
      }
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (fontSizeToggle) {
    const savedFontSize = localStorage.getItem('font-size');
    if (savedFontSize === 'large') {
      document.body.classList.add('font-size-large');
    }

    fontSizeToggle.addEventListener('click', () => {
      document.body.classList.toggle('font-size-large');
      const isLarge = document.body.classList.contains('font-size-large');
      localStorage.setItem('font-size', isLarge ? 'large' : 'normal');
    });
  }
}

function initBlockquotes() {
  const blockquotes = document.querySelectorAll('.post-content blockquote');
  blockquotes.forEach(bq => {
    const p = bq.querySelector('p');
    if (!p) return;
    
    // Check for admonition syntax like [!NOTE], [!WARNING], etc.
    const markerPattern = /^\[!(NOTE|WARNING|INFO|TIP|IMPORTANT|CAUTION|DANGER|ERROR|HINT|ATTENTION)\](<br>|\n)?/i;
    const match = p.innerHTML.match(markerPattern);
    if (match) {
      const rawType = match[1].toLowerCase();
      const typeAliases = {
        danger: 'danger',
        error: 'error',
        hint: 'hint',
        attention: 'attention'
      };
      const type = typeAliases[rawType] || rawType;
      bq.classList.add('admonition', `admonition-${type}`);
      bq.dataset.calloutType = type;
      bq.setAttribute('role', 'note');
      
      // Remove the [!TYPE] text and use any text after it as the callout title.
      const remainingHtml = p.innerHTML.replace(markerPattern, '').trim();
      const remainingParts = remainingHtml.split(/<br\s*\/?>|\n/i);
      const customTitle = (remainingParts.shift() || '').replace(/<[^>]+>/g, '').trim();
      const remainingBody = remainingParts.join('<br>').trim();
      p.innerHTML = remainingBody;
      
      // Add a title element
      const title = document.createElement('div');
      title.className = 'admonition-title';
      
      // Setup icon based on type
      let icon = '';
      let titleText = customTitle || type.charAt(0).toUpperCase() + type.slice(1);
      bq.dataset.calloutTitle = titleText;
      
      switch(type) {
        case 'note': case 'info':
          icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
          break;
        case 'warning': case 'caution': case 'attention': case 'danger': case 'error':
          icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
          break;
        case 'tip': case 'important': case 'hint':
          icon = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
          break;
      }
      
      title.innerHTML = `${icon} <span>${titleText}</span>`;
      bq.insertBefore(title, p);
      if (!p.innerHTML.trim()) {
        p.remove();
      }
    }
  });
}

function initSiyuanPlaceholders() {
  const placeholders = document.querySelectorAll('.post-content blockquote.admonition');
  placeholders.forEach(block => {
    const title = (block.dataset.calloutTitle || '').toLowerCase();
    const type = (block.dataset.calloutType || '').toLowerCase();
    const text = `${title} ${type}`;

    if (text.includes('模板') || text.includes('template')) {
      block.classList.add('siyuan-template-placeholder');
      return;
    }

    if (text.includes('嵌入') || text.includes('embed') || text.includes('query')) {
      block.classList.add('siyuan-embed-placeholder');
      return;
    }

    if (text.includes('挂件') || text.includes('widget')) {
      block.classList.add('siyuan-widget-placeholder');
      return;
    }

    if (text.includes('数据库') || text.includes('database')) {
      block.classList.add('siyuan-database-placeholder');
    }
  });
}



function initTablesAndEmbeds() {
  // Wrap tables for responsive scrolling
  const tables = document.querySelectorAll('.post-content table');
  tables.forEach(table => {
    if (!table.parentElement.classList.contains('table-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      wrapper.style.overflowX = 'auto';
      wrapper.style.margin = 'var(--space-6) 0';
      
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
      
      // Remove table's margin to avoid double margin
      table.style.margin = '0';
    }
  });

  // Make iframes/embeds responsive (like YouTube, Bilibili, etc.)
  const embeds = document.querySelectorAll('.post-content iframe, .post-content embed, .post-content video');
  embeds.forEach(embed => {
    // Skip if already wrapped or has fixed small sizes
    if (embed.parentElement.classList.contains('embed-responsive')) return;
    if (embed.getAttribute('width') && parseInt(embed.getAttribute('width')) < 300) return;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-responsive';
    embed.parentNode.insertBefore(wrapper, embed);
    wrapper.appendChild(embed);
  });
}
