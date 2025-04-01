
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/search-flight/', views.search_flight, name='search_flight'),
    path('api/chat-assistant/', views.chat_with_assistant, name='chat_assistant'),
    path('api/search-history/', views.get_search_history, name='search_history'),
]
