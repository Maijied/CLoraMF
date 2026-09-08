export interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface WatchStatus {
  connected: boolean;
  battery: number;
  lastSync: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface GitRepo {
  name: string;
  branch: string;
  status: 'clean' | 'modified' | 'syncing';
  lastCommit: string;
}
