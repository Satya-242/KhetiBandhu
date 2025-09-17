from django.urls import path
from . import views

urlpatterns = [
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
    path('badges/<int:farmer_id>/', views.farmer_badges, name='farmer_badges'),
    path('rewards/', views.available_rewards, name='available_rewards'),
    path('redeem/<int:farmer_id>/<int:reward_id>/', views.redeem_reward, name='redeem_reward'),
    path('stats/<int:farmer_id>/', views.farmer_stats, name='farmer_stats'),
]