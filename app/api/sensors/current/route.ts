import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export async function GET() {
  try {
    // Fetch current sensor data from Firebase
    const currentDataRef = ref(database, 'Current_Data');
    const snapshot = await get(currentDataRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'No sensor data found' },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}