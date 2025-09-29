from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from farmers.models import Farmer
from .models import Quest, FarmerQuest, QuestSubmission
from .serializers import FarmerQuestSerializer, QuestSubmissionSerializer
import random
from django.utils import timezone
from django.db import models
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.paginator import Paginator

@api_view(['GET'])
def farmer_quests(request, farmer_id):
    """Get personalized quests for a farmer (paginated)"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)

        # Always ensure suitable quests are assigned (idempotent)
        assign_personalized_quests(farmer)

        # Paginate assigned quests
        page = int(request.GET.get('page', '1'))
        page_size = int(request.GET.get('page_size', '20'))
        farmer_quests_qs = FarmerQuest.objects.filter(farmer=farmer).select_related('quest').order_by('id')

        paginator = Paginator(farmer_quests_qs, page_size)
        current = paginator.get_page(page)
        serializer = FarmerQuestSerializer(current.object_list, many=True)
        return Response({
            'status': 'success',
            'quests': serializer.data,
            'page': page,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'total_items': paginator.count,
        })

    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)

def assign_personalized_quests(farmer):
    """Assign personalized quests based on farmer's crops"""
    farmer_crops = farmer.crops.lower().split(',')
    farmer_crops = [crop.strip() for crop in farmer_crops]
    
    # Get quests that match farmer's crops or are general
    suitable_quests = Quest.objects.filter(
        is_active=True
    ).filter(
        models.Q(target_crop__in=farmer_crops) | 
        models.Q(target_crop='') |
        models.Q(target_crop__isnull=True)
    )
    
    # If no suitable quests, get random active quests
    if not suitable_quests:
        suitable_quests = Quest.objects.filter(is_active=True)
    
    # Create FarmerQuest entries
    for quest in suitable_quests:
        FarmerQuest.objects.get_or_create(
            farmer=farmer,
            quest=quest,
            defaults={'status': 'available'}
        )

@api_view(['POST'])
def start_quest(request, farmer_id, quest_id):
    """Start a quest for a farmer"""
    try:
        farmer_quest = FarmerQuest.objects.get(
            farmer_id=farmer_id, 
            quest_id=quest_id,
            status='available'
        )
        
        farmer_quest.status = 'in_progress'
        farmer_quest.started_at = timezone.now()
        farmer_quest.save()
        
        quest = farmer_quest.quest
        return Response({
            'status': 'success',
            'message': 'Quest started successfully',
            'video_url': quest.video_url
        })
        
    except FarmerQuest.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Quest not available'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def submit_proof(request, farmer_id, quest_id):
    """Farmer uploads proof file and optional notes for a quest"""
    try:
        farmer_quest = FarmerQuest.objects.get(
            farmer_id=farmer_id,
            quest_id=quest_id
        )
    except FarmerQuest.DoesNotExist:
        return Response({'status': 'error', 'message': 'Quest not found for farmer'}, status=status.HTTP_404_NOT_FOUND)

    uploaded_file = request.FILES.get('file')
    notes = request.data.get('notes', '')
    if not uploaded_file:
        return Response({'status': 'error', 'message': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

    submission = QuestSubmission.objects.create(
        farmer_id=farmer_id,
        quest_id=quest_id,
        file=uploaded_file,
        notes=notes
    )

    return Response({
        'status': 'success',
        'message': 'Proof submitted successfully',
        'submission': QuestSubmissionSerializer(submission).data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def review_submission(request, submission_id):
    """Admin/officer reviews a submission and approves or rejects"""
    try:
        submission = QuestSubmission.objects.get(id=submission_id)
    except QuestSubmission.DoesNotExist:
        return Response({'status': 'error', 'message': 'Submission not found'}, status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')  # 'approve' or 'reject'
    comment = request.data.get('comment', '')
    if action not in ['approve', 'reject']:
        return Response({'status': 'error', 'message': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

    submission.status = 'approved' if action == 'approve' else 'rejected'
    submission.review_comment = comment
    submission.reviewed_at = timezone.now()
    if request.user and request.user.is_authenticated:
        submission.reviewed_by = request.user
    submission.save()

    if submission.status == 'approved':
        # Mark farmer quest completed and award points
        try:
            farmer_quest = FarmerQuest.objects.get(farmer=submission.farmer, quest=submission.quest)
            farmer_quest.status = 'completed'
            farmer_quest.completed_at = timezone.now()
            farmer_quest.progress_percentage = 100
            farmer_quest.save()
        except FarmerQuest.DoesNotExist:
            pass

        farmer = submission.farmer
        farmer.total_points += submission.quest.reward_points
        farmer.save()

    return Response({
        'status': 'success',
        'message': f'Submission {submission.status}',
        'submission': QuestSubmissionSerializer(submission).data
    })

@api_view(['GET'])
def list_submissions(request):
    """List quest submissions with optional status filter and simple pagination"""
    status_filter = request.GET.get('status')
    page = int(request.GET.get('page', '1'))
    page_size = int(request.GET.get('page_size', '20'))

    qs = QuestSubmission.objects.select_related('farmer', 'quest')
    if status_filter in ['pending', 'approved', 'rejected']:
        qs = qs.filter(status=status_filter)

    paginator = Paginator(qs.order_by('-submitted_at'), page_size)
    current = paginator.get_page(page)

    data = {
        'status': 'success',
        'results': QuestSubmissionSerializer(current.object_list, many=True).data,
        'page': page,
        'page_size': page_size,
        'total_pages': paginator.num_pages,
        'total_items': paginator.count,
    }
    return Response(data)