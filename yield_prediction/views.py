from django.shortcuts import render
import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(__file__)
model = joblib.load(os.path.join(BASE_DIR, "yield_model_xgb.pkl"))
le_crop = joblib.load(os.path.join(BASE_DIR, "le_crop.pkl"))
le_district = joblib.load(os.path.join(BASE_DIR, "le_district.pkl"))

def predict_yield(request):
    prediction = None
    if request.method == "POST":
        crop = request.POST.get("crop")
        district = request.POST.get("district")
        year = int(request.POST.get("year"))
        production = float(request.POST.get("production"))

        # Encode categorical values
        crop_enc = le_crop.transform([crop])[0]
        district_enc = le_district.transform([district])[0]

        X = np.array([[crop_enc, district_enc, year, production]])
        prediction = model.predict(X)[0]

    return render(request, "yield_prediction/form.html", {"prediction": prediction})
