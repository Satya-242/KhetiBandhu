from django.urls import path
from . import views

urlpatterns = [
    path('<int:farmer_id>/', views.farmer_predictions, name='farmer_predictions'),
    path('weather/<str:village>/', views.weather_forecast, name='weather_forecast'),
]