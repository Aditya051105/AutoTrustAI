from rest_framework import serializers
from .models import Inspection
from vehicles.serializers import VehicleSerializer

class InspectionSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    mechanic_name = serializers.ReadOnlyField(source='mechanic.username')

    class Meta:
        model = Inspection
        fields = '__all__'
        read_only_fields = ('mechanic', 'status', 'created_at', 'engine_score', 'transmission_score', 'exterior_score', 'interior_score', 'electrical_score', 'mechanic_notes')

class MechanicInspectionSerializer(serializers.ModelSerializer):
    vehicle_details = VehicleSerializer(source='vehicle', read_only=True)
    mechanic_name = serializers.ReadOnlyField(source='mechanic.username')

    class Meta:
        model = Inspection
        fields = '__all__'
        read_only_fields = ('vehicle', 'mechanic', 'created_at')
