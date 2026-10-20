/**
 * Stats Fetcher for LeetCode, Codeforces, and GitHub
 * Only fetches when actual usernames are provided. Returns unconfigured clean slate otherwise.
 */

export const fetchLeetCodeStats = async (username) => {
  if (!username || username === 'tourist' || username.trim() === '') {
    return {
      configured: false,
      username: '',
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: null
    };
  }

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
          }
        }
      }
    `;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query, variables: { username } }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error('LeetCode response not ok');
    const data = await response.json();
    const stats = data?.data?.matchedUser?.submitStats?.acSubmissionNum || [];

    const totalSolved = stats.find(s => s.difficulty === 'All')?.count || 0;
    const easySolved = stats.find(s => s.difficulty === 'Easy')?.count || 0;
    const mediumSolved = stats.find(s => s.difficulty === 'Medium')?.count || 0;
    const hardSolved = stats.find(s => s.difficulty === 'Hard')?.count || 0;

    return {
      configured: true,
      username,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      ranking: data?.data?.matchedUser?.profile?.ranking || null
    };
  } catch (err) {
    return {
      configured: true,
      username,
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      ranking: null,
      error: 'Could not fetch LeetCode profile'
    };
  }
};

export const fetchCodeforcesStats = async (username) => {
  if (!username || username === 'tourist' || username.trim() === '') {
    return {
      configured: false,
      handle: '',
      rating: 0,
      maxRating: 0,
      rank: 'Unrated',
      maxRank: 'Unrated'
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://codeforces.com/api/user.info?handles=${username}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error('CF API error');
    const data = await res.json();
    if (data.status === 'OK' && data.result?.length > 0) {
      const user = data.result[0];
      return {
        configured: true,
        handle: user.handle,
        rating: user.rating || 0,
        maxRating: user.maxRating || 0,
        rank: user.rank || 'Unrated',
        maxRank: user.maxRank || 'Unrated'
      };
    }
  } catch (err) {
    // Return empty on error
  }

  return {
    configured: true,
    handle: username,
    rating: 0,
    maxRating: 0,
    rank: 'Unrated',
    maxRank: 'Unrated'
  };
};

export const fetchGithubStats = async (username) => {
  if (!username || username === 'developer' || username.trim() === '') {
    return {
      configured: false,
      username: '',
      publicRepos: 0,
      followers: 0,
      avatarUrl: null
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://api.github.com/users/${username}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'FreddyAI-Placement-Tracker' }
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      return {
        configured: true,
        username: data.login,
        publicRepos: data.public_repos,
        followers: data.followers,
        avatarUrl: data.avatar_url
      };
    }
  } catch (err) {
    // Return empty
  }

  return {
    configured: true,
    username,
    publicRepos: 0,
    followers: 0,
    avatarUrl: null
  };
};
