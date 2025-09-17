from django.db import models
from farmers.models import Farmer

class Prediction(models.Model):
    PREDICTION_TYPE = (
        ('crop_yield', 'Crop Yield'),
        ('rainfall', 'Rainfall'),
        ('market_price', 'Market Price'),
        ('pest_risk', 'Pest Risk'),
        ('soil_health', 'Soil Health')
    )
    
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    prediction_type = models.CharField(max_length=20, choices=PREDICTION_TYPE)
    crop_name = models.CharField(max_length=50)
    prediction_value = models.CharField(max_length=100)
    confidence_score = models.FloatField(default=0.0)
    sustainability_score = models.IntegerField(default=0, help_text="Score out of 100")
    season = models.CharField(max_length=20, default='Current')
    created_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()
    
    def __str__(self):
        return f"{self.farmer.name} - {self.prediction_type} - {self.crop_name}"

class WeatherData(models.Model):
    village = models.CharField(max_length=100)
    date = models.DateField()
    temperature_min = models.FloatField()
    temperature_max = models.FloatField()
    rainfall = models.FloatField(default=0.0)
    humidity = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.village} - {self.date}"