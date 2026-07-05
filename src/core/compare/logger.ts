/**
 * Event logging abstraction for future data-driven weights.
 * This tracks user interactions in the Compare UI to learn which name comparisons are actually meaningful.
 */

export function trackCompareEvent(name1Id: string, name2Id: string, score: number) {
  // In a real production system, this would send an event to a backend or analytics service.
  // For now, we simulate logging to localStorage or console for local testing.
  if (typeof window !== 'undefined') {
    console.log(`[CompareEngine] Logged comparison: ${name1Id} vs ${name2Id} (Score: ${score})`);
    
    // Simulate log accumulation
    try {
      const logs = JSON.parse(localStorage.getItem('kurdishname_compare_logs') || '[]');
      logs.push({
        n1: name1Id,
        n2: name2Id,
        score,
        timestamp: new Date().toISOString()
      });
      // Keep only last 100 to avoid bloat
      if (logs.length > 100) logs.shift();
      localStorage.setItem('kurdishname_compare_logs', JSON.stringify(logs));
    } catch (e) {
      // Ignore
    }
  }
}
