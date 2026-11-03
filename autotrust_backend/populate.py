import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autotrust_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from vehicles.models import Vehicle, VehicleImage
from inspections.models import Inspection
from transactions.models import Offer

User = get_user_model()

def populate():
    print("Creating Demo Users...")
    seller, _ = User.objects.get_or_create(username='demo_seller', defaults={'email': 'seller@autotrust.ai', 'role': 'SELLER', 'phone': '+91 98765 43210'})
    seller.set_password('password123')
    seller.role = 'SELLER'
    seller.save()

    mechanic, _ = User.objects.get_or_create(username='demo_mechanic', defaults={'email': 'mech@autotrust.ai', 'role': 'MECHANIC', 'phone': '+91 98123 45678'})
    mechanic.set_password('password123')
    mechanic.role = 'MECHANIC'
    mechanic.save()

    buyer, _ = User.objects.get_or_create(username='demo_buyer', defaults={'email': 'buyer@autotrust.ai', 'role': 'BUYER', 'phone': '+91 99887 76655'})
    buyer.set_password('password123')
    buyer.role = 'BUYER'
    buyer.save()

    print("Creating Verified Cars...")
    vehicles_data = [
        {
            'brand': 'Ford',
            'model': 'EcoSport',
            'variant': 'Titanium S 1.5L Automatic',
            'manufacturing_year': 2022,
            'registration_year': 2022,
            'fuel_type': 'Petrol',
            'transmission': 'Automatic',
            'mileage': 24000,
            'color': 'Diamond White',
            'number_of_owners': 1,
            'location': 'Bengaluru, KA',
            'asking_price': 980000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 96,
            'fair_market_value': 995000.00,
            'recommended_selling_price': 980000.00,
            'repair_estimate': 0.00,
            'image_url': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 97,
                'transmission_score': 96,
                'exterior_score': 94,
                'interior_score': 96,
                'electrical_score': 98,
                'notes': 'Certified Pre-Owned Spotlight: 150-point physical check completed. Titanium trim powertrain in pristine condition.'
            }
        },
        {
            'brand': 'Tesla',
            'model': 'Model 3',
            'variant': 'Long Range AWD',
            'manufacturing_year': 2022,
            'registration_year': 2022,
            'fuel_type': 'Electric',
            'transmission': 'Automatic',
            'mileage': 22000,
            'color': 'Pearl White',
            'number_of_owners': 1,
            'location': 'Mumbai, MH',
            'asking_price': 3850000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 95,
            'fair_market_value': 3920000.00,
            'recommended_selling_price': 3840000.00,
            'repair_estimate': 0.00,
            'image_url': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 98,
                'transmission_score': 96,
                'exterior_score': 92,
                'interior_score': 95,
                'electrical_score': 99,
                'notes': 'Battery state of health tested at 98.4%. Drive motors whisper quiet. All autopilot sensors fully calibrated.'
            }
        },
        {
            'brand': 'Toyota',
            'model': 'Camry',
            'variant': 'XLE Hybrid',
            'manufacturing_year': 2021,
            'registration_year': 2021,
            'fuel_type': 'Hybrid',
            'transmission': 'Automatic',
            'mileage': 45000,
            'color': 'Celestial Silver',
            'number_of_owners': 1,
            'location': 'Bengaluru, KA',
            'asking_price': 2450000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 92,
            'fair_market_value': 2510000.00,
            'recommended_selling_price': 2460000.00,
            'repair_estimate': 4500.00,
            'image_url': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fd?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 94,
                'transmission_score': 93,
                'exterior_score': 88,
                'interior_score': 92,
                'electrical_score': 94,
                'notes': 'Hybrid battery cells fully balanced. Fluid levels fresh. Minor stone chips on front bumper lower lip.'
            }
        },
        {
            'brand': 'BMW',
            'model': '3 Series',
            'variant': '330i M Sport',
            'manufacturing_year': 2020,
            'registration_year': 2020,
            'fuel_type': 'Petrol',
            'transmission': 'Automatic',
            'mileage': 38000,
            'color': 'Portimao Blue',
            'number_of_owners': 1,
            'location': 'New Delhi, DL',
            'asking_price': 3400000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 89,
            'fair_market_value': 3450000.00,
            'recommended_selling_price': 3380000.00,
            'repair_estimate': 8200.00,
            'image_url': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 90,
                'transmission_score': 92,
                'exterior_score': 85,
                'interior_score': 89,
                'electrical_score': 90,
                'notes': 'ZF 8-speed shifts smoothly. Brake pads at 65% remaining life. Clean diagnostic scan with zero trouble codes.'
            }
        },
        {
            'brand': 'Hyundai',
            'model': 'Creta',
            'variant': 'SX (O) Turbo 1.4',
            'manufacturing_year': 2023,
            'registration_year': 2023,
            'fuel_type': 'Petrol',
            'transmission': 'Automatic',
            'mileage': 16000,
            'color': 'Knight Black',
            'number_of_owners': 1,
            'location': 'Hyderabad, TS',
            'asking_price': 1720000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 94,
            'fair_market_value': 1750000.00,
            'recommended_selling_price': 1715000.00,
            'repair_estimate': 0.00,
            'image_url': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 96,
                'transmission_score': 95,
                'exterior_score': 92,
                'interior_score': 95,
                'electrical_score': 96,
                'notes': 'Under manufacturer warranty until 2026. Panoramic sunroof motor inspected and greased. Almost like new.'
            }
        },
        {
            'brand': 'Honda',
            'model': 'City',
            'variant': 'ZX CVT',
            'manufacturing_year': 2021,
            'registration_year': 2021,
            'fuel_type': 'Petrol',
            'transmission': 'Automatic',
            'mileage': 32000,
            'color': 'Radiant Red',
            'number_of_owners': 1,
            'location': 'Pune, MH',
            'asking_price': 1180000.00,
            'is_verified': True,
            'has_inspection_booked': True,
            'trust_score': 87,
            'fair_market_value': 1200000.00,
            'recommended_selling_price': 1175000.00,
            'repair_estimate': 3500.00,
            'image_url': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&auto=format&fit=crop&q=80',
            'inspection': {
                'engine_score': 88,
                'transmission_score': 87,
                'exterior_score': 85,
                'interior_score': 88,
                'electrical_score': 89,
                'notes': 'i-VTEC engine operates crisply. Air conditioning blowing ice cold at 4.2°C. Clean single-owner vehicle.'
            }
        }
    ]

    created_vehicles = []
    for data in vehicles_data:
        insp_data = data.pop('inspection')
        img_url = data.pop('image_url')
        v, created = Vehicle.objects.get_or_create(seller=seller, brand=data['brand'], model=data['model'], defaults=data)
        if not created:
            for k, val in data.items():
                setattr(v, k, val)
            v.save()
        created_vehicles.append(v)

        VehicleImage.objects.get_or_create(vehicle=v, image_url=img_url, defaults={'is_primary': True})
        
        Inspection.objects.get_or_create(
            vehicle=v,
            mechanic=mechanic,
            status='COMPLETED',
            defaults={
                'engine_score': insp_data['engine_score'],
                'transmission_score': insp_data['transmission_score'],
                'exterior_score': insp_data['exterior_score'],
                'interior_score': insp_data['interior_score'],
                'electrical_score': insp_data['electrical_score'],
                'mechanic_notes': insp_data['notes']
            }
        )

    print("Creating Needs-Inspection Vehicles...")
    v_pending, _ = Vehicle.objects.get_or_create(
        seller=seller,
        brand='Mahindra',
        model='Thar',
        defaults={
            'variant': 'LX Hardtop 4x4 Diesel AT',
            'manufacturing_year': 2021,
            'registration_year': 2021,
            'fuel_type': 'Diesel',
            'transmission': 'Automatic',
            'mileage': 41000,
            'color': 'Napoli Black',
            'number_of_owners': 1,
            'location': 'Bengaluru, KA',
            'asking_price': 1380000.00,
            'is_verified': False,
            'has_inspection_booked': True
        }
    )
    VehicleImage.objects.get_or_create(
        vehicle=v_pending,
        image_url='https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&auto=format&fit=crop&q=80',
        defaults={'is_primary': True}
    )
    Inspection.objects.get_or_create(
        vehicle=v_pending,
        status='PENDING',
        defaults={'mechanic': None}
    )

    v_unbooked, _ = Vehicle.objects.get_or_create(
        seller=seller,
        brand='Tata',
        model='Nexon EV',
        defaults={
            'variant': 'Max Empowered Plus',
            'manufacturing_year': 2022,
            'registration_year': 2022,
            'fuel_type': 'Electric',
            'transmission': 'Automatic',
            'mileage': 28000,
            'color': 'Intensi-Teal',
            'number_of_owners': 1,
            'location': 'New Delhi, DL',
            'asking_price': 1420000.00,
            'is_verified': False,
            'has_inspection_booked': False
        }
    )
    VehicleImage.objects.get_or_create(
        vehicle=v_unbooked,
        image_url='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&auto=format&fit=crop&q=80',
        defaults={'is_primary': True}
    )

    print("Creating Demo Offers...")
    if created_vehicles:
        # Create an offer on Tesla Model 3
        Offer.objects.get_or_create(
            vehicle=created_vehicles[0],
            buyer=buyer,
            defaults={
                'offer_amount': 3780000.00,
                'message': 'Serious buyer. Immediate wire transfer ready once offer is accepted.',
                'status': 'PENDING'
            }
        )
        # Create an accepted offer on Toyota Camry
        Offer.objects.get_or_create(
            vehicle=created_vehicles[1],
            buyer=buyer,
            defaults={
                'offer_amount': 2420000.00,
                'message': 'Offer matches valuation. Prepared to complete transfer this Saturday.',
                'status': 'ACCEPTED'
            }
        )

    print("AutoTrust AI Demo Data Setup Complete!")

if __name__ == '__main__':
    populate()
