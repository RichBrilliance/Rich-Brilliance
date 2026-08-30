/* ============================================================
 * module-loader.js — 翻书式页面切换 + 按需加载模块
 * 点击导航：当前页翻出（pageFlipOut），新页翻入（pageFlipIn）
 * 首页(home)包含 Banner+公司简况+联系我们，其余为按需加载模块
 * 依赖：i18n.js（window.__i18n）、animations.js（window.__anim）
 *       sections/{id}.html、site.css（.page / .page--active / .page--leaving）
 * ============================================================ */

(function () {
    'use strict';

    // 导航 hash → 页面映射
    var NAV_MAP = {
        'about':     { page: 'home',      scroll: 'about'    },
        'structure': { page: 'structure', scroll: null       },
        'contact':   { page: 'home',      scroll: 'contact'  },
        'factory':   { page: 'factory',   scroll: null       },
        'equipment':  { page: 'equipment', scroll: null       },
        'quality':   { page: 'quality',   scroll: null       }
    };

    var MODULES = ['structure', 'factory', 'equipment', 'quality'];
    var loadingSet = {};
    var isTransitioning = false;

    /* ---------- fetch 兜底 ---------- */
    function fetchModule(id) {
        var url = './sections/' + id + '.html';
        if (typeof fetch === 'function') {
            return fetch(url, { cache: 'no-cache' })
                .then(function (resp) {
                    if (!resp.ok) throw new Error('HTTP ' + resp.status);
                    return resp.text();
                })
                .catch(function (fetchErr) {
                    return xhrGet(url).catch(function () { throw fetchErr; });
                });
        }
        return xhrGet(url);
    }

    function xhrGet(url) {
        return new Promise(function (resolve, reject) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;
                    if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
                        resolve(xhr.responseText);
                    } else { reject(new Error('XHR ' + xhr.status)); }
                };
                xhr.onerror = function () { reject(new Error('XHR error')); };
                xhr.send();
            } catch (e) { reject(e); }
        });
    }

    /* ---------- 在模块页底部追加联系我们（克隆首页的 #contact） ---------- */
    function appendContactSection(page) {
        var homeContact = document.querySelector('[data-page="home"] #contact');
        if (!homeContact) return;
        var clone = homeContact.cloneNode(true);
        clone.removeAttribute('id'); // 避免重复 id
        page.appendChild(clone);
    }

    /* ---------- 加载模块内容到 page div ---------- */
    function ensureModuleLoaded(id) {
        var page = document.querySelector('[data-page="' + id + '"]');
        if (!page) return Promise.resolve();
        if (page.getAttribute('data-loaded') === 'true') return Promise.resolve();
        if (loadingSet[id]) return loadingSet[id];

        // 显示 loading 占位
        page.innerHTML = '<div class="page-loading"><div class="text-center">' +
            '<i class="fa fa-spinner fa-spin text-3xl"></i>' +
            '<p class="mt-4 text-sm">加载中…</p></div></div>';

        var p = fetchModule(id).then(function (html) {
            page.innerHTML = html;
            page.setAttribute('data-loaded', 'true');

            // 在模块底部追加联系我们（从首页克隆，避免重复 id）
            appendContactSection(page);

            // 翻译 + 动画
            if (window.__i18n) { try { window.__i18n.apply(window.__i18n.getLang()); } catch (e) {} }
            if (window.__anim) { try { window.__anim.refresh(page); } catch (e) {} }
            // 4 秒兜底
            setTimeout(function () {
                page.querySelectorAll('.fade-in-up:not(.show)')
                    .forEach(function (el) { el.classList.add('show'); });
            }, 4000);
        }).catch(function (err) {
            page.innerHTML = '<div class="page-loading"><div class="text-center text-red-400">' +
                '<i class="fa fa-exclamation-circle text-3xl"></i>' +
                '<p class="mt-4 text-sm">模块加载失败，请刷新重试</p></div></div>';
            if (typeof console !== 'undefined' && console.error)
                console.error('[module-loader] ' + id + ':', err);
        }).then(function () {
            delete loadingSet[id];
        });

        loadingSet[id] = p;
        return p;
    }

    /* ---------- 导航高亮 ---------- */
    function setActiveNav(id) {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
                link.classList.add('nav-active');
            } else {
                link.classList.remove('nav-active');
            }
        });
    }

    /* ---------- 翻页切换核心 ---------- */
    function switchToPage(pageName, scrollTarget) {
        if (isTransitioning) return Promise.resolve();

        var currentPage = document.querySelector('.page--active');
        var newPage = document.querySelector('[data-page="' + pageName + '"]');
        if (!newPage) return Promise.resolve();
        if (currentPage === newPage) {
            // 同一页，仅滚动
            if (scrollTarget) scrollToSection(scrollTarget);
            setActiveNav(scrollTarget || pageName);
            return Promise.resolve();
        }

        isTransitioning = true;
        // 立即高亮目标导航项（不等动画结束）
        setActiveNav(scrollTarget || pageName);

        // 如果目标页是模块且未加载，先加载
        var loadPromise = Promise.resolve();
        if (MODULES.indexOf(pageName) !== -1) {
            loadPromise = ensureModuleLoaded(pageName);
        }

        return loadPromise.then(function () {
            // 旧页翻出
            if (currentPage) {
                currentPage.classList.add('page--leaving');
                currentPage.classList.remove('page--active');
                setTimeout(function () {
                    currentPage.classList.remove('page--leaving');
                    currentPage.style.display = 'none';
                }, 400);
            }

            // 新页翻入
            newPage.style.display = '';
            // 强制 reflow 触发动画
            void newPage.offsetWidth;
            newPage.classList.add('page--active');

            // 滚动到顶部或指定 section
            window.scrollTo(0, 0);
            if (scrollTarget) {
                setTimeout(function () { scrollToSection(scrollTarget); }, 550);
            }

            // 更新 URL hash
            try { history.replaceState(null, '', '#' + (scrollTarget || pageName)); } catch (ex) {}

            isTransitioning = false;
        });
    }

    function scrollToSection(id) {
        var target = document.getElementById(id);
        if (!target) return;
        var navH = (document.getElementById('navbar') || {}).offsetHeight || 0;
        var top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    /* ---------- 初始化：拦截导航点击 ---------- */
    function init() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            var href = link.getAttribute('href');
            if (!href || href === '#') return;
            var id = href.slice(1);
            if (!NAV_MAP[id]) return;

            link.addEventListener('click', function (e) {
                e.preventDefault();
                var config = NAV_MAP[id];
                switchToPage(config.page, config.scroll);
                // 收起移动端菜单
                var mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) mobileMenu.classList.add('hidden');
            });
        });

        // 默认高亮"公司简况"
        setActiveNav('about');

        // 处理直接通过 URL hash 访问
        var hash = window.location.hash.slice(1);
        if (hash && NAV_MAP[hash]) {
            var cfg = NAV_MAP[hash];
            setActiveNav(hash);
            if (cfg.page !== 'home') {
                switchToPage(cfg.page, cfg.scroll);
            } else if (cfg.scroll) {
                setTimeout(function () { scrollToSection(cfg.scroll); }, 300);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
