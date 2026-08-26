/* ============================================================
 * i18n.js — 中英文切换
 * 依赖：<button id="langToggle">, <button id="langToggleMobile">
 *       以及所有加了 data-i18n 的 DOM 元素
 * ============================================================ */

(function () {
    'use strict';

    const I18N_DICT = {
        zh: {
            'nav.langBtn': 'EN',
            'nav.about': '公司简况',
            'nav.factory': '制造能力',
            'nav.equipment': '设备能力',
            'nav.quality': '质量体系',
            'nav.contact': '联系我们',
            'brand': '安徽格罗特智能科技',
            'hero.title': '专业电子产品生产服务高新技术企业',
            'hero.subtitle': 'SMT贴片、DIP、PCBA一站式服务，提供试产与批量EMS、OEM加工服务',
            'hero.cta1': '了解我们',
            'hero.cta2': '联系业务',
            'about.title': '公司简况介绍',
            'about.p1': '安徽格罗特智能科技有限公司成立于2022年6月，注册资本1000万元，二期投资总额1500万元，是一家专业从事电子产品生产服务的高新技术企业。',
            'about.p2': '总部坐落于安徽省马鞍山市郑蒲港新区姥桥镇新陶路107号浦建半导体产业园9栋1-4层。公司前身为浙江格瑞实业股份有限公司，位于浙江嘉善。2022年与恒为科技合作，建立格罗特生产车间。',
            'about.p3': '业务方向：SMT贴片、DIP，PCBA一站式服务，为多领域客户提供试产与批量EMS、OEM加工服务，具备完善供应链与智能制造服务能力。',
            'about.domainTitle': '服务领域：',
            'about.domains.0': '通信网络',
            'about.domains.1': '汽车电子',
            'about.domains.2': '消费电子',
            'about.domains.3': '科研',
            'about.domains.4': '医疗',
            'about.domains.5': '军工',
            'about.domains.6': '航空航天',
            'about.factory1.name': '嘉善姚庄厂区',
            'about.factory1.spec': '总建面3500㎡｜车间2000㎡｜办公楼1500㎡',
            'about.factory2.name': '嘉善魏塘厂区',
            'about.factory2.spec': '总建面50650㎡｜车间3000㎡｜办公楼6100㎡',
            'about.structure.title': '公司组织架构',
            'about.structure.note': '2023年公司规划总人数：160人，目前总人数：120人，其中制造部：80人，工程部：18人，品质部：10人。',
            'factory.title': '制造能力介绍',
            'factory.hardwareSubtitle': '制造与交付 – 硬件配置',
            'factory.capacitySubtitle': '制造与交付 – 工厂产能',
            'factory.totalMonthly': '月度总产能',
            'equipment.title': '设备能力',
            'quality.title': '质量体系',
            'contact.title': '联系我们',
            'contact.companyName': '安徽格罗特智能科技有限公司',
            'contact.address': '地址：安徽省马鞍山市郑蒲港新区姥桥镇新陶路107号浦建半导体产业园9栋1-4层',
            'contact.predecessor': '前身：浙江格瑞实业股份有限公司（嘉善生产基地）',
            'contact.businessTitle': '业务合作',
            'contact.businessDesc': '欢迎洽谈SMT贴片、DIP插件、PCBA加工、EMS/OEM批量与试产订单。',
            'contact.hkTitle': '香港收货地址',
            'footer.copyright': '©2026 安徽格罗特智能科技有限公司 版权所有 | PCBA EMS OEM电子制造服务商'
        },
        en: {
            'nav.langBtn': '中',
            'nav.about': 'About',
            'nav.factory': 'Manufacturing',
            'nav.equipment': 'Equipment',
            'nav.quality': 'Quality',
            'nav.contact': 'Contact',
            'brand': 'Anhui Great Intelligence Technology',
            'hero.title': 'Professional High-Tech Electronic Manufacturing Services',
            'hero.subtitle': 'One-stop SMT, DIP and PCBA services, providing prototype and mass EMS / OEM production',
            'hero.cta1': 'Learn More',
            'hero.cta2': 'Contact Sales',
            'about.title': 'Company Profile',
            'about.p1': 'Anhui Great Intelligence Technology Co., Ltd. was founded in June 2022 with a registered capital of RMB 10 million and a second-phase total investment of RMB 15 million. We are a high-tech enterprise specialized in electronic product manufacturing services.',
            'about.p2': 'Headquartered at Building 9, Floors 1-4, Pujian Semiconductor Industrial Park, 107 Xintao Road, Muqiao Town, Zhengpugang New District, Ma\'anshan, Anhui. Formerly known as Zhejiang Gerui Industrial Co., Ltd. based in Jiashan, Zhejiang. In 2022 we partnered with Hengwei Technology and established the Great workshop.',
            'about.p3': 'Business scope: SMT, DIP and one-stop PCBA services providing prototype and mass EMS / OEM for customers across multiple industries, backed by a mature supply chain and intelligent manufacturing capabilities.',
            'about.domainTitle': 'Industries served:',
            'about.domains.0': 'Telecom & Networking',
            'about.domains.1': 'Automotive',
            'about.domains.2': 'Consumer',
            'about.domains.3': 'Scientific R&D',
            'about.domains.4': 'Medical',
            'about.domains.5': 'Defense',
            'about.domains.6': 'Aerospace',
            'about.factory1.name': 'Jiashan Yaozhuang Plant',
            'about.factory1.spec': 'Total 3,500㎡｜Workshop 2,000㎡｜Office 1,500㎡',
            'about.factory2.name': 'Jiashan Weitang Plant',
            'about.factory2.spec': 'Total 50,650㎡｜Workshop 3,000㎡｜Office 6,100㎡',
            'about.structure.title': 'Organization Structure',
            'about.structure.note': '2023 plan: 160 employees; current: 120 employees. Manufacturing: 80, Engineering: 18, Quality: 10.',
            'factory.title': 'Manufacturing Capability',
            'factory.hardwareSubtitle': 'Manufacturing & Delivery – Equipment Setup',
            'factory.capacitySubtitle': 'Manufacturing & Delivery – Factory Capacity',
            'factory.totalMonthly': 'Total Monthly Output',
            'equipment.title': 'Equipment Capability',
            'quality.title': 'Quality System',
            'contact.title': 'Contact Us',
            'contact.companyName': 'Anhui Great Intelligence Technology Co., Ltd.',
            'contact.address': 'Address: Building 9, F1-4, Pujian Semiconductor Industrial Park, 107 Xintao Road, Muqiao Town, Zhengpugang New District, Ma\'anshan, Anhui, China',
            'contact.predecessor': 'Formerly: Zhejiang Gerui Industrial Co., Ltd. (Jiashan Production Base)',
            'contact.businessTitle': 'Business Cooperation',
            'contact.businessDesc': 'Welcome to contact us for SMT, DIP, PCBA manufacturing, EMS / OEM mass production and prototype orders.',
            'contact.hkTitle': 'Hong Kong Receiving Address',
            'footer.copyright': '©2026 Anhui Great Intelligence Technology Co., Ltd. All Rights Reserved | PCBA EMS OEM Electronic Manufacturing Service Provider'
        }
    };

    const STORAGE_KEY = 'rb-lang';

    function getDefaultLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'zh' || saved === 'en') return saved;
        } catch (e) { /* localStorage disabled in iframe/privacy mode */ }
        const nav = ((navigator && (navigator.language || navigator.userLanguage)) || '').toLowerCase();
        return nav.startsWith('zh') ? 'zh' : 'en';
    }

    function applyI18n(lang) {
        const dict = I18N_DICT[lang] || I18N_DICT.zh;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = dict[key];
            if (typeof val !== 'string') return;
            const iconEl = el.querySelector('i.fa, i[class*="fa-"]');
            if (iconEl) {
                // 保留 FontAwesome 图标，替换文字
                const cloned = iconEl.cloneNode(true);
                el.textContent = '';
                el.appendChild(cloned);
                // 去掉翻译里前缀的 "地址：/Address:" 这类 label
                const stripped = val.replace(/^[^：:]*[：:]\s*/, '');
                el.appendChild(document.createTextNode(' ' + stripped));
            } else {
                el.textContent = val;
            }
        });
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', 'ltr');
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }

    function toggleLang() {
        applyI18n(getDefaultLang() === 'zh' ? 'en' : 'zh');
    }

    function bindToggleBtn() {
        const btn = document.getElementById('langToggle');
        const btnMob = document.getElementById('langToggleMobile');
        if (btn) btn.addEventListener('click', toggleLang);
        if (btnMob) btnMob.addEventListener('click', toggleLang);
    }

    // 页面极早应用一次（避免闪屏，在 DOMContentLoaded 前就执行）
    applyI18n(getDefaultLang());

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            bindToggleBtn();
            applyI18n(getDefaultLang());
        });
    } else {
        bindToggleBtn();
    }
})();
