from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_subscription, name='create_subscription'),
]
