import { loadStimuliData } from './dataLoader.js';
import { computeScoring } from './scoring.js';
import { fillResultsIntoForm, fillStimulusLevelDetails } from './formFiller.js';

async function runScoring() {
  const input = document.getElementById("responseStringInput");
  const raw = input?.value.trim();
  const responseString = raw && raw.length > 0 ? raw : null;

  const { stimuliData, responses } = await loadStimuliData('adult_faces.json', responseString);

  const emotionMap = { 1: "Happy", 2: "Sad", 3: "Angry", 4: "Fearful" };
  const genderMap = { 1: "Female", 2: "Male" };

  const results = computeScoring(stimuliData, responses);

  fillResultsIntoForm(results);
  fillStimulusLevelDetails(stimuliData, responses, emotionMap, genderMap);

  // Draw horizontal stacked bar chart
  const ctx = document.getElementById('errorBarChart')?.getContext('2d');
  if (ctx) {
    if (window.barChart) window.barChart.destroy();
    window.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Errors (0–24 scale)'],
        datasets: [
          {
            label: 'Happy',
            data: [results.happyErrors],
            backgroundColor: '#00FF00'
          },
          {
            label: 'Sad',
            data: [results.sadErrors],
            backgroundColor: '#0000FF'
          },
          {
            label: 'Angry',
            data: [results.angryErrors],
            backgroundColor: '#FF0000'
          },
          {
            label: 'Fearful',
            data: [results.fearfulErrors],
            backgroundColor: '#FFFF00'
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Total Errors by Emotion (Stacked, includes Skipped)'
          }
        },
        scales: {
          x: {
            stacked: true,
            min: 0,
            max: 24,
            ticks: {
              stepSize: 2
            },
            title: {
              display: true,
              text: 'Error Count'
            }
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById("runScoringButton");
  if (runButton) runButton.addEventListener("click", runScoring);
  runScoring();
});
