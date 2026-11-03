from rest_framework import serializers
from .models import Offer
from vehicles.serializers import VehicleSerializer

class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'
        read_only_fields = ('buyer', 'status', 'created_at', 'updated_at')

class OfferStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ('id', 'status', 'offer_amount', 'message', 'updated_at')
        read_only_fields = ('id', 'offer_amount', 'message', 'updated_at')

class OfferDetailSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    class Meta:
        model = Offer
        fields = '__all__'
        read_only_fields = ('buyer', 'status', 'created_at', 'updated_at', 'vehicle')
