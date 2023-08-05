import numpy

class Audio:
        
    def __init__(self,track_details):
        
        self.filename = track_details['track_file']
        self.track_name = track_details['track_name']
        self.beat_interval = track_details['beat_divider']+1
 
 
 
    def get_audio_beats(self):
        
        f = open(self.filename)
        lines = f.readlines()
        audio_beats=[]
        

        audio_beats = [float(lines[x].strip()) for x in range(0,len(lines),self.beat_interval)]
        
        return audio_beats
    
    def get_ideal_freq(self):
        beats = self.get_audio_beats()

        mov_beats = [beats[x] for x in range(0,len(beats),self.beat_interval)]
        
        mov_beats = numpy.asarray(mov_beats,dtype=numpy.float32)
        
        ideal_movement_freq = 1/(numpy.mean(numpy.ediff1d(mov_beats))*2)
        
        
        return ideal_movement_freq
    
    #first 4 beats for countdown. Analysis for metrics to be done based on 5th beat onwards
    def get_music_start_and_end_timing(self):
        audio_beats = self.get_audio_beats()
        fifth_beat = audio_beats[4]
        last_beat = audio_beats[-1]
        
        return [fifth_beat,last_beat]

        