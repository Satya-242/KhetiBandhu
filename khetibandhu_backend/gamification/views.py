from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from farmers.models import Farmer
from .models import Badge, FarmerBadge, Leaderboard, Reward, FarmerReward
from .serializers import (LeaderboardSerializer, FarmerBadgeSerializer, 
                         RewardSerializer, FarmerRewardSerializer)
import random
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Sum, Q

@api_view(['GET'])
def leaderboard_view(request):
    """Get leaderboard data"""
    leaderboard_type = request.GET.get('type', 'all_time')
    limit = int(request.GET.get('limit', 10))
    
    # Get or create leaderboard entries
    leaderboard_entries = Leaderboard.objects.filter(
        leaderboard_type=leaderboard_type
    ).order_by('rank')[:limit]
    
    # If no entries exist, generate them
    if not leaderboard_entries.exists():
        generate_leaderboard_data(leaderboard_type)
        leaderboard_entries = Leaderboard.objects.filter(
            leaderboard_type=leaderboard_type
        ).order_by('rank')[:limit]
    
    serializer = LeaderboardSerializer(leaderboard_entries, many=True)
    
    return Response({
        'status': 'success',
        'leaderboard': serializer.data,
        'type': leaderboard_type,
        'last_updated': leaderboard_entries.first().updated_at if leaderboard_entries else None
    })

@api_view(['GET'])
def farmer_badges(request, farmer_id):
    """Get badges earned by a farmer"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        farmer_badges = FarmerBadge.objects.filter(farmer=farmer).select_related('badge')
        
        # If no badges, award some based on farmer's activity
        if not farmer_badges.exists():
            award_initial_badges(farmer)
            farmer_badges = FarmerBadge.objects.filter(farmer=farmer).select_related('badge')
        
        serializer = FarmerBadgeSerializer(farmer_badges, many=True)
        
        return Response({
            'status': 'success',
            'badges': serializer.data,
            'total_badges': farmer_badges.count()
        })
        
    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def available_rewards(request):
    """Get available rewards"""
    rewards = Reward.objects.filter(is_active=True).order_by('cost_points')
    serializer = RewardSerializer(rewards, many=True)
    
    return Response({
        'status': 'success',
        'rewards': serializer.data
    })

@api_view(['POST'])
def redeem_reward(request, farmer_id, reward_id):
    """Redeem a reward for a farmer"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        reward = Reward.objects.get(id=reward_id, is_active=True)
        
        if farmer.total_points >= reward.cost_points:
            # Deduct points and create reward entry
            farmer.total_points -= reward.cost_points
            farmer.save()
            
            farmer_reward = FarmerReward.objects.create(
                farmer=farmer,
                reward=reward
            )
            
            return Response({
                'status': 'success',
                'message': 'Reward redeemed successfully',
                'remaining_points': farmer.total_points,
                'reward': FarmerRewardSerializer(farmer_reward).data
            })
        else:
            return Response({
                'status': 'error',
                'message': 'Insufficient points',
                'required_points': reward.cost_points,
                'available_points': farmer.total_points
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except (Farmer.DoesNotExist, Reward.DoesNotExist):
        return Response({
            'status': 'error',
            'message': 'Farmer or reward not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def farmer_stats(request, farmer_id):
    """Get comprehensive stats for a farmer"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        
        # Get farmer's rank
        farmer_rank = Leaderboard.objects.filter(
            leaderboard_type='all_time'
        ).order_by('rank').values_list('farmer_id', flat=True)
        
        rank = list(farmer_rank).index(farmer.id) + 1 if farmer.id in farmer_rank else 'Unranked'
        
        # Get badges count
        badges_count = FarmerBadge.objects.filter(farmer=farmer).count()
        
        # Get rewards redeemed
        rewards_redeemed = FarmerReward.objects.filter(farmer=farmer).count()
        
        # Get completed quests (from quests app)
        try:
            from quests.models import FarmerQuest
            completed_quests = FarmerQuest.objects.filter(
                farmer=farmer, 
                status='completed'
            ).count()
        except ImportError:
            completed_quests = 0
        
        return Response({
            'status': 'success',
            'stats': {
                'total_points': farmer.total_points,
                'rank': rank,
                'badges_earned': badges_count,
                'rewards_redeemed': rewards_redeemed,
                'quests_completed': completed_quests,
                'registration_date': farmer.created_at.strftime('%Y-%m-%d'),
                'activity_level': calculate_activity_level(farmer)
            }
        })
        
    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)

def generate_leaderboard_data(leaderboard_type='all_time'):
    """Generate dummy leaderboard data"""
    farmers = Farmer.objects.all()
    
    if not farmers.exists():
        return
    
    # Clear existing leaderboard
    Leaderboard.objects.filter(leaderboard_type=leaderboard_type).delete()
    
    # Generate points and ranks
    farmer_points = []
    for farmer in farmers:
        points = random.randint(100, 5000)
        farmer.total_points = points
        farmer.save()
        farmer_points.append((farmer, points))
    
    # Sort by points and assign ranks
    farmer_points.sort(key=lambda x: x[1], reverse=True)
    
    period_start = timezone.now() - timedelta(days=30)
    period_end = timezone.now()
    
    for rank, (farmer, points) in enumerate(farmer_points, 1):
        Leaderboard.objects.create(
            farmer=farmer,
            leaderboard_type=leaderboard_type,
            points=points,
            rank=rank,
            period_start=period_start,
            period_end=period_end
        )

def award_initial_badges(farmer):
    """Award initial badges to a farmer"""
    # Create some badges if they don't exist
    badges_data = [
        {
            'name': 'Welcome Farmer',
            'description': 'Completed registration',
            'badge_type': 'achiever',
            'icon': '🌱',
            'points_required': 0
        },
        {
            'name': 'First Quest',
            'description': 'Completed your first quest',
            'badge_type': 'achiever',
            'icon': '🎯',
            'points_required': 50
        },
        {
            'name': 'Crop Expert',
            'description': 'Expert in crop management',
            'badge_type': 'expert',
            'icon': '🌾',
            'points_required': 200
        }
    ]
    
    for badge_data in badges_data:
        badge, created = Badge.objects.get_or_create(
            name=badge_data['name'],
            defaults=badge_data
        )
        
        if farmer.total_points >= badge.points_required:
            FarmerBadge.objects.get_or_create(
                farmer=farmer,
                badge=badge
            )

def calculate_activity_level(farmer):
    """Calculate farmer's activity level"""
    points = farmer.total_points
    
    if points >= 2000:
        return 'Very Active'
    elif points >= 1000:
        return 'Active'
    elif points >= 500:
        return 'Moderate'
    elif points >= 100:
        return 'Beginner'
    else:
        return 'New'