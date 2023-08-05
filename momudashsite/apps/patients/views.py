from django.shortcuts import render,redirect
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

#from core.utils import read_json,read_trc
from core.mocap import MoCapData
from core.patient import Patient
from core.audio import Audio

import logging
import json
import datetime
import numpy
import os

logger = logging.getLogger(__name__)

patient_list = sorted([f.name for f in os.scandir("static/data/Demo/") if f.is_dir() ])

@ensure_csrf_cookie
def index(request):

    
    
    patient_file_path = "static/data/Demo/Demo/Demo.json"
    if(request.method == "POST"):
        
        patient_id = request.POST["patient_id"]
        patient_file_path = "static/data/Demo/Demo/Demo.json"

    #parse in patient id instead of patient file path     
    patient = Patient(patient_file_path)

    # patient = Patient(patient_list[0])

    request.session['patient'] = patient_file_path
    patient_info = patient.get_patient_info()
    sessions = patient_info['sessions']
    sessions_list = []
    scores = []
    vel_list = list()
    
    
    for session in sessions:
        sess = dict()
        sess = patient.get_session_summary(session)  
        
        if(sess):
            scores.append(sess['average_score'])
            vel_list.append(sess['mean_velocity'])
            sessions_list.append(sess)
            
            
    
    ave_score = int(numpy.mean(numpy.asarray(scores,dtype=numpy.float32)))
    mean_vel = round(float(numpy.mean(numpy.asarray(vel_list,dtype=numpy.float32))),2)
    
   
    
    
    data={
        "patient_id":patient_info['patient_id'],
        "num_sessions": len(sessions_list),
        "ave_score": ave_score,
        "sessions_list":sessions_list,
        "patient_list": patient_list,
        "mean_velocity":mean_vel
    }
    
    
    
    if(request.method=="POST"):
        return JsonResponse(data)
    else:
        return render(request, 'dashboard.html',data)


def session_overview(request):
    patient = Patient(request.session['patient'])
    session = None
    if request.method == "POST":
        session_id = int(request.POST['session_id'])
        session = patient.get_trial_summary_for_session(session_id)
    
        
    return JsonResponse({"session_data":session})

def leaderboard(request):
    
    ave_score_list=[]
    final_patient_list=[]
    
    for patient_name in patient_list:
        print(patient_name)
        patient_dict = dict()
        patient_file_path = "static/data/MovementData/"+patient_name+"/"+patient_name+".json"
        patient = Patient(patient_file_path)

        patient_score = patient.get_patient_game_score()

        patient_dict['ave_score']= patient_score
        patient_dict['patient_id'] =patient_name
        final_patient_list.append(patient_dict)
    
    
    data={
        "leaderboard_list":final_patient_list
    }
        
        
    return JsonResponse(data)
        
        
        
    
    
    
    






    
    
