
from django.db import models

class Flight(models.Model):
    number = models.CharField(max_length=10, primary_key=True)
    status = models.CharField(max_length=20)
    departure_airport = models.CharField(max_length=100)
    departure_time = models.CharField(max_length=20)
    arrival_airport = models.CharField(max_length=100)
    arrival_time = models.CharField(max_length=20)
    progress = models.IntegerField()
    remaining = models.CharField(max_length=100)
    
    def __str__(self):
        return self.number
