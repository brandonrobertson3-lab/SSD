export interface User {
  id: string;
  name: string;
}

export interface StartupProgram {
  id: string;
  name: string;
  publisher: string;
  path: string;
  enabled: boolean;
  impact: 'low' | 'medium' | 'high';
  category: 'essential' | 'bloatware' | 'gaming' | 'utility' | 'unknown';
  description: string;
}

export interface OptimizationSetting {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'visual' | 'network' | 'power' | 'storage';
  enabled: boolean;
  recommended: boolean;
  impact: string;
}

export interface SystemInfo {
  os: string;
  cpu: string;
  ram: string;
  gpu: string;
  storage: string;
}

export interface OptimizationResult {
  success: boolean;
  message: string;
  settingId: string;
}