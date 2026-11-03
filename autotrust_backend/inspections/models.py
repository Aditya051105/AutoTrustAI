from django.db import models
from django.contrib.auth import get_user_model
from vehicles.models import Vehicle

User = get_user_model()

class Inspection(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Assignment'),
        ('ASSIGNED', 'Assigned to Mechanic'),
        ('IN_PROGRESS', 'Inspection In Progress'),
        ('COMPLETED', 'Completed'),
        ('REJECTED', 'Rejected'),
    )

    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='inspections')
    mechanic = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='inspections_assigned')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Core categories of the inspection report
    engine_score = models.IntegerField(null=True, blank=True) # 0-100
    transmission_score = models.IntegerField(null=True, blank=True)
    exterior_score = models.IntegerField(null=True, blank=True)
    interior_score = models.IntegerField(null=True, blank=True)
    electrical_score = models.IntegerField(null=True, blank=True)
    
    mechanic_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Inspection for {self.vehicle} - {self.status}"
