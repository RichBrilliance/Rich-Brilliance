/* ============================================================
 * i18n.js — 中英文切换（双机制：data-i18n + 纯文本完整匹配）
 * 机制 1）data-i18n 精准 key 匹配（见 I18N_DICT）—— 用于结构复杂、带图标、带变量的文本
 * 机制 2）TEXT_MAP 纯文本完整匹配（见 TEXT_MAP_ZH）—— 用于漏加 data-i18n 的所有遗留文本；
 *          通过 TreeWalker 遍历所有 #document 文本节点，trim 后与字典做 exact-match 替换
 * 说明：TEXT_MAP_ZH 是权威来源，英文切中文时自动构建反向 MAP（value -> key），避免手维护两份
 * ============================================================ */

(function () {
    'use strict';

    /* ============ 机制 1：data-i18n 精准 key 翻译 ============ */
    const I18N_DICT = {
        zh: {
            'nav.langBtn': 'EN',
            'nav.about': '公司简况',
            'nav.structure': '组织架构',
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
            'about.p2': '总部坐落于安徽省马鞍山市郑蒲港新区姥桥镇新陶路107号浦建半导体产业园9栋1-4层。公司前身为浙江格瑞实业股份有限公司，位于浙江嘉善。',
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
            'about.structure.title': '组织架构',
            'about.structure.note': '目前总人数：120人，其中制造部：80人，工程部：18人，品质部：10人。',
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
            'contact.manager1': '联系人：杨先生 电话：15061721822',
            'contact.manager2': '上海业务处：崔经理 电话: 021-33460331',
            'contact.businessTitle': '业务合作',
            'contact.businessDesc': '欢迎洽谈SMT贴片、DIP插件、PCBA加工、EMS/OEM批量与试产订单。',
            'contact.hkTitle': '香港收货地址',
            'footer.copyright': '©2026 安徽格罗特智能科技有限公司 版权所有 | PCBA EMS OEM电子制造服务商'
        },
        en: {
            'nav.langBtn': '中',
            'nav.about': 'About',
            'nav.structure': 'Organization',
            'nav.factory': 'Manufacturing',
            'nav.equipment': 'Equipment',
            'nav.quality': 'Quality',
            'nav.contact': 'Contact',
            'brand': 'Geluote Intelligent Technology',
            'hero.title': 'Professional High-Tech Electronic Manufacturing Services',
            'hero.subtitle': 'One-stop SMT, DIP and PCBA services, providing prototype and mass EMS / OEM production',
            'hero.cta1': 'Learn More',
            'hero.cta2': 'Contact Sales',
            'about.title': 'Company Profile',
            'about.p1': 'Anhui Geluote Intelligent Technology Co., Ltd was founded in June 2022 with a registered capital of RMB 10 million and a second-phase total investment of RMB 15 million. We are a high-tech enterprise specialized in electronic product manufacturing services.',
            'about.p2': 'Headquartered at Building 9, Floors 1-4, Pujian Semiconductor Industrial Park, 107 Xintao Road, Muqiao Town, Zhengpugang New District, Ma\'anshan, Anhui. Formerly known as Zhejiang Gerui Industrial Co., Ltd. based in Jiashan, Zhejiang.',
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
            'about.structure.note': 'current: 120 employees. Manufacturing: 80, Engineering: 18, Quality: 10.',
            'factory.title': 'Manufacturing Capability',
            'factory.hardwareSubtitle': 'Manufacturing & Delivery – Equipment Setup',
            'factory.capacitySubtitle': 'Manufacturing & Delivery – Factory Capacity',
            'factory.totalMonthly': 'Total Monthly Output',
            'equipment.title': 'Equipment Capability',
            'quality.title': 'Quality System',
            'contact.title': 'Contact Us',
            'contact.companyName': 'Anhui Geluote Intelligent Technology Co., Ltd',
            'contact.address': 'Address: Building 9, F1-4, Pujian Semiconductor Industrial Park, 107 Xintao Road, Muqiao Town, Zhengpugang New District, Ma\'anshan, Anhui, China',
            'contact.predecessor': 'Formerly: Zhejiang Gerui Industrial Co., Ltd. (Jiashan Production Base)',
            'contact.manager1': 'Contact: Mr. Yang  Tel: 15061721822',
            'contact.manager2': 'Shanghai Office: Manager Cui  Tel: 021-33460331',
            'contact.businessTitle': 'Business Cooperation',
            'contact.businessDesc': 'Welcome to contact us for SMT, DIP, PCBA manufacturing, EMS / OEM mass production and prototype orders.',
            'contact.hkTitle': 'Hong Kong Receiving Address',
            'footer.copyright': '©2026 Anhui Geluote Intelligent Technology Co., Ltd All Rights Reserved | PCBA EMS OEM Electronic Manufacturing Service Provider'
        }
    };

    /* ============ 机制 2：纯文本完整匹配（补全所有漏加 data-i18n 的文案） ============ */
    const TEXT_MAP_ZH = {
        // ---------- 香港收货地址 ----------
        '香港收货地址': 'Hong Kong Receiving Address',
        '香港富耀科技有限公司': 'HK FuYao Technology Co., Limited',
        '地址：香港观塘开源道55号开联工业中心A座9楼901室': 'Address: Room 901, 9/F, Block A, Hoi Luen Industrial Centre, 55 Hoi Yuen Road, Kwun Tong, Kowloon, Hong Kong',
        '联系人：陈培森': 'Contact: Chen Peisen',
        '电话：65789988': 'Mobile: +852 6578 9988',
        '仓库地址：香港屯门建泰街6号恒威工业中心C1座7楼7112室': 'Warehouse Address: Room 7112, 7/F, Block C1, Hang Wai Industrial Centre, 6 Kin Tai Street, Tuen Mun, Hong Kong',

        // ---------- 制造与交付 - 硬件配置（表格内） ----------
        '机台名称': 'Machine',
        '型号': 'Model',
        '供应商': 'Supplier',
        '规格描述': 'Specification',
        '状态': 'Status',
        '数量': 'Qty',

        // 具体机器行（中文名）
        '锡膏印刷机': 'Solder Paste Printer',
        '高速贴片机': 'High-speed Mounter',
        '多功能贴片机': 'Multi-function Mounter',
        '多温区回流焊': 'Multi-zone Reflow Oven',
        '3D SPI': '3D Solder Paste Inspection',
        '在线AOI': 'In-line AOI',
        'X-Ray检测设备': 'X-Ray Inspection System',
        '分板机': 'Router / Depanelizer',
        '自动化功能测试系统（ATE）': 'Automated Functional Test (ATE)',
        '自动化ICT/FCT测试系统': 'Automated ICT / FCT System',
        '波峰焊': 'Wave Solder Machine',
        '选择性波峰焊': 'Selective Wave Soldering',
        '全自动单双面孔金属化系统': 'Auto PTH Copper Plating Line',
        '其他（空调/烤箱等）': 'Others (AC / Oven etc.)',
        '正常投入使用': 'In Active Use',
        '在建': 'Ramping Up',
        '2023-2024 陆续安装': 'Installing 2023–2024',

        // ---------- 工厂产能（banner + 8 卡） ----------
        '8条生产线': '8 Production Lines',
        '160人员规模': '160 Employees',
        'SMT贴片': 'SMT Mounting',
        '月度2000K': '2,000K / Month',
        '组装': 'Assembly',
        '月度800K': '800K / Month',
        '测试': 'Testing',
        '月度1000K': '1,000K / Month',
        '电子接插件': 'Connectors',
        '月度500K': '500K / Month',
        '焊接': 'Welding',
        '月度300K': '300K / Month',
        '结构件': 'Structural Parts',
        '月度400K': '400K / Month',
        'PCBA': 'PCBA',
        '月度1500K': '1,500K / Month',
        '电子接插件（重复名称保留）': 'Connectors (dup)',

        // ---------- 设备能力 - 6 大关键设备 ----------
        '关键设备介绍 – 印刷机': 'Key Equipment – Solder Paste Printer',
        '关键设备介绍 - 检测设备SPI': 'Key Equipment – 3D SPI Inspection',
        '关键设备介绍 - 贴片机': 'Key Equipment – SMT Mounter',
        '关键设备介绍 - 检测设备AOI': 'Key Equipment – AOI Inspection',
        '关键设备介绍 – 回流焊': 'Key Equipment – Reflow Oven',
        '关键设备介绍 - 检测设备 X-Ray': 'Key Equipment – X-Ray Inspection',

        // 印刷机
        'GKG GK++印刷机': 'GKG GK++ Printer',
        '对象基板:L510×W510（最大） ~ L50×W50（最小）': 'PCB size: L510×W510 (max) ~ L50×W50 (min)',
        'PCB厚度: 0.4-6mm': 'PCB thickness: 0.4–6mm',
        '相机像素:1200万象素': 'Camera: 12 Mega-pixels',
        '印刷重复精度: ±22μm': 'Print repeatability: ±22μm',
        '刮刀': 'Squeegee',
        '程式': 'Program UI',
        '印刷': 'Printing',
        '脱模后': 'After Release',
        '精度': 'Accuracy',
        '放大后': 'Magnified View',

        // SPI
        '生产设备-锡膏厚度检测设备 3D SPI Storm-SPIS': 'Production – 3D Solder Paste Tester 3D SPI Storm-SPIS',
        'Storm-SPIS主要技术参数:': 'Storm-SPIS Specs:',
        'PCB尺寸: 50×50~510×505mm': 'PCB size: 50×50 ~ 510×505mm',
        '检测精度: XY<10um; H=0.37um': 'Accuracy: XY<10μm; Height=0.37μm',
        '检测面积: 480×490mm': 'Inspection area: 480×490mm',
        '最小检测元件: 01005': 'Smallest chip: 01005',
        '坐标': 'Coordinate',
        '检测前': 'Before Inspection',
        '检测中': 'Inspecting',
        '检测后': 'After Inspection',

        // 贴片机
        '松下NPM-2主要技术参数:': 'Panasonic NPM-W2 Specs:',
        '贴装理论速度: 75000Cph /小时': 'Rated IPC speed: 75,000 CPH',
        '贴装范围: 01005~max.□28mm(H=12mm)': 'Component range: 01005 ~ max.□28mm (H=12mm)',
        '贴装精度: ±0.05mm': 'Placement accuracy: ±0.05mm',
        'PCB尺寸: 50×50mm ~ 610 x 460mm': 'PCB size: 50×50mm ~ 610×460mm',

        // AOI
        'Strom-2DS（3D混合型光学式外观检查装置）': 'Strom-2DS (3D Hybrid Optical Appearance Inspector)',
        '分辨率: 13μm / 16μm / 19μm': 'Resolution: 13μm / 16μm / 19μm',
        '特点:可以对整个视野的高度进行一次性高速测量。即使是元件浮起等通过2维图像难以判别的情况也能够精准检测。':
            'Feature: one-shot full-FOV high-speed height measurement. Accurately detects lifted components hard to identify via 2-D imaging.',
        '引脚元件': 'Leaded Parts',
        '芯片元件': 'Chip Parts',
        '3维检查': '3D Inspection',
        '2维检查': '2D Inspection',

        // 回流焊
        '劲拓回流焊 HOTFLOW3/26XL回流焊炉:': 'JT HOTFLOW 3/26XL Reflow Oven:',
        '1) 独特的强对流风扇及三文治结构加热板，': '1) Unique strong-convection fans + sandwich heater plates;',
        '2) 助焊剂处理系统，科学高效地排放助焊剂废气；': '2) Flux-management system, efficient flux-fume exhaust;',
        '3) 温度：在0 ~ 300℃能稳定运行，精度达±1℃；': '3) Temperature: stable 0–300℃ operation, accuracy ±1℃;',
        '4) 五温区：10个加热区，2个冷却区，每个温区独立运作，相互干扰小；': '4) Zones: 10 heating + 2 cooling zones, each independently controlled with low cross-talk;',
        '5) 温差：上下同一温区温差可达20℃以上，出色焊接双面板；': '5) ΔT within same zone >20℃ top/bottom – excellent for double-sided boards;',
        '6) 轨道最大宽度490mm。': '6) Max conveyor width: 490mm.',
        'Reflow曲线': 'Reflow Profile',
        '炉温界面': 'Oven UI',
        '焊接PCBA': 'Soldered PCBA',

        // X-Ray
        '芯片空洞分析': 'Void Analysis',
        '具备2.5D功能': '2.5D Slice View',
        '多层次分段式扫描,可以很好的区分开top面和bottom面的焊点，互补影响，对BGA可以进行空洞测试，系统通过抓取的图像结合多种算法自动分析。':
            'Multi-layer / multi-pass scanning clearly separates top-side from bottom-side joints. Supports BGA void measurement with automatic multi-algorithm image analysis.',

        // ---------- 设备能力 - 测试设备（8 卡） ----------
        'WiFi 测试': 'Wi-Fi Test',
        '发包测试': 'Traffic Generation Test',
        '涵盖802.11ac、802.11a/b/g/n/p与蓝牙1.0-4.0': 'Covers 802.11ac, 802.11a/b/g/n/p + Bluetooth 1.0–4.0',
        '持所有802.11ac信道带宽组合的80与160MHz版本': 'Supports all 80/160 MHz BW combos for 802.11ac',
        'BigTao6100机框满配可实现96个千兆测试端口，支持从10M到100G多种速率的测试模块任意组合，能够长期连续（N*24小时）稳定运行':
            'BigTao 6100 chassis scales to 96 GE ports with 10M–100G multi-rate test modules; runs 24×7×N uninterrupted.',

        '超大尺寸加工能力': 'Oversize PCBA Capability',
        '测试装备平台开发能力': 'Test Platform Development',
        '自动测试夹具开发能力': 'Auto Test Fixture Development',
        '最大单板尺寸: 910*220mm': 'Max single-board size: 910×220mm',
        '最大BGA尺寸: 67.5*67.5mm': 'Max BGA size: 67.5×67.5mm',
        '高速连接器压接能力': 'High-Speed Connector Press-Fit',
        '1. 并行测试': '1) Parallel testing',
        '2. MES系统对接，自动过站与防呆': '2) MES integration – auto station pass & mistake-proofing',
        '3. 测试log自动备份服务器': '3) Test logs auto-backed up to server',
        '4. 后台数据统计与预警功能': '4) Back-office statistics & alerts',
        '全自动单板测试，覆盖所有对外接口、内存条、CPU压力，支持操作系统切换等': 'Full auto single-board test: all external I/Fs, DIMMs, CPU stress, OS switch, etc.',

        '环境实验箱ESS': 'ESS Chamber',
        '功能测试自动化': 'Functional Test Automation',
        'PC自动测试夹具': 'PC Auto Test Fixture',
        '1. 温箱的温变(升降温速率):-10℃ ~ 55 ℃/ 15℃/min (空载)': '1) Temp ramp rate: -10~55℃, 15℃/min (unloaded)',
        '2. 温度范围: -20℃ ~ +80 ℃±0.2℃': '2) Temp range: -20℃ ~ +80℃ ±0.2℃',
        '3. 温度分布均匀度 ±1.5℃(-40 ℃ ~ +100 ℃)(空载)': '3) Uniformity: ±1.5℃ (-40℃ ~ +100℃, unloaded)',
        '1.测试接口覆盖率100%': '1) 100% test-point coverage',
        '2.自动化程序与MES系统对接自动过站；防呆机制': '2) Auto program ↔ MES linkage; mistake-proofing',
        '3.SPC监控异常预警；': '3) SPC anomaly monitoring & alerting;',
        '4.测试日志自动上传备份服务器；': '4) Test logs auto-uploaded to backup server;',
        '5.支持多产品并行测试': '5) Parallel multi-product testing supported',

        // ---------- 质量体系 14 子模块 ----------
        // 模块标题
        '质量保证能力 – 体系框架': 'Quality Assurance – System Framework',
        '质量保证能力 – 基础环境': 'Quality Assurance – Factory Environment',
        '质量保证能力 – 供应商及物料管理': 'Quality Assurance – Supplier & Material Mgmt',
        '质量保证能力 – 来料检验能力': 'Quality Assurance – Incoming Inspection Capability',
        '质量保证能力 – 错混料管控': 'Quality Assurance – Mix-up Prevention',
        '质量保证能力 – 系统质量管控点': 'Quality Assurance – In-process Control Points',
        '质量保证能力 – IQC': 'Quality Assurance – IQC',
        '质量保证能力 – MES系统': 'Quality Assurance – MES System',
        '质量保证能力 – 装备开发与验证': 'Quality Assurance – Equipment Development & Validation',
        '质量保证能力 -应力应变测试与控制': 'Quality Assurance – Strain-Gauge Test & Control',
        '质量保证能力 – 过程质量框架': 'Quality Assurance – In-line Quality Framework',
        '生产管理：三化一稳定 – 流程IT化': 'Production: 3-S + 1-Stability – IT-enabled Process',
        '生产管理：三化一稳定 – 生产自动化': 'Production: 3-S + 1-Stability – Automation',
        '生产管理：三化一稳定 – 人员稳定化': 'Production: 3-S + 1-Stability – People Stability',
        '生产管理：三化一稳定 – 关键人员岗位稳定': 'Production: 3-S + 1-Stability – Key Position Retention',
        '生产管理：领导现场管理 – 走动式管理': 'Production: Gemba Walk – Management by Walking Around',

        // 体系框架
        '体系保障': 'Certified Systems',
        'ISO9001质量体系': 'ISO 9001 Quality System',
        'IECQ QC 080000体系': 'IECQ QC 080000 System',

        // 基础环境
        'ESD管控': 'ESD Control',
        '灰尘管控': 'Dust Control',
        'ESD接地远程监控看板': 'ESD grounding remote monitoring dashboard',
        '手环地带感应防呆装置': 'Wrist-strap sensing & mistake-proofing',
        'SMT线、插件所有工位、补焊工位等风险岗位配置离子风机': 'Ionizers at all SMT / through-hole / touch-up risk stations',
        '配置湿膜加湿机': 'Humidifiers deployed',
        '温湿度远程监控看板': 'Temperature & humidity remote monitoring dashboard',
        '单板与整机车间分开': 'Board / System assembly shops physically separated',
        '印刷前PCB清洁风棒': 'PCB anti-dust air knives before printing',
        '单板车间去除纸箱': 'No cardboard cartons inside board shop',

        // 供应商及物料管理（矩阵）
        '供应商及物料管控': 'Supplier & Material Governance',
        '管理模块': 'Management Pillars',
        '管控方式': 'Control Methods',
        '管理体系': 'Systems / Docs',
        '供应商选择': 'Supplier Selection',
        '新物料导入': 'New Part Introduction',
        'IQC进料检验': 'IQC Incoming Inspection',
        '物料问题处理': 'Material Escapes Handling',
        '供应商管理': 'Supplier Management',
        '供应商质量预防': 'Supplier Quality Prevention',
        '新供应商介绍沟通会': 'New supplier kick-off meeting',
        '供应商能力基线要求': 'Supplier capability baseline',
        '新供应商现场稽核': 'On-site new supplier audit',
        '新物料导入流程': 'New material NPI flow',
        '替代料导入和认证': 'Alternative part intro & qualification',
        '抽样比例': 'Sampling ratio',
        '检验规范': 'Inspection spec',
        '电子系统追踪物料质量问题': 'E-system tracks all material escapes',
        '研发参与8D报告审核': 'R&D reviews 8D reports',
        '供应商月度质量绩效': 'Supplier monthly quality KPI',
        '供应商季度绩效': 'Supplier quarterly KPI',
        '供应商绩效红黄灯管理': 'Red/Yellow light performance management',
        '关键供应商稽核': 'Key supplier audits',
        '供应商改善报告': 'Supplier corrective action reports',
        '供应商系统平台': 'Supplier web portal',
        '-供应商引入': '- Supplier onboarding',
        'OA管控系统': 'OA control system',
        'WMES IQC检验系统': 'WMES IQC inspection module',
        '物料不合格品电子流、物料让步电子流': 'NCM / Material Deviation e-Flows',
        '供应商红黄灯管理办法': 'Red/Yellow light management rule',
        '关键供应商体系纠正预防管理规范': 'CAPA management norm for key suppliers',

        // 来料检验能力（表格）
        '器件类别': 'Part Category',
        'AI类': 'Class AI',
        'AII类': 'Class AII',
        'AIII类': 'Class AIII',
        'B类': 'Class B',
        '备注': 'Remarks',
        '电阻': 'Resistor',
        '电容': 'Capacitor',
        '变压器、电感': 'Transformer / Inductor',
        '晶振': 'Crystal / Oscillator',
        '晶体管': 'Transistor',
        '保险管、厚膜': 'Fuse / Thick-film',
        '开关': 'Switch',
        '结构件类': 'Structural parts',
        '连接器': 'Connector',
        '辅料': 'Consumables',
        '风扇': 'Fan',
        '标签、包材类': 'Labels & Packaging',
        '电缆类': 'Cables',
        '满足': 'Fully',
        '部分满足': 'Partial',
        '不满足': 'N/A',
        'NA': 'N/A',
        '光模块、bosa、光器件、继电器、避雷器、射频、滤波器（海量）、磁芯、传感器（IC类物料除外）、分流器、天线电机、热缩套管、资料、计算机类、摄像机、摄像机配件、机心、镜头、双工器类、天线附件、LCD、电池类、IT配套类、计算机、内存、硬盘、二次电源、GPS接收卡、显卡类、采购模条、微波天线、线材、光纤类，不涉及。':
            'Optical modules / BiDi / Optical parts / Relays / Surge arrestors / RF / Filters / Cores / Sensors (ex-IC) / Shunts / Antenna motors / Heat-shrink / Documentation / Computers / Cameras & accessories / Mech-core / Lenses / Duplexers / Antenna accessories / LCDs / Batteries / IT kits / PCs / Memory / SSDs / Secondary PSUs / GPS cards / GPUs / Purchasing dies / Microwave antennas / Cables / Fiber parts — out of scope.',
        'AII类DPA不满足，2021年规划中': 'AII DPA not available – planned 2021 roadmap',
        'AII类DPA不满足，2021年规划中（重复）': 'AII DPA not available – planned 2021 roadmap',
        '各类匝间耐压测试仪和AIII类共模噪声测试仪，已提单购买': 'Turn-to-turn HIPOT testers + AIII common-mode noise testers on PO',
        '各类封装测试温巡工具板和B类测试仪器，已提单购买': 'All pkg temp-cycle tooling boards + Class-B test instruments on PO',
        'AII类STI5000NA晶体管图示仪已提单购买，DPA不满足，2021年规划中': 'STI5000NA curve tracer PO issued; AII DPA planned for 2021',
        'B类DPA不满足，2021年规划中': 'Class-B DPA planned for 2021',
        'B类检验项目参考供应商报告': 'Class-B items verified against supplier reports',
        'B类材料成分、抗拉、阻燃、镀层厚度参考供应商报告或委外': 'Class-B material C/T/Flame/plating-thickness by supplier report or outsourced lab',
        'B类膜厚、个别测试项目需要继续完善': 'Class-B film-thickness & some items still improving',
        'AII类参考供应商报告': 'AII items referenced to supplier reports',
        '风扇测试仪，风扇老化监控设备，2021年规划中': 'Fan tester / burn-in monitor – planned 2021 roadmap',
        '含水率测试仪、万能试验机参考供应商报告': 'Moisture / UTM results referenced to supplier reports',
        '参考供应商报告': 'Referenced to supplier reports',

        // 错混料管控 4 卡片
        '订单接收与转化': 'Order Intake & Conversion',
        '生产制造管控': 'Manufacturing Control',
        '理货与发货': 'Picking & Shipping',
        '尾数管理': 'Short-Qty Management',
        '使用前缀+客户产品编码，无需编码对照表': 'Prefix + customer PN, no cross-reference table needed',
        '使用系统BOM自动生成配料单': 'Pick-list auto-generated from system BOM',
        '5S区域划分与标识，防止混料': '5S zoning & labeling – mix-up prevention',
        'MES系统一键隔离': 'One-click MES isolation',
        '在线打印标签，标签内容根据后台数据库自动生成': 'In-line label printing from DB-driven content',
        '电子标签、本体标签、外箱标签一致性系统校验': 'E-label / body-label / carton-label cross-check in system',
        '换线清线管控': 'Line-change / line-clearance controls',
        '成品标签按客户格式在线打印和粘贴，无离线粘贴': 'Finished goods labels printed & applied in-line per customer format',
        '发货标签100%采集与订单核对': '100% shipping-label scan vs. SO reconciliation',
        '集合包装拆箱模块': 'Kit-packing / un-packing modules',
        'MES流程管控': 'MES workflow governed',
        '尾数专线安排': 'Dedicated short-qty lane',
        '100% FQC检验': '100% FQC inspection',

        // 系统质量管控点 3 段摘要
        '前段工序（仓库发料→AOI）': 'Front-End (Warehouse Issue → AOI)',
        '中段工序（DIP上线→DIP AOI）': 'Mid-Process (DIP Load → DIP AOI)',
        '后段工序（分板→OQC/客验）': 'Back-End (Depanel → OQC / Customer Audit)',
        '仓库发料': 'Warehouse Issue',
        'SMT上线': 'SMT Start',
        '锡膏印刷': 'Solder Paste Print',
        'SPI': 'SPI',
        '贴片': 'Placement',
        '回流焊': 'Reflow',
        'AOI': 'AOI',
        'DIP上线': 'DIP Start',
        '分板': 'Depanel',
        'DIP AOI': 'DIP AOI',
        '波峰焊': 'Wave Solder',
        '补焊': 'Touch-Up',
        '压接': 'Press-Fit',
        '散热器粘贴': 'HS Gluing',
        '单板测试': 'Board Test',
        '组装': 'Assembly',
        '预测试': 'Pre-Test',
        '老化': 'Burn-In',
        '功能测试': 'Functional Test',
        '系统测试': 'System Test',
        '包装': 'Packing',
        'OQC/客验': 'OQC / Customer Audit',

        // IQC
        'IQC的检验能力': 'IQC Capability',
        '检验项目: 外观检验 、尺寸结构 、 电气特性 、性能特性': 'Items: Visual / Dimensional / Electrical / Functional',
        '检验设备: 元素成分分析仪、LCR数字电桥、影像测试仪、耐压绝缘测试仪、千分尺、漏电流测试仪、显微镜、耐压耐破等':
            'Equipment: XRF elemental analyzer / LCR bridge / Vision tester / HIPOT + Insulation / Micrometer / Leakage / Microscope / Burst / HIPOT',
        '供应商来料的质量管理': 'Incoming Supplier Quality',
        '来料检验项目审视、物料标准检验文件的制定与输出': 'Inspection plan review + issuance of standard inspection docs',
        '原材料不良的判定、反馈并辅导供应商有效改善，8D报告对策输出的实施与跟踪确认':
            'Raw-material NC judgment / feedback / supplier coaching, plus 8D follow-up & closure',
        '重点供应商实施QBR月度会议，讨论LRR、DPPM状况，提升和稳定入料品质':
            'Key-supplier monthly QBR: LRR + DPPM reviews, driving incoming quality up',
        'IQC检验仪器设备': 'IQC Inspection Equipment',

        // MES（9 模块 + 架构）
        'MES': 'MES',
        '系统管理': '01 System Administration',
        '基础数据': '02 Master Data',
        '设备管理': '03 Equipment Mgmt',
        '仓库管理': '04 Warehouse Mgmt',
        '生产管理': '05 Production Mgmt',
        '品质管理': '06 Quality Mgmt',
        '数据采集': '07 Data Collection',
        '看板管理': '08 Dashboard Mgmt',
        'BI中心': '09 BI Center',
        '√质量看板': '✓ Quality dashboard',
        '√效率看板': '✓ Efficiency dashboard',
        '√进度看板': '✓ Schedule dashboard',
        '√物料数据': '✓ Material data',
        '√产品数据': '✓ Product data',
        '√维修数据': '✓ Repair data',
        '√市场数据': '✓ Market data',
        '√作业数据': '✓ Operation data',
        '√产品追溯': '✓ Product traceability',
        '√作业防呆': '✓ Mistake-proofing',
        '√流程防呆': '✓ Routing mistake-proofing',
        '√异常处理': '✓ Exception handling',
        '√维护管理': '✓ Maintenance',
        '√信息收集': '✓ Information collection',
        '√先进先出': '✓ FIFO',
        '√MSD管控': '✓ MSD control',
        '√OEE管理': '✓ OEE',
        '√品质过程管理': '✓ In-line quality',

        // 装备开发与验证
        '产品经理/项目负责人提出需求': 'PM / Project Owner raises requirement',
        '自动化测试工程师提交版本': 'Automation Test Engineer submits build',
        '硬件自动化测试验收': 'Hardware Automated Test Acceptance',
        '产品经理/项目负责人确认': 'PM / Project Owner confirms',
        '工程师提交归档': 'Engineer submits for archiving',
        '通过': 'Pass',
        '未通过': 'Fail',
        '测试装备平台开发能力': 'Test Platform Development Capability',
        '1. 并行测试': '1) Parallel testing',
        '2. MES系统自动过站与防呆': '2) MES auto station pass & mistake-proofing',
        '3. 测试log自动备份服务器': '3) Test logs auto-backed up',
        '4. 后台数据统计与预警功能': '4) Back-office KPI & alerts',
        '自动测试夹具开发能力': 'Auto Test Fixture Development',

        // 应力应变
        '按 IPC/JEDEC-9074A 印制板应变测试指南测试': 'Tested per IPC/JEDEC-9074A PCB Strain Test Guide',
        '应力应变测试工序': 'Test Stations',
        '应力应变管控点': 'Control Points',
        '周转运输': 'Kitting & Transit',
        '抽屉式周转车，竖插周转车，单板托盘': 'Drawer carts, vertical-insert carts, single-board trays',
        '插件工序': 'Through-hole Process',
        '专用波峰焊托盘，擦拭方式清洁补焊焊点': 'Dedicated wave pallets, wipe-clean touch-up pads',
        '分板工序': 'Depanel Process',
        'Router分板机，刀具寿命管控': 'Router depanelizer + tool-life management',
        'ICT测试': 'ICT Test',
        'ICT夹具例行保养和例行应力监控': 'ICT fixture PM + periodic stress monitoring',
        'FBT测试': 'FBT Test',
        '辅助定位角和定位pin设计，防止放置失误': 'Auxiliary locating corners + pins – anti-misload',
        '产品组装': 'Product Assembly',
        '散热片安装，DIMM/PCIE安装，制作专用治具': 'HS install, DIMM/PCIe install, dedicated jigs',
        '*切片和染色分析，当前委托第三方进行': '* Cross-section & Dye-stain currently outsourced to 3rd-party lab',

        // 过程质量框架 右 6 卡片
        '过程质量运行监控清单': 'Process Quality Audit Checklist',
        '设备关键制程工艺确认': 'Key process parameter sign-off',
        '覆盖率报告测试计划': 'Coverage report + Test plan',
        '检验流程、检验报告': 'Inspection flow & reports',
        'FDPPM/RIDPPM/FPY/LAR/IRR/YRR': 'FDPPM / RIDPPM / FPY / LAR / IRR / YRR',
        '质量日/周/月报，测试直通率预警': 'Daily/Weekly/Monthly quality report + first-pass alerts',
        '对应的监控机制（meeting review）': 'Review meetings & escalation mechanisms',
        'MES追溯，工艺流程设定，防呆，数据收集及汇总': 'MES traceability, routing config, mistake-proofing, data aggregation',
        '异常处理流程总览': 'Escalation Flows Overview',
        '产线异常反馈机制、FA分析的流程、repair&rework后的流程、客诉处理流程': 'In-line anomaly → FA → Repair/Rework → Customer complaint flow',
        'DCN变更、ECN变更流程、audit/线体quality/物料quality/等、测试&检验要求，其他工厂管理要求': 'DCN / ECN flow, audits, line & material quality, test & inspection rules, other plant rules',
        '质量计划（Quality plan）落地机制': 'Quality Plan Execution Mechanism',
        'quality plan定义/ 试产质量要求/ 试产问题点review/ 产线readiness review/ 项目量产质量要求定义':
            'QP definition, pilot quality reqs, pilot findings review, line readiness review, MP quality criteria definition',
        '过程质量运行监控清单（短标题）': 'PQ Audit Checklist',

        // 三化一稳定
        'ERP维护单据': 'ERP-maintained Docs',
        'MES事务': 'MES Transactions',
        '企业计划层（K3 ERP……）': 'Enterprise Planning Layer (Kingdee K3 ERP…)',
        '原料采购': 'Raw Material Procurement',
        '原料库存': 'Raw Material Inventory',
        '工单': 'Work Order',
        '成品发货指令': 'Finished-Goods Shipping',
        '供应商协同': 'Supplier Collaboration',
        '物料管理': 'Material Mgmt',
        '生产过程与品质管理': 'Production & Quality Mgmt',
        '企业内部协同': 'Internal Collaboration',
        '客户协同': 'Customer Collaboration',
        '采购订单': 'Purchase Order',
        '发货看板': 'Shipping Board',
        '送货单': 'Delivery Note',
        '打印/粘贴物料标签': 'Print & Apply Material Label',
        '发货执行（采集车牌、司机机等）': 'Shipping execution (plate & driver capture)',
        '在途看板': 'In-Transit Board',
        '退货流程': 'RMA Process',
        '供方不良排名': 'Vendor NC Ranking',
        '移库': 'Stock Transfer',
        '盘点': 'Stock Count',
        '库存看板': 'Inventory Board',
        '生成入库单': 'Goods Receipt Note',
        'PDA上架': 'PDA Put-away',
        'IQC判定': 'IQC Judgment',
        '收料看板': 'Receiving Board',
        'PDA来料点收': 'PDA Incoming Check',
        '卸货指引': 'Unloading Guide',
        '作业排程': 'Production Scheduling',
        '生产领料单': 'Material Issue Slip',
        '齐套检查': 'Kit Check',
        'FIFO拉料看板': 'FIFO Material Pull Board',
        'PDA下架': 'PDA Pick',
        '配送到工位': 'Line-Side Delivery',
        '派工与生产调度': 'Dispatch & Production Scheduling',
        '模块级生产': 'Module-level Production',
        '整机组装生产': 'System-level Assembly',
        '物料上线检查': 'Material Line Check',
        '成品下线-FQC': 'FG Off-line → FQC',
        'SMT贴片': 'SMT Mounting',
        '包装作业': 'Packing',
        '测试': 'Test',
        '维修站': 'Repair Station',
        '二次测试': 'Re-Test',
        '老化': 'Burn-In',
        '下线入库': 'GR from Production',
        'ATE测试': 'ATE Test',
        '模块中转看板': 'Module Transfer Board',
        '整机组配': 'System Assembly',
        '半成品准备站': 'Semi-FG Prep Station',
        'IPQC': 'IPQC',
        '线边物料缓存区': 'Line-Side Buffer',
        '成品看板': 'Finished Goods Board',
        '发货计划': 'Shipping Plan',
        '拣货单': 'Picking List',
        'PDA下架（成品）': 'PDA Pick (FG)',
        '出货扫描': 'Outbound Scan',
        '发货跟踪看板': 'Outbound Tracking Board',
        '客诉客退流程': 'Complaint / RMA Flow',
        '送检': 'Send for Inspection',
        '判退': 'Reject',
        '发料': 'Issue',
        '入库': 'Stock In',
        '异常停线': 'Abnormal Stop',
        'NG': 'NG',
        'G': 'OK',
        '为生产保驾护航': 'Production Support',
        '数据采集及获取、显示': 'Data Collection & Display',
        'PDA': 'PDA',
        '扫描枪': 'Barcode Scanner',
        '设备数据采集': 'Equipment Data Collection',
        '看板显示器': 'Dashboard Display',
        '来料检验': 'Incoming Inspection',
        '不良判定': 'Defect Judgment',
        '供应商合格率': 'Vendor Yield',
        '制程巡检': 'In-Process Patrol',
        '制程异常': 'In-Process Abnormal',
        '首件管理': 'First-Article Management',
        '样箱管理': 'Golden Sample Management',
        'OQC检验': 'OQC Inspection',
        '生产看板': 'Production Dashboard',
        '绩效看板': 'KPI Dashboard',
        '生产过程数据分析': 'Production Analytics',
        '移动应用': 'Mobile Apps',
        '数据采集': 'Data Collection',
        '过程追溯': 'Process Traceability',
        '实时防错': 'Real-time Mistake-Proofing',
        '制程监控': 'In-line Monitoring',
        '物料追溯': 'Material Traceability',
        '制程维修': 'In-line Repair',
        '物料条码化': 'Barcoded Material',
        '先进先出': 'FIFO',
        '超期预警': 'Expiry Alert',
        '工具管理': 'Tool Mgmt',
        '日常点检': 'Daily Check',
        '保养预警': 'Maintenance Alert',
        '标签管理': 'Label Mgmt',
        '作业规程': 'SOP',
        '料站表': 'Feeder Setup Sheet',
        '条码打印': 'Barcode Print',
        '送货': 'Delivery',
        '退货': 'Return',
        '计划下达': 'Plan Release',
        '产出回传': 'Output Feedback',
        'EAM工具管理': 'EAM Tool Mgmt',
        '工艺管理': 'Process Mgmt',
        'WMS仓储执行': 'WMS Execution',
        'MES生产制造执行': 'MES Execution',
        'QMS品质管理': 'QMS Quality Mgmt',

        // 生产自动化 - 左右两列
        '设备自动化': 'Equipment Automation',
        '软件自动化': 'Software Automation',
        '功能测试自动化': 'Functional Test Automation',
        '智能仓储': 'Smart Warehouse',
        '炉前AOI': 'Pre-Reflow AOI',
        '炉后AOI': 'Post-Reflow AOI',
        'X-Ray检测仪': 'X-Ray Inspection',
        '分板机': 'Router / Depanelizer',
        'SPI设备': 'SPI System',
        '上架：随机分配储位': 'Put-away: auto-assign storage slots',
        '备料：同工单同时亮起储位信号': 'Kitting: simultaneous slot-lighting per work-order',
        '补仓：储位不足安全库存，自动亮灯提示补货': 'Replenish: auto light-call when below safety stock',

        // 人员稳定化 3 卡片
        'ISO9001/ISO45001体系培训': 'ISO 9001 / ISO 45001 Awareness',
        '六西格玛培训': 'Six Sigma Training',
        'MSA和SPC培训对关键量测系统进行分析': 'MSA & SPC Training – Key Measurement Systems Analysis',
        '· 组织生产，质量和工艺参加 IOS9001/ISO45001 体系培训\n· 加强体系管理概念，增强流程意识':
            '• Production / Quality / Process teams attend ISO 9001 / ISO 45001 training\n• Strengthen system awareness & process discipline',
        '· 接轨全球质量经验，提升团队质量等级\n· 用六西格玛管理方法指导生产质量':
            '• Benchmark global quality practices, raise team capability level\n• Apply Six Sigma to production quality',
        '· 评估环境校准周期，设备外部校准周期\n· 对量测系统一致性分析改善':
            '• Review environmental & external calibration cycles\n• MSA consistency analysis & improvement',

        // 关键人员岗位稳定 2 卡片
        '活动类': 'Activities',
        '培训类': 'Training',
        '· 月度之星评选': '• Employee of the Month awards',
        '· 员工慰问': '• Employee care & consolation',
        '· 恒为趣味运动会': '• Hengwei Fun Sports Day',
        '· 回归基本、夯实基础，建立信赖性工厂专题培训': '• Back-to-basics Reliable Factory workshop',
        '· 六西格玛培训': '• Six Sigma training',
        '· 基层管理者储备干部系列培训和考核': '• Frontline Supervisor talent-pool training & assessment',

        // 领导现场管理（走动式）
        '活动目的': 'Objectives',
        '活动内容': 'Contents',
        'A 了解情况 不下一线亲自走走，心中没底': 'A Understand – no solid feel without walking the floor',
        'B 加强沟通 走动中和各级的交流就是沟通': 'B Communicate – walk-the-floor interactions at all levels',
        'C 交流情感 经常的下基层可以和一线员工直接交流': 'C Connect – regular gemba walks build rapport with front-line',
        'D 监督工作 是对下属的工作情况进行的一次检查': 'D Supervise – check-up on direct reports’ execution',
        '参与人员：所有主管及以上人员': 'Participants: all supervisors + above',
        '活动范围：涉及IQC, 生产，工艺，维修，仓库等所有单位': 'Scope: all functions – IQC / Production / Process / Repair / Warehouse',
        '工作内容：“三现主义” 每日去现场发现问题，改善问题': 'Work: “3-Realism” – daily go-see, problem find & kaizen',
        '发现问题': 'Identify Issues',
        '制定改善措施': 'Define Countermeasures',
        '问题改善和宣导': 'Improve & Cascade',

        // 返回顶部（aria-label 虽然在 DOM 但为保险添加）
        '返回顶部': 'Back to top'
    };

    // 反向字典：英文 -> 中文，从 TEXT_MAP_ZH 自动生成避免手改双份
    const TEXT_MAP_EN = (function buildReverse() {
        const rev = {};
        Object.keys(TEXT_MAP_ZH).forEach(k => {
            const v = TEXT_MAP_ZH[k];
            if (typeof v === 'string') rev[v] = k;
        });
        return rev;
    })();

    function walkTextNodes(root, visitor) {
        if (!root) return;
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    // 跳过脚本/样式/注释/pre内代码
                    const p = node.parentNode;
                    if (!p) return NodeFilter.FILTER_REJECT;
                    const tag = (p.tagName || '').toUpperCase();
                    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'PRE' || tag === 'CODE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 跳过完全空白（除非包含换行）
                    if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );
        let cur;
        while ((cur = walker.nextNode())) visitor(cur);
    }

    function applyTextMap(lang) {
        const map = (lang === 'en') ? TEXT_MAP_ZH : TEXT_MAP_EN;
        if (!map || typeof map !== 'object') return;
        walkTextNodes(document.body, function (node) {
            // 不要碰带 data-i18n 的元素内部（它的替换归上面 applyI18n 管，含图标逻辑）
            let el = node.parentElement;
            while (el && el !== document.body) {
                if (el.hasAttribute && el.hasAttribute('data-i18n')) return;
                el = el.parentElement;
            }
            const raw = node.nodeValue;
            if (!raw || !raw.trim()) return;
            // exact-match 优先（最常见场景，比如列表 bullet 一整句）
            const t = raw.trim();
            if (Object.prototype.hasOwnProperty.call(map, t)) {
                const trans = map[t];
                if (typeof trans === 'string') {
                    // 保留前后的空格（列表 bullet 前缩进）
                    const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
                    if (m) {
                        node.nodeValue = m[1] + trans + m[3];
                    } else {
                        node.nodeValue = trans;
                    }
                    return;
                }
            }
            // 次优：整串 substring 包含某个 key（仅在 lang==en 切英文时使用，避免中文切回时把英文错匹配）
            if (lang === 'en') {
                let buf = raw;
                let changed = false;
                // 最长 key 优先（避免 "AOI" 比 "炉后AOI" 先匹配）
                const keys = Object.keys(map).sort((a, b) => b.length - a.length);
                for (let i = 0; i < keys.length; i++) {
                    const k = keys[i];
                    if (!k || k.length < 2) continue;
                    const v = map[k];
                    if (buf.indexOf(k) !== -1 && typeof v === 'string') {
                        // 将所有重复出现全部替换
                        buf = buf.split(k).join(v);
                        changed = true;
                    }
                }
                if (changed) node.nodeValue = buf;
            }
        });
    }

    /* ============ 主流程 ============ */
    const STORAGE_KEY = 'rb-lang';

    function getDefaultLang() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === 'zh' || saved === 'en') return saved;
        } catch (e) { /* ignore */ }
        const nav = ((navigator && (navigator.language || navigator.userLanguage)) || '').toLowerCase();
        return nav.startsWith('zh') ? 'zh' : 'en';
    }

    function applyI18n(lang) {
        // 机制 1）：data-i18n
        const dict = I18N_DICT[lang] || I18N_DICT.zh;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = dict[key];
            if (typeof val !== 'string') return;
            const iconEl = el.querySelector('i.fa, i[class*="fa-"]');
            if (iconEl) {
                const cloned = iconEl.cloneNode(true);
                el.textContent = '';
                el.appendChild(cloned);
                const stripped = val.replace(/^[^：:]*[：:]\s*/, '');
                el.appendChild(document.createTextNode(' ' + stripped));
            } else {
                el.textContent = val;
            }
        });
        // 机制 2）：TEXT_MAP 纯文本全文匹配 + 子串替换兜底
        try { applyTextMap(lang); } catch (err) {
            if (typeof console !== 'undefined' && console.warn) console.warn('[i18n] applyTextMap failed:', err);
        }
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

    // 立即执行一次（首屏 DOM 已就绪的部分先翻译），减少闪屏
    if (document.body) applyI18n(getDefaultLang());

    function boot() {
        bindToggleBtn();
        applyI18n(getDefaultLang());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    // 暴露给 module-loader.js 按需翻译动态加载内容
    window.__i18n = { apply: applyI18n, getLang: getDefaultLang };
})();
