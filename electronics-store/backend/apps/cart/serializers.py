from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.models import Product


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_slug = serializers.SlugField(source="product.slug", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    final_price = serializers.DecimalField(source="product.final_price", max_digits=10, decimal_places=2, read_only=True)
    product_images = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product",
            "product_name",
            "product_slug",
            "product_price",
            "final_price",
            "product_images",
            "quantity",
        ]

    def get_product_images(self, obj):
        images = obj.product.images.all()
        primary = [i for i in images if getattr(i, "is_primary", False)]
        chosen = primary[0:1] if primary else images[0:1]
        return [{"image": i.image.url if hasattr(i.image, "url") else str(i.image)} for i in chosen]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "subtotal"]

    def get_subtotal(self, obj):
        return sum((item.final_price or 0) * item.quantity for item in obj.items.all())

