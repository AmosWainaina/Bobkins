from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Brand, Review
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer, ReviewSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'brand__slug', 'is_featured', 'is_bestseller']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'rating', 'discount_price']
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(product=product, user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    @action(detail=False, methods=['get'])
    def flash_sales(self, request):
        """Products with >20% discount"""
        products = self.get_queryset().filter(discount_price__isnull=False)
        products = [p for p in products if p.discount_percentage >= 20]
        serializer = self.get_serializer(products[:10], many=True)
        return Response(serializer.data)