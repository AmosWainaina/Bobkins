from django.urls import path

from .views import SendOTPView, VerifyOTPView, UserProfileView, LogoutView

urlpatterns = [
    path("otp/send/", SendOTPView.as_view(), name="send-otp"),
    path("otp/verify/", VerifyOTPView.as_view(), name="verify-otp"),
    path("me/", UserProfileView.as_view(), name="user-profile"),
    path("logout/", LogoutView.as_view(), name="logout"),
]

