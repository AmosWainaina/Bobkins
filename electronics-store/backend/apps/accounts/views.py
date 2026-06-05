from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, OTP
from .serializers import UserSerializer
from .utils import create_and_send_otp, verify_otp




class SendOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        phone = request.data.get('phone')
        full_name = request.data.get('full_name')
        admin_secret = request.data.get('admin_secret')  # Get admin secret
        
        # Check if user is trying to register as admin
        is_admin_request = False
        if admin_secret and admin_secret == '0115006114':  # Replace with your actual admin secret
            is_admin_request = True
        
        # Create or get user
        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={
                'full_name': full_name or phone,
                'is_staff': is_admin_request,      # Set admin if secret provided
                'is_superuser': is_admin_request,  # Set superuser if secret provided
            }
        )
        
        # If user already exists and admin secret provided, upgrade to admin
        if not created and is_admin_request:
            user.is_staff = True
            user.is_superuser = True
            user.save()
        
        # Send OTP
        otp, success = create_and_send_otp(user)
        
        if success:
            return Response({
                'message': 'OTP sent successfully',
                'phone': phone,
                'requires_verification': True,
                'is_admin': user.is_staff  # Return admin status
            })
        return Response({'error': 'Failed to send OTP'}, status=500)
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        phone = request.data.get('phone')
        otp_code = request.data.get('otp_code')
        
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        if verify_otp(user, otp_code):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
                'is_authenticated': True
            })
        
        return Response({'error': 'Invalid or expired OTP'}, status=400)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response(UserSerializer(request.user).data)
    
    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'})
        except Exception:
            return Response({'error': 'Invalid token'}, status=400)