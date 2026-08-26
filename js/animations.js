/* ============================================================
 * animations.js — fade-in-up 滚动显示动画
 * 依赖：带 .fade-in-up class 的 DOM 元素
 * ============================================================ */

(function () {
    'use strict';

    function forceShowVisible() {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        document.querySelectorAll('.fade-in-up:not(.show)').forEach(el => {
            const r = el.getBoundingClientRect();
            if (r.top < vh - 40 && r.bottom > 40) {
                el.classList.add('show');
            }
        });
    }

    function startObserver() {
        if ('IntersectionObserver' in window) {
            try {
                const observerOptions = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -40px 0px'
                };
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('show');
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);
                document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
            } catch (err) {
                // observer 不可用时降级到滚动轮询兜底
            }
        }
        // 兜底：滚动时扫描
        window.addEventListener('scroll', forceShowVisible, { passive: true });
        window.addEventListener('resize', forceShowVisible, { passive: true });
    }

    function boot() {
        startObserver();
        // 首屏立即显示在视口内的元素
        forceShowVisible();
        // 等 layout 稳定后再扫一次（字体/图片加载后高度变化）
        setTimeout(forceShowVisible, 800);
        // 终极兜底：4 秒后所有 fade-in-up 强制显示
        setTimeout(() => {
            document.querySelectorAll('.fade-in-up:not(.show)').forEach(el => el.classList.add('show'));
        }, 4000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
        window.addEventListener('load', forceShowVisible);
    } else {
        boot();
    }
})();
