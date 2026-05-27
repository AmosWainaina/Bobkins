import random
from django.utils import timezone
from datetime import timedelta
from .models import OTP, User

def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def send_otp_via_sms(phone_number, otp_code):
    """Development mode - print OTP to console"""
    print(f"\n{'='*50}")
    print(f" OTP for {phone_number}: {otp_code}")
    print(f"{'='*50}\n")
    return True

def create_and_send_otp(user):
    """Create OTP and send to user's phone"""
    # Delete old OTPs
    OTP.objects.filter(user=user).delete()
    
    otp_code = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=5)
    
    otp = OTP.objects.create(
        user=user,
        phone_number=user.phone,
        otp_code=otp_code,
        expires_at=expires_at
    )
    
    # Send SMS
    success = send_otp_via_sms(user.phone, otp_code)
    
    return otp, success

def verify_otp(user, otp_code):
    """Verify OTP code"""
    try:
        otp = OTP.objects.filter(user=user, otp_code=otp_code).latest('created_at')
        if otp.is_valid():
            otp.is_verified = True
            otp.save()
            return True
        return False
    except OTP.DoesNotExist:
        return False