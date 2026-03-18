import { NextResponse } from 'next/server';
import { getDatabase, ref, get, child } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export async function GET() {
  try {
    // Fetch history data from Firebase
    const historyRef = ref(database, 'History');
    const snapshot = await get(historyRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'No history data found' },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    
    // Transform into array format if needed
    const historyArray = Object.entries(data).map(([key, value]) => ({
      id: key,
      ...(value as object),
    }));

    return NextResponse.json(historyArray);
  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}