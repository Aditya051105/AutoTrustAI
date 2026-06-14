from django.db import models
from django.conf import settings


class Vehicle(models.Model):

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    brand = models.CharField(max_length=100)
    model_name = models.CharField(max_length=100)
    variant = models.CharField(max_length=100)

    manufacturing_year = models.IntegerField()

    fuel_type = models.CharField(max_length=50)

    transmission = models.CharField(max_length=50)

    kilometers_driven = models.IntegerField()

    number_of_owners = models.IntegerField()

    location = models.CharField(max_length=200)

    insurance_status = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.brand} {self.model_name}"


# ADD THIS BELOW THE VEHICLE MODEL

class VehicleImage(models.Model):

    vehicle = models.ForeignKey(
        Vehicle,
        related_name='images',
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to='vehicles/'
    )

    def __str__(self):
        return f"Image for {self.vehicle}"
    
class PricePrediction(models.Model):
    
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE
    )

    predicted_price = models.FloatField()

    confidence_score = models.FloatField(default=84)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle} - ₹{self.predicted_price}"
    
class TrustScore(models.Model):
    
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE
    )

    score = models.IntegerField()

    risk_level = models.CharField(
        max_length=20
    )

    recommendation = models.CharField(
        max_length=100
    )
class TrustScore(models.Model):
    
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE
    )

    score = models.IntegerField()

    risk_level = models.CharField(
        max_length=20
    )

    recommendation = models.CharField(
        max_length=50
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.vehicle.brand} - {self.score}"    
    
class RepairCost(models.Model):
    
    vehicle = models.OneToOneField(
        Vehicle,
        on_delete=models.CASCADE
    )

    scratch_cost = models.IntegerField(default=0)

    dent_cost = models.IntegerField(default=0)

    rust_cost = models.IntegerField(default=0)

    broken_light_cost = models.IntegerField(default=0)

    total_cost = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.vehicle.brand} Repair Cost"