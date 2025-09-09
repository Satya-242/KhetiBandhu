from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('KrishiQuest.urls')),
    path('yield/', include('yield_prediction.urls')),  # keep like this
]
