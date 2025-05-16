export function fillResultsIntoForm(results) {
  const fields = [
    "danvasubtest", "participant", "age",
    "skippedErrors",
    "happyHighIntensityErrors", "sadHighIntensityErrors", "angryHighIntensityErrors", "fearfulHighIntensityErrors", "highIntensityErrors",
    "happyLowIntensityErrors", "sadLowIntensityErrors", "angryLowIntensityErrors", "fearfulLowIntensityErrors", "lowIntensityErrors",
    "happyErrors", "sadErrors", "angryErrors", "fearfulErrors",
    "misattributedHappySad", "misattributedHappyAngry", "misattributedHappyFearful",
    "misattributedSadHappy", "misattributedSadAngry", "misattributedSadFearful",
    "misattributedAngryHappy", "misattributedAngrySad", "misattributedAngryFearful",
    "misattributedFearfulHappy", "misattributedFearfulSad", "misattributedFearfulAngry",
    "maleHappyErrors", "maleSadErrors", "maleAngryErrors", "maleFearfulErrors", "maleTotalErrors",
    "femaleHappyErrors", "femaleSadErrors", "femaleAngryErrors", "femaleFearfulErrors", "femaleTotalErrors"
  ];

  fields.forEach(field => {
    const el = document.getElementById(field);
    if (el && results[field] !== undefined) {
      el.textContent = results[field];
    }
  });

  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const sum = (...args) => args.reduce((a, b) => a + (results[b] || 0), 0);

  setVal("genderTotalHappy", sum("maleHappyErrors", "femaleHappyErrors"));
  setVal("genderTotalSad", sum("maleSadErrors", "femaleSadErrors"));
  setVal("genderTotalAngry", sum("maleAngryErrors", "femaleAngryErrors"));
  setVal("genderTotalFearful", sum("maleFearfulErrors", "femaleFearfulErrors"));
  setVal("genderGrandTotal", sum(
    "maleHappyErrors", "maleSadErrors", "maleAngryErrors", "maleFearfulErrors",
    "femaleHappyErrors", "femaleSadErrors", "femaleAngryErrors", "femaleFearfulErrors"
  ));

  // Total Incorrect is the number of incorrect responses (including skipped)
  const totalIncorrect = results.totalerrors + results.skippedErrors;
  setVal("totalerrors", totalIncorrect);
  setVal("errorsByMisjudgement", results.totalerrors);
}

export function fillStimulusLevelDetails(stimuliData, responses, emotionMap, genderMap) {
  const tableBody = document.getElementById("stimulus-details");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  let incorrectCount = 0;

  stimuliData.forEach((item, i) => {
    const correct = emotionMap[item.correctAnswer];
    const responseCode = responses[i] ?? '0';
    const response = emotionMap[responseCode];
    const incorrect = responseCode !== item.correctAnswer.toString() && responseCode !== "0" ? response : (responseCode === "0" ? "Skipped" : "");
    const intensityStr = item.intensity === 1 ? 'Low' : 'High';
    const genderStr = genderMap[item.stimuliGender];

    if (incorrect) incorrectCount++;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.stimFile.split("/").pop()}</td>
      <td>${correct} (${intensityStr} Intensity, ${genderStr})</td>
      <td>${incorrect}</td>
    `;
    tableBody.appendChild(row);
  });

  const stimTotalEl = document.getElementById("stimulusIncorrectTotal");
  const stimGrandEl = document.getElementById("stimulusIncorrectGrandTotal");
  if (stimTotalEl) stimTotalEl.textContent = incorrectCount;
  if (stimGrandEl) stimGrandEl.textContent = incorrectCount;
}