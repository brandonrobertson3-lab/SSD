import type { StartupProgram, OptimizationSetting, SystemInfo, OptimizationResult } from '@shared/types';

// Sample startup programs data (simulates Windows registry/startup entries)
const startupPrograms: StartupProgram[] = [
  {
    id: '1',
    name: 'Microsoft Teams',
    publisher: 'Microsoft Corporation',
    path: 'C:\\Users\\AppData\\Local\\Microsoft\\Teams\\Update.exe',
    enabled: true,
    impact: 'high',
    category: 'utility',
    description: 'Collaboration and messaging application'
  },
  {
    id: '2',
    name: 'Spotify',
    publisher: 'Spotify AB',
    path: 'C:\\Users\\AppData\\Roaming\\Spotify\\Spotify.exe',
    enabled: true,
    impact: 'medium',
    category: 'bloatware',
    description: 'Music streaming service - not needed at startup'
  },
  {
    id: '3',
    name: 'Discord',
    publisher: 'Discord Inc.',
    path: 'C:\\Users\\AppData\\Local\\Discord\\Update.exe',
    enabled: true,
    impact: 'medium',
    category: 'gaming',
    description: 'Voice and text chat for gamers'
  },
  {
    id: '4',
    name: 'Steam Client Bootstrapper',
    publisher: 'Valve Corporation',
    path: 'C:\\Program Files (x86)\\Steam\\steam.exe',
    enabled: true,
    impact: 'medium',
    category: 'gaming',
    description: 'Steam gaming platform launcher'
  },
  {
    id: '5',
    name: 'NVIDIA GeForce Experience',
    publisher: 'NVIDIA Corporation',
    path: 'C:\\Program Files\\NVIDIA Corporation\\NVIDIA GeForce Experience\\NVIDIA GeForce Experience.exe',
    enabled: true,
    impact: 'high',
    category: 'gaming',
    description: 'Driver updates and game optimization'
  },
  {
    id: '6',
    name: 'OneDrive',
    publisher: 'Microsoft Corporation',
    path: 'C:\\Users\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe',
    enabled: true,
    impact: 'high',
    category: 'bloatware',
    description: 'Cloud storage sync - can slow boot significantly'
  },
  {
    id: '7',
    name: 'Adobe Creative Cloud',
    publisher: 'Adobe Inc.',
    path: 'C:\\Program Files\\Adobe\\Adobe Creative Cloud\\ACC\\Creative Cloud.exe',
    enabled: true,
    impact: 'high',
    category: 'bloatware',
    description: 'Adobe applications manager - heavy resource usage'
  },
  {
    id: '8',
    name: 'iTunes Helper',
    publisher: 'Apple Inc.',
    path: 'C:\\Program Files\\iTunes\\iTunesHelper.exe',
    enabled: true,
    impact: 'low',
    category: 'bloatware',
    description: 'iTunes device detection - unnecessary for most users'
  },
  {
    id: '9',
    name: 'Windows Security',
    publisher: 'Microsoft Corporation',
    path: 'C:\\Windows\\System32\\SecurityHealthSystray.exe',
    enabled: true,
    impact: 'low',
    category: 'essential',
    description: 'Windows Defender - essential security protection'
  },
  {
    id: '10',
    name: 'Realtek HD Audio Manager',
    publisher: 'Realtek Semiconductor',
    path: 'C:\\Program Files\\Realtek\\Audio\\HDA\\RtkNGUI64.exe',
    enabled: true,
    impact: 'low',
    category: 'essential',
    description: 'Audio driver management utility'
  },
  {
    id: '11',
    name: 'Corsair iCUE',
    publisher: 'Corsair',
    path: 'C:\\Program Files\\Corsair\\CORSAIR iCUE 4 Software\\iCUE.exe',
    enabled: true,
    impact: 'medium',
    category: 'gaming',
    description: 'RGB lighting and peripheral control'
  },
  {
    id: '12',
    name: 'Razer Synapse',
    publisher: 'Razer Inc.',
    path: 'C:\\Program Files (x86)\\Razer\\Synapse3\\WPFUI\\Framework\\Razer Synapse 3.exe',
    enabled: true,
    impact: 'medium',
    category: 'gaming',
    description: 'Gaming peripheral configuration'
  },
  {
    id: '13',
    name: 'Dropbox',
    publisher: 'Dropbox, Inc.',
    path: 'C:\\Program Files\\Dropbox\\Client\\Dropbox.exe',
    enabled: true,
    impact: 'high',
    category: 'bloatware',
    description: 'Cloud storage sync service'
  },
  {
    id: '14',
    name: 'Skype',
    publisher: 'Microsoft Corporation',
    path: 'C:\\Program Files\\WindowsApps\\Microsoft.SkypeApp\\Skype.exe',
    enabled: true,
    impact: 'medium',
    category: 'bloatware',
    description: 'Video calling application'
  },
  {
    id: '15',
    name: 'Java Update Scheduler',
    publisher: 'Oracle Corporation',
    path: 'C:\\Program Files\\Java\\jre\\bin\\jusched.exe',
    enabled: true,
    impact: 'low',
    category: 'bloatware',
    description: 'Java runtime update checker'
  }
];

