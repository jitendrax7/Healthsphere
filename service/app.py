from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# ===============================
# Load Saved Model
# ===============================
model = joblib.load("./heart/heart_disease_model.pkl")
print("Model Loaded Successfully!")

# Load Diabetes Model
diabetes_model = joblib.load("./Diabetes/model.pkl")
print("Diabetes Model Loaded Successfully!")
# ===============================
# Heart Disease Prediction Route
# ===============================
@app.route("/heart_predict", methods=["POST"])
def heart_predict():

    try:
        data = request.get_json()
        print("Received data for prediction:", data)  # Debugging line
        # ===============================
        # Extract Data From JSON
        # ===============================
        BMI = float(data["BMI"])
        Smoking = int(data["Smoking"])
        AlcoholDrinking = int(data["AlcoholDrinking"])
        Stroke = int(data["Stroke"])
        PhysicalHealth = float(data["PhysicalHealth"])
        MentalHealth = float(data["MentalHealth"])
        DiffWalking = int(data["DiffWalking"])
        Sex = int(data["Sex"])
        AgeCategory = int(data["AgeCategory"])
        Diabetic = int(data["Diabetic"])
        PhysicalActivity = int(data["PhysicalActivity"])
        GenHealth = int(data["GenHealth"])
        SleepTime = float(data["SleepTime"])
        Asthma = int(data["Asthma"])
        KidneyDisease = int(data["KidneyDisease"])
        SkinCancer = int(data["SkinCancer"])
        race_input = int(data["Race"])

        # ===============================
        # Race One-Hot Encoding
        # ===============================
        Race_Asian = 1 if race_input == 1 else 0
        Race_Black = 1 if race_input == 2 else 0
        Race_Hispanic = 1 if race_input == 3 else 0
        Race_Other = 1 if race_input == 4 else 0
        Race_White = 1 if race_input == 5 else 0

        # ===============================
        # Create DataFrame
        # ===============================
        input_data = pd.DataFrame([{
            "BMI": BMI,
            "Smoking": Smoking,
            "AlcoholDrinking": AlcoholDrinking,
            "Stroke": Stroke,
            "PhysicalHealth": PhysicalHealth,
            "MentalHealth": MentalHealth,
            "DiffWalking": DiffWalking,
            "Sex": Sex,
            "AgeCategory": AgeCategory,
            "Diabetic": Diabetic,
            "PhysicalActivity": PhysicalActivity,
            "GenHealth": GenHealth,
            "SleepTime": SleepTime,
            "Asthma": Asthma,
            "KidneyDisease": KidneyDisease,
            "SkinCancer": SkinCancer,
            "Race_Asian": Race_Asian,
            "Race_Black": Race_Black,
            "Race_Hispanic": Race_Hispanic,
            "Race_Other": Race_Other,
            "Race_White": Race_White
        }])

        # Ensure column order matches training
        input_data = input_data[model.feature_names_in_]

        # ===============================
        # Predict
        # ===============================
        prediction = int(model.predict(input_data)[0])
        probability = float(model.predict_proba(input_data)[0][1])

        result = {
            "prediction": prediction,
            "risk_level": "High Risk" if prediction == 1 else "Low Risk",
            "probability": round(probability, 4)
        }

        return jsonify(result)

    except Exception as e:
        print("Error during prediction:", e)  # Debugging line
        return jsonify({"error": str(e)}), 400

@app.route("/diabetes_prediction", methods=["POST"])
def diabetes_prediction():
    try:
        data = request.get_json()

        # Required numeric features
        age = int(data["age"])
        hypertension = int(data["hypertension"])
        heart_disease = int(data["heart_disease"])
        bmi = float(data["bmi"])
        hba1c = float(data["HbA1c_level"])
        glucose = float(data["blood_glucose_level"])

        # Validation
        if hypertension not in [0,1]:
            return jsonify({"error":"hypertension must be 0 or 1"}),400

        if heart_disease not in [0,1]:
            return jsonify({"error":"heart_disease must be 0 or 1"}),400

        if age < 1 or age > 120:
            return jsonify({"error":"invalid age"}),400

        if bmi < 10 or bmi > 80:
            return jsonify({"error":"invalid bmi"}),400


        # Gender encoding
        gender = data["gender"].lower()

        gender_Female = 0
        gender_Male = 0

        if gender == "female":
            gender_Female = 1
        elif gender == "male":
            gender_Male = 1
        else:
            return jsonify({"error":"gender must be male or female"}),400


        # Smoking encoding
        smoking = data["smoking_history"].lower()

        smoking_current = 0
        smoking_ever = 0
        smoking_former = 0
        smoking_never = 0
        smoking_not_current = 0

        if smoking == "current":
            smoking_current = 1

        elif smoking == "ever":
            smoking_ever = 1

        elif smoking == "former":
            smoking_former = 1

        elif smoking == "never":
            smoking_never = 1

        elif smoking == "not_current":
            smoking_not_current = 1

        else:
            return jsonify({
                "error":"invalid smoking history"
            }),400


        # Create dataframe (order MUST match training)
        input_data = pd.DataFrame([[

            age,
            hypertension,
            heart_disease,
            bmi,
            hba1c,
            glucose,

            gender_Female,
            gender_Male,

            smoking_current,
            smoking_ever,
            smoking_former,
            smoking_never,
            smoking_not_current

        ]], columns=diabetes_model.feature_names_in_)


        # Prediction
        prediction = int(diabetes_model.predict(input_data)[0])

        probability = float(
            diabetes_model.predict_proba(input_data)[0][1]
        )


        result = {

            "prediction": prediction,

            "risk_level":
            "Diabetic" if prediction==1 else "Not Diabetic",

            "probability":
            round(probability,4)

        }


        return jsonify(result)

    except KeyError as e:

        return jsonify({
            "error":f"Missing field {str(e)}"
        }),400

    except Exception as e:

        return jsonify({
            "error":str(e)
        }),400
# ===============================
# Run App
# ===============================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001)