# patients/models.py

from django.db import models

# Create your models here.


class Patient (models.Model):
    patient_id = models.CharField(max_length = 24,primary_key = True, unique=True)
    # patient_name = models.CharField(max_length=255)
    # patient_age = models.IntegerField()
    # patient_diagnosis = models.CharField(max_length=255)

    
    
class Session (models.Model):
    session_id = models.CharField(max_length = 255, primary_key = True)
    session_time = models.CharField(max_length = 255)
    session_score = models.FloatField()
    session_mean_vel = models.FloatField()
    session_autocorr_score = models.FloatField()
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    
class Exercise(models.Model):
    exercise_id = models.UUIDField(primary_key = True)
    exercise_type = models.CharField(max_length=255)
    exercise_side = models.CharField(max_length=255)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    
class Trial(models.Model):
    trial_id = models.UUIDField(primary_key = True)
    track_name = models.CharField(max_length=255)
    track_file = models.CharField(max_length=1024)
    beat_divider = models.IntegerField()
    smoothness_score = models.FloatField()
    mean_velocity = models.FloatField()
    autocorrelation_score = models.FloatField()
    kinematics = models.JSONField()



    
    
    
    


    
    

