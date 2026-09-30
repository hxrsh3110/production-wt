// ApexFit Studio OS - ES6 Algorithm & Pricing Engine (Exp 2)
import { trainingPackages } from '../data/initialData.js';

export const algorithmService = {
  // 1. Factorial: Superset sequence permutations (Exp 2)
  calculateFactorial(n) {
    const num = parseInt(n, 10);
    if (isNaN(num) || num < 0) return { error: "Please enter a non-negative integer." };
    if (num > 15) return { error: "Input too large (max 15 to prevent precision loss)." };

    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }

    return {
      input: num,
      factorial: result,
      formatted: result.toLocaleString(),
      description: `${num}! = ${result.toLocaleString()} distinct exercise circuit orders for superset variation.`
    };
  },

  // 2. Multiplication Table: Progressive Volume Matrix (Exp 2)
  generateVolumeMatrix(baseLoadKg, maxSets = 10) {
    const load = parseFloat(baseLoadKg);
    if (isNaN(load) || load <= 0) return { error: "Please provide a valid positive load in kg." };

    const matrix = [];
    for (let setNum = 1; setNum <= maxSets; setNum++) {
      const cumulativeVolume = (load * setNum).toFixed(1);
      matrix.push({
        setNumber: setNum,
        loadKg: load,
        cumulativeVolumeKg: parseFloat(cumulativeVolume),
        representation: `Set ${setNum.toString().padStart(2, ' ')}: ${load} kg × ${setNum} = ${cumulativeVolume} kg`
      });
    }

    return {
      baseLoadKg: load,
      sets: maxSets,
      totalTonnage: parseFloat((load * maxSets).toFixed(1)),
      matrix
    };
  },

  // 3. Sum of N Numbers: Macrocycle Cumulative Volume (Exp 2)
  calculateMacrocycleTarget(n) {
    const days = parseInt(n, 10);
    if (isNaN(days) || days <= 0) return { error: "Please enter a valid positive integer for days." };

    // Standard formula n*(n+1)/2 and iterative check
    const cumulativeScore = (days * (days + 1)) / 2;

    return {
      days,
      cumulativeScore,
      formatted: cumulativeScore.toLocaleString(),
      description: `Cumulative target score over ${days} training days: ${cumulativeScore.toLocaleString()} units.`
    };
  },

  // 4. Packages Pipeline using ES6 map, filter, reduce (Exp 2)
  getPackagesAnalytics() {
    // Map with computed totals
    const packageCards = trainingPackages.map(({ id, name, sessions, pricePerSession, tier, description }) => ({
      id,
      name,
      sessions,
      pricePerSession,
      tier,
      description,
      totalCost: sessions * pricePerSession
    }));

    // Reduce for total pipeline value
    const totalPipelineValue = trainingPackages.reduce(
      (acc, curr) => acc + curr.sessions * curr.pricePerSession,
      0
    );

    // Filter for elite tier packages
    const elitePackages = trainingPackages.filter(pkg => pkg.tier === "Elite");

    return {
      packages: packageCards,
      totalPipelineValue,
      formattedPipelineValue: `₹${totalPipelineValue.toLocaleString('en-IN')}`,
      totalCount: trainingPackages.length,
      eliteTierCount: elitePackages.length,
      standardTierCount: trainingPackages.length - elitePackages.length
    };
  }
};
