/* ============================================================
 * scroll-top.js — 返回顶部按钮
 * 依赖：<button id="scrollTopBtn">（含 <i class="fa fa-arrow-up"> 图标）
 * ============================================================ */

(function () {
    'use strict';

    const SHOW_THRESHOLD = 320;    // 滚动超过多少 px 开始显示按钮
    const SCROLL_STEP_MS = 16;
    const SCROLL_DURATION_MS = 480;

    // 优先使用 CSS scroll-behavior:smooth（浏览器原生），降级为手动 requestAnimationFrame 动画
    function smoothScrollToTop() {
        const doc = document.documentElement;
        const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) {
            window.scrollTo(0, 0);
            return;
        }
        // 原生支持 smooth
        const supportsNativeSmooth = 'scrollBehavior' in doc.style;
        if (supportsNativeSmooth) {
            try {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
            } catch (e) { /* Safari 老版本 fallback */ }
        }
        const startY = window.scrollY || doc.scrollTop;
        if (startY <= 0) return;
        const startTime = performance.now();
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / SCROLL_DURATION_MS, 1);
            const nextY = Math.round(startY * (1 - easeInOutCubic(progress)));
            window.scrollTo(0, nextY);
            if (progress < 1 && nextY > 0) requestAnimationFrame(step);
            else window.scrollTo(0, 0);
        }
        requestAnimationFrame(step);
    }

    function setVisible(btn, visible) {
        if (visible) btn.classList.add('is-visible');
        else btn.classList.remove('is-visible');
    }

    function init() {
        const btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        // 立即决定初始状态（页面刷新后可能直接处于中间位置）
        setVisible(btn, (window.scrollY || document.documentElement.scrollTop) > SHOW_THRESHOLD);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                const y = window.scrollY || document.documentElement.scrollTop;
                setVisible(btn, y > SHOW_THRESHOLD);
                ticking = false;
            });
        }, { passive: true });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollToTop();
        });

        // 键盘可达性：Enter / Space
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ' || e.keyCode === 13 || e.keyCode === 32) {
                e.preventDefault();
                smoothScrollToTop();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
