import { Router, Request, Response } from 'express';
import {
  getStartupPrograms,
  toggleStartupProgram,
  disableAllBloatware,
  getOptimizationSettings,
  toggleOptimizationSetting,
  applyRecommendedSettings,
  getSystemInfo,
  getOptimizationScore
} from '../services/optimizationService';

const router = Router();

// Get all startup programs
router.get('/startup-programs', (_req: Request, res: Response) => {
  try {
    const programs = getStartupPrograms();
    res.json(programs);
  } catch {
    res.status(500).json({ error: 'Failed to fetch startup programs' });
  }
});

// Toggle a startup program
router.post('/startup-programs/:id/toggle', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const program = toggleStartupProgram(id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ error: 'Program not found' });
    }
  } catch {
    res.status(500).json({ error: 'Failed to toggle startup program' });
  }
});

// Disable all bloatware
router.post('/startup-programs/disable-bloatware', (_req: Request, res: Response) => {
  try {
    const disabled = disableAllBloatware();
    res.json({ success: true, disabled });
  } catch {
    res.status(500).json({ error: 'Failed to disable bloatware' });
  }
});

// Get optimization settings
router.get('/optimization-settings', (_req: Request, res: Response) => {
  try {
    const settings = getOptimizationSettings();
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Failed to fetch optimization settings' });
  }
});

// Toggle an optimization setting
router.post('/optimization-settings/:id/toggle', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = toggleOptimizationSetting(id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch {
    res.status(500).json({ error: 'Failed to toggle optimization setting' });
  }
});

// Apply all recommended settings
router.post('/optimization-settings/apply-recommended', (_req: Request, res: Response) => {
  try {
    const results = applyRecommendedSettings();
    res.json({ success: true, results });
  } catch {
    res.status(500).json({ error: 'Failed to apply recommended settings' });
  }
});

// Get system info
router.get('/system-info', (_req: Request, res: Response) => {
  try {
    const info = getSystemInfo();
    res.json(info);
  } catch {
    res.status(500).json({ error: 'Failed to fetch system info' });
  }
});

// Get optimization score
router.get('/optimization-score', (_req: Request, res: Response) => {
  try {
    const score = getOptimizationScore();
    res.json({ score });
  } catch {
    res.status(500).json({ error: 'Failed to calculate optimization score' });
  }
});

export default router;
