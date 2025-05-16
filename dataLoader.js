export async function loadStimuliData(jsonPath = 'adult_faces.json', responseString = null) {
  const response = await fetch(jsonPath);
  const stimuliData = await response.json();

  const fallback = Array(stimuliData.length).fill("1");
  const cleaned = (responseString || fallback.join(",")).trim();
  const responses = cleaned.split(',');

  return { stimuliData, responses };
}