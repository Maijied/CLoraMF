import type { 
  WatchFace, 
  FirmwareInfo, 
  StoreApp, 
  StoreReview, 
  CustomAppPackage, 
  GitRepo, 
  GitCommitInfo 
} from './types';

export const CMF_COLORS = {
  orange: '#FF5C00',
  black: '#0A0A0C',
  darkGray: '#16181B',
  midGray: '#26292E',
  lightGray: '#8A8F98',
  white: '#FFFFFF',
  cyan: '#00F0FF',
  red: '#FF334B',
  green: '#00E676',
  yellow: '#FFD600',
  purple: '#A855F7'
};

export const INITIAL_WATCH_FACES: WatchFace[] = [
  {
    id: 'face_cmf_matrix_01',
    name: 'CMF Matrix Dot',
    author: 'Nothing CMF Design Lab',
    version: '2.1.0',
    resolution: { width: 466, height: 466 },
    style: 'matrix',
    isActive: true,
    alwaysOnDisplay: true,
    animations: true,
    batteryEfficient: true,
    sizeBytes: 142000,
    customFonts: ['Silkscreen', 'JetBrains Mono'],
    activeThemeId: 'theme_cmf_orange',
    rating: 4.9,
    downloadsCount: 48200,
    description: 'Iconic Nothing & CMF dot-matrix digital dial with live battery percentage arc and biometric status complication.',
    colorThemes: [
      {
        id: 'theme_cmf_orange',
        name: 'CMF Signature Orange',
        backgroundColor: '#090A0B',
        primaryColor: '#FF5C00',
        secondaryColor: '#FFFFFF',
        accentColor: '#FF5C00',
        textColor: '#FFFFFF'
      },
      {
        id: 'theme_matrix_green',
        name: 'Cyberpunk Terminal',
        backgroundColor: '#050D08',
        primaryColor: '#00E676',
        secondaryColor: '#B9F6CA',
        accentColor: '#00E676',
        textColor: '#FFFFFF'
      },
      {
        id: 'theme_monochrome',
        name: 'Stealth Noir',
        backgroundColor: '#000000',
        primaryColor: '#FFFFFF',
        secondaryColor: '#71717A',
        accentColor: '#A1A1AA',
        textColor: '#FFFFFF'
      }
    ],
    complications: [
      { id: 'c_time', type: 'time', position: { x: 50, y: 38 }, size: 36, configurable: true, label: 'TIME' },
      { id: 'c_date', type: 'date', position: { x: 50, y: 55 }, size: 14, configurable: true, label: 'DATE' },
      { id: 'c_hr', type: 'heart_rate', position: { x: 28, y: 72 }, size: 16, configurable: true, label: 'BPM', value: '74' },
      { id: 'c_steps', type: 'steps', position: { x: 72, y: 72 }, size: 16, configurable: true, label: 'STEPS', value: '8,432' },
      { id: 'c_bat', type: 'battery', position: { x: 50, y: 18 }, size: 12, configurable: true, label: 'BAT', value: '84%' }
    ]
  },
  {
    id: 'face_chrono_sport',
    name: 'Aero Chrono Pro',
    author: 'CMF Velocity Studio',
    version: '1.4.0',
    resolution: { width: 466, height: 466 },
    style: 'sport',
    isActive: false,
    alwaysOnDisplay: true,
    animations: true,
    batteryEfficient: false,
    sizeBytes: 284000,
    customFonts: ['Space Grotesk'],
    activeThemeId: 'theme_sport_crimson',
    rating: 4.8,
    downloadsCount: 31500,
    description: 'High-intensity tri-dial chronograph designed for runners and cyclists with real-time VO2 max & pace gauges.',
    colorThemes: [
      {
        id: 'theme_sport_crimson',
        name: 'Crimson Surge',
        backgroundColor: '#0D0D11',
        primaryColor: '#FF334B',
        secondaryColor: '#38BDF8',
        accentColor: '#FF5C00',
        textColor: '#FFFFFF'
      },
      {
        id: 'theme_sport_electric',
        name: 'Electric Cyan',
        backgroundColor: '#090E14',
        primaryColor: '#00F0FF',
        secondaryColor: '#FFD600',
        accentColor: '#00F0FF',
        textColor: '#FFFFFF'
      }
    ],
    complications: [
      { id: 'c_time', type: 'time', position: { x: 50, y: 50 }, size: 40, configurable: true },
      { id: 'c_calories', type: 'calories', position: { x: 25, y: 40 }, size: 14, configurable: true, value: '620 kcal' },
      { id: 'c_dist', type: 'distance', position: { x: 75, y: 40 }, size: 14, configurable: true, value: '5.8 km' },
      { id: 'c_hr', type: 'heart_rate', position: { x: 50, y: 78 }, size: 16, configurable: true, value: '128' }
    ]
  },
  {
    id: 'face_minimal_analog',
    name: 'Bauhaus Minimalist',
    author: 'Dieter Design Co.',
    version: '1.0.2',
    resolution: { width: 466, height: 466 },
    style: 'analog',
    isActive: false,
    alwaysOnDisplay: true,
    animations: true,
    batteryEfficient: true,
    sizeBytes: 98000,
    customFonts: ['JetBrains Mono'],
    activeThemeId: 'theme_bauhaus_clean',
    rating: 4.7,
    downloadsCount: 19400,
    description: 'Pure aesthetic precision with sweep second hand, geometric hour markers, and subtle floating complications.',
    colorThemes: [
      {
        id: 'theme_bauhaus_clean',
        name: 'Swiss White & Red',
        backgroundColor: '#111215',
        primaryColor: '#FFFFFF',
        secondaryColor: '#FF334B',
        accentColor: '#FF5C00',
        textColor: '#FFFFFF'
      },
      {
        id: 'theme_bauhaus_amber',
        name: 'Warm Amber Glass',
        backgroundColor: '#140E0A',
        primaryColor: '#F59E0B',
        secondaryColor: '#FCD34D',
        accentColor: '#F59E0B',
        textColor: '#FFFFFF'
      }
    ],
    complications: [
      { id: 'c_date', type: 'date', position: { x: 75, y: 50 }, size: 12, configurable: true },
      { id: 'c_bat', type: 'battery', position: { x: 50, y: 70 }, size: 12, configurable: true }
    ]
  },
  {
    id: 'face_glitch_vector',
    name: 'Glitch Cyber Vector',
    author: 'Kurogane Systems',
    version: '3.0.1',
    resolution: { width: 466, height: 466 },
    style: 'digital',
    isActive: false,
    alwaysOnDisplay: false,
    animations: true,
    batteryEfficient: false,
    sizeBytes: 310000,
    customFonts: ['Silkscreen'],
    activeThemeId: 'theme_cyber_neon',
    rating: 4.9,
    downloadsCount: 56100,
    description: 'Dynamic glitch aesthetics with CRT scanline flicker, audio spectrum visualizer, and hexadecimal memory addresses.',
    colorThemes: [
      {
        id: 'theme_cyber_neon',
        name: 'Cyberpunk 2099',
        backgroundColor: '#080511',
        primaryColor: '#E024C3',
        secondaryColor: '#00F0FF',
        accentColor: '#FFD600',
        textColor: '#FFFFFF'
      }
    ],
    complications: [
      { id: 'c_time', type: 'time', position: { x: 50, y: 35 }, size: 34, configurable: true },
      { id: 'c_hr', type: 'heart_rate', position: { x: 30, y: 65 }, size: 14, configurable: true },
      { id: 'c_steps', type: 'steps', position: { x: 70, y: 65 }, size: 14, configurable: true }
    ]
  }
];

