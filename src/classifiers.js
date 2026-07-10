export const SECTIONS = [
  {
    key: "facts",
    title: "Facts Observed",
    pattern: /\b(observed|found|confirmed|verified|result|output|exists|passed|failed)\b/i
  },
  {
    key: "decisions",
    title: "Decisions Made",
    pattern: /\b(decided|chose|selected|will use|approach|strategy)\b/i
  },
  {
    key: "blockers",
    title: "Unresolved Blockers",
    pattern: /\b(blocked|blocker|cannot|failed|error|missing|denied|rejected)\b/i
  },
  {
    key: "assumptions",
    title: "Risky Assumptions",
    pattern: /\b(assume|assumption|assuming|unclear|unknown|maybe|risk|likely)\b/i
  },
  {
    key: "nextActions",
    title: "Next Safe Actions",
    pattern: /\b(next|continue|retry|run|check|inspect|verify|ask)\b/i
  }
];
