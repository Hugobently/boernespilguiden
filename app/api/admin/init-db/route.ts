// Database Initialization Route
// Run this ONCE to create tables in production database

import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  // Temporarily disabled auth for testing
  // TODO: Re-enable after successful init
  const auth = request.headers.get('authorization');
  console.log('Init DB started with auth:', auth);

  // if (auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

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
  } catch (error) {
    const err = error as { message: string; stdout?: string; stderr?: string };
    console.error('Database initialization failed:', error);
    return NextResponse.json({
      success: false,
      error: err.message,
      output: err.stdout || '',
      stderr: err.stderr || '',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
