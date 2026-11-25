
const API_URL = "https://portfolio-applause-tapered.ngrok-free.dev/predict";

const uploadForm = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const uploadArea = document.getElementById("uploadArea");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");
const plantName = document.getElementById("plantName");
const confidence = document.getElementById("confidence");
const message = document.getElementById("message");

let selectedFile = null;

function showMessage(text) {
    message.textContent = text;
}

function validateImage(file) {
    if (!file) return false;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
        showMessage("Please select a JPG or PNG image.");
        return false;
    }

    if (file.size > 10 * 1024 * 1024) {
        showMessage("Image size must be below 10 MB.");
        return false;
    }

    return true;
}

function selectImage(file) {
    if (!validateImage(file)) return;

    selectedFile = file;
    preview.src = URL.createObjectURL(file);
    preview.hidden = false;
    predictBtn.disabled = false;
    result.hidden = true;
    showMessage("");
}

// Image selection
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) selectImage(file);
});

// Drag and drop
uploadArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    uploadArea.classList.add("dragging");
});

uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragging");
});

uploadArea.addEventListener("drop", (event) => {
    event.preventDefault();
    uploadArea.classList.remove("dragging");

    const file = event.dataTransfer.files[0];
    if (!file) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    imageInput.files = transfer.files;

    selectImage(file);
});

// AI prediction
uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedFile) {
        showMessage("Please select a leaf image first.");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    predictBtn.disabled = true;
    predictBtn.textContent = "Analyzing Leaf...";
    showMessage("AI is analyzing your leaf image...");
    result.hidden = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true"
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed.");
        }

        plantName.textContent = data.plant;
        confidence.textContent = data.confidence + "%";
        result.hidden = false;
        showMessage("Plant identified successfully!");

    } catch (error) {
        showMessage("Connection error: " + error.message);
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = 'Identify Plant <span>→</span>';
    }
});
