from decimal import Decimal

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order, OrderItem
from apps.products.models import Product
from apps.cart.models import Cart, CartItem


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).order_by("-created_at")
        data = [
            {
                "id": o.id,
                "status": o.status,
                "total": o.total,
                "created_at": o.created_at,
            }
            for o in qs
        ]
        return Response(data)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart:
            return Response({"error": "Cart empty"}, status=status.HTTP_400_BAD_REQUEST)

        items = list(cart.items.select_related("product").all())
        if not items:
            return Response({"error": "Cart empty"}, status=status.HTTP_400_BAD_REQUEST)

        total = sum([(i.product.final_price or i.product.price) * i.quantity for i in items])
        order = Order.objects.create(user=request.user, total=total)

        for i in items:
            OrderItem.objects.create(order=order, product=i.product, quantity=i.quantity, price=i.product.final_price or i.product.price)

            # decrement stock
            Product.objects.filter(id=i.product.id).update(stock=max(i.product.stock - i.quantity, 0))

        # clear cart
        cart.items.all().delete()

        return Response({"message": "Order placed", "order_id": order.id, "total": str(order.total)})

