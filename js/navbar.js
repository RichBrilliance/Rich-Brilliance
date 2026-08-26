/* ============================================================
 * navbar.js — 导航栏 / 移动端菜单 / 锚点平滑滚动
 * 依赖：<header id="navbar">, <button id="menuBtn">, <div id="mobileMenu">
 * ============================================================ */

(function () {
    'use strict';

    function initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        const applyNavState = () => {
            if (window.scrollY > 80) navbar.classList.add('nav-fixed');
            else navbar.classList.remove('nav-fixed');
        };
        applyNavState();
        window.addEventListener('scroll', applyNavState, { passive: true });
    }

    function initMobileMenu() {
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // 点击移动端菜单项后自动收起
        mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const targetDom = document.querySelector(href);
                if (!targetDom) return;
                e.preventDefault();
                const navH = (document.getElementById('navbar') || {}).offsetHeight || 0;
                const top = targetDom.getBoundingClientRect().top + window.scrollY - navH - 8;
                window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initNavbar();
            initMobileMenu();
            initSmoothScroll();
        });
    } else {
        initNavbar();
        initMobileMenu();
        initSmoothScroll();
    }
})();
