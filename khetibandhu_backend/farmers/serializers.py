from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Farmer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name']

class FarmerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Farmer
        fields = ['name', 'pm_kisan_id', 'village', 'crops', 'phone_number', 
                 'username', 'password', 'email']

    def validate_pm_kisan_id(self, value):
        if not Farmer.verify_pm_kisan_id(value):
            raise serializers.ValidationError("Invalid PM-Kisan ID format")
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        
        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
            first_name=validated_data['name']
        )
        
        farmer = Farmer.objects.create(
            user=user,
            is_pm_kisan_verified=True,
            **validated_data
        )
        return farmer

class FarmerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Farmer
        fields = ['id', 'user', 'name', 'pm_kisan_id', 'village', 'crops', 
                 'is_pm_kisan_verified', 'phone_number', 'total_points', 
                 'created_at', 'updated_at']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()