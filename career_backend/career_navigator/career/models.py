from django.db import models

# Create your models here.
class Career(models.Model):
    specialization = models.CharField(max_length=100)
    interest = models.CharField(max_length=400)
    skills = models.CharField(max_length=400)
    certification = models.CharField(max_length=100)
    recommended_role = models.CharField(max_length=50, blank=True, null=True)







