/**
 * ============================================
 * EFFECTS.JS - 光效與動畫系統
 * 獨立檔案以優化載入效能
 * ============================================
 */

(function() {
  'use strict';

  // ========================================
  // 星點粒子生成器
  // ========================================

  /**
   * 為傳說卡生成星點粒子
   * @param {HTMLElement} cardElement - 卡片元素
   * @param {number} count - 粒子數量
   */
  function generateCardSparkles(cardElement, count = 8) {
    if (!cardElement) return;

    // 檢查是否已有星點容器
    let sparklesContainer = cardElement.querySelector('.legendary-sparkles');

    if (!sparklesContainer) {
      sparklesContainer = document.createElement('div');
      sparklesContainer.className = 'legendary-sparkles';

      // 找到 card-inner 並插入
      const cardInner = cardElement.querySelector('.card-inner');
      if (cardInner) {
        cardInner.appendChild(sparklesContainer);
      } else {
        cardElement.appendChild(sparklesContainer);
      }
    }

    // 清除舊的粒子
    sparklesContainer.innerHTML = '';

    // 生成粒子
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'sparkle-particle';

      // 隨機位置（在卡片周圍）
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 0.4 + Math.random() * 0.15; // 40%-55% 從中心
      const x = 50 + Math.cos(angle) * distance * 100;
      const y = 50 + Math.sin(angle) * distance * 100;

      // 隨機動畫參數
      const delay = (Math.random() * 2.5).toFixed(2);
      const duration = (1.5 + Math.random() * 1.5).toFixed(2);

      particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --sparkle-delay: ${delay}s;
        --sparkle-duration: ${duration}s;
      `;

      sparklesContainer.appendChild(particle);
    }
  }

  /**
   * 為所有傳說卡添加星點效果
   */
  function initLegendarySparkles() {
    // 尋找所有傳說卡的 card-inner
    const legendaryCards = document.querySelectorAll('.legendary-aura');

    legendaryCards.forEach(cardInner => {
      const card = cardInner.closest('.card') || cardInner.closest('.card-detail');
      if (card) {
        generateCardSparkles(card, 8);
      }
    });
  }

  /**
   * 監聽新卡片添加，自動為傳說卡添加星點
   */
  function observeLegendaryCards() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 檢查是否為傳說卡或包含傳說卡
            const legendaryAuras = node.classList?.contains('legendary-aura')
              ? [node]
              : node.querySelectorAll?.('.legendary-aura') || [];

            legendaryAuras.forEach(aura => {
              const card = aura.closest('.card') || aura.closest('.card-detail');
              if (card && !card.querySelector('.legendary-sparkles')) {
                // 延遲添加，確保卡片完全渲染
                setTimeout(() => generateCardSparkles(card, 8), 100);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  // ========================================
  // 彈窗光效生成器
  // ========================================

  /**
   * 生成星點閃爍效果（用於彈窗）
   * @param {HTMLElement} container - 星點容器
   * @param {number} count - 星點數量
   */
  function generateSparkles(container, count = 20) {
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = (Math.random() * 3).toFixed(2);
      const duration = (1 + Math.random() * 2).toFixed(2);

      sparkle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        --sparkle-delay: ${delay}s;
        --sparkle-duration: ${duration}s;
      `;

      container.appendChild(sparkle);
    }
  }

  /**
   * 生成粒子效果（用於彈窗）
   * @param {HTMLElement} container - 粒子容器
   * @param {number} count - 粒子數量
   */
  function generateParticles(container, count = 30) {
    if (!container) return;

    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'legendary-particle';

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = (Math.random() * 3).toFixed(2);
      const size = 4 + Math.random() * 6;

      particle.style.cssText = `
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        animation-delay: ${delay}s;
      `;

      container.appendChild(particle);
    }
  }

  // ========================================
  // 傳說卡動畫系統
  // ========================================

  /**
   * 顯示傳說卡動畫
   * @param {Object} card - 卡片資料
   */
  function showLegendaryAnimation(card) {
    const overlay = document.getElementById('legendaryAnimationOverlay');
    const showcase = document.getElementById('legendaryCardShowcase');
    const cardName = document.getElementById('legendaryCardName');
    const particles = document.getElementById('legendaryParticles');
    const sparkleLayer = document.getElementById('sparkleLayer');

    if (!card || !overlay) return;

    // 生成光效元素
    if (sparkleLayer) generateSparkles(sparkleLayer, 25);
    if (particles) generateParticles(particles, 35);

    // 設置卡片展示
    if (showcase) {
      const photoContent = card.image
        ? `<img src="${card.image}" alt="${card.nameChinese}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
        : `<span style="font-size:5rem;">${card.emoji}</span>`;

      showcase.innerHTML = `
        <div class="legendary-card-display">
          ${photoContent}
        </div>
      `;
    }

    // 設置卡片名稱
    if (cardName) {
      cardName.textContent = card.nameChinese || card.nameEnglish;
    }

    // 顯示動畫層
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 關閉傳說卡動畫
   */
  function closeLegendaryAnimation() {
    const overlay = document.getElementById('legendaryAnimationOverlay');
    const sparkleLayer = document.getElementById('sparkleLayer');
    const particles = document.getElementById('legendaryParticles');

    if (!overlay) return;

    overlay.classList.remove('active');
    document.body.style.overflow = '';

    // 清除生成的元素
    setTimeout(() => {
      if (sparkleLayer) sparkleLayer.innerHTML = '';
      if (particles) particles.innerHTML = '';
    }, 500);
  }

  // ========================================
  // 初始化
  // ========================================

  function initEffects() {
    // 啟動傳說卡觀察器
    observeLegendaryCards();

    // 為現有傳說卡添加星點
    initLegendarySparkles();

    // 綁定傳說卡動畫關閉按鈕
    const continueBtn = document.getElementById('legendaryContinueBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', closeLegendaryAnimation);
    }

    // ESC 關閉傳說卡動畫
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('legendaryAnimationOverlay');
        if (overlay && overlay.classList.contains('active')) {
          closeLegendaryAnimation();
        }
      }
    });
  }

  // DOM 載入後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEffects);
  } else {
    initEffects();
  }

  // ========================================
  // 導出函數（供其他模組使用）
  // ========================================
  window.CardEffects = {
    generateCardSparkles,
    generateSparkles,
    generateParticles,
    showLegendaryAnimation,
    closeLegendaryAnimation,
    initLegendarySparkles
  };

})();
