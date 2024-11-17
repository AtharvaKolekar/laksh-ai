from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    
    # path('',career),
    path('recommend/',post_career),
    # path('update_olympiad/<id>/', update_olympiad),
]
