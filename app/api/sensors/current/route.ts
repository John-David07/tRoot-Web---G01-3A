import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export async function GET() {
  try {
    const currentDataRef = ref(database, 'CurrentData');
    const snapshot = await get(currentDataRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'No sensor data found' },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    
    // Transform to match DashboardClient expected format
    const transformedData = {
      Humidity: data.humidity || 0,
      Temperature: data.temperature || 0,
      Soil_Moisture: {
        Node_1: data.soil_moisture?.node_1 || 0,
        Node_2: data.soil_moisture?.node_2 || 0,
        Node_3: data.soil_moisture?.node_3 || 0,
        Node_4: data.soil_moisture?.node_4 || 0,
        Node_5: data.soil_moisture?.node_5 || 0
      }
    };
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}