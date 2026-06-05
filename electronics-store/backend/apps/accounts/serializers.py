
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'phone', 
            'full_name', 
            'is_staff',      
            'is_superuser',  
            'is_active',     
            'date_joined'
        ]
        read_only_fields = ['id', 'is_staff', 'is_superuser', 'is_active', 'date_joined']


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=15)

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError('A user with this phone already exists')
        return value

    def create(self, validated_data):
        user = User(
            phone=validated_data['phone'],
            full_name=validated_data['full_name']
        )
        user.set_unusable_password()
        user.save()
        return user


class OTPSendSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)


class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp_code = serializers.CharField(max_length=6)
