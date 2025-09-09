from django.shortcuts import render
from .forms import CropForm
import pickle
import numpy as np

# Load model
model = pickle.load(open("KrishiQuest/crop_model.pkl", "rb"))

def recommend_crop(request):
    crop = None
    if request.method == "POST":
        form = CropForm(request.POST)
        if form.is_valid():
            values = np.array([[
                form.cleaned_data['N'],
                form.cleaned_data['P'],
                form.cleaned_data['K'],
                form.cleaned_data['temperature'],
                form.cleaned_data['humidity'],
                form.cleaned_data['ph'],
                form.cleaned_data['rainfall']
            ]])
            crop = model.predict(values)[0]
    else:
        form = CropForm()
    return render(request, "KrishiQuest/index.html", {"form": form, "crop": crop})
