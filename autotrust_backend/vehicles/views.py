from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Q
from .models import Vehicle, VehicleImage
from .serializers import VehicleSerializer

class VehicleListView(generics.ListAPIView):
    """Public marketplace: highly trusted and verified vehicles only."""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Vehicle.objects.filter(is_verified=True)
        
        # Search query (brand, model, variant, location)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(brand__icontains=search) |
                Q(model__icontains=search) |
                Q(variant__icontains=search) |
                Q(location__icontains=search)
            )
            
        # Fuel type filter
        fuel_type = self.request.query_params.get('fuel_type')
        if fuel_type and fuel_type != 'All':
            queryset = queryset.filter(fuel_type__iexact=fuel_type)
            
        # Transmission filter
        transmission = self.request.query_params.get('transmission')
        if transmission and transmission != 'All':
            queryset = queryset.filter(transmission__iexact=transmission)
            
        # Min / Max price
        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(asking_price__gte=float(min_price))
            except ValueError:
                pass
                
        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(asking_price__lte=float(max_price))
            except ValueError:
                pass
                
        # Sorting
        sort_by = self.request.query_params.get('sort_by', 'trust_score')
        if sort_by == 'price_low':
            queryset = queryset.order_by('asking_price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-asking_price')
        elif sort_by == 'mileage_low':
            queryset = queryset.order_by('mileage')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by('-trust_score', '-created_at')
            
        return queryset

class VehicleDetailView(generics.RetrieveAPIView):
    """Public details of a vehicle."""
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [permissions.AllowAny]

class VehicleCreateView(generics.CreateAPIView):
    """Sellers creating a new listing."""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        vehicle = serializer.save(seller=self.request.user)
        
        # Handle gallery file uploads
        uploaded_files = self.request.FILES.getlist('images') or self.request.FILES.getlist('image')
        if uploaded_files:
            for idx, img_file in enumerate(uploaded_files):
                VehicleImage.objects.create(
                    vehicle=vehicle,
                    image=img_file,
                    is_primary=(idx == 0)
                )
        else:
            image_url = self.request.data.get('image_url')
            if image_url:
                VehicleImage.objects.create(vehicle=vehicle, image_url=image_url, is_primary=True)

class SellerVehicleListView(generics.ListAPIView):
    """A seller's own vehicles in dashboard."""
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(seller=self.request.user).order_by('-created_at')

class VehicleDeleteView(generics.DestroyAPIView):
    """Allows sellers to delete their own vehicle listing."""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(seller=self.request.user)
