export interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  detail?: string;
}

export interface WatchStatus {
  connected: boolean;
  battery: number;
  lastSync: string;
  isCharging?: boolean;
  deviceName: string;
  firmwareVersion: string;
  bluetoothAddress: string;
  heartRateCurrent: number;
  stepsCurrent: number;
  caloriesCurrent: number;
  distanceKm: number;
  sleepHours: number;
  activeFaceId: string;
  storageUsedMb: number;
  storageTotalMb: number;
  bleRssi: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: AIActionPayload[];
  confidence?: number;
}

export interface AIActionPayload {
  type: 'git' | 'web' | 'cursor' | 'notification' | 'health_alert' | 'watchface' | 'app_install';
  title?: string;
  message?: string;
  command?: string;
  query?: string;
  instruction?: string;
  metric?: string;
  value?: number | string;
  targetId?: string;
}

export interface GitRepo {
  id: string;
  name: string;
  branch: string;
  status: 'clean' | 'modified' | 'syncing' | 'diverged';
  lastCommit: string;
  commitHash: string;
  author: string;
  aheadCount: number;
  behindCount: number;
  modifiedFiles: string[];
  untrackedFiles: string[];
}

export interface GitCommitInfo {
  hash: string;
  message: string;
  author: string;
  timestamp: number;
  tag?: string;
}

/* =========================================================================
   WATCH FACE TYPES
========================================================================= */
export type WatchFaceStyle = 'analog' | 'digital' | 'hybrid' | 'minimalist' | 'sport' | 'matrix' | 'elegant';

export type ComplicationType = 
  | 'time' 
  | 'date' 
  | 'weather' 
  | 'heart_rate' 
  | 'steps' 
  | 'battery' 
  | 'calories' 
  | 'distance' 
  | 'sleep' 
  | 'notifications' 
  | 'custom';

