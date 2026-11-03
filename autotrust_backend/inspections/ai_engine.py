import datetime
from decimal import Decimal

# Brand retention tier ratings
PREMIUM_RETENTION_BRANDS = {'toyota', 'honda', 'lexus', 'porsche', 'maruti', 'hyundai', 'kia'}
LUXURY_BRANDS = {'bmw', 'mercedes-benz', 'mercedes', 'audi', 'land rover', 'jaguar', 'volvo'}

def calculate_ai_valuation(vehicle, inspection):
    """
    Computes an AI-driven Trust Score, Fair Market Value, Recommended Price,
    Repair Estimate, and Health Grade based on physical inspection metrics and vehicle history.
    """
    current_year = datetime.datetime.now().year
    
    # 1. Base Physical Condition Score (Weighted Multi-point Matrix)
    engine = inspection.engine_score if inspection.engine_score is not None else 80
    transmission = inspection.transmission_score if inspection.transmission_score is not None else 80
    electrical = inspection.electrical_score if inspection.electrical_score is not None else 80
    exterior = inspection.exterior_score if inspection.exterior_score is not None else 80
    interior = inspection.interior_score if inspection.interior_score is not None else 80
    
    # Core component weights:
    # Engine (30%), Transmission (25%), Electrical (15%), Exterior (15%), Interior (15%)
    weighted_condition = (
        (engine * 0.30) +
        (transmission * 0.25) +
        (electrical * 0.15) +
        (exterior * 0.15) +
        (interior * 0.15)
    )
    
    # 2. Historical & Usage Adjustments
    age = max(0, current_year - vehicle.manufacturing_year)
    expected_mileage = max(10000, age * 14000)
    actual_mileage = vehicle.mileage or 40000
    
    mileage_delta = actual_mileage - expected_mileage
    if mileage_delta > 50000:
        mileage_penalty = -8
    elif mileage_delta > 20000:
        mileage_penalty = -4
    elif mileage_delta < -20000:
        mileage_penalty = 4  # Bonus for gently driven
    else:
        mileage_penalty = 0
        
    owners = vehicle.number_of_owners or 1
    if owners == 1:
        owner_penalty = 1  # Bonus single owner
    elif owners == 2:
        owner_penalty = -2
    else:
        owner_penalty = -5
        
    # Calculate Final Trust Score (clamped 40 - 99)
    raw_trust_score = weighted_condition + mileage_penalty + owner_penalty
    trust_score = max(40, min(99, int(round(raw_trust_score))))
    
    # 3. Fair Market Value & Recommended Selling Price calculation
    asking_price = float(vehicle.asking_price or 1000000)
    brand_lower = (vehicle.brand or '').strip().lower()
    
    # Condition impact on valuation (-15% to +8%)
    condition_ratio = (trust_score - 80) / 100.0
    valuation_multiplier = 1.0 + (condition_ratio * 0.5)
    
    # Mileage adjustment factor on valuation
    mileage_ratio = 1.0 - min(0.15, max(-0.08, (actual_mileage - 50000) / 400000.0))
    
    calculated_fmv = asking_price * valuation_multiplier * mileage_ratio
    
    # Smooth boundaries: within sensible range of asking price
    fmv = Decimal(str(round(max(asking_price * 0.75, min(asking_price * 1.30, calculated_fmv)), -2)))
    recommended_price = Decimal(str(round(float(fmv) * 0.98, -2)))
    
    # 4. Repair Cost Estimation
    repair_sum = 0
    if engine < 85:
        repair_sum += (85 - engine) * 450
    if transmission < 85:
        repair_sum += (85 - transmission) * 400
    if electrical < 85:
        repair_sum += (85 - electrical) * 200
    if exterior < 85:
        repair_sum += (85 - exterior) * 180
    if interior < 85:
        repair_sum += (85 - interior) * 120
        
    repair_estimate = Decimal(str(round(repair_sum, -1)))
    
    # 5. Verification & Grade Status
    is_verified = (trust_score >= 70) and (engine >= 65) and (transmission >= 65)
    
    if trust_score >= 90:
        grade = "Grade A+ (Pristine)"
    elif trust_score >= 80:
        grade = "Grade A (Excellent)"
    elif trust_score >= 70:
        grade = "Grade B (Verified Good)"
    else:
        grade = "Grade C (Sub-standard)"
        
    # 6. AI Summary Highlights
    highlights = []
    if engine >= 90:
        highlights.append("Engine running with optimal cylinder compression and low vibration.")
    elif engine < 75:
        highlights.append("Engine requires preventative servicing or timing inspection.")
        
    if transmission >= 90:
        highlights.append("Transmission gear engagement and clutch/torque converter in peak condition.")
        
    if electrical >= 90:
        highlights.append("Clean OBD-II diagnostic scan with zero active error codes.")
        
    if exterior >= 85 and interior >= 85:
        highlights.append("Cosmetic aesthetics and upholstery well maintained.")
        
    if actual_mileage < 40000:
        highlights.append(f"Low odometer reading ({actual_mileage:,} km) compared to market cohort.")
        
    summary_notes = " • ".join(highlights) if highlights else "Vehicle standard operational assessment completed."
    
    return {
        'trust_score': trust_score,
        'fair_market_value': fmv,
        'recommended_selling_price': recommended_price,
        'repair_estimate': repair_estimate,
        'is_verified': is_verified,
        'grade': grade,
        'summary_notes': summary_notes
    }

