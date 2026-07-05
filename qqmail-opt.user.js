// ==UserScript==
// @name         屏蔽 QQ 邮箱 VIP
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  隐藏 QQ 邮箱中 VIP 相关元素 (AI-assisted by Gemini)
// @author       hoiyuyiu
// @contributors Gemini
// @license      MIT
// @match        *://wx.mail.qq.com/*
// @match        *://mail.qq.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/hoiyuyiu/web-monkey/main/qqmail-opt.user.js
// @downloadURL  https://raw.githubusercontent.com/hoiyuyiu/web-monkey/main/qqmail-opt.user.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 1. 纯 CSS 屏蔽部分（100% 精准靶向，绝不误伤）
    // ==========================================
    const targetSelectors = [
        '.xmail-cmp-vip-embed-bubble',                                                    // 1. VIP 气泡提示
        '.cmp-user-info-name .cmp-vip-icon-click',                                        // 2. “成为 VIP”小标签/图标
        '.xmail-ui-btn.ui-btn-size32.ui-btn-them-clear-gray:has(.ui-btn-text .cmp-vip-icon)', // 3. 包含会员图标的灰色外层按钮
        '.profile-user-info .cmp-vip-state-icon',                                         // 4. “普通用户”状态标签
        '.mail-setting-vip-bar.setting-vip-bar-none',                                     // 5. 设置中的 VIP 提示条
        '.xmail-cmp-vip-streamer',                                                        // 6. VIP 横幅/流式元素
        '.frame-sidebar-menu:has(.cmp-vip-icon)',                                         // 7. 包含 VIP 图标的侧边栏菜单

        // 8. 彻底整行屏蔽原本包含“会员专属”标题的整行，以及它的卡片行（防止留白）
        '.setting-item-row:has(.setting-theme-card-group-title .cmp-vip-icon)',
        '.setting-item-row:has(.setting-theme-card-group-title .cmp-vip-icon) + .setting-item-row'
    ];

    const combinedStyle = targetSelectors.join(', ');
    GM_addStyle(`${combinedStyle} { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; }`);


    // ==========================================
    // 2. JavaScript DOM 动态改造部分（原生布局无缝还原）
    // ==========================================
    function injectThemeTitle() {
        // 寻找“通用主题”所在的那个 row 容器
        const targetRow = document.querySelector('.setting-item-row:has(.theme-card-group-title-free)');

        // 如果找到了，且这个 row 里面目前还没有被插过大标题
        if (targetRow && !targetRow.querySelector('.injected-theme-title')) {
            // 创建标准的外部 div 容器并赋予原生类名
            const nameDiv = document.createElement('div');
            nameDiv.className = 'setting-item-name injected-theme-title';

            // 创建内部的 span 标签
            const spanText = document.createElement('span');
            spanText.innerText = '主题';

            // 组装并前置插入到通用主题行
            nameDiv.appendChild(spanText);
            targetRow.insertBefore(nameDiv, targetRow.firstChild);

            console.log('[VIP屏蔽] 已成功将“主题”原生大标题注入到通用主题行！');
        }
    }

    // 监听网页动态加载
    const observer = new MutationObserver(() => {
        injectThemeTitle();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
