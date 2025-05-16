export function computeScoring(stimuliData, responses) {
    const emotionMap = { 1: "Happy", 2: "Sad", 3: "Angry", 4: "Fearful" };
    const genderMap = { 1: "Female", 2: "Male" };
  
    const results = {};
    const fields = [
      "happyHighIntensityErrors", "happyLowIntensityErrors", "sadHighIntensityErrors", "sadLowIntensityErrors",
      "angryHighIntensityErrors", "angryLowIntensityErrors", "fearfulHighIntensityErrors", "fearfulLowIntensityErrors",
      "happyErrors", "sadErrors", "angryErrors", "fearfulErrors",
      "highIntensityErrors", "lowIntensityErrors", "totalerrors", "skippedErrors", "errorsByMisjudgement",
      "misattributedHappySad", "misattributedHappyAngry", "misattributedHappyFearful",
      "misattributedSadHappy", "misattributedSadAngry", "misattributedSadFearful",
      "misattributedAngryHappy", "misattributedAngrySad", "misattributedAngryFearful",
      "misattributedFearfulHappy", "misattributedFearfulSad", "misattributedFearfulAngry",
      "maleHappyErrors", "maleSadErrors", "maleAngryErrors", "maleFearfulErrors", "maleTotalErrors",
      "femaleHappyErrors", "femaleSadErrors", "femaleAngryErrors", "femaleFearfulErrors", "femaleTotalErrors"
    ];
    fields.forEach(f => results[f] = 0);
  
    stimuliData.forEach((stim, i) => {
      const responseCode = responses[i] ?? '0';
      const response = emotionMap[responseCode] || "Skipped";
      const correct = emotionMap[stim.correctAnswer];
      const isSkipped = responseCode === '0';
      const isIncorrect = !isSkipped && response !== correct;
      const intensityStr = stim.intensity === 1 ? 'Low' : 'High';
      const genderStr = stim.stimuliGender === 1 ? 'female' : 'male';
  
      if (isIncorrect || isSkipped) {
        results[`${correct.toLowerCase()}Errors`]++;
        results[`${correct.toLowerCase()}${intensityStr}IntensityErrors`]++;
        results[`${intensityStr.toLowerCase()}IntensityErrors`]++;
        results[`${genderStr}${correct}Errors`]++;
        results[`${genderStr}TotalErrors`]++;
      }
  
      if (isIncorrect) {
        results.totalerrors++;
        if (responseCode !== '0') {
          results[`misattributed${correct}${response}`]++;
        }
      } else if (isSkipped) {
        results.skippedErrors++;
      }
    });
  
    results.errorsByMisjudgement = results.totalerrors - results.skippedErrors;
    return results;
  }
  