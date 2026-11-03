from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Vehicle(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    variant = models.CharField(max_length=100)
    manufacturing_year = models.IntegerField()
    registration_year = models.IntegerField()
    fuel_type = models.CharField(max_length=50)
    transmission = models.CharField(max_length=50)
    mileage = models.IntegerField()
    color = models.CharField(max_length=50)
    number_of_owners = models.IntegerField()
    location = models.CharField(max_length=255)
    asking_price = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Internal Statuses
    is_verified = models.BooleanField(default=False)
    has_inspection_booked = models.BooleanField(default=False)
    
    # AI/Inspection Fields Mock Output
    trust_score = models.IntegerField(null=True, blank=True)
    fair_market_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    recommended_selling_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    repair_estimate = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.brand} {self.model} ({self.manufacturing_year})"

class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='vehicle_images/', null=True, blank=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.vehicle.brand} {self.vehicle.model}"


class VehicleDocument(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=50) # RC, Insurance...
    file_url = models.URLField()
