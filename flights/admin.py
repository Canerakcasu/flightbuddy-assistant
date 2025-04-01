
from django.contrib import admin
from .models import Flight

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('number', 'status', 'departure_airport', 'arrival_airport', 'progress')
    search_fields = ('number', 'departure_airport', 'arrival_airport')
    list_filter = ('status',)