export const LATEST_FIRMWARE_INFO: FirmwareInfo = {
  version: '1.5.0-PRO',
  buildNumber: 4210,
  releaseDate: Date.now() - 86400000 * 2, // 2 days ago
  size: 3840000, // 3.84 MB
  criticalUpdate: false,
  minBatteryLevel: 50,
  requiresCharging: true,
  estimatedInstallTimeMs: 180000, // 3 mins
  checksum: '7e9b41a8c9e50df2b86134b12389d44e59f20108a95ce5e6f3b0198cae4129b0',
  downloadUrl: 'https://cdn.cmf.tech/ota/v1.5.0-pro-firmware.bin',
  changelog: [
    '✨ Integrated Native AI Copilot Protocol over BLE v5.3',
    '⚡ 24% reduction in background AOD battery consumption',
    '🫀 Upgraded PPG dual-LED Heart Rate & SpO2 tracking algorithms',
    '📦 Added dynamic sandboxed bytecode runtime for Custom SDK Apps (.wapp)',
    '⌚ 60FPS ultra-smooth watchface UI rendering pipeline with v-sync',
    '🔄 Added automatic Git commit sync & IDE telemetry notifications',
    '🛡️ Enhanced SHA-256 binary validation and secure boot signature check'
  ]
};

export const INITIAL_STORE_APPS: StoreApp[] = [
  {
    id: 'app_pulse_analytics',
    name: 'PulseFlow Biometrics',
    author: 'BioTech Labs',
    description: 'Real-time continuous HRV (Heart Rate Variability), stress index calculations, and recovery stage analyzer with graphical charts directly on your watch.',
    version: '2.4.1',
    rating: 4.9,
    downloads: 42800,
    size: 420000,
    category: 'HEALTH',
    iconUrl: 'Heart',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80'
    ],
    isInstalled: true,
    requiresSubscription: false,
    permissions: ['heart_rate', 'bluetooth', 'storage', 'notifications'],
    featured: true,
    changelog: 'Added real-time anaerobic threshold calculation.'
  },
  {
    id: 'app_git_wrist_monitor',
    name: 'GitWrist CI/CD',
    author: 'DevOps Wear',
    description: 'Monitor your GitHub & GitLab pull requests, build statuses, commit logs, and trigger webhook deployments directly from your watch crown.',
    version: '1.2.0',
    rating: 4.8,
    downloads: 31200,
    size: 290000,
    category: 'DEVELOPER',
    iconUrl: 'GitBranch',
    screenshots: [
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=400&q=80'
    ],
    isInstalled: true,
    requiresSubscription: false,
    permissions: ['network', 'notifications', 'storage'],
    featured: true,
    changelog: 'Added branch commit inspection and diff summary.'
  },
  {
    id: 'app_pomodoro_haptic',
    name: 'Haptic Focus Timer',
    author: 'Minimal Flow Inc.',
    description: 'Tactile vibration-driven Pomodoro timer that keeps you focused without checking your screen. Features customizable intervals and break stats.',
    version: '3.0.2',
    rating: 4.7,
    downloads: 65100,
    size: 150000,
    category: 'PRODUCTIVITY',
    iconUrl: 'Clock',
    screenshots: [],
    isInstalled: false,
    requiresSubscription: false,
    permissions: ['notifications', 'battery'],
    featured: false
  },
  {
    id: 'app_voice_memo_ai',
    name: 'Whisper AI Voice Note',
    author: 'DeepMind Integrations',
    description: 'Record quick voice notes on watch mic with auto-transcription and smart summarization synced instantly to your companion dashboard.',
    version: '1.0.8',
    rating: 4.9,
    downloads: 18900,
    size: 580000,
    category: 'PRODUCTIVITY',
    iconUrl: 'MessageSquare',
    screenshots: [],
    isInstalled: false,
    requiresSubscription: false,
    permissions: ['network', 'storage', 'bluetooth'],
    featured: true
  },
  {
    id: 'app_cyber_pong',
    name: 'Cyber Pong Matrix',
    author: 'Retro Arcade',
    description: 'Ultra-fast responsive arcade pong game utilizing the watch crown rotational encoder for paddle physics.',
    version: '1.1.0',
    rating: 4.6,
    downloads: 52000,
    size: 340000,
    category: 'GAMES',
    iconUrl: 'Gamepad2',
    screenshots: [],
    isInstalled: false,
    requiresSubscription: false,
    permissions: ['storage'],
    featured: false
  },
  {
    id: 'app_meteo_hyperlocal',
    name: 'Nothing Weather Radar',
    author: 'CMF Core Services',
    description: 'Minute-by-minute precipitation radar, UV index, air quality index, and barometric pressure sensor readings.',
    version: '2.0.0',
    rating: 4.8,
    downloads: 91400,
    size: 260000,
    category: 'WEATHER',
    iconUrl: 'CloudRain',
    screenshots: [],
    isInstalled: true,
    requiresSubscription: false,
    permissions: ['location', 'network', 'notifications'],
    featured: false
  }
];

