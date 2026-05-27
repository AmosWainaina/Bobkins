from django.urls import path

from .views import OrderListView, CheckoutView

urlpatterns = [
    path("me/", OrderListView.as_view(), name="orders-me"),
    path("checkout/", CheckoutView.as_view(), name="orders-checkout"),
]

