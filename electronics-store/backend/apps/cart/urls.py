from django.urls import path

from .views import CartDetailView, CartAddItemView, CartUpdateItemView, CartRemoveItemView

urlpatterns = [
    path("me/", CartDetailView.as_view(), name="cart-detail"),
    path("add/", CartAddItemView.as_view(), name="cart-add"),
    path("update/", CartUpdateItemView.as_view(), name="cart-update"),
    path("remove/", CartRemoveItemView.as_view(), name="cart-remove"),
]