export const INITIAL_REVIEWS: Record<string, StoreReview[]> = {
  app_pulse_analytics: [
    {
      id: 'rev_1',
      userId: 'user_dev_42',
      userName: 'Alex Rivers',
      rating: 5,
      comment: 'Incredible accuracy during HIIT workouts. The HRV graph on the 466x466 AMOLED screen looks crisp and updates in real-time!',
      date: Date.now() - 86400000 * 3,
      verifiedUser: true
    },
    {
      id: 'rev_2',
      userId: 'user_sam',
      userName: 'Samantha Chen',
      rating: 4.8,
      comment: 'Very low battery drain compared to the official companion app. Love the CMF monochrome theme option.',
      date: Date.now() - 86400000 * 7,
      verifiedUser: true
    }
  ],
  app_git_wrist_monitor: [
    {
      id: 'rev_3',
      userId: 'user_kyle',
      userName: 'Kyle Henderson',
      rating: 5,
      comment: 'Deploying hotfixes and seeing CI pipeline green lights on my wrist while grabbing coffee is peak engineer experience.',
      date: Date.now() - 86400000 * 1,
      verifiedUser: true
    }
  ]
};

export const DEFAULT_SDK_PROJECT: CustomAppPackage = {
  id: 'app_custom_live_monitor',
  name: 'Dev Vitality HUD',
  version: '1.0.0',
  author: 'MD Shuvo',
  description: 'Custom real-time biometric HUD displaying live Heart Rate, Step milestones, and battery status with instant haptic alerts.',
  sdkVersion: '1.0.0',
  minWatchVersion: '1.0.0',
  permissions: ['heart_rate', 'steps', 'battery', 'notifications', 'bluetooth'],
  components: [
    {
      type: 'text',
      id: 'comp_title',
      text: 'DEV VITALITY',
      x: 50,
      y: 18,
      size: 16,
      color: '#FF5C00',
      font: 'Silkscreen'
    },
    {
      type: 'text',
      id: 'comp_hr_val',
      text: '74 BPM',
      x: 50,
      y: 38,
      size: 34,
      color: '#FFFFFF',
      font: 'JetBrains Mono',
      isDynamic: true,
      bindingKey: 'heart_rate'
    },
    {
      type: 'graph',
      id: 'comp_hr_graph',
      dataProvider: 'heart_rate',
      x: 15,
      y: 52,
      width: 70,
      height: 20,
      graphType: 'line',
      color: '#FF5C00'
    },
    {
      type: 'button',
      id: 'comp_btn_ping',
      text: 'PULSE LOG',
      x: 25,
      y: 78,
      width: 50,
      height: 12,
      onClickAction: 'action_ping_server',
      color: '#000000',
      bgColor: '#FF5C00'
    }
  ],
  events: [
    {
      id: 'evt_on_hr_update',
      type: 'on_data_update',
      dataProvider: 'heart_rate',
      action: {
        type: 'update_component',
        targetComponentId: 'comp_hr_val',
        property: 'text',
        value: '{value} BPM'
      }
    },
    {
      id: 'evt_on_btn_click',
      type: 'on_click',
      componentId: 'comp_btn_ping',
      action: {
        type: 'notification',
        title: 'VITALITY LOGGED',
        message: 'Telemetry synced with companion AI agent.'
      }
    }
  ],
  dataProviders: [
    {
      id: 'prov_hr',
      type: 'heart_rate',
      name: 'PPG Heart Rate Sensor',
      updateIntervalMs: 1000,
      currentValue: 74
    },
    {
      id: 'prov_steps',
      type: 'steps',
      name: '3-Axis Step Accelerometer',
      updateIntervalMs: 3000,
      currentValue: 8432
    },
    {
      id: 'prov_bat',
      type: 'battery',
      name: 'Battery Controller IC',
      updateIntervalMs: 10000,
      currentValue: 84
    }
  ],
  assets: ['icon_vital.png', 'logo_cmf.png'],
  compiledBinarySize: 68400
};