export interface Complication {
  id: string;
  type: ComplicationType;
  position: { x: number; y: number }; // percentage 0-100
  size: number;
  configurable: boolean;
  label?: string;
  value?: string;
  color?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

export interface WatchFace {
  id: string;
  name: string;
  author: string;
  version: string;
  resolution: { width: number; height: number };
  style: WatchFaceStyle;
  complications: Complication[];
  alwaysOnDisplay: boolean;
  animations: boolean;
  batteryEfficient: boolean;
  customFonts: string[];
  colorThemes: ColorTheme[];
  activeThemeId: string;
  isActive: boolean;
  installDate?: number;
  sizeBytes: number;
  previewUrl?: string;
  rating?: number;
  downloadsCount?: number;
  description?: string;
}

/* =========================================================================
   FIRMWARE & OTA TYPES
========================================================================= */
export type UpdateStage = 
  | 'CHECKING' 
  | 'DOWNLOADING' 
  | 'PREPARING' 
  | 'TRANSFERRING' 
  | 'VERIFYING' 
  | 'INSTALLING' 
  | 'COMPLETED' 
  | 'FAILED';

export interface UpdateDetails {
  totalBytes: number;
  transferredBytes: number;
  speedKbps: number;
  timeRemainingSec: number;
  currentChunk?: number;
  totalChunks?: number;
}

export interface FirmwareInfo {
  version: string;
  buildNumber: number;
  releaseDate: number;
  size: number;
  changelog: string[];
  criticalUpdate: boolean;
  minBatteryLevel: number;
  requiresCharging: boolean;
  estimatedInstallTimeMs: number;
  checksum: string;
  downloadUrl?: string;
}

export interface UpdateProgress {
  stage: UpdateStage;
  progress: number; // 0 to 1
  message: string;
  details: UpdateDetails;
  error?: string;
}

/* =========================================================================
   CUSTOM APP SDK TYPES
========================================================================= */
export type WatchPermission = 
  | 'heart_rate'
  | 'steps'
  | 'battery'
  | 'notifications'
  | 'bluetooth'
  | 'storage'
  | 'network'
  | 'location';

export type GraphType = 'line' | 'bar' | 'pie' | 'area';

export interface UIComponentText {
  type: 'text';
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  color: string;
  font?: string;
  isDynamic?: boolean;
  bindingKey?: string;
}

export interface UIComponentButton {
  type: 'button';
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onClickAction: string;
  color?: string;
  bgColor?: string;
}

export interface UIComponentImage {
  type: 'image';
  id: string;
  assetName: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UIComponentGraph {
  type: 'graph';
  id: string;
  dataProvider: string;
  x: number;
  y: number;
  width: number;
  height: number;
  graphType: GraphType;
  color?: string;
}

export interface UIComponentGauge {
  type: 'gauge';
  id: string;
  dataProvider: string;
  x: number;
  y: number;
  size: number;
  min: number;
  max: number;
  color?: string;
}

export type SDKUIComponent = 
  | UIComponentText 
  | UIComponentButton 
  | UIComponentImage 
  | UIComponentGraph
  | UIComponentGauge;

export interface SDKEventHandler {
  id: string;
  type: 'on_click' | 'on_data_update' | 'on_timer';
  componentId?: string;
  dataProvider?: string;
  intervalMs?: number;
  action: {
    type: 'open_app' | 'close_app' | 'navigate' | 'notification' | 'update_component' | 'toggle_vibration';
    appId?: string;
    title?: string;
    message?: string;
    targetComponentId?: string;
    property?: string;
    value?: string;
  };
}

export interface SDKDataProvider {
  id: string;
  type: 'heart_rate' | 'steps' | 'battery' | 'calories' | 'custom';
  name: string;
  updateIntervalMs: number;
  currentValue?: number | string;
}

export interface CustomAppPackage {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  sdkVersion: string;
  minWatchVersion: string;
  permissions: WatchPermission[];
  components: SDKUIComponent[];
  events: SDKEventHandler[];
  dataProviders: SDKDataProvider[];
  assets: string[];
  compiledBinarySize?: number;
  icon?: string;
  category?: string;
}

/* =========================================================================
   APP STORE TYPES
========================================================================= */
export type AppCategory = 
  | 'ALL'
  | 'HEALTH' 
  | 'FITNESS' 
  | 'PRODUCTIVITY' 
  | 'GAMES' 
  | 'UTILITIES' 
  | 'WEATHER' 
  | 'SOCIAL' 
  | 'DEVELOPER'
  | 'CUSTOM';

export interface StoreApp {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  rating: number;
  downloads: number;
  size: number;
  category: AppCategory;
  iconUrl: string;
  screenshots: string[];
  isInstalled: boolean;
  requiresSubscription: boolean;
  permissions: string[];
  changelog?: string;
  featured?: boolean;
}

export interface StoreReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: number;
  verifiedUser: boolean;
}

export interface DeveloperAccount {
  developerId: string;
  name: string;
  email: string;
  appsCount: number;
  totalDownloads: number;
  revenue: number;
  verified: boolean;
}

/* =========================================================================
   BLE PROTOCOL TYPES
========================================================================= */
export interface WatchNotificationPayload {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  appId?: string;
  urgency?: 'low' | 'normal' | 'high';
  read?: boolean;
}

export interface BLEPacketLog {
  id: string;
  direction: 'TX' | 'RX';
  serviceKey: string;
  characteristicKey: string;
  dataHex: string;
  decoded: string;
  timestamp: string;
}

/* =========================================================================
   CI/CD PIPELINE & ARTIFACT TYPES
========================================================================= */
export type PipelineStatus = 'idle' | 'queued' | 'running' | 'success' | 'failed';

export interface PipelineStep {
  id: string;
  name: string;
  command: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  durationMs?: number;
  logs: string[];
}

export interface BuildArtifact {
  id: string;
  name: string;
  filename: string;
  sizeBytes: number;
  format: 'apk' | 'bin' | 'zip' | 'wapp' | 'json';
  type: 'companion_app' | 'firmware' | 'sdk_bundle' | 'watchface_pack';
  checksum: string;
  version: string;
  downloadUrl?: string;
  description: string;
}

export interface WorkflowRun {
  id: string;
  workflowName: string;
  commitHash: string;
  commitMessage: string;
  branch: string;
  trigger: 'push' | 'pull_request' | 'manual' | 'auto_sync';
  status: PipelineStatus;
  startedAt: number;
  completedAt?: number;
  steps: PipelineStep[];
  artifacts: BuildArtifact[];
  environment: string;
}
