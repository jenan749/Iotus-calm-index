const textarea = document.querySelector("textarea");
const message = document.getElementById("message");
const circle = document.getElementById("breathingCircle");

let startTime = null;
let totalErrors = 0;
let totalTyped = 0;

updateUI(0, 0, 100);

// نحسب الضغطات بدقة
textarea.addEventListener("keydown", function (event) {

    if (!startTime) {
        startTime = new Date();
    }

    if (event.key === "Backspace") {
        totalErrors++;
    }

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        totalTyped++;
    }
});

textarea.addEventListener("input", function () {

    const text = textarea.value;

    if (text.length === 0) {
        startTime = null;
        totalErrors = 0;
        totalTyped = 0;
        updateUI(0, 0, 100);
        return;
    }

    let elapsedSeconds = (new Date() - startTime) / 1000;
    if (elapsedSeconds < 1) elapsedSeconds = 1;

    // سرعة الكتابة
    let wpm = ((text.length / 5) / elapsedSeconds) * 60;

    // نسبة الأخطاء (مستقرة)
    let totalActions = totalTyped + totalErrors;
    let errorRate = totalActions > 0
        ? (totalErrors / totalActions) * 100
        : 0;

    errorRate = Math.min(errorRate, 100);

    // Calm Index
    let calmScore = 100 - (wpm * 0.4) - (errorRate * 5);
    calmScore = Math.max(0, Math.min(100, calmScore));

    updateUI(wpm, errorRate, calmScore);
});

function updateUI(wpm, errorRate, calmScore) {

    document.getElementById("speed").textContent = wpm.toFixed(1);
    document.getElementById("errors").textContent = errorRate.toFixed(1);
    document.getElementById("calmScore").textContent = calmScore.toFixed(0);

    const calmBar = document.getElementById("calmBar");
    calmBar.style.width = calmScore + "%";

    if (calmScore >= 80) {
        calmBar.style.backgroundColor = "#4CAF50";
    } else if (calmScore >= 50) {
        calmBar.style.backgroundColor = "#FFC107";
    } else {
        calmBar.style.backgroundColor = "#F44336";
    }

    if (wpm === 0 && errorRate === 0) {
        message.textContent = "Start typing to measure your calm pattern 🌿";
        circle.style.display = "none";
        return;
    }

    if (calmScore < 60) {
        message.textContent =
            "You seem a little tense 💛 Take a short breathing break.";
        circle.style.display = "block";
    } else {
        message.textContent = "";
        circle.style.display = "none";
    }
}
