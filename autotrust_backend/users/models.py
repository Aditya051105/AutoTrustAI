from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('BUYER', 'Buyer'),
        ('SELLER', 'Seller'),
        ('MECHANIC', 'Mechanic'),
        ('MANAGER', 'Service Center Manager'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='BUYER')
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
