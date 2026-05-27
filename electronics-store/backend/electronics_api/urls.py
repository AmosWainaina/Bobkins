from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to Electronics Store API")



class HealthCheckView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"status": "ok"})


urlpatterns = [
    path('', home, name='home'),
    path("admin/", admin.site.urls),
    path('api/products/', include('apps.products.urls')),  
    path("accounts/", include("apps.accounts.urls")),
    path("health/", HealthCheckView.as_view(), name="health"),

    # Apps
    path("accounts/", include("apps.accounts.urls")),
    path("products/", include("apps.products.urls")),
    path("cart/", include("apps.cart.urls")),
    path("orders/", include("apps.orders.urls")),
    path("analytics/", include("apps.analytics.urls")),
]

