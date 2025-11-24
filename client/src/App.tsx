import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Gamepad2, 
  Rocket, 
  Power, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Monitor, 
  Battery
} from 'lucide-react';
import type { StartupProgram, OptimizationSetting, SystemInfo } from '@shared/types';

const apiBase = '/api';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(`${apiBase}${url}`);
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

async function postJSON<T>(url: string): Promise<T> {
  const res = await fetch(`${apiBase}${url}`, { method: 'POST' });
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}

function App() {
  const [activeTab, setActiveTab] = useState<'startup' | 'optimize' | 'system'>('startup');
  const queryClient = useQueryClient();

  const { data: startupPrograms = [], isLoading: loadingPrograms } = useQuery({
    queryKey: ['startup-programs'],
    queryFn: () => fetchJSON<StartupProgram[]>('/startup-programs')
  });

  const { data: optimizationSettings = [], isLoading: loadingSettings } = useQuery({
    queryKey: ['optimization-settings'],
    queryFn: () => fetchJSON<OptimizationSetting[]>('/optimization-settings')
  });

  const { data: systemInfo } = useQuery({
    queryKey: ['system-info'],
    queryFn: () => fetchJSON<SystemInfo>('/system-info')
  });

  const { data: scoreData } = useQuery({
    queryKey: ['optimization-score'],
    queryFn: () => fetchJSON<{ score: number }>('/optimization-score')
  });

  const toggleProgramMutation = useMutation({
    mutationFn: (id: string) => postJSON(`/startup-programs/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startup-programs'] });
      queryClient.invalidateQueries({ queryKey: ['optimization-score'] });
    }
  });

  const disableBloatwareMutation = useMutation({
    mutationFn: () => postJSON('/startup-programs/disable-bloatware'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['startup-programs'] });
      queryClient.invalidateQueries({ queryKey: ['optimization-score'] });
    }
  });

  const toggleSettingMutation = useMutation({
    mutationFn: (id: string) => postJSON(`/optimization-settings/${id}/toggle`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-settings'] });
      queryClient.invalidateQueries({ queryKey: ['optimization-score'] });
    }
  });

  const applyRecommendedMutation = useMutation({
    mutationFn: () => postJSON('/optimization-settings/apply-recommended'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-settings'] });
      queryClient.invalidateQueries({ queryKey: ['optimization-score'] });
    }
  });

  const score = scoreData?.score ?? 0;
  const bloatwareCount = startupPrograms.filter(p => p.category === 'bloatware' && p.enabled).length;
  const highImpactCount = startupPrograms.filter(p => p.impact === 'high' && p.enabled).length;
  const recommendedNotEnabled = optimizationSettings.filter(s => s.recommended && !s.enabled).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="w-5 h-5" />;
      case 'visual': return <Monitor className="w-5 h-5" />;
      case 'network': return <Wifi className="w-5 h-5" />;
      case 'power': return <Battery className="w-5 h-5" />;
      case 'storage': return <HardDrive className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const classes = {
      low: 'badge-low',
      medium: 'badge-medium',
      high: 'badge-high'
    }[impact] || 'badge-low';
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${classes}`}>
        {impact.toUpperCase()}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      essential: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      bloatware: 'bg-red-500/20 text-red-400 border-red-500/30',
      gaming: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      utility: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors[category] || colors.unknown}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Gaming PC Optimizer
                </h1>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Maximize your gaming performance
                </p>
              </div>
            </div>
            
            {/* Score Display */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Optimization Score</p>
                <p className="text-3xl font-bold font-mono bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  {score}%
                </p>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    strokeDasharray={`${score}, 100`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'startup', label: 'Startup Programs', icon: Power },
              { id: 'optimize', label: 'Gaming Optimizations', icon: Rocket },
              { id: 'system', label: 'System Info', icon: Cpu }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-gaming bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-red-500/10">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Active Bloatware</p>
                <p className="text-2xl font-bold font-mono text-red-400">{bloatwareCount}</p>
              </div>
            </div>
          </div>
          <div className="card-gaming bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">High Impact Items</p>
                <p className="text-2xl font-bold font-mono text-yellow-400">{highImpactCount}</p>
              </div>
            </div>
          </div>
          <div className="card-gaming bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-violet-500/10">
                <Settings className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Recommended Settings</p>
                <p className="text-2xl font-bold font-mono text-violet-400">{recommendedNotEnabled} pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Startup Programs Tab */}
        {activeTab === 'startup' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Startup Programs</h2>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Disable unnecessary programs to speed up boot time and free resources
                </p>
              </div>
              <button
                onClick={() => disableBloatwareMutation.mutate()}
                disabled={disableBloatwareMutation.isPending || bloatwareCount === 0}
                className="btn-gaming px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
                Disable All Bloatware
              </button>
            </div>

            {loadingPrograms ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] animate-pulse">
                    <div className="h-6 bg-[hsl(var(--secondary))] rounded w-1/4 mb-2" />
                    <div className="h-4 bg-[hsl(var(--secondary))] rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {startupPrograms.map(program => (
                  <div
                    key={program.id}
                    className={`card-gaming bg-[hsl(var(--card))] rounded-xl p-5 border transition-all ${
                      program.enabled
                        ? 'border-[hsl(var(--border))]'
                        : 'border-emerald-500/30 bg-emerald-500/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${program.enabled ? 'bg-[hsl(var(--secondary))]' : 'bg-emerald-500/10'}`}>
                          {program.enabled ? (
                            <XCircle className="w-6 h-6 text-red-400" />
                          ) : (
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold">{program.name}</h3>
                            {getCategoryBadge(program.category)}
                            {getImpactBadge(program.impact)}
                          </div>
                          <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {program.publisher} • {program.description}
                          </p>
                          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))] mt-1 opacity-50">
                            {program.path}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleProgramMutation.mutate(program.id)}
                        disabled={toggleProgramMutation.isPending || program.category === 'essential'}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          program.category === 'essential'
                            ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                            : program.enabled
                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                        }`}
                      >
                        {program.category === 'essential' ? 'Required' : program.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Optimization Settings Tab */}
        {activeTab === 'optimize' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Gaming Optimizations</h2>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Enable Windows optimizations for better gaming performance
                </p>
              </div>
              <button
                onClick={() => applyRecommendedMutation.mutate()}
                disabled={applyRecommendedMutation.isPending || recommendedNotEnabled === 0}
                className="btn-gaming px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Rocket className="w-5 h-5" />
                Apply All Recommended
              </button>
            </div>

            {loadingSettings ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-[hsl(var(--card))] rounded-xl p-6 border border-[hsl(var(--border))] animate-pulse">
                    <div className="h-6 bg-[hsl(var(--secondary))] rounded w-1/3 mb-2" />
                    <div className="h-4 bg-[hsl(var(--secondary))] rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {['performance', 'network', 'visual', 'power', 'storage'].map(category => {
                  const categorySettings = optimizationSettings.filter(s => s.category === category);
                  if (categorySettings.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-lg font-medium capitalize mb-3 flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                        {getCategoryIcon(category)}
                        {category} Settings
                      </h3>
                      <div className="space-y-3">
                        {categorySettings.map(setting => (
                          <div
                            key={setting.id}
                            className={`card-gaming bg-[hsl(var(--card))] rounded-xl p-5 border transition-all ${
                              setting.enabled
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-[hsl(var(--border))]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${setting.enabled ? 'bg-emerald-500/10' : 'bg-[hsl(var(--secondary))]'}`}>
                                  {setting.enabled ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                  ) : (
                                    getCategoryIcon(setting.category)
                                  )}
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-semibold">{setting.name}</h4>
                                    {setting.recommended && (
                                      <span className="px-2 py-0.5 text-xs font-medium rounded-full border bg-violet-500/20 text-violet-400 border-violet-500/30">
                                        Recommended
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    {setting.description}
                                  </p>
                                  <p className="text-xs text-cyan-400 mt-1">
                                    Impact: {setting.impact}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => toggleSettingMutation.mutate(setting.id)}
                                disabled={toggleSettingMutation.isPending}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  setting.enabled
                                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                                    : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/30'
                                }`}
                              >
                                {setting.enabled ? 'Enabled' : 'Enable'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* System Info Tab */}
        {activeTab === 'system' && systemInfo && (
          <div>
            <h2 className="text-xl font-semibold mb-6">System Information</h2>
            <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] overflow-hidden">
              {[
                { label: 'Operating System', value: systemInfo.os, icon: Monitor },
                { label: 'Processor', value: systemInfo.cpu, icon: Cpu },
                { label: 'Memory', value: systemInfo.ram, icon: Zap },
                { label: 'Graphics Card', value: systemInfo.gpu, icon: Gamepad2 },
                { label: 'Storage', value: systemInfo.storage, icon: HardDrive }
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 p-5 ${
                    index !== 4 ? 'border-b border-[hsl(var(--border))]' : ''
                  }`}
                >
                  <div className="p-3 rounded-lg bg-[hsl(var(--secondary))]">
                    <item.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{item.label}</p>
                    <p className="font-medium font-mono">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-br from-violet-500/10 to-cyan-500/10 rounded-xl border border-violet-500/20 p-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-violet-400" />
                Ready for Gaming?
              </h3>
              <p className="text-[hsl(var(--muted-foreground))] mb-4">
                Your system is {score >= 70 ? 'well optimized' : score >= 40 ? 'partially optimized' : 'not optimized'} for gaming.
                {score < 100 && ' Apply the recommended settings and disable bloatware to improve performance.'}
              </p>
              <div className="progress-gaming">
                <div
                  className="progress-gaming-fill"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                Current optimization score: <span className="font-mono text-violet-400">{score}%</span>
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--card))] mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
            Gaming PC Optimizer • Boost your FPS and reduce boot times
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
