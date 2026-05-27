from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from apps.products.models import Product
from apps.accounts.models import User


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_sales = sum(o.total for o in Order.objects.all())
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_users = User.objects.count()

        recent_orders = list(Order.objects.order_by("-created_at")[:5])
        recent_orders_payload = [
            {
                "id": o.id,
                "user_name": o.user.full_name,
                "total": str(o.total),
                "status": o.status,
            }
            for o in recent_orders
        ]

        # basic chart data stub
        sales_labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
        sales_data = [0, 0, 0, 0, 0, 0]

        return Response(
            {
                "totalSales": float(total_sales),
                "totalOrders": total_orders,
                "totalProducts": total_products,
                "totalUsers": total_users,
                "recentOrders": recent_orders_payload,
                "salesData": {"labels": sales_labels, "data": sales_data},
            }
        )

