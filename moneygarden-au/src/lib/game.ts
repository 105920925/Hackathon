const LEVEL_THRESHOLDS = [0, 120, 300, 520, 800, 1150, 1550, 2000];

export function getGardenLevel(xp: number) {
  let level = 1;
  LEVEL_THRESHOLDS.forEach((threshold, index) => {
    if (xp >= threshold) level = index + 1;
  });
  return Math.min(level, LEVEL_THRESHOLDS.length);
}

export function getNextLevelXP(xp: number) {
  for (const threshold of LEVEL_THRESHOLDS) {
    if (threshold > xp) return threshold;
  }
  return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getUnlocksForLevel(level: number) {
  const unlocks = [
    "Sprout Pot",
    "Sunflower Patch",
    "Compost Bin",
    "Fruit Tree",
    "Water Feature",
    "Bee Hotel",
    "Veggie Bed",
    "Greenhouse",
  ];
  return unlocks.slice(0, level);
}
