import json
import numpy
import datetime
from core.mocap import MoCapData
from core.audio import Audio
from apps.patients.models import Patient as mPatient
from apps.patients.models import Session

class Patient:
    
    # def __init__(self, patient_id):
    def __init__(self, datafilepath):
        

        f = open(datafilepath)
        self.patient_data = json.load(f)
        self.session_list = self.patient_data['session_list']


        f.close()
        
    
    def create_patient_object():
        return

    def create_session_object(self,session_list):
        for session in self.session_list:
            sess = self.get_session_summary(session)



    def get_patient_info(self):
        

        patient_info = dict()
        
        patient_info['patient_id'] = self.patient_data['participant_name']
        patient_info['sessions'] = self.session_list 

        
        return patient_info
    
    def get_session_game_score(self,session):
        game_scores = list()
        if(self.get_num_valid_trials(session) > 0):            
            for exercise in session['exercise_list']:
                for trial in exercise['trial_list']:
                    game_scores.append(trial['score'])                  
            
        return int(numpy.mean(numpy.asarray(game_scores,dtype=numpy.float32)))
    
    def get_patient_game_score(self):
        sessions = self.session_list
        scores_list = list()
        
        for session in sessions:
            scores_list.append(self.get_session_game_score(session))
            
        
        return int(numpy.mean(numpy.asarray(scores_list,dtype=numpy.float32)))  
    
    def get_session_mean_vel(self,session):
        mean_vel = list()
        if(self.get_num_valid_trials(session) > 0):            
            for exercise in session['exercise_list']:
                for trial in exercise['trial_list']:
                    mcp = MoCapData(self.get_data_file_path(trial))
                    marker_id = mcp.get_marker_id_by_marker_name(self.get_marker_for_trial(trial))   
                    audio = Audio(self.get_audio_info(trial))
                    music_timings = audio.get_music_start_and_end_timing()
                    music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
                    
                    trial_mean_vel = mcp.get_average_vel(music_start_and_end_frame)
                    
                    mean_vel.append(trial_mean_vel)
                    
        return round(float(numpy.mean(numpy.asarray(mean_vel,dtype=numpy.float32))),2)
    
    def get_session_autocorr_score(self,session):
        autocorr_scores = list()
        if(self.get_num_valid_trials(session) > 0):            
            for exercise in session['exercise_list']:
                for trial in exercise['trial_list']:
                    mcp = MoCapData(self.get_data_file_path(trial))
                    marker_id = mcp.get_marker_id_by_marker_name(self.get_marker_for_trial(trial))   
                    audio = Audio(self.get_audio_info(trial))
                    music_timings = audio.get_music_start_and_end_timing()
                    music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
                    
                    autocorr_data = mcp.get_autocorrelation_data(music_start_and_end_frame)['autocorr'][marker_id]
                    autocorr_score = numpy.mean(numpy.absolute(numpy.asarray(autocorr_data,dtype=numpy.float32)))
                    
                    autocorr_scores.append(autocorr_score)
                    
        return round(float(numpy.mean(numpy.asarray(autocorr_scores,dtype=numpy.float32))),2)
    
    def get_session_smoothness_score(self,session):
        smoothness_scores = list()
        if(self.get_num_valid_trials(session) > 0):            
            for exercise in session['exercise_list']:
                for trial in exercise['trial_list']:
                    mcp = MoCapData(self.get_data_file_path(trial))
                    marker_id = mcp.get_marker_id_by_marker_name(self.get_marker_for_trial(trial))   
                    audio = Audio(self.get_audio_info(trial))
                    music_timings = audio.get_music_start_and_end_timing()
                    music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
                    
                    trial_smoothness_score = mcp.get_smoothness_score(marker_id,music_start_and_end_frame)

                    
                    smoothness_scores.append(trial_smoothness_score)
                    
        return round(float(numpy.mean(numpy.asarray(smoothness_scores,dtype=numpy.float32))),2)
    
    def get_session_summary(self,session):
        sess = dict()
        smoothness_scores = list()
        game_scores = list()
        mean_vel = list()
        autocorr_scores = list()
        

        audio_tracks = list()

        if(self.get_num_valid_trials(session) > 0):          
            
            sess['session_id'] = session['session_id']
            sess['time'] = datetime.datetime.fromtimestamp(int(session['time'])).strftime('%d-%m-%Y, %H:%M')            
                    
                    
            
            sess['average_score'] = self.get_session_game_score(session)
            sess['mean_velocity'] = self.get_session_mean_vel(session)
            print("session mean vel")
            print(sess['mean_velocity'])
            

            
            sess['autocorr_score'] = self.get_session_autocorr_score(session)
            print("Session autocorr score: ")
            print(sess['autocorr_score'])
            
          
            
            
            
            

        
        return sess
    
    def get_trial_summary_for_session(self,session_num):
        trial_list = []      
        selected_session = self.get_session_by_session_num(session_num)
          
        for exercise in selected_session['exercise_list']:
            
            for trial in exercise['trial_list']:
                trial_data = dict()
                mcp = MoCapData(self.get_data_file_path(trial))
                
                #skip trial if trial is not valid
                if not mcp.is_trial_valid():
                    continue
                    
                audio = Audio(self.get_audio_info(trial))
                music_timings = audio.get_music_start_and_end_timing()
                music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
                autocorr_data = mcp.get_autocorrelation_data(music_start_and_end_frame)['autocorr']
                autocorr_score = float(numpy.mean(numpy.absolute(numpy.asarray(autocorr_data,dtype=numpy.float32))))
                
                trial_data['trialscore'] = trial['score']
                trial_data['trialnum'] = trial['trial_no']
                trial_data['smoothness_score'] = mcp.get_smoothness_score(self.get_marker_for_trial(trial),music_start_and_end_frame)
                trial_data['mean_velocity'] = mcp.get_average_vel(music_start_and_end_frame)
                trial_data['autocorrelation_score'] = autocorr_score
                trial_data['audio_track'] = audio.track_name

                if (trial_data):
                    trial_list.append(trial_data)
            
            
        return trial_list
            
    

    def get_session_by_session_num(self,session_num):
        sessions = self.session_list
        for i in range(len(sessions)):
            if (sessions[i]['session_id'] == int(session_num)):
                break 

                
        selected_session = sessions[i]
        
        return selected_session
    
    def get_trial_by_trial_num(self,session,trial_num):
        for exercise in session['exercise_list']:
            trials = exercise['trial_list']
            for i in range(len(trials)):
                if trials[i]['trial_no']-1 == int(trial_num):
                    break
            selected_trial = trials[i]
            
        return selected_trial
    

    
    def get_ave_smoothness_score(self):
        sessions = self.session_list
        scores = list()
        
        for session in sessions:
            for exercise in session['exercise_list']:
                for trial in exercise['trial_list']:
                    mcp = MoCapData(self.get_data_file_path(trial))
                    if not mcp.is_trial_valid():
                        continue
                        
                    marker_id = mcp.get_marker_id_by_marker_name(self.get_marker_for_trial(trial))
                    audio = Audio(self.get_audio_info(trial))
                    music_timings = audio.get_music_start_and_end_timing()
                    music_start_and_end_frame = mcp.get_music_start_and_end_frame_index(music_timings)
                    trial_smoothness_score = mcp.get_smoothness_score(marker_id,music_start_and_end_frame) 
                    scores.append(trial_smoothness_score)
                    
        ave_smoothness = numpy.mean(numpy.asarray(trial_smoothness_score,dtype=numpy.float32))
        
        return ave_smoothness
    
    def get_movement_limits(self,trial):
        d = dict()
        d['upper_limit'] = trial['range_of_motion'][0]['value_y'][1]
        d['lower_limit'] = trial['range_of_motion'][0]['value_y'][0]
        
        return d
    
    def get_marker_name(self,trial):
        marker = trial['range_of_motion'][0]['marker_name']
        
        return marker
        
        
    def get_data_file_path(self,trial):
        
         return trial['performance_files']['data_file_name']   
        
    def get_marker_for_trial(self,trial):
            
        return trial['range_of_motion'][0]['marker_name']
    
    def get_num_valid_trials(self,session):
        num_valid_trials = 0
        
        for exercise in session['exercise_list']:
            for trial in exercise['trial_list']:
                mcp = MoCapData(self.get_data_file_path(trial))
                if not mcp.is_trial_valid():
                    continue
                    
                num_valid_trials = num_valid_trials + 1

        return num_valid_trials
 
    def get_audio_info(self,trial):
        return  trial['track_details']
        
        
                
        