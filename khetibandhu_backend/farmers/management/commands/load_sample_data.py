from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from farmers.models import Farmer
from quests.models import Quest, FarmerQuest
from predictions.models import Prediction, WeatherData
from gamification.models import Badge, Reward
from datetime import datetime, timedelta
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Load sample data for KhetiBandhu'

    def handle(self, *args, **options):
        self.stdout.write('Loading sample data...')
        
        # Create sample farmers
        self.create_sample_farmers()
        
        # Create sample quests
        self.create_sample_quests()
        
        # Create sample badges
        self.create_sample_badges()
        
        # Create sample rewards
        self.create_sample_rewards()
        
        # Create sample weather data
        self.create_sample_weather_data()
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded sample data'))

    def create_sample_farmers(self):
        farmers_data = [
            {
                'name': 'Rajesh Kumar',
                'username': 'rajesh_farmer',
                'pm_kisan_id': 'PMK123456789',
                'village': 'Kisan Nagar',
                'crops': 'Rice, Wheat, Sugarcane',
                'phone': '9876543210',
                'points': 1250
            },
            {
                'name': 'Priya Sharma',
                'username': 'priya_farmer',
                'pm_kisan_id': 'PMK987654321',
                'village': 'Green Valley',
                'crops': 'Cotton, Soybean',
                'phone': '9876543211',
                'points': 2100
            },
            {
                'name': 'Amit Patel',
                'username': 'amit_farmer',
                'pm_kisan_id': 'PMK456789123',
                'village': 'Harvest Town',
                'crops': 'Tomato, Potato, Onion',
                'phone': '9876543212',
                'points': 875
            },
            {
                'name': 'Sunita Devi',
                'username': 'sunita_farmer',
                'pm_kisan_id': 'PMK789123456',
                'village': 'Kisan Nagar',
                'crops': 'Rice, Wheat',
                'phone': '9876543213',
                'points': 1680
            },
            {
                'name': 'Vikash Singh',
                'username': 'vikash_farmer',
                'pm_kisan_id': 'PMK321654987',
                'village': 'Crop Circle',
                'crops': 'Maize, Barley, Mustard',
                'phone': '9876543214',
                'points': 945
            }
        ]
        
        for farmer_data in farmers_data:
            if not User.objects.filter(username=farmer_data['username']).exists():
                user = User.objects.create_user(
                    username=farmer_data['username'],
                    password='farmer123',
                    email=f"{farmer_data['username']}@khetibandhu.com",
                    first_name=farmer_data['name'].split()[0]
                )
                
                Farmer.objects.create(
                    user=user,
                    name=farmer_data['name'],
                    pm_kisan_id=farmer_data['pm_kisan_id'],
                    village=farmer_data['village'],
                    crops=farmer_data['crops'],
                    phone_number=farmer_data['phone'],
                    is_pm_kisan_verified=True,
                    total_points=farmer_data['points']
                )
                
        self.stdout.write('Created sample farmers')

    def create_sample_quests(self):
        quests_data = [
            {
                'title': 'Optimize Water Usage',
                'description': 'Implement drip irrigation system for better water management',
                'quest_type': 'water_management',
                'reward_points': 150,
                'target_crop': 'Rice',
                'difficulty_level': 2,
                'duration_days': 14
            },
            {
                'title': 'Soil Health Assessment',
                'description': 'Test soil pH and nutrient levels in your fields',
                'quest_type': 'soil_health',
                'reward_points': 100,
                'target_crop': '',
                'difficulty_level': 1,
                'duration_days': 7
            },
            {
                'title': 'Pest Control Strategy',
                'description': 'Implement integrated pest management for cotton crops',
                'quest_type': 'pest_control',
                'reward_points': 200,
                'target_crop': 'Cotton',
                'difficulty_level': 3,
                'duration_days': 21
            },
            {
                'title': 'Market Price Analysis',
                'description': 'Analyze market trends for your crops and plan selling strategy',
                'quest_type': 'market_analysis',
                'reward_points': 120,
                'target_crop': 'Wheat',
                'difficulty_level': 2,
                'duration_days': 10
            },
            {
                'title': 'Crop Rotation Planning',
                'description': 'Plan optimal crop rotation for sustainable farming',
                'quest_type': 'crop_optimization',
                'reward_points': 180,
                'target_crop': '',
                'difficulty_level': 4,
                'duration_days': 30
            }
        ]
        
        for quest_data in quests_data:
            Quest.objects.get_or_create(
                title=quest_data['title'],
                defaults=quest_data
            )
            
        self.stdout.write('Created sample quests')

    def create_sample_badges(self):
        badges_data = [
            {
                'name': 'Welcome Farmer',
                'description': 'Successfully registered on KhetiBandhu',
                'badge_type': 'achiever',
                'icon': '🌱',
                'points_required': 0
            },
            {
                'name': 'First Quest Completed',
                'description': 'Completed your first quest',
                'badge_type': 'achiever',
                'icon': '🎯',
                'points_required': 50
            },
            {
                'name': 'Water Conservation Expert',
                'description': 'Master of water management techniques',
                'badge_type': 'expert',
                'icon': '💧',
                'points_required': 300
            },
            {
                'name': 'Soil Guardian',
                'description': 'Expert in soil health management',
                'badge_type': 'expert',
                'icon': '🌍',
                'points_required': 250
            },
            {
                'name': 'Crop Innovator',
                'description': 'Pioneer in crop optimization',
                'badge_type': 'pioneer',
                'icon': '🚀',
                'points_required': 500
            },
            {
                'name': 'Community Helper',
                'description': 'Helped fellow farmers with advice',
                'badge_type': 'helper',
                'icon': '🤝',
                'points_required': 200
            },
            {
                'name': 'Knowledge Seeker',
                'description': 'Completed learning modules',
                'badge_type': 'learner',
                'icon': '📚',
                'points_required': 150
            }
        ]
        
        for badge_data in badges_data:
            Badge.objects.get_or_create(
                name=badge_data['name'],
                defaults=badge_data
            )
            
        self.stdout.write('Created sample badges')

    def create_sample_rewards(self):
        rewards_data = [
            {
                'name': '₹50 Fertilizer Voucher',
                'description': 'Discount voucher for fertilizer purchase',
                'reward_type': 'voucher',
                'value': 'FERT50OFF',
                'cost_points': 100
            },
            {
                'name': '₹100 Seed Voucher',
                'description': 'Discount voucher for quality seeds',
                'reward_type': 'voucher',
                'value': 'SEED100OFF',
                'cost_points': 200
            },
            {
                'name': 'Farming Certificate',
                'description': 'Digital certificate of excellence in farming',
                'reward_type': 'certificate',
                'value': 'Digital Certificate',
                'cost_points': 500
            },
            {
                'name': '₹200 Equipment Voucher',
                'description': 'Discount on farming equipment',
                'reward_type': 'voucher',
                'value': 'EQUIP200OFF',
                'cost_points': 400
            },
            {
                'name': 'Bonus Points',
                'description': 'Extra 100 points for your account',
                'reward_type': 'points',
                'value': '100',
                'cost_points': 80
            }
        ]
        
        for reward_data in rewards_data:
            Reward.objects.get_or_create(
                name=reward_data['name'],
                defaults=reward_data
            )
            
        self.stdout.write('Created sample rewards')

    def create_sample_weather_data(self):
        villages = ['Kisan Nagar', 'Green Valley', 'Harvest Town', 'Crop Circle']
        
        for village in villages:
            for i in range(30):  # Last 30 days
                date = timezone.now().date() - timedelta(days=i)
                WeatherData.objects.get_or_create(
                    village=village,
                    date=date,
                    defaults={
                        'temperature_min': random.uniform(18, 25),
                        'temperature_max': random.uniform(28, 38),
                        'rainfall': random.uniform(0, 45),
                        'humidity': random.uniform(45, 85)
                    }
                )
                
        self.stdout.write('Created sample weather data')