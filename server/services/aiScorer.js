/**
 * FreddyAI - Intelligent Daily Placement Scoring & Evaluation Engine
 */

export const evaluateDailyPerformance = async (logData, recentHistory = []) => {
  const { problems = [], studyHours = 0, csFundamentals = [], projectWork = {} } = logData;

  // 1. Calculate Problem Solving Score (Max 40 points)
  let problemScore = 0;
  const topicCounts = {};

  for (const prob of problems) {
    const diff = (prob.difficulty || 'Medium').toLowerCase();
    if (diff === 'hard') problemScore += 20;
    else if (diff === 'medium') problemScore += 12;
    else problemScore += 6;

    if (prob.topic) {
      topicCounts[prob.topic] = (topicCounts[prob.topic] || 0) + 1;
    }
  }
  const problemSolvingScore = Math.min(40, problemScore);

  // 2. CS Fundamentals & Study Hours (Max 25 points)
  const hoursScore = Math.min(15, (studyHours || 0) * 5);
  const fundamentalsScore = Math.min(10, (csFundamentals?.length || 0) * 5);
  const depthAndFundamentals = hoursScore + fundamentalsScore;

  // 3. Project / Dev Output (Max 20 points)
  let projectScore = 0;
  if (projectWork?.commitsCount) {
    projectScore += Math.min(10, projectWork.commitsCount * 3);
  }
  if (projectWork?.taskDescription && projectWork.taskDescription.trim().length > 10) {
    projectScore += 10;
  }
  const projectOutputScore = Math.min(20, projectScore);

  // 4. Topic Breadth & Consistency (Max 15 points)
  const distinctTopics = Object.keys(topicCounts).length;
  const breadthOfTopics = Math.min(8, distinctTopics * 4);
  const consistencyScore = 7; // base consistency bonus

  // Total raw score (0 - 100)
  const totalScore = Math.min(
    100,
    Math.round(problemSolvingScore + depthAndFundamentals + projectOutputScore + breadthOfTopics + consistencyScore)
  );

  // Derive automated strengths, weaknesses, and targets
  const strengths = [];
  const weaknesses = [];
  const tomorrowTarget = [];

  if (problems.length >= 3) {
    strengths.push(`High problem-solving throughput: ${problems.length} problems cracked today.`);
  } else if (problems.length > 0) {
    strengths.push(`Good focus on quality over volume.`);
  } else {
    weaknesses.push(`No DSA problems registered today. Consistent daily problem solving is vital for top-tier OAs.`);
  }

  const hasHard = problems.some(p => (p.difficulty || '').toLowerCase() === 'hard');
  const hasMedium = problems.some(p => (p.difficulty || '').toLowerCase() === 'medium');

  if (hasHard) {
    strengths.push(`Pushed cognitive boundaries with Hard-tier algorithm challenge.`);
  } else if (!hasMedium && problems.length > 0) {
    weaknesses.push(`Stuck to Easy problems. Try stepping up to Mediums for standard product-company placement bars.`);
  }

  if (csFundamentals && csFundamentals.length > 0) {
    strengths.push(`Strengthened core CS topics (${csFundamentals.join(', ')}).`);
  } else {
    weaknesses.push(`Zero CS Fundamentals logged. System Design, OS, and DBMS questions carry 30-40% weightage in interviews.`);
  }

  // Generate tomorrow targets
  if (distinctTopics <= 1) {
    tomorrowTarget.push(`Diversify topics: Solve at least 1 Graph / Dynamic Programming Medium problem.`);
  } else {
    tomorrowTarget.push(`Maintain topic momentum: Revisit 1 tagged tricky problem from this week.`);
  }

  if (!csFundamentals || csFundamentals.length === 0) {
    tomorrowTarget.push(`Dedicate 45 minutes to core CS (DBMS normalization or OS Concurrency).`);
  }

  if (!projectWork?.taskDescription) {
    tomorrowTarget.push(`Ship at least 1 meaningful commit or feature module to your featured project.`);
  } else {
    tomorrowTarget.push(`Document architectural decisions or benchmark API latency on your active project.`);
  }

  let recommendation = '';
  if (totalScore >= 85) {
    recommendation = `Phenomenal day! You're performing at an elite placement readiness tier. Keep this exact rhythm and prioritize mock interview simulations.`;
  } else if (totalScore >= 65) {
    recommendation = `Solid day of progress! To cross into the top 10% candidate bracket, balance your problem-solving with at least one timed mock or CS fundamental revision.`;
  } else if (totalScore >= 40) {
    recommendation = `Good baseline effort. Push for at least two Medium DSA questions and a 30-minute CS core review to elevate your readiness score.`;
  } else {
    recommendation = `Slow day detected. Remember that consistency beats intensity. Even 45 minutes of targeted DSA tomorrow will restore your streak!`;
  }

  // If Gemini API Key is configured, attempt enriched prompt
  if (process.env.GEMINI_API_KEY) {
    try {
      const prompt = `You are FreddyAI, an elite software engineering placement coach. Evaluate this candidate's daily output:
Problems solved: ${JSON.stringify(problems)}
Study hours: ${studyHours}
CS Fundamentals: ${JSON.stringify(csFundamentals)}
Project work: ${JSON.stringify(projectWork)}

Provide a concise JSON response with:
{
  "totalScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "recommendation": string,
  "tomorrowTarget": string[]
}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            totalScore: parsed.totalScore || totalScore,
            breakdown: {
              problemSolving: problemSolvingScore,
              consistency: consistencyScore,
              breadthOfTopics,
              depthAndFundamentals
            },
            strengths: parsed.strengths || strengths,
            weaknesses: parsed.weaknesses || weaknesses,
            recommendation: parsed.recommendation || recommendation,
            tomorrowTarget: parsed.tomorrowTarget || tomorrowTarget
          };
        }
      }
    } catch (e) {
      console.warn(`[AI Engine] Gemini API fallback to internal heuristic: ${e.message}`);
    }
  }

  return {
    totalScore,
    breakdown: {
      problemSolving: problemSolvingScore,
      consistency: consistencyScore,
      breadthOfTopics,
      depthAndFundamentals
    },
    strengths,
    weaknesses,
    recommendation,
    tomorrowTarget
  };
};
