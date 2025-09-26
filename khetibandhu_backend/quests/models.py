from django.db import models
from farmers.models import Farmer
from django.contrib.auth.models import User

class Quest(models.Model):
    QUEST_STATUS = (
        ('available', 'Available'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('expired', 'Expired')
    )
    
    QUEST_TYPE = (
        ('crop_optimization', 'Crop Optimization'),
        ('water_management', 'Water Management'),
        ('soil_health', 'Soil Health'),
        ('pest_control', 'Pest Control'),
        ('market_analysis', 'Market Analysis')
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    quest_type = models.CharField(max_length=20, choices=QUEST_TYPE)
    reward_points = models.IntegerField(default=0)
    target_crop = models.CharField(max_length=50, blank=True)
    difficulty_level = models.IntegerField(default=1, help_text="1=Easy, 5=Hard")
    duration_days = models.IntegerField(default=7)
    video_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.reward_points} points"

class FarmerQuest(models.Model):
    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Quest.QUEST_STATUS, default='available')
    assigned_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    progress_percentage = models.IntegerField(default=0)
    
    class Meta:
        unique_together = ['farmer', 'quest']
    
    def __str__(self):
        return f"{self.farmer.name} - {self.quest.title} ({self.status})"

class QuestSubmission(models.Model):
    SUBMISSION_STATUS = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    farmer = models.ForeignKey(Farmer, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    file = models.FileField(upload_to='quest_proofs/')
    notes = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=SUBMISSION_STATUS, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    review_comment = models.TextField(blank=True)

    class Meta:
        unique_together = ['farmer', 'quest', 'submitted_at']

    def __str__(self):
        return f"{self.farmer.name} - {self.quest.title} ({self.status})"