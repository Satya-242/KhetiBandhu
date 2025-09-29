from django.urls import path
from . import views

urlpatterns = [
    path('list/<int:farmer_id>/', views.farmer_quests, name='farmer_quests'),
    path('start/<int:farmer_id>/<int:quest_id>/', views.start_quest, name='start_quest'),
    path('submit/<int:farmer_id>/<int:quest_id>/', views.submit_proof, name='submit_proof'),
    path('review/<int:submission_id>/', views.review_submission, name='review_submission'),
    path('submissions/', views.list_submissions, name='list_submissions'),
]