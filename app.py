#app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Load the model
with open('log_reg_model.pkl', 'rb') as model_file:
    log_reg = pickle.load(model_file)

@app.route('/api/predict', methods=['POST'])
def predict():
    # Get JSON data from the request
    data = request.json
    
    # Extract input data for the model and ensure they are floats
    Age = float(data.get('age'))
    Systolic_Pressure = float(data.get('systolic_pressure'))
    Diastolic_Pressure = float(data.get('diastolic_pressure'))
    Heart_Rate = float(data.get('heart_rate'))
    Weight = float(data.get('weight'))
    Height = float(data.get('height'))  # Now height can be a decimal value, e.g., 1.75
    
    # Calculate BMI and Stress Score
    BMI = Weight / (Height * Height)
    Stress_Score = (0.4 * (Systolic_Pressure - 120) +
                    0.4 * (Diastolic_Pressure - 80) +
                    0.2 * (Heart_Rate - 70) +
                    0.1 * (BMI - 24))

    # Create DataFrame for model input
    input_data = pd.DataFrame({
        'Age': [Age],
        'Systolic_Pressure': [Systolic_Pressure],
        'Diastolic_Pressure': [Diastolic_Pressure],
        'Heart_Rate': [Heart_Rate],
        'Weight': [Weight],
        'Height': [Height],
        'BMI': [BMI],
        'Stress_Score': [Stress_Score]
    })
    
    # Make prediction
    prediction = log_reg.predict(input_data)
    
    # Return the result as JSON
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)
