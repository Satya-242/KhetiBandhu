from django.db import models
from django.contrib.auth.models import User

class Farmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    pm_kisan_id = models.CharField(max_length=20, unique=True)
    village = models.CharField(max_length=100)
    crops = models.TextField(help_text="Comma-separated list of crops")
    is_pm_kisan_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True)
    total_points = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.pm_kisan_id}"

    @staticmethod
    def verify_pm_kisan_id(pm_kisan_id):
        """Dummy PM-Kisan ID verification logic"""
        return pm_kisan_id.startswith("PMK") and len(pm_kisan_id) >= 10