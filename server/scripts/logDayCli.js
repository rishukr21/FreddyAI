/**
 * CLI Tool: Fast Daily Activity Logger for FreddyAI
 * Usage: npm run log:today
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function runCli() {
  console.log('\n======================================================');
  console.log('🤖 FreddyAI — Daily Activity Logger & AI Evaluator');
  console.log('======================================================\n');

  const today = new Date().toISOString().split('T')[0];
  console.log(`📅 Date: ${today}`);

  const probTitles = await ask('📝 DSA Problems solved today (comma-separated, or Enter to skip): ');
  const difficulty = await ask('⚡ Average Difficulty (Easy/Medium/Hard) [Medium]: ') || 'Medium';
  const hours = parseFloat(await ask('⏱️ Study / Coding hours spent [3]: ') || '3');
  const cs = await ask('📚 CS Fundamentals studied (e.g. OS, DBMS, Networks, or Enter): ');
  const project = await ask('💻 Project task worked on (or Enter): ');
  const notes = await ask('📓 Quick journal note / learning (or Enter): ');

  const problems = probTitles.trim() ? probTitles.split(',').map(t => ({
    title: t.trim(),
    difficulty: difficulty.trim(),
    topic: 'Algorithms',
    platform: 'LeetCode'
  })) : [];

  const csFundamentals = cs.trim() ? cs.split(',').map(s => s.trim()) : [];

  const payload = {
    date: today,
    problems,
    studyHours: hours,
    csFundamentals,
    projectWork: {
      projectName: 'Main Project',
      taskDescription: project.trim(),
      commitsCount: project.trim() ? 2 : 0
    },
    journalNotes: notes.trim()
  };

  console.log('\n⏳ Sending to FreddyAI Scoring Engine...');

  try {
    const res = await fetch('http://localhost:5001/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      const score = data.data?.aiScore;
      console.log('\n🎯 AI EVALUATION RESULTS:');
      console.log(`⭐ Placement Readiness Score: ${score?.totalScore}/100`);
      console.log(`💡 Recommendation: ${score?.recommendation}`);
      if (score?.tomorrowTarget?.length) {
        console.log('\n🎯 Targets for Tomorrow:');
        score.tomorrowTarget.forEach(t => console.log(`   - ${t}`));
      }
      console.log('\n✅ Successfully logged and updated in FreddyAI dashboard!');
    } else {
      console.error('⚠️ Could not post to server. Is the backend server running on port 5001?');
    }
  } catch (err) {
    console.error(`❌ Connection error: ${err.message}. Make sure npm run dev:server is running.`);
  }

  rl.close();
}

runCli();
