/**
 * ============================================
 * 資料設定檔 - DATA CONFIGURATION
 * ============================================
 *
 * 【如何添加卡包】
 * 在 PACKS 陣列中添加物件，格式如下：
 *
 * {
 *   id: 'unique_id',              // 唯一識別碼（英文小寫+底線）
 *   name: '卡包名稱',              // 大廳顯示名稱
 *   description: '描述文字',       // 大廳顯示描述
 *   brandTitle: 'LE SSERAFIM',    // 卡包品牌標題
 *   brandSub: 'ALBUM NAME',       // 卡包副標題
 *   packLabel: 'PHOTOCARD PACK',  // 卡包類型標籤
 *   cardCount: 5,                 // 每包抽取張數
 *   image: 'images/packs/xxx.jpg', // 預覽圖路徑（可選）
 *   emoji: '🦋',                  // 無圖時顯示的 emoji
 *   cards: [1, 2, 3]              // 包含的卡片 ID 陣列
 * }
 *
 * 【如何添加卡片】
 * 在 CARDS 陣列中添加物件，格式如下：
 *
 * {
 *   id: 1,                        // 唯一數字 ID
 *   nameChinese: '中文名',
 *   nameEnglish: 'English Name',
 *   nameKorean: '한국어',
 *   image: 'images/cards/xxx.jpg', // 照片路徑（可選）
 *   emoji: '🌸',                  // 無照片時的 emoji
 *   rarity: 'legendary'           // rare | epic | legendary
 * }
 *
 * 【音效設定】
 * 在 SOUNDS 區塊中配置音效，需準備以下音效檔案放入 sounds/ 資料夾：
 *
 * sounds/
 * ├── pack-open.mp3              // 卡包打開音效
 * ├── pack-tear.mp3              // 卡包撕開音效
 * ├── card-flip.mp3              // 單張翻卡音效
 * ├── card-flip-all.mp3          // 一次翻開音效
 * ├── card-enlarge.mp3           // 卡片放大音效
 * ├── new-card-1star.mp3         // 首抽 1 星卡音效
 * ├── new-card-2star.mp3         // 首抽 2 星卡音效
 * ├── new-card-3star.mp3         // 首抽 3 星卡音效
 * ├── new-card-4star.mp3         // 首抽 4 星卡音效
 * ├── new-card-5star.mp3         // 首抽 5 星卡音效
 * ├── new-card-6star.mp3         // 首抽 6 星卡音效
 * ├── new-card-7star.mp3         // 首抽 7 星卡音效
 * ├── button-click.mp3           // 按鈕點擊音效
 * ├── overlay-close.mp3          // 關閉覆蓋層音效
 * ├── nav-switch.mp3             // 導航切換音效
 * └── legendary.mp3              // 傳說卡特殊音效
 *
 * 可透過 enabled: false 關閉音效，或調整 volume (0.0-1.0) 控制音量
 */

