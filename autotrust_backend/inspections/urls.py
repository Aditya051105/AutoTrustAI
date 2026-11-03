from django.urls import path
from .views import BookInspectionView, MechanicInspectionListView, MechanicInspectionUpdateView, ClaimInspectionView

urlpatterns = [
    path('book/', BookInspectionView.as_view(), name='book-inspection'),
    path('mechanic/', MechanicInspectionListView.as_view(), name='mechanic-inspections'),
    path('mechanic/<int:pk>/', MechanicInspectionUpdateView.as_view(), name='mechanic-inspection-update'),
    path('claim/<int:pk>/', ClaimInspectionView.as_view(), name='claim-inspection'),
]