export const INITIAL_GIT_REPOS: GitRepo[] = [
  {
    id: 'repo_1',
    name: 'cmf-watch-ai-platform',
    branch: 'main',
    status: 'clean',
    lastCommit: 'feat: add OTA firmware updater and SDK builder',
    commitHash: '7e4b91f',
    author: 'mdshuvo',
    aheadCount: 0,
    behindCount: 0,
    modifiedFiles: ['src/App.tsx', 'server.ts', 'src/types.ts'],
    untrackedFiles: []
  },
  {
    id: 'repo_2',
    name: 'cmf-watch3-ble-protocol',
    branch: 'develop',
    status: 'modified',
    lastCommit: 'fix(ble): resolve packet buffer overflow in MTU chunking',
    commitHash: '3a19dc2',
    author: 'mdshuvo',
    aheadCount: 2,
    behindCount: 0,
    modifiedFiles: ['bluetooth/BLEManager.kt', 'bluetooth/WatchProtocol.kt'],
    untrackedFiles: ['docs/uuid_mapping.md']
  },
  {
    id: 'repo_3',
    name: 'watchface-dotmatrix-engine',
    branch: 'feature/glitch-shaders',
    status: 'syncing',
    lastCommit: 'refactor: vectorize custom silkscreen font rendering',
    commitHash: '9c88be4',
    author: 'mdshuvo',
    aheadCount: 1,
    behindCount: 1,
    modifiedFiles: ['engine/canvas.ts'],
    untrackedFiles: []
  }
];

export const INITIAL_COMMITS: GitCommitInfo[] = [
  {
    hash: '7e4b91f',
    message: 'feat: add OTA firmware updater and SDK builder',
    author: 'mdshuvo <mdshuvo40@gmail.com>',
    timestamp: Date.now() - 3600000 * 2,
    tag: 'v1.5.0'
  },
  {
    hash: '3a19dc2',
    message: 'fix(ble): resolve packet buffer overflow in MTU chunking',
    author: 'mdshuvo <mdshuvo40@gmail.com>',
    timestamp: Date.now() - 3600000 * 6
  },
  {
    hash: '9c88be4',
    message: 'refactor: vectorize custom silkscreen font rendering',
    author: 'mdshuvo <mdshuvo40@gmail.com>',
    timestamp: Date.now() - 3600000 * 18
  },
  {
    hash: '0d41e2b',
    message: 'feat: add Gemini 3.8 Flash action tool invocation bridge',
    author: 'mdshuvo <mdshuvo40@gmail.com>',
    timestamp: Date.now() - 86400000 * 2,
    tag: 'v1.4.2'
  }
];
