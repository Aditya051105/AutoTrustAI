from rest_framework import generics, permissions
from .models import Offer
from .serializers import OfferSerializer, OfferDetailSerializer, OfferStatusUpdateSerializer

class CreateOfferView(generics.CreateAPIView):
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)

class BuyerOffersListView(generics.ListAPIView):
    serializer_class = OfferDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.filter(buyer=self.request.user).order_by('-created_at')

class BuyerOfferCancelView(generics.UpdateAPIView):
    """Allows buyers to cancel a pending offer."""
    serializer_class = OfferStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.filter(buyer=self.request.user, status='PENDING')

    def perform_update(self, serializer):
        serializer.save(status='CANCELLED')

class SellerOffersListView(generics.ListAPIView):
    """View all incoming offers on the seller's vehicles"""
    serializer_class = OfferDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.filter(vehicle__seller=self.request.user).order_by('-created_at')

class SellerOfferUpdateView(generics.UpdateAPIView):
    """Allow seller to change status to ACCEPTED or REJECTED"""
    serializer_class = OfferStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Offer.objects.filter(vehicle__seller=self.request.user)
        
    def perform_update(self, serializer):
        serializer.save()
