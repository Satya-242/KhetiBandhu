from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from farmers.models import Farmer
from .models import Quest, FarmerQuest
from .serializers import FarmerQuestSerializer
import random

@api_view(['GET'])
def farmer_quests(request, farmer_id):
    """Get personalized quests for a farmer"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        
        # Get existing farmer quests
        farmer_quests = FarmerQuest.objects.filter(farmer=farmer).select_related('quest')
        
        # If farmer has no quests, assign some personalized ones
        if not farmer_quests.exists():
            assign_personalized_quests(farmer)
            farmer_quests = FarmerQuest.objects.filter(farmer=farmer).select_related('quest')
        
        serializer = FarmerQuestSerializer(farmer_quests, many=True)
        return Response({
            'status': 'success',
            'quests': serializer.data
        })
        
    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)

def assign_personalized_quests(farmer):
    """Assign personalized quests based on farmer's crops"""
    farmer_crops = farmer.crops.lower().split(',')
    farmer_crops = [crop.strip() for crop in farmer_crops]
    
    # Get quests that match farmer's crops or are general
    suitable_quests = Quest.objects.filter(
        is_active=True
    ).filter(
        models.Q(target_crop__in=farmer_crops) | 
        models.Q(target_crop='') |
        models.Q(target_crop__isnull=True)
    )[:5]
    
    # If no suitable quests, get random active quests
    if not suitable_quests:
        suitable_quests = Quest.objects.filter(is_active=True)[:5]
    
    # Create FarmerQuest entries
    for quest in suitable_quests:
        FarmerQuest.objects.get_or_create(
            farmer=farmer,
            quest=quest,
            defaults={'status': 'available'}
        )

@api_view(['POST'])
def start_quest(request, farmer_id, quest_id):
    """Start a quest for a farmer"""
    try:
        farmer_quest = FarmerQuest.objects.get(
            farmer_id=farmer_id, 
            quest_id=quest_id,
            status='available'
        )
        
        farmer_quest.status = 'in_progress'
        farmer_quest.started_at = timezone.now()
        farmer_quest.save()
        
        return Response({
            'status': 'success',
            'message': 'Quest started successfully'
        })
        
    except FarmerQuest.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Quest not available'
        }, status=status.HTTP_404_NOT_FOUND)

from django.utils import timezone
from django.db import models