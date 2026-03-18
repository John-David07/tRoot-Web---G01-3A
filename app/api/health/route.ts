import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      firebase: 'unknown',
      database: 'unknown',
    },
    environment: process.env.NODE_ENV,
  };

  try {
    // Just try to read Current_Data directly
    const currentDataRef = ref(database, 'Current_Data');
    const snapshot = await get(currentDataRef);
    
    // If we get here without error, Firebase is connected
    healthCheck.services.firebase = 'connected';
    healthCheck.services.database = snapshot.exists() ? 'reachable' : 'empty';
    
    return NextResponse.json(healthCheck);
  } catch (error) {
    console.error('Health check error:', error);
    healthCheck.status = 'degraded';
    healthCheck.services.firebase = 'disconnected';
    healthCheck.services.database = 'unreachable';
    
    return NextResponse.json(healthCheck, { status: 503 });
  }
}