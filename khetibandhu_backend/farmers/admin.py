from django.contrib import admin
from .models import Farmer

@admin.register(Farmer)
class FarmerAdmin(admin.ModelAdmin):
    list_display = ['name', 'pm_kisan_id', 'village', 'is_pm_kisan_verified', 'total_points']
    list_filter = ['is_pm_kisan_verified', 'village']
    search_fields = ['name', 'pm_kisan_id', 'village']