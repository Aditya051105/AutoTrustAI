from django import forms
from .models import VehicleImage


class VehicleImageForm(forms.ModelForm):

    class Meta:
        model = VehicleImage
        fields = ['image']