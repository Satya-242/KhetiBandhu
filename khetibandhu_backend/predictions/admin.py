from django.contrib import admin
from .models import Prediction, WeatherData

@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'prediction_type', 'crop_name', 'prediction_value', 
                'confidence_score', 'sustainability_score', 'created_at']
    list_filter = ['prediction_type', 'season', 'created_at']
    search_fields = ['farmer__name', 'crop_name']

@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ['village', 'date', 'temperature_min', 'temperature_max', 'rainfall', 'humidity']
    list_filter = ['village', 'date']
    search_fields = ['village']