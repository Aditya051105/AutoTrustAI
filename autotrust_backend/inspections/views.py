from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from .models import Inspection
from vehicles.models import Vehicle
from .serializers import InspectionSerializer, MechanicInspectionSerializer
from .ai_engine import calculate_ai_valuation

class BookInspectionView(generics.CreateAPIView):
    """Sellers booking an inspection."""
    serializer_class = InspectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        inspection = serializer.save(status='PENDING')
        # Mark vehicle as having booked an inspection
        v = inspection.vehicle
        v.has_inspection_booked = True
        v.save()

class MechanicInspectionListView(generics.ListAPIView):
    """Mechanics view assignments: pending requests or ones assigned to them."""
    serializer_class = MechanicInspectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Inspection.objects.filter(
            Q(mechanic=self.request.user) | Q(status='PENDING')
        ).order_by('-created_at')

class ClaimInspectionView(generics.GenericAPIView):
    """Allows a mechanic to claim an unassigned pending inspection."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            inspection = Inspection.objects.get(pk=pk)
            inspection.mechanic = request.user
            inspection.status = 'IN_PROGRESS'
            inspection.save()
            return Response(MechanicInspectionSerializer(inspection, context={'request': request}).data)
        except Inspection.DoesNotExist:
            return Response({'error': 'Inspection not found'}, status=status.HTTP_404_NOT_FOUND)

class MechanicInspectionUpdateView(generics.UpdateAPIView):
    """Mechanics filling the inspection report and executing AI valuation engine."""
    serializer_class = MechanicInspectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Can update if already assigned to this mechanic OR if pending
        return Inspection.objects.filter(
            Q(mechanic=self.request.user) | Q(mechanic__isnull=True) | Q(status='PENDING')
        )
        
    def perform_update(self, serializer):
        inspection = serializer.save(mechanic=self.request.user)
        
        if inspection.status == 'COMPLETED':
            v = inspection.vehicle
            ai_results = calculate_ai_valuation(v, inspection)
            
            v.trust_score = ai_results['trust_score']
            v.fair_market_value = ai_results['fair_market_value']
            v.recommended_selling_price = ai_results['recommended_selling_price']
            v.repair_estimate = ai_results['repair_estimate']
            v.is_verified = ai_results['is_verified']
            v.save()
            
            ai_summary = f"[AI Diagnostic: {ai_results['grade']} • Trust Score: {ai_results['trust_score']}/100 • FMV: ₹{float(ai_results['fair_market_value']):,.0f}]\nInsights: {ai_results['summary_notes']}"
            if ai_results['summary_notes'] not in (inspection.mechanic_notes or ''):
                if inspection.mechanic_notes:
                    inspection.mechanic_notes = f"{inspection.mechanic_notes}\n\n{ai_summary}"
                else:
                    inspection.mechanic_notes = ai_summary
                inspection.save()
