from rest_framework import serializers
from .models import Quest, FarmerQuest

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = '__all__'

class FarmerQuestSerializer(serializers.ModelSerializer):
    quest = QuestSerializer(read_only=True)
    
    class Meta:
        model = FarmerQuest
        fields = ['id', 'quest', 'status', 'assigned_at', 'started_at', 
                 'completed_at', 'progress_percentage']