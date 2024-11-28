document.getElementById("inputForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect input values
    const age = document.getElementById("input1").value;
    const systolicPressure = document.getElementById("input2").value;
    const diastolicPressure = document.getElementById("input3").value;
    const heartRate = document.getElementById("input4").value;
    const weight = document.getElementById("input5").value;
    const height = document.getElementById("input6").value;

    try {
        // Send data to the Flask API
        const response = await fetch("http://127.0.0.1:5000/api/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                age,
                systolic_pressure: systolicPressure,
                diastolic_pressure: diastolicPressure,
                heart_rate: heartRate,
                weight,
                height
            })
        });

        const result = await response.json();
        const prediction = result.prediction;
        let precautions = "";

        // Set precautions based on the prediction
        switch (prediction) {
            case 1:
                precautions = "Maintain a balanced diet, stay hydrated, and get regular physical activity.";
                break;
            case 2:
                precautions = "Practice mindfulness or meditation, ensure quality sleep, and limit caffeine intake.";
                break;
            case 3:
                precautions = "Take short breaks throughout the day, engage in hobbies, and seek social support if needed.";
                break;
            case 4:
                precautions = "Consider speaking to a counselor, focus on stress management techniques, and try deep-breathing exercises.";
                break;
            case 5:
                precautions = "Consult a healthcare professional for personalized advice, and prioritize self-care activities daily.";
                break;
            default:
                precautions = "Invalid stress level detected.";
        }

        // Display the result and precautions
        document.body.innerHTML = `
        <div class="container">
            <h1>Your stress level is:<h2 style="font-size: 48px;"> ${prediction}</h2></h1>
            <p>${precautions}</p>
            <button onclick="window.location.reload()">Go back to Home</button>
        </div>
`;


    } catch (error) {
        console.error("Error:", error);
        document.getElementById("answer").textContent = "An error occurred. Please try again.";
    }
});
