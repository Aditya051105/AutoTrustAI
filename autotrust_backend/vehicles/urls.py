from django.urls import path
from .views import (
    VehicleListView,
    VehicleDetailView,
    VehicleCreateView,
    SellerVehicleListView,
    VehicleDeleteView
)

urlpatterns = [
    path('', VehicleListView.as_view(), name='vehicle-list'),
    path('<int:pk>/', VehicleDetailView.as_view(), name='vehicle-detail'),
    path('add/', VehicleCreateView.as_view(), name='vehicle-add'),
    path('my-vehicles/', SellerVehicleListView.as_view(), name='seller-vehicles'),
    path('delete/<int:pk>/', VehicleDeleteView.as_view(), name='vehicle-delete'),
]
