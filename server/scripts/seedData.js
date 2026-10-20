import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { DsaProblem } from '../models/DsaProblem.js';
import { DailyLog } from '../models/DailyLog.js';
import { Interview } from '../models/Interview.js';
import { Project } from '../models/Project.js';
import { initialProjects, initialDsaProblems, initialInterviews, initialDailyLogs } from '../services/mockStore.js';

dotenv.config();

const seed = async () => {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to MongoDB. Ensure mongod is running or check MONGODB_URI in .env.');
    process.exit(1);
  }

  console.log('🌱 Seeding FreddyAI initial database records...');

  await Promise.all([
    DsaProblem.deleteMany({}),
    DailyLog.deleteMany({}),
    Interview.deleteMany({}),
    Project.deleteMany({})
  ]);

  // Strip mock _ids to let Mongo generate ObjectIds
  const cleanDsa = initialDsaProblems.map(({ _id, ...rest }) => rest);
  const cleanProjects = initialProjects.map(({ _id, ...rest }) => rest);
  const cleanInterviews = initialInterviews.map(({ _id, ...rest }) => rest);
  const cleanLogs = initialDailyLogs.map(({ _id, ...rest }) => rest);

  await DsaProblem.insertMany(cleanDsa);
  await Project.insertMany(cleanProjects);
  await Interview.insertMany(cleanInterviews);
  await DailyLog.insertMany(cleanLogs);

  console.log(`✅ Seeded ${cleanDsa.length} DSA problems`);
  console.log(`✅ Seeded ${cleanProjects.length} Projects`);
  console.log(`✅ Seeded ${cleanInterviews.length} Interview experiences`);
  console.log(`✅ Seeded ${cleanLogs.length} Daily AI logs`);
  console.log('🎉 Database seeding complete!');

  await mongoose.disconnect();
  process.exit(0);
};

seed();
