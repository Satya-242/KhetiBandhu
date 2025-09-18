from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from farmers.models import Farmer
from .models import Prediction, WeatherData
from .serializers import PredictionSerializer, WeatherDataSerializer
import random
from datetime import datetime, timedelta
from django.utils import timezone

@api_view(['GET'])
def farmer_predictions(request, farmer_id):
    """Get predictions for a specific farmer"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        
        # Get existing predictions
        predictions = Prediction.objects.filter(
            farmer=farmer,
            valid_until__gt=timezone.now()
        ).order_by('-created_at')
        
        # If no predictions exist, generate dummy ones
        if not predictions.exists():
            generate_dummy_predictions(farmer)
            predictions = Prediction.objects.filter(
                farmer=farmer,
                valid_until__gt=timezone.now()
            ).order_by('-created_at')
        
        serializer = PredictionSerializer(predictions, many=True)
        
        # Also get weather data for farmer's village
        weather_data = WeatherData.objects.filter(
            village=farmer.village
        ).order_by('-date')[:7]  # Last 7 days
        
        weather_serializer = WeatherDataSerializer(weather_data, many=True)
        
        return Response({
            'status': 'success',
            'predictions': serializer.data,
            'weather_data': weather_serializer.data,
            'summary': generate_prediction_summary(predictions)
        })
        
    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)

def generate_dummy_predictions(farmer):
    """Generate dummy ML-like predictions for a farmer"""
    crops = farmer.crops.split(',')
    crops = [crop.strip() for crop in crops if crop.strip()]
    
    prediction_templates = [
        {
            'type': 'crop_yield',
            'values': ['+15%', '+22%', '+8%', '-5%', '+18%'],
            'confidence_range': (0.75, 0.95),
            'sustainability_range': (70, 95)
        },
        {
            'type': 'rainfall',
            'values': ['120mm expected', '85mm expected', '150mm expected', '95mm expected'],
            'confidence_range': (0.65, 0.85),
            'sustainability_range': (60, 80)
        },
        {
            'type': 'market_price',
            'values': ['₹2,500/quintal', '₹1,850/quintal', '₹3,200/quintal', '₹2,100/quintal'],
            'confidence_range': (0.70, 0.90),
            'sustainability_range': (50, 75)
        },
        {
            'type': 'pest_risk',
            'values': ['Low Risk', 'Medium Risk', 'High Risk', 'Very Low Risk'],
            'confidence_range': (0.80, 0.95),
            'sustainability_range': (65, 90)
        }
    ]
    
    for crop in crops[:3]:  # Limit to 3 crops
        for template in prediction_templates:
            Prediction.objects.create(
                farmer=farmer,
                prediction_type=template['type'],
                crop_name=crop,
                prediction_value=random.choice(template['values']),
                confidence_score=random.uniform(*template['confidence_range']),
                sustainability_score=random.randint(*template['sustainability_range']),
                season='Kharif 2024',
                valid_until=timezone.now() + timedelta(days=30)
            )

def generate_prediction_summary(predictions):
    """Generate a summary of predictions"""
    if not predictions:
        return {}
    
    avg_confidence = sum(p.confidence_score for p in predictions) / len(predictions)
    avg_sustainability = sum(p.sustainability_score for p in predictions) / len(predictions)
    
    return {
        'total_predictions': len(predictions),
        'average_confidence': round(avg_confidence * 100, 1),
        'average_sustainability_score': round(avg_sustainability, 1),
        'last_updated': predictions[0].created_at.strftime('%Y-%m-%d %H:%M') if predictions else None
    }

@api_view(['GET'])
def weather_forecast(request, village):
    """Get weather forecast for a village"""
    weather_data = WeatherData.objects.filter(
        village__icontains=village
    ).order_by('-date')[:10]
    
    if not weather_data.exists():
        # Generate dummy weather data
        generate_dummy_weather(village)
        weather_data = WeatherData.objects.filter(
            village__icontains=village
        ).order_by('-date')[:10]
    
    serializer = WeatherDataSerializer(weather_data, many=True)
    return Response({
        'status': 'success',
        'weather_data': serializer.data
    })

def generate_dummy_weather(village):
    """Generate dummy weather data"""
    for i in range(10):
        date = timezone.now().date() - timedelta(days=i)
        WeatherData.objects.get_or_create(
            village=village,
            date=date,
            defaults={
                'temperature_min': random.uniform(18, 25),
                'temperature_max': random.uniform(28, 38),
                'rainfall': random.uniform(0, 50),
                'humidity': random.uniform(40, 85)
            }
        )