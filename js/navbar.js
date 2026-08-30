/* ============================================================
 * navbar.js — 导航栏 / 移动端菜单
 * 依赖：<header id="navbar">, <button id="menuBtn">, <div id="mobileMenu">
 * 注意：锚点导航和平滑滚动已由 module-loader.js 接管（翻页切换）
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initNavbar();
            initMobileMenu();
        });
    } else {
        initNavbar();
        initMobileMenu();
    }
})();