// Gaming optimization settings
const optimizationSettings: OptimizationSetting[] = [
  {
    id: 'game-mode',
    name: 'Windows Game Mode',
    description: 'Prioritizes game processes and reduces background activity',
    category: 'performance',
    enabled: false,
    recommended: true,
    impact: 'Improves FPS stability by 5-15%'
  },
  {
    id: 'hardware-accel',
    name: 'Hardware-Accelerated GPU Scheduling',
    description: 'Reduces latency and improves GPU performance',
    category: 'performance',
    enabled: false,
    recommended: true,
    impact: 'Reduces input lag by 1-3ms'
  },
  {
    id: 'disable-fullscreen-opt',
    name: 'Disable Fullscreen Optimizations',
    description: 'Prevents Windows from optimizing fullscreen games',
    category: 'performance',
    enabled: false,
    recommended: true,
    impact: 'Fixes stuttering in some games'
  },
  {
    id: 'high-perf-power',
    name: 'High Performance Power Plan',
    description: 'Maximizes CPU and GPU performance at the cost of power consumption',
    category: 'power',
    enabled: false,
    recommended: true,
    impact: 'Up to 20% performance boost on laptops'
  },
  {
    id: 'disable-nagle',
    name: 'Disable Nagle\'s Algorithm',
    description: 'Reduces network latency for online gaming',
    category: 'network',
    enabled: false,
    recommended: true,
    impact: 'Reduces ping by 5-20ms'
  },
  {
    id: 'disable-auto-update',
    name: 'Pause Windows Updates During Gaming',
    description: 'Temporarily pauses Windows Update to prevent interruptions',
    category: 'performance',
    enabled: false,
    recommended: true,
    impact: 'Prevents update-related lag spikes'
  },
  {
    id: 'disable-transparency',
    name: 'Disable Transparency Effects',
    description: 'Turns off Windows transparency and blur effects',
    category: 'visual',
    enabled: false,
    recommended: false,
    impact: 'Frees up 50-150MB VRAM'
  },
  {
    id: 'disable-animations',
    name: 'Disable UI Animations',
    description: 'Removes Windows animation effects for snappier feel',
    category: 'visual',
    enabled: false,
    recommended: false,
    impact: 'Minimal performance impact, faster UI'
  },
  {
    id: 'disable-dvr',
    name: 'Disable Xbox Game DVR',
    description: 'Turns off background game recording',
    category: 'performance',
    enabled: false,
    recommended: true,
    impact: 'Recovers 5-10% FPS in many games'
  },
  {
    id: 'clean-temp',
    name: 'Clean Temporary Files',
    description: 'Removes temporary files to free up disk space',
    category: 'storage',
    enabled: false,
    recommended: true,
    impact: 'Frees 1-10GB of storage'
  },
  {
    id: 'disable-superfetch',
    name: 'Disable Superfetch/SysMain',
    description: 'Stops Windows from preloading applications into memory',
    category: 'performance',
    enabled: false,
    recommended: false,
    impact: 'Reduces disk usage, may slow app launches'
  },
  {
    id: 'disable-search-indexing',
    name: 'Disable Windows Search Indexing',
    description: 'Stops background file indexing to reduce disk I/O',
    category: 'storage',
    enabled: false,
    recommended: false,
    impact: 'Reduces disk activity, slower searches'
  }
];

export function getStartupPrograms(): StartupProgram[] {
  return startupPrograms;
}

export function toggleStartupProgram(id: string): StartupProgram | null {
  const program = startupPrograms.find(p => p.id === id);
  if (program) {
    program.enabled = !program.enabled;
    return program;
  }
  return null;
}

export function disableAllBloatware(): StartupProgram[] {
  return startupPrograms.filter(p => p.category === 'bloatware').map(p => {
    p.enabled = false;
    return p;
  });
}

export function getOptimizationSettings(): OptimizationSetting[] {
  return optimizationSettings;
}

export function toggleOptimizationSetting(id: string): OptimizationResult {
  const setting = optimizationSettings.find(s => s.id === id);
  if (setting) {
    setting.enabled = !setting.enabled;
    return {
      success: true,
      message: `${setting.name} has been ${setting.enabled ? 'enabled' : 'disabled'}`,
      settingId: id
    };
  }
  return {
    success: false,
    message: 'Setting not found',
    settingId: id
  };
}

export function applyRecommendedSettings(): OptimizationResult[] {
  const results: OptimizationResult[] = [];
  
  for (const setting of optimizationSettings) {
    if (setting.recommended && !setting.enabled) {
      setting.enabled = true;
      results.push({
        success: true,
        message: `${setting.name} has been enabled`,
        settingId: setting.id
      });
    }
  }
  
  return results;
}

export function getSystemInfo(): SystemInfo {
  return {
    os: 'Windows 11 Pro (Build 22621)',
    cpu: 'AMD Ryzen 7 5800X @ 3.80GHz',
    ram: '32GB DDR4 3600MHz',
    gpu: 'NVIDIA GeForce RTX 3070',
    storage: '1TB NVMe SSD (45% used)'
  };
}

export function getOptimizationScore(): number {
  const enabledCount = optimizationSettings.filter(s => s.enabled && s.recommended).length;
  const recommendedCount = optimizationSettings.filter(s => s.recommended).length;
  const disabledBloatwareCount = startupPrograms.filter(p => p.category === 'bloatware' && !p.enabled).length;
  const totalBloatwareCount = startupPrograms.filter(p => p.category === 'bloatware').length;
  
  const settingsScore = recommendedCount > 0 ? (enabledCount / recommendedCount) * 50 : 50;
  const startupScore = totalBloatwareCount > 0 ? (disabledBloatwareCount / totalBloatwareCount) * 50 : 50;
  
  return Math.round(settingsScore + startupScore);
}