const CONFIG = {
  // ========================================
  // 背景音樂設定
  // ========================================
  BGM: {
    enabled: true,           // 是否啟用背景音樂
    volume: 0.1,             // 背景音樂音量 (0.0 - 1.0)
    shuffle: true,           // 是否隨機播放（輪播列表）

    // 大廳 BGM 輪播列表（最多 10 首）
    lobby: [
      'sounds/bgm/AfterLIKE.mp3',
      'sounds/bgm/CAKE.mp3',
      'sounds/bgm/HOMESWEETHOME.mp3',
      'sounds/bgm/Queencard.mp3',
      'sounds/bgm/SHEESH.mp3',
      'sounds/bgm/SPAGHETTI.mp3',
      'sounds/bgm/SuperShy.mp3',
      'sounds/bgm/Drama.mp3',
      'sounds/bgm/Baddie.mp3',
    ],

    // 圖鑑 BGM 輪播列表（最多 10 首）
    collection: [
      'sounds/bgm/Supernova.mp3',
      'sounds/bgm/Allergy.mp3',
      'sounds/bgm/NoCelestial.mp3',
      'sounds/bgm/FIESTA.mp3',
      'sounds/bgm/UNFORGIVEN.mp3',
      'sounds/bgm/Bubble.mp3',
      'sounds/bgm/Cupid.mp3',
      'sounds/bgm/The Feels.mp3',
    ],

  },

  // ========================================
  // 音效設定
  // ========================================
  SOUNDS: {
    enabled: true,           // 是否啟用音效
    volume: 0.5,             // 音量 (0.0 - 1.0)

    // 音效檔案路徑（放置於 sounds/ 資料夾）
    files: {
      // 開卡包音效
      packOpen: 'sounds/pack-open.m4a',
      packTear: 'sounds/pack-tear.m4a',

      // 翻卡片音效
      cardFlip: 'sounds/card-flip.mp3',
      cardFlipAll: 'sounds/card-flip-all.m4a',

      // 首次抽到卡片音效（依星數）
      newCard1Star: 'sounds/new-card-1star.mp3',
      newCard2Star: 'sounds/new-card-2star.mp3',
      newCard3Star: 'sounds/new-card-3star.mp3',
      newCard4Star: 'sounds/new-card-4star.mp3',
      newCard5Star: 'sounds/new-card-5star.mp3',
      newCard6Star: 'sounds/new-card-6star.mp3',
      newCard7Star: 'sounds/new-card-7star.mp3',

      // 其他音效
      buttonClick: 'sounds/button-click.mp3',
      cardEnlarge: 'sounds/card-enlarge.mp3',
      overlayClose: 'sounds/overlay-close.mp3',
      navSwitch: 'sounds/nav-switch.mp3',
      legendary: 'sounds/legendary.mp3',      // 傳說卡特殊音效
    },
    volumes: {
      packOpen: 0.1,           // 卡包打開音效較小聲
      packTear: 0.8,           // 卡包撕開音效正常
      cardFlip: 0.5,           // 翻卡音效較小聲
      cardFlipAll: 1.0,        // 一次翻開音效
      newCard7Star: 0.5,       // 7星卡音效最大聲
      legendary: 0.5,          // 傳說卡音效最大聲
      buttonClick: 0.1,        // 按鈕點擊音效很小聲
      // 其他未列出的音效會使用預設 0.8
    }
  },

  // ========================================
  // 稀有度設定
  // ========================================
  RARITY: {
    WEIGHTS: {
      normal: 40,
      common: 25,
      rare: 15,
      superrare: 10,
      ultrarare: 6,
      epic: 3,
      legendary: 1,
    },
    TEXT: {
      normal: 'N',
      common: 'R',
      rare: 'SR',
      superrare: 'SSR',
      ultrarare: 'UR',
      epic: 'EPIC',
      legendary: 'LR'
    },
    // 星星數量
    STARS: {
      normal: 1,
      common: 2,
      rare: 3,
      superrare: 4,
      ultrarare: 5,
      epic: 6,
      legendary: 7
    },
    // 字體顏色（可自訂）
    COLORS: {
      normal: '#8B8B8B',
      common: '#3A9D6A',
      rare: '#2AAFAF',
      superrare: '#E8A020',
      ultrarare: '#E06050',
      epic: '#C82020',
      legendary: '#FFD700'
    }
  },

  // ========================================
  // 系列分類（用於圖鑑分組）
  // ========================================
  SERIES: [
    { id: 'fearless', name: 'FEARLESS COLLECTION', order: 1 },
    { id: 'antifragile', name: 'ANTIFRAGILE COLLECTION', order: 2 },
    { id: 'unforgiven', name: 'UNFORGIVEN COLLECTION', order: 3 },
    { id: 'perfectnight', name: 'PERFECTNIGHT COLLECTION', order: 4 },
    { id: 'crazy', name: 'CRAZY COLLECTION', order: 5 },
    { id: 'ex', name: 'EX LESSERAFIM COLLECTION', order: 6 },
    { id: 'next', name: 'NEXTLEVEL COLLECTION', order: 7 },
    { id: 'savage', name: 'SAVAGE COLLECTION', order: 8},
    { id: 'drama', name: 'DRAMA COLLECTION', order: 9 },
    { id: 'arma', name: 'ARMAGEDDON COLLECTION', order: 10 },
    { id: 'ex-aespa', name: 'EX AESPA COLLECTION', order: 11 },
    { id: 'newjeans', name: 'EX NEWJEANS COLLECTION', order: 12 },
    { id: 'howsweet', name: 'HOW SWEET COLLECTION', order: 13 },
    { id: 'omg', name: 'OMG COLLECTION', order: 14 },
    { id: 'getup', name: 'GET UP COLLECTION', order: 15 },
    
    { id: 'itzyI', name: 'itzy I COLLECTION', order: 20 },
    { id: 'itzyII', name: 'itzy II COLLECTION', order: 21 },
  ],

  // ========================================
  // 卡包資料    
  // ========================================
  PACKS: [
    {
      id: 'lesserafim',
      name: 'LESSERAFIM START',
      description: '內含2022-2024期間的LESSERAFIM',
      brandTitle: 'LE SSERAFIM',
      brandSub: '-START-',
      packLabel: '2022-2024',
      cardCount: 10,
      image: 'images/packs/lesserafim.jpg',
      emoji: '💜',
      bgm: 'sounds/bgm/FEARLESS.mp3',  // 卡包專屬 BGM
      cards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    },
    {
      id: 'itzyI',
      name: 'ITZY-I',
      description: '每位成員有4張卡片',
      brandTitle: 'ITZY',
      brandSub: '*+special+*',
      packLabel: '',
      cardCount: 10,
      image: 'images/packs/itzy-1.jpg',
      emoji: '',
      bgm: 'sounds/bgm/WANNABE.mp3',  // 卡包專屬 BGM
      cards: [31, 32, 33, 34 ,35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
    },
    {
      id: 'aespa',
      name: 'AESPA-I',
      description: 'DRAMA、NEXTLEVEL、SAVAGE、ARMAGEDDON',
      brandTitle: 'AESPA',
      brandSub: '',
      packLabel: 'first',
      cardCount: 10,
      image: 'images/packs/aespa-1.jpg',
      emoji: '',
      bgm: 'sounds/bgm/NextLevel.mp3',  // 卡包專屬 BGM
      cards: [51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70]
    },
    {
      id: 'newjeans',
      name: 'NEWJEANS-I',
      description: 'HOWSWEET、OMG、GETUP',
      brandTitle: 'NEWJEANS',
      brandSub: '',
      packLabel: 'first',
      cardCount: 10,
      image: 'images/packs/newjeans-1.jpg',
      emoji: '',
      bgm:'sounds/bgm/OMG.mp3',  // 卡包專屬 BGM
      cards: [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
    },
    {
      id: 'itzyII',
      name: 'ITZY-II',
      description: '失去理智',
      brandTitle: 'ITZY',
      brandSub: '*+Curated+*',
      packLabel: '',
      cardCount: 10,
      image: 'images/packs/itzy-2.jpg',
      emoji: '',
      bgm: 'sounds/bgm/TUNNELVISION.mp3',  // 卡包專屬 BGM
      cards: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115]
    },
  ],

  // ========================================
  // 卡片資料
  // ========================================
  CARDS: [
    // ===== ANTIFRAGILE 系列 =====
    { id: 1, nameChinese: '金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/antifragile-chaewon.jpg', rarity: 'epic', series: 'antifragile' },
    { id: 2, nameChinese: '宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/antifragile-sakura.jpg', rarity: 'common', series: 'antifragile' },
    { id: 3, nameChinese: '許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/antifragile-yunjin.jpg', rarity: 'ultrarare', series: 'antifragile' },
    { id: 4, nameChinese: '中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/antifragile-kazuha.jpg', rarity: 'superrare', series: 'antifragile' },
    { id: 5, nameChinese: '洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/antifragile-eunchae.jpg', rarity: 'rare', series: 'antifragile' },

    // ===== FEARLESS 系列 =====
    { id: 6, nameChinese: '宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/fearless-sakura.jpg', rarity: 'common', series: 'fearless' },
    { id: 7, nameChinese: '許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/fearless-yunjin.jpg', rarity: 'superrare', series: 'fearless' },
    { id: 8, nameChinese: '中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/fearless-kazuha.jpg', rarity: 'rare', series: 'fearless' },
    { id: 9, nameChinese: '洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/fearless-eunchae.jpg', rarity: 'normal', series: 'fearless' },
    { id: 10, nameChinese: '金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/fearless-chaewon.jpg', rarity: 'ultrarare', series: 'fearless' },

    // ===== UNFORGIVEN 系列 =====
    { id: 11, nameChinese: '許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/unforgiven-yunjin.jpg', rarity: 'epic', series: 'unforgiven' },
    { id: 12, nameChinese: '中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/unforgiven-kazuha.jpg', rarity: 'superrare', series: 'unforgiven' },
    { id: 13, nameChinese: '洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/unforgiven-eunchae.jpg', rarity: 'rare', series: 'unforgiven' },
    { id: 14, nameChinese: '宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/unforgiven-sakura.jpg', rarity: 'common', series: 'unforgiven' },
    { id: 15, nameChinese: '金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/unforgiven-chaewon.jpg', rarity: 'ultrarare', series: 'unforgiven' },

    // ===== CRAZY 系列 =====
    { id: 16, nameChinese: '宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/crazy-sakura.jpg', rarity: 'epic', series: 'crazy' },
    { id: 17, nameChinese: '許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/crazy-yunjin.jpg', rarity: 'normal', series: 'crazy' },
    { id: 18, nameChinese: '中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/crazy-kazuha.jpg', rarity: 'common', series: 'crazy' },
    { id: 19, nameChinese: '洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/crazy-eunchae.jpg', rarity: 'rare', series: 'crazy' },
    { id: 20, nameChinese: '金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/crazy-chaewon.jpg', rarity: 'superrare', series: 'crazy' },

    // ===== PERFECT NIGHT 系列 =====
    { id: 21, nameChinese: '宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/perfectnight-sakura.jpg', rarity: 'superrare', series: 'perfectnight' },
    { id: 22, nameChinese: '許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/perfectnight-yunjin.jpg', rarity: 'rare', series: 'perfectnight' },
    { id: 23, nameChinese: '中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/perfectnight-kazuha.jpg', rarity: 'epic', series: 'perfectnight' },
    { id: 24, nameChinese: '洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/perfectnight-eunchae.jpg', rarity: 'common', series: 'perfectnight' },
    { id: 25, nameChinese: '金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/perfectnight-chaewon.jpg', rarity: 'ultrarare', series: 'perfectnight' },

    // ===== EX COLLECTION 系列 =====
    { id: 26, nameChinese: 'CRAZY 宮脇咲良', nameEnglish: 'Sakura Miyawaki', nameKorean: '미야와키 사쿠라', image: 'images/cards/lesserafim/EX_CRAZY-SAKURA.gif', rarity: 'legendary', series: 'ex' },
    { id: 27, nameChinese: 'FEARLESS 許允眞', nameEnglish: 'Huh Yunjin', nameKorean: '허윤진', image: 'images/cards/lesserafim/EX_FEARLESS-YUNJIN.gif', rarity: 'legendary', series: 'ex' },
    { id: 28, nameChinese: 'UNFORGIVEN 中村一葉', nameEnglish: 'Kazuha Nakamura', nameKorean: '나카무라 카즈하', image: 'images/cards/lesserafim/EX_UNFORGIVEN-KAZUHA.gif', rarity: 'legendary', series: 'ex' },
    { id: 29, nameChinese: 'UNFORGIVEN 洪恩采', nameEnglish: 'Hong Eunchae', nameKorean: '홍은채', image: 'images/cards/lesserafim/EX_UNFORGIVEN-EUNCHAE.gif', rarity: 'legendary', series: 'ex' },
    { id: 30, nameChinese: 'FEARLESS 金采源', nameEnglish: 'Kim Chaewon', nameKorean: '김채원', image: 'images/cards/lesserafim/EX_FEARLESS-CHAEWON.gif', rarity: 'legendary', series: 'ex' },
    
    // ===== ITZY 系列 =====
    { id: 31, nameChinese: 'WATERBOMB 黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy/EX-YEJI.gif', rarity: 'legendary', series: 'itzyI' },
    { id: 32, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy/lia01.jpg', rarity: 'superrare', series: 'itzyI' },
    { id: 33, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy/EX-ryujin.gif', rarity: 'epic', series: 'itzyI' },
    { id: 34, nameChinese: 'SBS 李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy/EX-CHAEYEONG.gif', rarity: 'legendary', series: 'itzyI' },
    { id: 35, nameChinese: '2021 W-KPOP 申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy/EX-YUNA.gif', rarity: 'legendary', series: 'itzyI' },
    { id: 36, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy/yeji01.jpg', rarity: 'superrare', series: 'itzyI' },
    { id: 37, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy/lia02.jpg', rarity: 'epic', series: 'itzyI' },
    { id: 38, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy/ryujin01.jpg', rarity: 'superrare', series: 'itzyI' },
    { id: 39, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy/chaeryeong01.jpg', rarity: 'epic', series: 'itzyI' },
    { id: 40, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy/yuna01.jpg', rarity: 'superrare', series: 'itzyI' },
    { id: 41, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy/yeji02.jpg', rarity: 'epic', series: 'itzyI' },
    { id: 42, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy/lia03.jpg', rarity: 'normal', series: 'itzyI' },
    { id: 43, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy/ryujin02.jpg', rarity: 'rare', series: 'itzyI' },
    { id: 44, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy/chaeryeong02.jpg', rarity: 'ultrarare', series: 'itzyI' },
    { id: 45, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy/yuna02.jpg', rarity: 'ultrarare', series: 'itzyI' },
    { id: 46, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy/yeji03.jpg', rarity: 'ultrarare', series: 'itzyI' },
    { id: 47, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy/lia04.jpg', rarity: 'rare', series: 'itzyI' },
    { id: 48, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy/ryujin03.jpg', rarity: 'common', series: 'itzyI' },
    { id: 49, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy/chaeryeong03.jpg', rarity: 'common', series: 'itzyI' },
    { id: 50, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy/yuna03.jpg', rarity: 'epic', series: 'itzyI' },


    // ===== DRAMA 系列 =====
    { id: 51, nameChinese: 'DRAMA 劉知珉', nameEnglish: 'Karina', nameKorean: '유지민', image: 'images/cards/aespa/Karina01.gif', rarity: 'legendary', series: 'drama' },
    { id: 52, nameChinese: '金枝利', nameEnglish: 'Giselle', nameKorean: '김애리', image: 'images/cards/aespa/Giselle01.jpg', rarity: 'superrare', series: 'drama' },
    { id: 53, nameChinese: '金旼炡', nameEnglish: 'Winter', nameKorean: '김민정', image: 'images/cards/aespa/Winter01.jpg', rarity: 'epic', series: 'drama' },
    { id: 54, nameChinese: '寧藝卓', nameEnglish: 'Ningning', nameKorean: '닝이줘', image: 'images/cards/aespa/Ningning01.jpg', rarity: 'superrare', series: 'drama' },
    // ===== NEXTLEVEL 系列 =====
    { id: 55, nameChinese: '劉知珉', nameEnglish: 'Karina', nameKorean: '유지민', image: 'images/cards/aespa/Karina02.jpg', rarity: 'superrare', series: 'next' },
    { id: 56, nameChinese: '金枝利', nameEnglish: 'Giselle', nameKorean: '김애리', image: 'images/cards/aespa/Giselle02.jpg', rarity: 'common', series: 'next' },
    { id: 57, nameChinese: '金旼炡', nameEnglish: 'Winter', nameKorean: '김민정', image: 'images/cards/aespa/Winter02.jpg', rarity: 'rare', series: 'next' },
    { id: 58, nameChinese: '寧藝卓', nameEnglish: 'Ningning', nameKorean: '닝이줘', image: 'images/cards/aespa/Ningning02.jpg', rarity: 'normal', series: 'next' },
    // ===== SAVAGE 系列 =====
    { id: 59, nameChinese: '劉知珉', nameEnglish: 'Karina', nameKorean: '유지민', image: 'images/cards/aespa/Karina03.jpg', rarity: 'ultrarare', series: 'savage' },
    { id: 60, nameChinese: '金枝利', nameEnglish: 'Giselle', nameKorean: '김애리', image: 'images/cards/aespa/Giselle03.jpg', rarity: 'common', series: 'savage' },
    { id: 61, nameChinese: '金旼炡', nameEnglish: 'Winter', nameKorean: '김민정', image: 'images/cards/aespa/Winter03.jpg', rarity: 'epic', series: 'savage' },
    { id: 62, nameChinese: '寧藝卓', nameEnglish: 'Ningning', nameKorean: '닝이줘', image: 'images/cards/aespa/Ningning03.jpg', rarity: 'rare', series: 'savage' },
    // ===== ARMAGEDDON 系列 =====
    { id: 63, nameChinese: '劉知珉', nameEnglish: 'Karina', nameKorean: '유지민', image: 'images/cards/aespa/Karina04.jpg', rarity: 'ultrarare', series: 'arma' },
    { id: 64, nameChinese: '金枝利', nameEnglish: 'Giselle', nameKorean: '김애리', image: 'images/cards/aespa/Giselle04.jpg', rarity: 'superrare', series: 'arma' },
    { id: 65, nameChinese: '金旼炡', nameEnglish: 'Winter', nameKorean: '김민정', image: 'images/cards/aespa/Winter04.jpg', rarity: 'common', series: 'arma' },
    { id: 66, nameChinese: '寧藝卓', nameEnglish: 'Ningning', nameKorean: '닝이줘', image: 'images/cards/aespa/Ningning04.jpg', rarity: 'ultrarare', series: 'arma' },
    // ===== EX 系列 =====
    { id: 67, nameChinese: 'SALTY&SWEET 劉知珉', nameEnglish: 'Karina', nameKorean: '유지민', image: 'images/cards/aespa/Karina.gif', rarity: 'legendary', series: 'ex-aespa' },
    { id: 68, nameChinese: 'DIRTYWORK 金枝利', nameEnglish: 'Giselle', nameKorean: '김애리', image: 'images/cards/aespa/Giselle.gif', rarity: 'legendary', series: 'ex-aespa' },
    { id: 69, nameChinese: 'SUPERNOVA 金旼炡', nameEnglish: 'Winter', nameKorean: '김민정', image: 'images/cards/aespa/Winter.gif', rarity: 'legendary', series: 'ex-aespa' },
    { id: 70, nameChinese: 'W-KOREA 寧藝卓', nameEnglish: 'Ningning', nameKorean: '닝이줘', image: 'images/cards/aespa/Ningning.gif', rarity: 'legendary', series: 'ex-aespa' },


   // ===== EX 系列 =====
    { id: 75, nameChinese: 'ZERO 范玉欣', nameEnglish: 'Hanni', nameKorean: '하니', image: 'images/cards/newjeans/hanni.gif', rarity: 'legendary', series: 'newjeans' },    
    { id: 83, nameChinese: 'NEWJEANS 姜諧潾', nameEnglish: 'Haerin', nameKorean: '강해린', image: 'images/cards/newjeans/haerin.gif', rarity: 'legendary', series: 'newjeans' },
    { id: 79, nameChinese: 'OMG 牟智慧', nameEnglish: 'Danielle', nameKorean: '모지혜', image: 'images/cards/newjeans/danielle.gif', rarity: 'legendary', series: 'newjeans' },
    { id: 87, nameChinese: 'HYPEBOY 李惠仁', nameEnglish: 'Hyein', nameKorean: '이혜인', image: 'images/cards/newjeans/hyein.gif', rarity: 'legendary', series: 'newjeans' },
    { id: 74, nameChinese: 'KORF 金玟池', nameEnglish: 'Minji', nameKorean: '김민지', image: 'images/cards/newjeans/minji.gif', rarity: 'legendary', series: 'newjeans' },
   // ===== How Sweet 系列 =====
    { id: 71, nameChinese: '金玟池', nameEnglish: 'Minji', nameKorean: '김민지', image: 'images/cards/newjeans/minji01.jpg', rarity: 'superrare', series: 'howsweet' },
    { id: 76, nameChinese: '范玉欣', nameEnglish: 'Hanni', nameKorean: '하니', image: 'images/cards/newjeans/hanni01.jpg', rarity: 'ultrarare', series: 'howsweet' },
    { id: 80, nameChinese: '牟智慧', nameEnglish: 'Danielle', nameKorean: '모지혜', image: 'images/cards/newjeans/danielle01.jpg', rarity: 'ultrarare', series: 'howsweet' },
    { id: 84, nameChinese: '姜諧潾', nameEnglish: 'Haerin', nameKorean: '강해린', image: 'images/cards/newjeans/haerin01.jpg', rarity: 'epic', series: 'howsweet' },
    { id: 88, nameChinese: '李惠仁', nameEnglish: 'Hyein', nameKorean: '이혜인', image: 'images/cards/newjeans/hyein01.jpg', rarity: 'normal', series: 'howsweet' },
   // ===== OMG 系列 =====
    { id: 72, nameChinese: '金玟池', nameEnglish: 'Minji', nameKorean: '김민지', image: 'images/cards/newjeans/minji02.jpg', rarity: 'ultrarare', series: 'omg' },
    { id: 77, nameChinese: '范玉欣', nameEnglish: 'Hanni', nameKorean: '하니', image: 'images/cards/newjeans/hanni02.jpg', rarity: 'common', series: 'omg' },
    { id: 81, nameChinese: '牟智慧', nameEnglish: 'Danielle', nameKorean: '모지혜', image: 'images/cards/newjeans/danielle02.jpg', rarity: 'rare', series: 'omg' },
    { id: 85, nameChinese: '姜諧潾', nameEnglish: 'Haerin', nameKorean: '강해린', image: 'images/cards/newjeans/haerin02.jpg', rarity: 'epic', series: 'omg' },
    { id: 89, nameChinese: '李惠仁', nameEnglish: 'Hyein', nameKorean: '이혜인', image: 'images/cards/newjeans/hyein02.jpg', rarity: 'superrare', series: 'omg' },
    // ===== Get Up 系列 =====
    { id: 73, nameChinese: '金玟池', nameEnglish: 'Minji', nameKorean: '김민지', image: 'images/cards/newjeans/minji03.jpg', rarity: 'epic', series: 'getup' },
    { id: 82, nameChinese: '牟智慧', nameEnglish: 'Danielle', nameKorean: '모지혜', image: 'images/cards/newjeans/danielle03.jpg', rarity: 'normal', series: 'getup' },
    { id: 78, nameChinese: '范玉欣', nameEnglish: 'Hanni', nameKorean: '하니', image: 'images/cards/newjeans/hanni03.jpg', rarity: 'ultrarare', series: 'getup' },
    { id: 86, nameChinese: '姜諧潾', nameEnglish: 'Haerin', nameKorean: '강해린', image: 'images/cards/newjeans/haerin03.jpg', rarity: 'superrare', series: 'getup' },
    { id: 90, nameChinese: '李惠仁', nameEnglish: 'Hyein', nameKorean: '이혜인', image: 'images/cards/newjeans/hyein03.jpg', rarity: 'common', series: 'getup' },

    // ===== ITZY 2 系列 =====
    { id: 91, nameChinese: 'KISS 黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy2/YEJI.gif', rarity: 'legendary', series: 'itzyII' },
    { id: 92, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy2/yeji01.jpg', rarity: 'epic', series: 'itzyII' },
    { id: 93, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy2/yeji02.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 94, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy2/yeji03.jpg', rarity: 'rare', series: 'itzyII' },
    { id: 95, nameChinese: '黃禮志', nameEnglish: 'Yeji', nameKorean: '황예지', image: 'images/cards/itzy2/yeji04.jpg', rarity: 'normal', series: 'itzyII' },
    { id: 96, nameChinese: 'ITM 崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy2/LIA.gif', rarity: 'legendary', series: 'itzyII' },
    { id: 97, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy2/lia01.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 98, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy2/lia02.jpg', rarity: 'superrare', series: 'itzyII' },
    { id: 99, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy2/lia03.jpg', rarity: 'common', series: 'itzyII' },
    { id: 100, nameChinese: '崔智壽', nameEnglish: 'Lia', nameKorean: '최지수', image: 'images/cards/itzy2/lia04.jpg', rarity: 'normal', series: 'itzyII' },
    { id: 101, nameChinese: 'SMILE 申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy2/RYUJIN.gif', rarity: 'legendary', series: 'itzyII' },
    { id: 102, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy2/ryujin01.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 103, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy2/ryujin02.jpg', rarity: 'superrare', series: 'itzyII' },
    { id: 104, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy2/ryujin03.jpg', rarity: 'rare', series: 'itzyII' },
    { id: 105, nameChinese: '申留眞', nameEnglish: 'Ryujin', nameKorean: '신류진', image: 'images/cards/itzy2/ryujin04.jpg', rarity: 'common', series: 'itzyII' },
    { id: 106, nameChinese: 'TUNNELVISION 李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy2/CHAERYEONG.gif', rarity: 'legendary', series: 'itzyII' },
    { id: 107, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy2/chaeryeong01.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 108, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy2/chaeryeong02.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 109, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy2/chaeryeong03.jpg', rarity: 'rare', series: 'itzyII' },
    { id: 110, nameChinese: '李彩領', nameEnglish: 'Chaeryeong', nameKorean: '이채령', image: 'images/cards/itzy2/chaeryeong04.jpg', rarity: 'common', series: 'itzyII' },
    { id: 111, nameChinese: 'WIGGLE 申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy2/YUNA.gif', rarity: 'legendary', series: 'itzyII' },
    { id: 112, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy2/yuna01.jpg', rarity: 'ultrarare', series: 'itzyII' },
    { id: 113, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy2/yuna02.jpg', rarity: 'superrare', series: 'itzyII' },
    { id: 114, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy2/yuna03.jpg', rarity: 'common', series: 'itzyII' },
    { id: 115, nameChinese: '申有娜', nameEnglish: 'Yuna', nameKorean: '신유나', image: 'images/cards/itzy2/yuna04.jpg', rarity: 'normal', series: 'itzyII' },




  ]

};
