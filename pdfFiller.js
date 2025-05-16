// pdfFiller.js
import { PDFDocument } from 'pdf-lib';
import DANVAScorer from './scoring.js'; // Updated to the new scoring file

export class PDFFiller {
    constructor() {
        this.scorer = new DANVAScorer();
        this.emotions = {
            1: "happy",
            2: "sad",
            3: "angry",
            4: "fearful"
        };
    }

    async loadJson(url) {
        const response = await fetch(url);
        return await response.json();
    }

    async fillPdf(jsonData, answers, pdfUrl) {
        // Process all trials first
        jsonData.forEach((trial, index) => {
            this.scorer.processTrial({
                ...trial,
                response: answers[index]
            });
        });

        const results = this.scorer.getResults();
        
        // Load PDF
        const pdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        // Fill form fields
        this.fillFormFields(form, jsonData, answers, results);

        // Save and return filled PDF
        return await pdfDoc.save();
    }

    fillFormFields(form, jsonData, answers, results) {
        // Fill individual fields
        jsonData.forEach((trial, i) => {
            const stimFilename = trial.stimFile.split("/").pop();
            const correctEmotion = this.emotions[trial.correctAnswer] || "unknown";
            const intensity = trial.intensity === 2 ? "high" : "low";
            const gender = trial.stimuliGender === 1 ? "female" : "male";
            const userAnswer = answers[i];

            form.getTextField(`stim${i}`).setText(stimFilename);
            form.getTextField(`correctAnswer${i}`).setText(`${correctEmotion}, ${intensity}, ${gender}`);

            if (userAnswer !== correctEmotion) {
                form.getTextField(`incorrectAnswer${i}`).setText(userAnswer);
            } else {
                form.getTextField(`incorrectAnswer${i}`).setText("");
            }
        });

        // Fill summary fields
        Object.entries(results).forEach(([key, value]) => {
            if (form.getTextField(key)) {
                form.getTextField(key).setText(value.toString());
            }
        });
    }
}
