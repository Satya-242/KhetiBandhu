from django.db import models
from farmers.models import Farmer

class Badge(models.Model):
    BADGE_TYPE = (
        ('achiever', 'Achiever'),
        ('expert', 'Expert'),
        ('pioneer', 'Pioneer'),
        ('helper', 'Helper'),
        ('learner', 'Learner')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPE)
    icon = models.CharField(max_length=50, default='🏆')
    points_required = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.points_required} points"

class FarmerBadge(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['farmer', 'badge']
    
    def __str__(self):
        return f"{self.farmer.name} - {self.badge.name}"

class Leaderboard(models.Model):
    LEADERBOARD_TYPE = (
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('seasonal', 'Seasonal'),
        ('all_time', 'All Time')
    )
    
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPE)
    points = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['farmer', 'leaderboard_type', 'period_start']
    
    def __str__(self):
        return f"{self.farmer.name} - Rank {self.rank} ({self.leaderboard_type})"

class Reward(models.Model):
    REWARD_TYPE = (
        ('points', 'Points'),
        ('badge', 'Badge'),
        ('voucher', 'Voucher'),
        ('certificate', 'Certificate')
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    reward_type = models.CharField(max_length=20, choices=REWARD_TYPE)
    value = models.CharField(max_length=100)  # Points amount, voucher code, etc.
    cost_points = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} - {self.cost_points} points"

class FarmerReward(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    reward = models.ForeignKey(Reward, on_delete=models.CASCADE)
    redeemed_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.farmer.name} - {self.reward.name}"