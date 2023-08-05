import numpy
from scipy import fftpack, arange, signal
from core.smoothness import sparc

class MoCapData:

    def __init__(self, datafilepath):

        f = open(datafilepath)
        self.data = f.readlines()
        f.close()
                
        self.mocap_metadata = dict()
        metadata = self.data[2].strip().split("\t")
        self.mocap_metadata['data_rate'] = int(metadata[0])
        self.mocap_metadata['camera_rate'] = int(metadata[1])
        self.mocap_metadata['num_frames'] = int(metadata[2])
        self.mocap_metadata['num_markers'] = int(metadata[3])
        self.mocap_metadata['units'] = metadata[4]
        self.mocap_metadata['orig_data_rate'] = int(metadata[5])
        self.mocap_metadata['orig_data_frame'] = int(metadata[6])
        self.mocap_metadata['orig_num_frames'] = int(metadata[7])
        
    
    def get_metadata(self):       
        return self.mocap_metadata
    
    def get_music_start_and_end_frame_index(self,music_timings):
        frame_time = self.get_frametime()
        end_idx = 0
        start_idx = next(i for i,v in enumerate(frame_time) if v > music_timings[0])
        try:
            end_idx = next(i for i,v in enumerate(frame_time) if v > music_timings[1])-1
        except:
            end_idx = len(frame_time)-1
        
        return [start_idx,end_idx]
        
    
    def get_num_frames(self):
        return self.mocap_metadata['num_frames']
    
    def get_marker_names(self):
        self.marker_names =  [x for x in self.data[3].strip().split("\t")[2:] if x!=""]
        return self.marker_names
    
    def get_displacement_data(self):
        disp_data = list()
        d = dict()
        for j in range(0, self.mocap_metadata['num_markers']*3,3):
            marker_x = []
            marker_y = []
            marker_z = []
            for i in range(5,len(self.data)):
                data_row = self.data[i].strip().split("\t")[2:]
                marker_x.append(data_row[j])
                marker_y.append(data_row[j+1])
                marker_z.append(data_row[j+2])

            disp_data.append([signal.savgol_filter(numpy.asarray(marker_x,dtype=numpy.float32),5,0).tolist(),signal.savgol_filter(numpy.asarray(marker_y,dtype=numpy.float32),5,0).tolist(),signal.savgol_filter(numpy.asarray(marker_z,dtype=numpy.float32),5,0).tolist()])
            

            
        d = {
            "disp_data":disp_data,
            "frametime":self.get_frametime()
        }

        return d
    
    def get_velocity_data(self,idx):
        vel_data = list()
        disp = self.get_displacement_data()
        
              
        
        for marker_disp in disp['disp_data']:            
            disp_arr = numpy.asarray(marker_disp[1][idx[0]:idx[1]],dtype=numpy.float32)
            

            
            gradient_dy = numpy.gradient(disp_arr)
            dx = numpy.gradient(numpy.asarray(self.get_frametime()[idx[0]:idx[1]]))
            
            gradient_vel_vec = gradient_dy*50
            vel_data.append(gradient_vel_vec.tolist())
            

        
        d = {
            "vel_data":vel_data,
            "frametime":self.get_frametime()[idx[0]:idx[1]]
        }

        return d
    
    def get_average_vel(self,idx):
        vel = self.get_velocity_data(idx)
        ave_vel = numpy.mean(numpy.absolute(numpy.asarray(vel['vel_data'],dtype = numpy.float32)))
        
        return ave_vel.tolist()
        
    
    def autocorr(self,x):
        autocorr = numpy.correlate(signal.detrend(x),signal.detrend(x),mode="full")
        if(float(autocorr.max()) != 0):        
            return autocorr[autocorr.size // 2:]/float(autocorr.max())
        else:
            return autocorr[autocorr.size // 2:]
    
    def get_autocorrelation_data(self,idx):
        
        vel = self.get_velocity_data(idx)
        autocorr_data = list()
        d = dict()
        
        for marker_vel in vel['vel_data']:
            acc_arr = numpy.asarray(marker_vel,dtype=numpy.float32) 
            #acc_arr = numpy.asarray(marker_vel,dtype=numpy.float32)
            autocorr = self.autocorr(acc_arr)
            
            autocorr_data.append(autocorr.tolist())
        
        lags=[]       
        for i in range(len(autocorr_data[0])):
            lags.append(i)   
            
            
            
        d['autocorr'] = autocorr_data
        d['lags'] = lags

            
        return d
    
    def get_precision_data(self,idx):
        
        d= dict()
        frq_data = list()
        spec_data = list()
        frq=list()
        
        disp = self.get_displacement_data()
        
        for marker_disp in disp['disp_data']: 
            n = len(marker_disp[1][idx[0]:idx[1]])
            k = arange(n)
            T = n/50

            frq = k/T       
            spec = 2*abs(numpy.fft.fft(marker_disp[1][idx[0]:idx[1]]))
            #spec = abs(fft(marker_vel))
            amp_spec = 2*spec[1:int(len(spec)/2)]
            spec_data.append(amp_spec.tolist())
  
        d['spec'] = spec_data
        d['frq'] = frq.tolist()
        
        
        return d
    
    def get_smoothness_score(self,marker_name,idx):
        
        marker_id = self.get_marker_id_by_marker_name(marker_name)
        sparc_values = list()
        vel = self.get_velocity_data(idx)
        vel_vec = numpy.asarray(vel['vel_data'][marker_id],dtype=numpy.float32)
        submovements = self.get_submovements(marker_id,idx)
        for i in range(len(submovements)):
            
            sal, _, _  = sparc(vel_vec[submovements[i][0]:submovements[i][1]], 50)
            sparc_values.append(sal)
            
        mean_sparc = float(numpy.mean(numpy.asarray(sparc_values,dtype=numpy.float32)))
        
        
        
        
        #sal = -1/sal  
        return mean_sparc
    
    def get_marker_id_by_marker_name(self,marker_name):
        marker_index = 0
        marker_list = self.get_marker_names()
        for i in range(len(marker_list)):
            if marker_name == marker_list[i]:
                marker_index = i
                
        return marker_index   
    
    def get_frametime(self):
        num_frames = self.mocap_metadata['num_frames']
        frametime=[]       
        for i in range(num_frames):
            frametime.append(i/50)
            
        return frametime
    
    def is_trial_valid(self):
        if (self.get_num_frames() == 0):
             return False
        else:
            return True
        
    def get_submovements(self,marker_index,idx):
        disp = self.get_displacement_data()['disp_data'][marker_index][1][idx[0]:idx[1]]
        
        submovement_indices = list()
        
        #threshold_height = mean of displacement signal
        threshold_height = numpy.mean(numpy.asarray(disp,dtype=numpy.float64))
        #find peaks of movement
        peak_indices,props = signal.find_peaks(disp,height = threshold_height,distance = 1*50)
        minima = list()
        
        for i in range (len(peak_indices)-1):   
            #finding all bottoms between all peaks
            minima.append(numpy.argmin(numpy.asarray(disp[peak_indices[i]:peak_indices[i+1]],dtype=numpy.float64))+peak_indices[i])
        
        #movement starts from upper limit
        minimum_indices= [x for x in minima if x > peak_indices[0]]     
            
        for i in range(len(peak_indices)-1):        
            submovement_indices.append([peak_indices[i],minimum_indices[i]])
            submovement_indices.append([minimum_indices[i]+1,peak_indices[i+1]-1])
            
            if(len(peak_indices) == len(minimum_indices) and i == len(peak_indices)-2):             
                submovement_indices.append([peak_indices[i+1],minimum_indices[i+1]])
                            
        
        return submovement_indices
        
        
        
        
        

                
            
        
    
        
        
