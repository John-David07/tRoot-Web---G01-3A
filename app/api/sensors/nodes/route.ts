import { NextResponse } from 'next/server';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase/client';

export async function GET() {
  try {
    // Fetch current data to extract nodes
    const currentDataRef = ref(database, 'Current_Data');
    const snapshot = await get(currentDataRef);
    
    if (!snapshot.exists()) {
      return NextResponse.json(
        { error: 'No sensor data found' },
        { status: 404 }
      );
    }

    const data = snapshot.val();
    const soilMoisture = data.Soil_Moisture || {};
    
    // Extract node names and their current values
    const nodes = Object.entries(soilMoisture).map(([nodeId, value]) => ({
      id: nodeId,
      name: nodeId.replace('_', ' '),
      currentValue: value,
    }));

    return NextResponse.json({
      count: nodes.length,
      nodes: nodes
    });
  } catch (error) {
    console.error('Nodes API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}