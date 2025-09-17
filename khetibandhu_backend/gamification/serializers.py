from rest_framework import serializers
from .models import Badge, FarmerBadge, Leaderboard, Reward, FarmerReward
from farmers.serializers import FarmerSerializer

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class FarmerBadgeSerializer(serializers.ModelSerializer):
    badge = BadgeSerializer(read_only=True)
    
    class Meta:
        model = FarmerBadge
        fields = ['id', 'badge', 'earned_at']

class LeaderboardSerializer(serializers.ModelSerializer):
    farmer = FarmerSerializer(read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'farmer', 'leaderboard_type', 'points', 'rank', 
                'period_start', 'period_end', 'updated_at']

class RewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reward
        fields = '__all__'

class FarmerRewardSerializer(serializers.ModelSerializer):
    reward = RewardSerializer(read_only=True)
    
    class Meta:
        model = FarmerReward
        fields = ['id', 'reward', 'redeemed_at', 'is_used']