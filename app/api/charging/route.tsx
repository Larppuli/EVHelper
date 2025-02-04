import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB;
const collectionName = 'chargingData';

async function connectToMongoDB() {
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return { client, collection };
}

async function saveToMongoDB(chargingObject: any) {
  const { client, collection } = await connectToMongoDB();
  try {
    const result = await collection.insertOne(chargingObject);
    console.log("Saved to MongoDB:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("MongoDB Error:", error);
    throw new Error("Failed to save data to MongoDB");
  } finally {
    await client.close();
  }
}

export async function POST(req: NextRequest) {
  try {
    const chargingObject = await req.json();

    if (!chargingObject) {
      return new NextResponse(JSON.stringify({ error: "Missing chargingObject" }), { status: 400 });
    }

    const insertedId = await saveToMongoDB(chargingObject);
    return new NextResponse(JSON.stringify({ success: true, insertedId }), { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}

export async function GET() {
  try {
    const { client, collection } = await connectToMongoDB();
    const data = await collection.find({}).toArray();
    await client.close();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
}
