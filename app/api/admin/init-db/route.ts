// Database Initialization Route
// Run this ONCE to create tables in production database

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  // Simple auth check
  const auth = request.headers.get('authorization');
  if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Starting database initialization...');

    // Run prisma db push to create tables
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss');

    console.log('Database push output:', stdout);
    if (stderr) console.error('Database push errors:', stderr);

    return NextResponse.json({
      success: true,
      message: 'Database schema pushed successfully',
      output: stdout,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      output: error.stdout || '',
      stderr: error.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
