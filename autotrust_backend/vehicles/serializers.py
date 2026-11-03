from rest_framework import serializers
from .models import Vehicle, VehicleImage, VehicleDocument
from inspections.models import Inspection

class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ('id', 'image', 'image_url', 'is_primary')

    def get_image_url(self, obj):
        if obj.image:
            url = obj.image.url
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(url)
            if url.startswith('http'):
                return url
            return f"http://localhost:8000{url}"
        return obj.image_url or ''


class VehicleDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleDocument
        fields = ('id', 'doc_type', 'file_url')

class VehicleSerializer(serializers.ModelSerializer):
    images = VehicleImageSerializer(many=True, read_only=True)
    documents = VehicleDocumentSerializer(many=True, read_only=True)
    latest_inspection = serializers.SerializerMethodField()
    seller_username = serializers.ReadOnlyField(source='seller.username')
    seller_email = serializers.ReadOnlyField(source='seller.email')
    seller_phone = serializers.ReadOnlyField(source='seller.phone')

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ('seller', 'is_verified', 'has_inspection_booked', 'trust_score', 'fair_market_value', 'recommended_selling_price', 'repair_estimate', 'created_at')

    def get_latest_inspection(self, obj):
        inspection = Inspection.objects.filter(vehicle=obj, status='COMPLETED').order_by('-created_at').first()
        if inspection:
            return {
                'id': inspection.id,
                'status': inspection.status,
                'engine_score': inspection.engine_score,
                'transmission_score': inspection.transmission_score,
                'exterior_score': inspection.exterior_score,
                'interior_score': inspection.interior_score,
                'electrical_score': inspection.electrical_score,
                'mechanic_notes': inspection.mechanic_notes,
                'created_at': inspection.created_at
            }
        return None
