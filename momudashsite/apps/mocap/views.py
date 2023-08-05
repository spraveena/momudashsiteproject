from django.shortcuts import render
from django.http import JsonResponse
from core.mocap import MoCapData
from core.audio import Audio
from core.patient import Patient
import logging
import json
import datetime




def displacement(request):
    patient = Patient(request.session['patient'])
    if request.method == "POST":
        marker_index = 0
        #get session number
        trial_num = request.POST['trial_num']
        session_num = request.POST['session_id']
        
        session = patient.get_session_by_session_num(session_num)
        print("trial number: ")
        print(trial_num)
        trial = patient.get_trial_by_trial_num(session,trial_num)
        mcp = MoCapData(patient.get_data_file_path(trial))
        print("mocap file path")
        print(patient.get_data_file_path(trial))
        #patient = read_json()
        
    
        #Get range of motion object for trial to retrieve limits and marker of focus
        
        movement_limits = patient.get_movement_limits(trial)

        #Use marker of focus to get marker ID by comparing across MoCap object's marker list (mcp.get_marker_names)
        marker_index = [mcp.get_marker_id_by_marker_name(patient.get_marker_for_trial(trial)),mcp.get_marker_id_by_marker_name("ShoulderRight")]
        print("marker id for right shoulder")
        print(mcp.get_marker_id_by_marker_name("ShoulderRight"))
        print(marker_index)
        audio = Audio(patient.get_audio_info(trial))
        audio_beats = audio.get_audio_beats()
        
        mocap_disp = mcp.get_displacement_data()
        

        
        
        
        data={
            "marker_id":marker_index,
            "disp":mocap_disp['disp_data'],
            "upper_limit":movement_limits['upper_limit'],
            "lower_limit":movement_limits['lower_limit'],
            "frametime":mocap_disp['frametime'],
            "audio_beats":audio_beats
         }     

    return JsonResponse({"disp_data":data})

def velocity(request):
    patient = Patient(request.session['patient'])
    if request.method =="POST":
        marker_index = 0
        
        #get session number
        trial_num = request.POST['trial_num']
        session_num = request.POST['session_id']
        
        session = patient.get_session_by_session_num(session_num)      
        trial = patient.get_trial_by_trial_num(session,trial_num)
        mcp = MoCapData(patient.get_data_file_path(trial))
        audio = Audio(patient.get_audio_info(trial))
        music_timings = audio.get_music_start_and_end_timing()
        music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
        print("music start and end frame")
        print(music_start_and_end_frame)
        mocap_vel = mcp.get_velocity_data(music_start_and_end_frame)
    

        #Use marker of focus to get marker ID by comparing across MoCap object's marker list (mcp.get_marker_names)
        marker = patient.get_marker_name(trial)
        marker_index = mcp.get_marker_id_by_marker_name(marker)
        

        
        data={
            "marker_id":marker_index,
            "vel":mocap_vel['vel_data'],
            "frametime":mocap_vel['frametime']                        
         }     

    return JsonResponse({"vel_data":data})

def autocorr(request):
    patient = Patient(request.session['patient'])
    if request.method =="POST":
        marker_index = 0
        
        #get session number
        trial_num = request.POST['trial_num']
        session_num = request.POST['session_id']
        
        session = patient.get_session_by_session_num(session_num)      
        trial = patient.get_trial_by_trial_num(session,trial_num)
        mcp = MoCapData(patient.get_data_file_path(trial))
        audio = Audio(patient.get_audio_info(trial))
        music_timings = audio.get_music_start_and_end_timing()
        music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
        mocap_autocorr = mcp.get_autocorrelation_data(music_start_and_end_frame)
    

        #Use marker of focus to get marker ID by comparing across MoCap object's marker list (mcp.get_marker_names)
        marker_index = mcp.get_marker_id_by_marker_name(patient.get_marker_for_trial(trial) )
        
        data={
            "marker_id":marker_index,
            "autocorr":mocap_autocorr['autocorr'],
            "lags":mocap_autocorr['lags']                       
         }     

    return JsonResponse({"autocorr_data":data})

def precision(request):
    patient = Patient(request.session['patient'])
    if request.method =="POST":
        marker_index = 0
        
        #get session number
        trial_num = request.POST['trial_num']
        session_num = request.POST['session_id']
        
        session = patient.get_session_by_session_num(session_num)      
        trial = patient.get_trial_by_trial_num(session,trial_num)
        mcp = MoCapData(patient.get_data_file_path(trial))
        audio = Audio(patient.get_audio_info(trial))
        music_timings = audio.get_music_start_and_end_timing()
        music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
        mocap_prec = mcp.get_precision_data(music_start_and_end_frame)

        #Use marker of focus to get marker ID by comparing across MoCap object's marker list (mcp.get_marker_names)
        marker_index = mcp.get_marker_id_by_marker_name(patient.get_marker_for_trial(trial))
        
        audio = Audio(patient.get_audio_info(trial))      
        ideal_freq = audio.get_ideal_freq()

        
        data={
            "marker_id":marker_index,
            "spec":mocap_prec['spec'],
            "frq":mocap_prec['frq'],
            "ideal_freq": ideal_freq
         }   
        

    return JsonResponse({"prec_data":data})