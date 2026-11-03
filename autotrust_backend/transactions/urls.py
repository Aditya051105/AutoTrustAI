from django.urls import path
from .views import (
    CreateOfferView, 
    BuyerOffersListView, 
    BuyerOfferCancelView, 
    SellerOffersListView, 
    SellerOfferUpdateView
)

urlpatterns = [
    path('make-offer/', CreateOfferView.as_view(), name='make-offer'),
    path('my-offers/', BuyerOffersListView.as_view(), name='buyer-offers'),
    path('cancel-offer/<int:pk>/', BuyerOfferCancelView.as_view(), name='cancel-offer'),
    path('incoming/', SellerOffersListView.as_view(), name='incoming-offers'),
    path('manage/<int:pk>/', SellerOfferUpdateView.as_view(), name='manage-offer'),
]
