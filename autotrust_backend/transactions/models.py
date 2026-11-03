from django.db import models
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle

User = get_user_model()

class Offer(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='offers')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offers_made')
    offer_amount = models.DecimalField(max_digits=12, decimal_places=2)
    message = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Offer of {self.offer_amount} for {self.vehicle} by {self.buyer.username}"
