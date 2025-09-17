from django.contrib import admin
from .models import Quest, FarmerQuest

@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ['title', 'quest_type', 'reward_points', 'difficulty_level', 'is_active']
    list_filter = ['quest_type', 'difficulty_level', 'is_active']
    search_fields = ['title', 'description']

@admin.register(FarmerQuest)
class FarmerQuestAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'quest', 'status', 'progress_percentage', 'assigned_at']
    list_filter = ['status', 'assigned_at']
    search_fields = ['farmer__name', 'quest__title']