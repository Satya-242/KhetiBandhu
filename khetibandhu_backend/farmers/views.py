from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import Farmer
from .serializers import FarmerRegistrationSerializer, FarmerSerializer, LoginSerializer

@api_view(['POST'])
def register_farmer(request):
    """Register a new farmer with PM-Kisan ID verification"""
    serializer = FarmerRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        farmer = serializer.save()
        token, created = Token.objects.get_or_create(user=farmer.user)
        
        return Response({
            'status': 'success',
            'message': 'Farmer registered successfully',
            'farmer': FarmerSerializer(farmer).data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_farmer(request):
    """Login farmer"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            try:
                farmer = Farmer.objects.get(user=user)
                token, created = Token.objects.get_or_create(user=user)
                
                return Response({
                    'status': 'success',
                    'message': 'Login successful',
                    'farmer': FarmerSerializer(farmer).data,
                    'token': token.key
                })
            except Farmer.DoesNotExist:
                return Response({
                    'status': 'error',
                    'message': 'Farmer profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'status': 'error',
            'message': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def farmer_profile(request, farmer_id):
    """Get farmer profile"""
    try:
        farmer = Farmer.objects.get(id=farmer_id)
        return Response({
            'status': 'success',
            'farmer': FarmerSerializer(farmer).data
        })
    except Farmer.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Farmer not found'
        }, status=status.HTTP_404_NOT_FOUND)