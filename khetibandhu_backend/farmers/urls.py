from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_farmer, name='register_farmer'),
    path('login/', views.login_farmer, name='login_farmer'),
    path('profile/<int:farmer_id>/', views.farmer_profile, name='farmer_profile'),
]