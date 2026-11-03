from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from vehicles.models import Vehicle, VehicleImage
from inspections.models import Inspection
from transactions.models import Offer
from inspections.ai_engine import calculate_ai_valuation

User = get_user_model()

class AutoTrustComprehensiveTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.seller = User.objects.create_user(username='seller_test', password='password123', role='SELLER')
        self.buyer = User.objects.create_user(username='buyer_test', password='password123', role='BUYER')
        self.mechanic = User.objects.create_user(username='mechanic_test', password='password123', role='MECHANIC')

        self.vehicle = Vehicle.objects.create(
            seller=self.seller,
            brand='Honda',
            model='City',
            variant='ZX',
            manufacturing_year=2021,
            registration_year=2021,
            fuel_type='Petrol',
            transmission='Automatic',
            mileage=35000,
            color='White',
            number_of_owners=1,
            location='Mumbai',
            asking_price=1200000.00
        )

    def test_marketplace_listing_unverified(self):
        """Unverified vehicles should not appear in public marketplace listing."""
        response = self.client.get('/api/vehicles/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_ai_valuation_engine_and_verification(self):
        """Simulate mechanic completing inspection and verify AI engine output."""
        inspection = Inspection.objects.create(
            vehicle=self.vehicle,
            mechanic=self.mechanic,
            status='IN_PROGRESS',
            engine_score=92,
            transmission_score=90,
            electrical_score=94,
            exterior_score=88,
            interior_score=90,
            mechanic_notes='Excellent mechanical condition.'
        )

        ai_result = calculate_ai_valuation(self.vehicle, inspection)
        self.assertGreaterEqual(ai_result['trust_score'], 70)
        self.assertTrue(ai_result['is_verified'])
        self.assertGreater(ai_result['fair_market_value'], 0)

        # Apply update via API
        self.client.force_authenticate(user=self.mechanic)
        update_response = self.client.put(f'/api/inspections/mechanic/{inspection.id}/', {
            'status': 'COMPLETED',
            'engine_score': 92,
            'transmission_score': 90,
            'electrical_score': 94,
            'exterior_score': 88,
            'interior_score': 90,
            'mechanic_notes': 'Verified test drive.'
        })
        self.assertEqual(update_response.status_code, 200)

        self.vehicle.refresh_from_db()
        self.assertTrue(self.vehicle.is_verified)
        self.assertIsNotNone(self.vehicle.trust_score)

        # Now vehicle should be visible on public marketplace
        marketplace_res = self.client.get('/api/vehicles/')
        self.assertEqual(len(marketplace_res.data), 1)

    def test_buyer_offer_workflow(self):
        """Test buyer submitting offer and seller accepting it."""
        self.client.force_authenticate(user=self.buyer)
        offer_res = self.client.post('/api/transactions/make-offer/', {
            'vehicle': self.vehicle.id,
            'offer_amount': '1150000.00',
            'message': 'Ready to buy immediately'
        })
        self.assertEqual(offer_res.status_code, 201)
        offer_id = offer_res.data['id']

        # Seller accepts offer
        self.client.force_authenticate(user=self.seller)
        accept_res = self.client.patch(f'/api/transactions/manage/{offer_id}/', {
            'status': 'ACCEPTED'
        })
        self.assertEqual(accept_res.status_code, 200)
        self.assertEqual(accept_res.data['status'], 'ACCEPTED')
