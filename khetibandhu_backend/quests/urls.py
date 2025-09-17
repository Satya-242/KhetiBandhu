from django.urls import path
from . import views

urlpatterns = [
    path('list/<int:farmer_id>/', views.farmer_quests, name='farmer_quests'),
    path('start/<int:farmer_id>/<int:quest_id>/', views.start_quest, name='start_quest'),
]