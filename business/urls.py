from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path('', views.ApiRoot.as_view()),
    path('business_list/', views.BusinessList.as_view(), name='business_list'),
    path('business/<str:id>/details/', views.BusinessDetails.as_view(), name='business_details'),
]

urlpatterns = format_suffix_patterns(urlpatterns)