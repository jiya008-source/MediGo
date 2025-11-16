import { MongoClient } from 'mongodb';

const uri = 'mongodb://jiya:jiya2005@ac-6gsrqce-shard-00-00.y0go4sm.mongodb.net:27017,ac-6gsrqce-shard-00-01.y0go4sm.mongodb.net:27017,ac-6gsrqce-shard-00-02.y0go4sm.mongodb.net:27017/?ssl=true&replicaSet=atlas-b42a4e-shard-0&authSource=admin&retryWrites=true&w=majority';

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log('✅ Connected to MongoDB via native driver');
  const db = client.db('DOCTOR-APPOINTMENT-WEBSITE');
  const collections = await db.collections();
  console.log('Collections:', collections.map(c => c.collectionName));
  await client.close();
} catch (err) {
  console.error('❌ Native MongoDB connection failed:', err.message);
}
