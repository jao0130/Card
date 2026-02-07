/**
 * ============================================
 * 應用程式主邏輯 - APP LOGIC
 * ============================================
 * 效能優化：
 * - 事件委派（Event Delegation）
 * - DocumentFragment 批次 DOM 操作
 * - 圖片延遲載入（Lazy Loading）
 * - Map 快速查找
 * - 模板快取
 */

(function() {
  'use strict';

  // ========================================
  // 快取與狀態
  // ========================================
  const cardMap = new Map();
  const packMap = new Map();
  let currentPack = null;
  let collection = {};
  let currentDrawnCards = [];  // 當前抽到的卡片（含首次抽取標記）

  // DOM 快取
  const DOM = {};

  // 音效快取
  const audioCache = new Map();

  // 模板快取
  const templates = {
    packCard: null,
    card: null,
    collectionItem: null
  };

  // ========================================
  // 音效系統
  // ========================================
  let currentBGM = null;
  let currentBGMKey = null;

  function playSound(soundKey) {
    if (!CONFIG.SOUNDS.enabled) return;

    const soundPath = CONFIG.SOUNDS.files[soundKey];
    if (!soundPath) return;

    try {
      let audio = audioCache.get(soundKey);
      if (!audio) {
        audio = new Audio(soundPath);
        audioCache.set(soundKey, audio);
      }

      // 使用個別音量設定，若無則使用預設音量
      const individualVolume = CONFIG.SOUNDS.volumes?.[soundKey];
      audio.volume = individualVolume !== undefined ? individualVolume : CONFIG.SOUNDS.volume;
      audio.currentTime = 0;
      audio.play().catch(() => {
        // 忽略自動播放限制錯誤
      });
    } catch (e) {
      // 音效載入失敗時靜默處理
    }
  }

  function playNewCardSound(starCount) {
    const soundKey = `newCard${starCount}Star`;
    playSound(soundKey);
  }

  // 背景音樂系統（支援播放列表輪播）
  let currentPlaylist = [];
  let currentPlaylistIndex = 0;
  let bgmVolume = CONFIG.BGM?.volume || 0.3;
  let sfxVolume = CONFIG.SOUNDS?.volume || 0.8;

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function playBGM(bgmKey, customPath = null) {
    if (!CONFIG.BGM?.enabled) return;
  
    let bgmPath = customPath;
    let isPlaylist = false;
  
    if (!bgmPath) {
      const bgmConfig = CONFIG.BGM[bgmKey];
      if (Array.isArray(bgmConfig)) {
        isPlaylist = true;
        currentPlaylist = CONFIG.BGM.shuffle ? shuffleArray(bgmConfig) : [...bgmConfig];
        currentPlaylistIndex = 0;
        bgmPath = currentPlaylist[0];
      } else if (typeof bgmConfig === 'string') {
        bgmPath = bgmConfig;
        currentPlaylist = [];
      }
    } else {
      // 當傳入 customPath (卡包音樂) 時，清空舊的播放列表，避免邏輯干擾
      currentPlaylist = [];
    }
  
    if (!bgmPath) return;
    if (currentBGMKey === bgmPath && !isPlaylist) return;
  
    try {
      if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
        currentBGM.removeEventListener('ended', playNextInPlaylist);
      }
  
      currentBGM = new Audio(bgmPath);
      currentBGM.volume = bgmVolume;
      currentBGMKey = bgmPath;
  
      // 關鍵修改：如果是播放列表則換歌，若是單曲(卡包音樂)則循環播放
      if (isPlaylist) {
        currentBGM.loop = false;
        currentBGM.addEventListener('ended', playNextInPlaylist);
      } else {
        currentBGM.loop = true; // 卡包專屬 BGM 將會重複播放
      }
  
      currentBGM.play().catch(() => {});
    } catch (e) {}
  }

  function playNextInPlaylist() {
    if (currentPlaylist.length === 0) return;

    currentPlaylistIndex = (currentPlaylistIndex + 1) % currentPlaylist.length;

    // 如果循環回到開頭，重新洗牌
    if (currentPlaylistIndex === 0 && CONFIG.BGM.shuffle) {
      currentPlaylist = shuffleArray(currentPlaylist);
    }

    const bgmPath = currentPlaylist[currentPlaylistIndex];

    try {
      if (currentBGM) {
        currentBGM.removeEventListener('ended', playNextInPlaylist);
        currentBGM.pause();
      }

      currentBGM = new Audio(bgmPath);
      currentBGM.volume = bgmVolume;
      currentBGMKey = bgmPath;
      currentBGM.loop = false;
      currentBGM.addEventListener('ended', playNextInPlaylist);
      currentBGM.play().catch(() => {});
    } catch (e) {}
  }

  function playPackBGM(pack) {
    if (pack?.bgm) {
      playBGM(null, pack.bgm);
    } else {
      // 沒有卡包專屬 BGM，使用大廳 BGM
      playBGM('lobby');
    }
  }

  function stopBGM() {
    if (currentBGM) {
      currentBGM.removeEventListener('ended', playNextInPlaylist);
      currentBGM.pause();
      currentBGM.currentTime = 0;
      currentBGM = null;
      currentBGMKey = null;
    }
    currentPlaylist = [];
    currentPlaylistIndex = 0;
  }

  function setBGMVolume(volume) {
    bgmVolume = volume;
    CONFIG.BGM.volume = volume;
    if (currentBGM) {
      currentBGM.volume = volume;
    }
  }

  function setSFXVolume(volume) {
    sfxVolume = volume;
    CONFIG.SOUNDS.volume = volume;

    // Update individual sound volumes proportionally
    if (CONFIG.SOUNDS.volumes) {
      const baseVolumes = {
        packOpen: 0.1,
        packTear: 0.8,
        cardFlip: 0.5,
        cardFlipAll: 0.6,
        cardEnlarge: 0.5,
        overlayClose: 0.3,
        buttonClick: 0.4,
        navSwitch: 0.4,
        newCard1Star: 0.3,
        newCard2Star: 0.35,
        newCard3Star: 0.4,
        newCard4Star: 0.45,
        newCard5Star: 0.5,
        newCard6Star: 0.5,
        newCard7Star: 0.5,
        legendary: 0.5
      };

      for (const [key, baseVol] of Object.entries(baseVolumes)) {
        CONFIG.SOUNDS.volumes[key] = baseVol * volume;
      }
    }
  }

  function getBGMVolume() {
    return bgmVolume;
  }

  function getSFXVolume() {
    return sfxVolume;
  }

  // ========================================
  // 初始化
  // ========================================
  let bgmStarted = false;

  function startBGMOnInteraction() {
    if (bgmStarted) return;
    bgmStarted = true;
    playBGM('lobby');
    document.removeEventListener('click', startBGMOnInteraction);
  }

  function init() {
    cacheDom();
    buildDataMaps();
    loadCollection();
    buildTemplates();
    renderLobby();
    bindEvents();
  
    // 獲取我們新增的進入層
    const startOverlay = document.getElementById('startOverlay');
    if (startOverlay) {
      startOverlay.addEventListener('click', () => {
        // 1. 隱藏進入層
        startOverlay.style.display = 'none';
        
        // 2. 觸發背景音樂
        if (!bgmStarted) {
          bgmStarted = true;
          playBGM('lobby'); 
        }
        
        // 3. 播放一個初始音效增加回饋感
        playSound('buttonClick');
      }, { once: true });
    }
  }
  function cacheDom() {
    DOM.packGrid = document.getElementById('packGrid');
    DOM.cardPack = document.getElementById('cardPack');
    DOM.openPackBtn = document.getElementById('openPackBtn');
    DOM.cardsOverlay = document.getElementById('cardsOverlay');
    DOM.cardsContainer = document.getElementById('cardsContainer');
    DOM.closeOverlayBtn = document.getElementById('closeOverlayBtn');
    DOM.flipAllBtn = document.getElementById('flipAllBtn');
    DOM.collectionGrid = document.getElementById('collectionGrid');
    DOM.backToLobbyBtn = document.getElementById('backToLobbyBtn');
    DOM.navTabs = document.querySelectorAll('.nav-tab');
    DOM.pages = document.querySelectorAll('.page');

    // Pack page elements
    DOM.packPageTitle = document.getElementById('packPageTitle');
    DOM.packPageSubtitle = document.getElementById('packPageSubtitle');
    DOM.packBrandTitle = document.getElementById('packBrandTitle');
    DOM.packBrandSub = document.getElementById('packBrandSub');
    DOM.packPreview = document.getElementById('packPreview');
    DOM.packInfoTitle = document.getElementById('packInfoTitle');
    DOM.packCardCount = document.getElementById('packCardCount');
    DOM.packProbabilityInfo = document.getElementById('packProbabilityInfo');

    // Stats
    DOM.totalCards = document.getElementById('totalCards');
    DOM.uniqueCards = document.getElementById('uniqueCards');
    DOM.completionRate = document.getElementById('completionRate');

    // Card detail modal
    DOM.cardDetailOverlay = document.getElementById('cardDetailOverlay');
    DOM.cardDetail = document.getElementById('cardDetail');
    DOM.cardDetailClose = document.getElementById('cardDetailClose');
  }

  function buildDataMaps() {
    CONFIG.CARDS.forEach(card => cardMap.set(card.id, card));
    CONFIG.PACKS.forEach(pack => packMap.set(pack.id, pack));
  }

  function loadCollection() {
    try {
      const saved = localStorage.getItem('cardCollection');
      collection = saved ? JSON.parse(saved) : {};
    } catch (e) {
      collection = {};
    }
  }

  function saveCollection() {
    try {
      localStorage.setItem('cardCollection', JSON.stringify(collection));
    } catch (e) {
      console.warn('無法儲存收集數據');
    }
  }

  // ========================================
  // 模板建構
  // ========================================
  function buildTemplates() {
    // Pack card template
    templates.packCard = (pack) => `
      <div class="pack-card" data-pack-id="${pack.id}">
        <div class="pack-card-preview">
          ${pack.image
            ? `<img src="${pack.image}" alt="${pack.name}" loading="lazy">`
            : `<span class="pack-card-preview-placeholder">${pack.emoji}</span>`
          }
        </div>
        <div class="pack-card-info">
          <h3 class="pack-card-name">${pack.name}</h3>
          <p class="pack-card-description">${pack.description}</p>
          <div class="pack-card-meta">
            <span class="pack-card-count">✦ ${pack.cardCount} 張卡片</span>
            <button class="pack-card-btn">開啟</button>
          </div>
        </div>
      </div>
    `;

    // Generate stars HTML based on rarity
    function generateStarsHTML(rarity) {
      const starCount = CONFIG.RARITY.STARS[rarity] || 1;
      let starsHTML = '';
      for (let i = 0; i < starCount; i++) {
        const delay = (Math.random() * 1.5).toFixed(2);
        const duration = (1.5 + Math.random() * 1).toFixed(2);
        starsHTML += `<span class="card-star" style="--twinkle-delay: ${delay}s; --twinkle-duration: ${duration}s;"></span>`;
      }
      return starsHTML;
    }

    // Trading card template
    templates.card = (card, isFirstTime = false) => {
      const rarityText = CONFIG.RARITY.TEXT[card.rarity];
      const rarityColor = CONFIG.RARITY.COLORS[card.rarity] || '#F59E0B';
      const starsHTML = generateStarsHTML(card.rarity);
      const photoContent = card.image
        ? `<img src="${card.image}" alt="${card.nameChinese}" loading="lazy">`
        : card.emoji;
      const isLegendary = card.rarity === 'legendary';
      const parentPack = CONFIG.PACKS.find(p => p.cards.includes(card.id));
      const packDisplayId = parentPack ? parentPack.id.toUpperCase() : 'UNKNOWN';
      const newBadgeHTML = isFirstTime ? `<div class="new-card-badge"><span class="new-badge-text">NEW</span></div>` : '';
      return `
        <div class="card-inner ${isLegendary ? 'legendary-aura' : ''}">
          <div class="card-face card-back back-${card.rarity}">
            <div class="card-back-pattern"></div>
            <div class="card-back-center">
              <div class="card-back-logo">✦</div>
              <div class="card-back-text">${packDisplayId}</div>
            </div>
            <div class="card-back-shine"></div>
          </div>
          <div class="card-face card-front rarity-${card.rarity}">
            ${newBadgeHTML}
            <span class="card-rarity-badge badge-${card.rarity}">${rarityText}</span>
            <div class="card-photo-area">
              <div class="card-photo">${photoContent}</div>
              <div class="card-photo-holo"></div>
            </div>
            <div class="card-member-info">
              <div class="card-stars">${starsHTML}</div>
              <div class="member-name-zh">${card.nameChinese}</div>
              <div class="member-name-en">${card.nameEnglish}</div>
              <div class="member-name-kr">${card.nameKorean}</div>
              <div class="card-rarity-text" style="color: ${rarityColor};">${rarityText}</div>
            </div>
          </div>
        </div>
      `;
    };

    // Collection item template
    templates.collectionItem = (card, count) => {
      const isLocked = count === 0;
      const rarityText = CONFIG.RARITY.TEXT[card.rarity];

      let photoContent = '';
      if (!isLocked) {
        photoContent = card.image
          ? `<img src="${card.image}" alt="${card.nameChinese}" loading="lazy">`
          : card.emoji;
      }

      return `
        <div class="collection-item ${isLocked ? 'locked' : ''}" data-card-id="${card.id}">
          <div class="collection-item-photo">${photoContent}</div>
          <div class="collection-item-info">
            <div class="collection-item-name">${isLocked ? '???' : card.nameChinese}</div>
            <div class="collection-item-count">${isLocked ? '未收集' : `擁有: ${count} 張`}</div>
            <span class="collection-item-rarity badge-${card.rarity}">${rarityText}</span>
          </div>
        </div>
      `;
    };

    // Card detail template (enlarged view)
    templates.cardDetail = (card) => {
      const rarityText = CONFIG.RARITY.TEXT[card.rarity];
      const rarityColor = CONFIG.RARITY.COLORS[card.rarity] || '#F59E0B';
      const starsHTML = generateStarsHTML(card.rarity);
      const photoContent = card.image
        ? `<img src="${card.image}" alt="${card.nameChinese}">`
        : card.emoji;
      const isLegendary = card.rarity === 'legendary';
      const parentPack = CONFIG.PACKS.find(p => p.cards.includes(card.id));
      const packDisplayId = parentPack ? parentPack.id.toUpperCase() : 'UNKNOWN';
      return `
        <div class="card-inner ${isLegendary ? 'legendary-aura' : ''}">
          <div class="card-face card-back back-${card.rarity}">
            <div class="card-back-pattern"></div>
            <div class="card-back-center">
              <div class="card-back-logo">✦</div>
              <div class="card-back-text">${packDisplayId}</div>
            </div>
            <div class="card-back-shine"></div>
          </div>
          <div class="card-face card-front rarity-${card.rarity}">
            <span class="card-rarity-badge badge-${card.rarity}">${rarityText}</span>
            <div class="card-photo-area">
              <div class="card-photo">${photoContent}</div>
              <div class="card-photo-holo"></div>
            </div>
            <div class="card-member-info">
              <div class="card-stars">${starsHTML}</div>
              <div class="member-name-zh">${card.nameChinese}</div>
              <div class="member-name-en">${card.nameEnglish}</div>
              <div class="member-name-kr">${card.nameKorean}</div>
              <div class="card-rarity-text" style="color: ${rarityColor};">${rarityText}</div>
            </div>
          </div>
        </div>
      `;
    };
  }

  // ========================================
  // 渲染函數
  // ========================================
  function renderLobby() {
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');

    CONFIG.PACKS.forEach(pack => {
      temp.innerHTML = templates.packCard(pack);
      fragment.appendChild(temp.firstElementChild);
    });

    DOM.packGrid.innerHTML = '';
    DOM.packGrid.appendChild(fragment);
  }

  // 稀有度排序權重（越高越稀有）
  const RARITY_ORDER = {
    legendary: 7,
    epic: 6,
    ultrarare: 5,
    superrare: 4,
    rare: 3,
    common: 2,
    normal: 1
  };

  function renderCollection() {
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');

    let totalCount = 0;
    let uniqueCount = 0;

    // Group cards by series
    const seriesMap = new Map();
    CONFIG.SERIES.forEach(series => {
      seriesMap.set(series.id, { ...series, cards: [] });
    });

    // Organize cards into series
    CONFIG.CARDS.forEach(card => {
      const count = collection[card.id] || 0;
      totalCount += count;
      if (count > 0) uniqueCount++;

      const seriesId = card.series || 'other';
      if (seriesMap.has(seriesId)) {
        seriesMap.get(seriesId).cards.push({ card, count });
      }
    });

    // Sort series by order and render
    const sortedSeries = Array.from(seriesMap.values())
      .filter(s => s.cards.length > 0)
      .sort((a, b) => a.order - b.order);

    sortedSeries.forEach(series => {
      // Create series section
      const seriesSection = document.createElement('div');
      seriesSection.className = 'collection-series-section';

      // Series header
      const seriesHeader = document.createElement('div');
      seriesHeader.className = 'collection-series-header';
      seriesHeader.innerHTML = `<h3 class="collection-series-title">${series.name}</h3>`;
      seriesSection.appendChild(seriesHeader);

      // Series grid
      const seriesGrid = document.createElement('div');
      seriesGrid.className = 'collection-series-grid';

      // 按稀有度排序（高到低）
      series.cards.sort((a, b) => {
        const rarityA = RARITY_ORDER[a.card.rarity] || 0;
        const rarityB = RARITY_ORDER[b.card.rarity] || 0;
        return rarityB - rarityA;
      });

      series.cards.forEach(({ card, count }) => {
        temp.innerHTML = templates.collectionItem(card, count);
        seriesGrid.appendChild(temp.firstElementChild);
      });

      seriesSection.appendChild(seriesGrid);
      fragment.appendChild(seriesSection);
    });

    DOM.collectionGrid.innerHTML = '';
    DOM.collectionGrid.appendChild(fragment);

    // Update stats
    DOM.totalCards.textContent = totalCount;
    DOM.uniqueCards.textContent = uniqueCount;
    DOM.completionRate.textContent = Math.round((uniqueCount / CONFIG.CARDS.length) * 100) + '%';
  }

  function renderDrawnCards(cardData) {
    const fragment = document.createDocumentFragment();

    cardData.forEach(({ card, isFirstTime }, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'card';
      cardEl.dataset.cardId = card.id;
      cardEl.dataset.isFirstTime = isFirstTime ? '1' : '0';
      cardEl.dataset.starCount = CONFIG.RARITY.STARS[card.rarity] || 1;
      cardEl.dataset.rarity = card.rarity;
      cardEl.style.animationDelay = `${0.2 + index * 0.15}s`;
      cardEl.innerHTML = templates.card(card, isFirstTime);
      fragment.appendChild(cardEl);

      const delayTime = 0.2 + index * 0.15;
      setTimeout(() => {
        playSound('packOpen'); // 每出一張卡就播一次音效
      }, delayTime * 1000);
      // Trigger reveal animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cardEl.classList.add('revealed');
        });
      });
    });

    DOM.cardsContainer.innerHTML = '';
    DOM.cardsContainer.appendChild(fragment);

    // Reset flip button state
    DOM.flipAllBtn.textContent = '一次翻開';
    DOM.flipAllBtn.classList.remove('draw-again');
  }

  // ========================================
  // 抽卡邏輯
  // ========================================
  function drawCard() {
    const availableCards = currentPack.cards
      .map(id => cardMap.get(id))
      .filter(Boolean);

    if (availableCards.length === 0) return null;

    const weights = CONFIG.RARITY.WEIGHTS;

    // 按稀有度分組卡片
    const rarityGroups = {};
    for (const card of availableCards) {
      if (!rarityGroups[card.rarity]) {
        rarityGroups[card.rarity] = [];
      }
      rarityGroups[card.rarity].push(card);
    }

    // 計算卡包中存在的稀有度總權重
    const availableRarities = Object.keys(rarityGroups);
    let totalWeight = 0;
    for (const rarity of availableRarities) {
      totalWeight += weights[rarity] || 0;
    }

    // 根據重新分配的權重選擇稀有度
    const roll = Math.random() * totalWeight;
    let cumulative = 0;
    let selectedRarity = availableRarities[0];

    for (const rarity of availableRarities) {
      cumulative += weights[rarity] || 0;
      if (roll < cumulative) {
        selectedRarity = rarity;
        break;
      }
    }

    // 從選中的稀有度中等機率選擇卡片
    const cardsOfRarity = rarityGroups[selectedRarity];
    return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
  }

  function drawMultipleCards(count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const card = drawCard();
      if (card) cards.push(card);
    }
    return cards;
  }

  // ========================================
  // 機率顯示
  // ========================================
  function renderProbabilityInfo(pack) {
    if (!pack || !DOM.packProbabilityInfo) return;

    const availableCards = pack.cards
      .map(id => cardMap.get(id))
      .filter(Boolean);

    if (availableCards.length === 0) {
      DOM.packProbabilityInfo.innerHTML = '';
      return;
    }

    const weights = CONFIG.RARITY.WEIGHTS;
    const rarityText = CONFIG.RARITY.TEXT;

    // 按稀有度分組卡片
    const rarityGroups = {};
    for (const card of availableCards) {
      if (!rarityGroups[card.rarity]) {
        rarityGroups[card.rarity] = [];
      }
      rarityGroups[card.rarity].push(card);
    }

    // 計算總權重
    const availableRarities = Object.keys(rarityGroups);
    let totalWeight = 0;
    for (const rarity of availableRarities) {
      totalWeight += weights[rarity] || 0;
    }

    // 稀有度排序（從低到高）
    const rarityOrder = ['normal', 'common', 'rare', 'superrare', 'ultrarare', 'epic', 'legendary'];
    const sortedRarities = availableRarities.sort((a, b) =>
      rarityOrder.indexOf(a) - rarityOrder.indexOf(b)
    );

    // 建構稀有度機率 HTML
    let rarityHtml = '';
    for (const rarity of sortedRarities) {
      const weight = weights[rarity] || 0;
      const probability = ((weight / totalWeight) * 100).toFixed(1);
      rarityHtml += `
        <div class="probability-item rarity-${rarity}">
          <span class="rarity-name">${rarityText[rarity] || rarity}</span>
          <span class="rarity-chance">${probability}%</span>
        </div>
      `;
    }

    // 建構傳說卡機率 HTML
    let legendaryHtml = '';
    const legendaryCards = rarityGroups['legendary'] || [];
    if (legendaryCards.length > 0) {
      const legendaryWeight = weights['legendary'] || 0;
      const legendaryTotalProb = (legendaryWeight / totalWeight) * 100;
      const perCardProb = legendaryTotalProb / legendaryCards.length;

      let legendaryCardsHtml = '';
      for (const card of legendaryCards) {
        const displayName = card.nameChinese || card.nameEnglish;
        legendaryCardsHtml += `
          <div class="legendary-card-item">
            <span class="card-name">${displayName}</span>
            <span class="card-chance">${perCardProb.toFixed(2)}%</span>
          </div>
        `;
      }

      legendaryHtml = `
        <div class="legendary-section">
          <div class="legendary-title">✦ 傳說卡個別機率 ✦</div>
          <div class="legendary-cards">${legendaryCardsHtml}</div>
        </div>
      `;
    }

    DOM.packProbabilityInfo.innerHTML = `
      <div class="probability-title">抽卡機率</div>
      <div class="probability-grid">${rarityHtml}</div>
      ${legendaryHtml}
    `;
  }

  // ========================================
  // 頁面控制
  // ========================================
  function switchPage(pageId) {
    DOM.navTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === pageId);
    });

    DOM.pages.forEach(page => {
      page.classList.toggle('active', page.id === pageId + 'Page');
    });

    if (pageId === 'collection') {
      renderCollection();
      playBGM('collection');
    } else if (pageId === 'lobby') {
      playBGM('lobby');
    }
  }

  function selectPack(packId) {
    currentPack = packMap.get(packId);
    if (!currentPack) return;

    // Update UI
    DOM.packPageTitle.textContent = currentPack.name;
    DOM.packPageSubtitle.textContent = currentPack.description;
    DOM.packBrandTitle.textContent = currentPack.brandTitle;
    DOM.packBrandSub.textContent = currentPack.brandSub;
    DOM.packInfoTitle.textContent = currentPack.packLabel;
    DOM.packCardCount.textContent = `${currentPack.cardCount} CARDS`;

    // Preview
    DOM.packPreview.innerHTML = currentPack.image
      ? `<img src="${currentPack.image}" alt="${currentPack.name}" loading="lazy">`
      : `<div class="pack-preview-placeholder">${currentPack.emoji}</div>`;

    // Render probability info
    renderProbabilityInfo(currentPack);

    // Reset pack state
    DOM.cardPack.style.visibility = 'visible';
    DOM.cardPack.classList.remove('pack-tearing');

    playPackBGM(currentPack);

    // Switch to pack page
    DOM.pages.forEach(p => p.classList.remove('active'));
    document.getElementById('packPage').classList.add('active');
    DOM.navTabs.forEach(t => t.classList.remove('active'));
  }

  function openPack() {
    if (!currentPack) return;

    playSound('packTear');
    playBGM('packOpening');
    DOM.openPackBtn.disabled = true;
    DOM.cardPack.classList.add('pack-tearing');

    setTimeout(() => {
      DOM.cardPack.classList.remove('pack-tearing');
      DOM.cardPack.style.visibility = 'hidden';

      // Draw cards and track first-time draws
      const drawnCards = drawMultipleCards(currentPack.cardCount);

      // Check if any legendary cards were drawn
      const hasLegendary = drawnCards.some(card => card.rarity === 'legendary');

      // Mark first-time draws and update collection
      currentDrawnCards = drawnCards.map(card => {
        const isFirstTime = !collection[card.id] || collection[card.id] === 0;
        collection[card.id] = (collection[card.id] || 0) + 1;
        return { card, isFirstTime };
      });
      saveCollection();

      // Render and show
      DOM.cardsOverlay.classList.add('active');
      renderDrawnCards(currentDrawnCards);

      // Reset flip button to initial state
      DOM.flipAllBtn.textContent = '一次翻開';
      DOM.flipAllBtn.classList.remove('draw-again');
      DOM.flipAllBtn.disabled = false;
      DOM.openPackBtn.disabled = false;

      // 如果抽到傳說卡，稍後播放傳說卡BGM
      if (hasLegendary) {
        // 傳說卡BGM會在翻牌時觸發
      }
    }, 1400);
  }

  function closeOverlay() {
    DOM.cardsOverlay.classList.remove('active');
    DOM.cardPack.style.visibility = 'visible';
    playSound('overlayClose');
    playPackBGM(currentPack); // 返回卡包專屬BGM或大廳BGM

    // Reset flip button state
    DOM.flipAllBtn.textContent = '一次翻開';
    DOM.flipAllBtn.classList.remove('draw-again');
  }

  // ========================================
  // 翻卡片邏輯
  // ========================================
  function flipCard(cardEl) {
    if (cardEl.classList.contains('flipped')) return;

    cardEl.classList.add('flipped');
    playSound('cardFlip');

    // 首次抽到的卡片播放對應星數音效
    const isFirstTime = cardEl.dataset.isFirstTime === '1';
    const starCount = parseInt(cardEl.dataset.starCount) || 1;
    const rarity = cardEl.dataset.rarity;
    const cardId = parseInt(cardEl.dataset.cardId);

    if (isFirstTime) {
      // 延遲播放，讓翻卡音效先響
      setTimeout(() => {
        // 傳說卡播放特殊音效和BGM，並顯示傳說卡動畫
        if (rarity === 'legendary') {
          playSound('legendary');
          playBGM('legendary');

          // 顯示傳說卡光效動畫
          const legendaryCard = cardMap.get(cardId);
          if (legendaryCard) {
            setTimeout(() => {
              showLegendaryAnimation(legendaryCard);
            }, 500);
          }
        }
        playNewCardSound(starCount);
      }, 300);
    }
  }

  function flipAllCards() {
    // Check if button is in "draw again" mode
    if (DOM.flipAllBtn.classList.contains('draw-again')) {
      // Re-draw cards directly
      closeOverlay();
      setTimeout(() => {
        openPack();
      }, 100);
      return;
    }

    const cards = DOM.cardsContainer.querySelectorAll('.card:not(.flipped)');
    if (cards.length === 0) {
      // All cards already flipped, change to draw again mode
      changeToDrawAgainMode();
      return;
    }

    playSound('cardFlipAll');
    DOM.flipAllBtn.disabled = true;

    // Collect all cards info first
    const cardsInfo = Array.from(cards).map(card => ({
      element: card,
      isFirstTime: card.dataset.isFirstTime === '1',
      starCount: parseInt(card.dataset.starCount) || 1,
      rarity: card.dataset.rarity
    }));

    // Find indices of new cards
    const newCardIndices = cardsInfo
      .map((info, idx) => info.isFirstTime ? idx : -1)
      .filter(idx => idx !== -1);

    let currentIndex = 0;
    let maxStarCount = 0;
    let hasLegendary = false;

    function flipNextCard() {
      if (currentIndex >= cardsInfo.length) {
        // All cards flipped, play final sound if needed
        setTimeout(() => {
          changeToDrawAgainMode();
        }, 300);
        return;
      }

      const cardInfo = cardsInfo[currentIndex];
      cardInfo.element.classList.add('flipped');

      if (cardInfo.isFirstTime) {
        // This is a new card - pause and play sound
        if (cardInfo.starCount > maxStarCount) maxStarCount = cardInfo.starCount;
        if (cardInfo.rarity === 'legendary') hasLegendary = true;

        // Play sound for this new card
        setTimeout(() => {
          if (cardInfo.rarity === 'legendary') {
            playSound('legendary');
            playBGM('legendary');

            // 顯示傳說卡光效動畫
            const cardId = parseInt(cardInfo.element.dataset.cardId);
            const legendaryCard = cardMap.get(cardId);
            if (legendaryCard) {
              setTimeout(() => {
                showLegendaryAnimation(legendaryCard);
              }, 500);
            }
          }
          playNewCardSound(cardInfo.starCount);
        }, 300);

        // Wait longer for new card sound effect to finish
        currentIndex++;
        setTimeout(flipNextCard, 1200); // Longer pause for new cards
      } else {
        // Normal card - continue quickly
        currentIndex++;
        setTimeout(flipNextCard, 100);
      }
    }

    // Start flipping
    flipNextCard();
  }

  function changeToDrawAgainMode() {
    DOM.flipAllBtn.textContent = '再抽一次';
    DOM.flipAllBtn.classList.add('draw-again');
    DOM.flipAllBtn.disabled = false;
  }

  // ========================================
  // Card Detail Modal
  // ========================================
  function showCardDetail(cardId, sourceElement) {
    const card = cardMap.get(cardId);
    if (!card) return;

    DOM.cardDetail.innerHTML = templates.cardDetail(card);
    // 直接顯示正面，不需要翻回背面
    DOM.cardDetail.classList.add('flipped');

    // Path animation from source element
    const container = DOM.cardDetailOverlay.querySelector('.card-detail-container');
    if (sourceElement && container) {
      const rect = sourceElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate starting position (center of source element relative to viewport center)
      const startX = rect.left + rect.width / 2 - viewportWidth / 2;
      const startY = rect.top + rect.height / 2 - viewportHeight / 2;
      const startScale = Math.min(rect.width / 280, rect.height / 400, 0.5);

      container.style.setProperty('--start-x', `${startX}px`);
      container.style.setProperty('--start-y', `${startY}px`);
      container.style.setProperty('--start-scale', startScale);

      // Trigger animation
      container.classList.remove('animating');
      void container.offsetWidth; // Force reflow
      container.classList.add('animating');
    }

    DOM.cardDetailOverlay.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeCardDetail() {
    DOM.cardDetailOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ========================================
  // 事件綁定（使用事件委派）
  // ========================================
  function bindEvents() {
    // Navigation - 事件委派
    document.querySelector('.nav-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.nav-tab');
      if (tab) {
        playSound('navSwitch');
        switchPage(tab.dataset.page);
      }
    });

    // Volume control panel
    const volumeToggleBtn = document.getElementById('volumeToggleBtn');
    const volumeSliders = document.getElementById('volumeSliders');
    const volumeIcon = volumeToggleBtn.querySelector('.volume-icon');
    const bgmVolumeSlider = document.getElementById('bgmVolumeSlider');
    const sfxVolumeSlider = document.getElementById('sfxVolumeSlider');
    const bgmVolumeValue = document.getElementById('bgmVolumeValue');
    const sfxVolumeValue = document.getElementById('sfxVolumeValue');

    // Initialize slider values from config
    bgmVolumeSlider.value = Math.round(bgmVolume * 100);
    sfxVolumeSlider.value = Math.round(sfxVolume * 100);
    bgmVolumeValue.textContent = `${bgmVolumeSlider.value}%`;
    sfxVolumeValue.textContent = `${sfxVolumeSlider.value}%`;

    // Toggle volume panel visibility
    volumeToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      volumeSliders.classList.toggle('active');
      playSound('buttonClick');
    });

    // Close volume panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.volume-control-panel')) {
        volumeSliders.classList.remove('active');
      }
    });

    // BGM volume slider
    bgmVolumeSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      setBGMVolume(value / 100);
      bgmVolumeValue.textContent = `${value}%`;

      // Update icon based on volume
      if (value === 0) {
        volumeIcon.textContent = '🔇';
      } else if (value < 50) {
        volumeIcon.textContent = '🔉';
      } else {
        volumeIcon.textContent = '🔊';
      }
    });

    // SFX volume slider
    sfxVolumeSlider.addEventListener('input', (e) => {
      const value = parseInt(e.target.value);
      setSFXVolume(value / 100);
      sfxVolumeValue.textContent = `${value}%`;
    });

    // Update audio enabled states based on volume
    bgmVolumeSlider.addEventListener('change', () => {
      CONFIG.BGM.enabled = parseInt(bgmVolumeSlider.value) > 0;
      if (CONFIG.BGM.enabled && !currentBGM) {
        playBGM('lobby');
      }
    });

    sfxVolumeSlider.addEventListener('change', () => {
      CONFIG.SOUNDS.enabled = parseInt(sfxVolumeSlider.value) > 0;
    });

    // Pack grid - 事件委派
    DOM.packGrid.addEventListener('click', (e) => {
      const packCard = e.target.closest('.pack-card');
      if (packCard) {
        playSound('buttonClick');
        selectPack(packCard.dataset.packId);
      }
    });

    // Cards container - 事件委派（翻面或放大）
    DOM.cardsContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card) {
        const cardId = parseInt(card.dataset.cardId);
        if (!cardId) return;

        // 如果卡片還沒翻面，先翻面
        if (!card.classList.contains('flipped')) {
          flipCard(card);
        } else {
          // 已翻面，放大顯示
          playSound('cardEnlarge');
          showCardDetail(cardId, card);
        }
      }
    });

    // Collection grid - 事件委派（點擊放大）
    DOM.collectionGrid.addEventListener('click', (e) => {
      const item = e.target.closest('.collection-item');
      if (item && !item.classList.contains('locked')) {
        const cardId = parseInt(item.dataset.cardId);
        if (cardId) {
          playSound('cardEnlarge');
          showCardDetail(cardId, item);
        }
      }
    });

    // Card detail modal
    DOM.cardDetailOverlay.addEventListener('click', (e) => {
      if (e.target === DOM.cardDetailOverlay) {
        closeCardDetail();
      }
    });

    DOM.cardDetail.addEventListener('click', (e) => {
      e.stopPropagation();
      DOM.cardDetail.classList.toggle('flipped');
      playSound('cardFlip');
    });

    DOM.cardDetailClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCardDetail();
    });

    // Buttons
    DOM.openPackBtn.addEventListener('click', openPack);
    DOM.cardPack.addEventListener('click', openPack);
    DOM.closeOverlayBtn.addEventListener('click', closeOverlay);
    DOM.flipAllBtn.addEventListener('click', flipAllCards);
    DOM.backToLobbyBtn.addEventListener('click', () => {
      playSound('buttonClick');
      switchPage('lobby');
    });

    // ESC key to close modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.cardDetailOverlay.classList.contains('active')) {
          closeCardDetail();
        }
      }
    });

  }

  // ========================================
  // 傳說卡動畫（使用 CardEffects 模組）
  // ========================================

  function showLegendaryAnimation(card) {
    if (window.CardEffects) {
      window.CardEffects.showLegendaryAnimation(card);
    }
  }

  // ========================================
  // 啟動
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
