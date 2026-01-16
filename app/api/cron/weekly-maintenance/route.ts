// Weekly Maintenance Cron Route
// Køres automatisk via Vercel Cron hver søndag kl. 07:00 UTC
// Tjekker links, billeder og indhold for problemer

import { NextResponse } from 'next/server';
import {
  runMaintenanceCheck,
  fixMissingGameIcons,
  MaintenanceReport,
} from '@/lib/services/link-health-check';

export const maxDuration = 120; // 2 minutter til maintenance check

export async function GET(request: Request) {
  // Verify Vercel cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let report: MaintenanceReport | null = null;
  let iconsFixed = 0;

  try {
    // 1. Run maintenance check
    console.log('Starting weekly maintenance check...');
    report = await runMaintenanceCheck();

    // 2. Try to fix missing game icons (max 10 per week)
    if (report.gamesWithMissingIcons > 0) {
      console.log(`Found ${report.gamesWithMissingIcons} games without icons, attempting to fix...`);
      iconsFixed = await fixMissingGameIcons(10);
    }

    // 3. Log results
    console.log('Weekly maintenance complete:', {
      summary: report.summary,
      iconsFixed,
      brokenImages: report.brokenImageUrls.length,
      staleContent: report.staleContent.length,
    });

  } catch (error) {
    console.error('Weekly maintenance error:', error);
    return NextResponse.json(
      {
        error: String(error),
        report,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    report: {
      ...report,
      iconsFixed,
    },
    timestamp: new Date().toISOString(),
  });
}
