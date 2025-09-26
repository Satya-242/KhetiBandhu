from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import QuestSubmission, FarmerQuest


@receiver(pre_save, sender=QuestSubmission)
def remember_old_status(sender, instance: QuestSubmission, **kwargs):
    if instance.pk:
        try:
            old = QuestSubmission.objects.get(pk=instance.pk)
            instance._old_status = old.status
        except QuestSubmission.DoesNotExist:
            instance._old_status = None
    else:
        instance._old_status = None


@receiver(post_save, sender=QuestSubmission)
def handle_submission_review(sender, instance: QuestSubmission, created: bool, **kwargs):
    # Only act when status transitions to approved
    old_status = getattr(instance, '_old_status', None)
    if instance.status == 'approved' and old_status != 'approved':
        # Mark farmer quest as completed
        try:
            farmer_quest = FarmerQuest.objects.get(farmer=instance.farmer, quest=instance.quest)
            farmer_quest.status = 'completed'
            farmer_quest.completed_at = timezone.now()
            farmer_quest.progress_percentage = 100
            farmer_quest.save()
        except FarmerQuest.DoesNotExist:
            pass

        # Award points to farmer
        farmer = instance.farmer
        farmer.total_points += instance.quest.reward_points
        farmer.save(update_fields=["total_points"])

