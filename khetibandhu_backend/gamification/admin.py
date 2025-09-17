from django.contrib import admin
from .models import Badge, FarmerBadge, Leaderboard, Reward, FarmerReward

@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ['name', 'badge_type', 'points_required', 'is_active']
    list_filter = ['badge_type', 'is_active']
    search_fields = ['name', 'description']

@admin.register(FarmerBadge)
class FarmerBadgeAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'badge', 'earned_at']
    list_filter = ['badge', 'earned_at']
    search_fields = ['farmer__name', 'badge__name']

@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'leaderboard_type', 'rank', 'points', 'updated_at']
    list_filter = ['leaderboard_type', 'updated_at']
    search_fields = ['farmer__name']

@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = ['name', 'reward_type', 'cost_points', 'is_active']
    list_filter = ['reward_type', 'is_active']
    search_fields = ['name', 'description']

@admin.register(FarmerReward)
class FarmerRewardAdmin(admin.ModelAdmin):
    list_display = ['farmer', 'reward', 'redeemed_at', 'is_used']
    list_filter = ['reward', 'redeemed_at', 'is_used']
    search_fields = ['farmer__name', 'reward__name']