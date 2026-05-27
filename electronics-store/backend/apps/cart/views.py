from decimal import Decimal

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


class CartDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return Response(CartSerializer(cart).data)


class CartAddItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))
        if quantity <= 0:
            return Response({"error": "Quantity must be positive"}, status=status.HTTP_400_BAD_REQUEST)

        product = Product.objects.filter(is_active=True).filter(id=product_id).first()
        if not product:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        if product.stock <= 0:
            return Response({"error": "Out of stock"}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        new_qty = min(quantity if created else item.quantity + quantity, product.stock)
        item.quantity = new_qty
        item.save()

        return Response(CartItemSerializer(item).data, status=status.HTTP_201_CREATED)


class CartUpdateItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if not item:
            return Response({"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND)

        if quantity <= 0:
            item.delete()
            return Response({"message": "Item removed"})

        product = item.product
        item.quantity = min(quantity, product.stock)
        item.save()

        return Response(CartItemSerializer(item).data)


class CartRemoveItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product")
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({"message": "Cart empty"})

        CartItem.objects.filter(cart=cart, product_id=product_id).delete()
        return Response({"message": "Removed"})

