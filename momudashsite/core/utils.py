#utils functions
import json


def read_json():
    json_data = open('static/data/testNewCharts/testNewCharts.json')
    data = json.load(json_data)
    print(data['participant_name'])
    
    return data

def read_trc():
    
    #define Dictionary
    mocap_data = dict()
    
    #Read .trc file 
    f = open('static/data/testNewCharts/23_August_2019/testNewCharts_181857_23_August_2019.trc')
    data = f.readlines()
    f.close()
    
    #Fill up metadata information
    metadata = data[2].strip().split("\t")
    mocap_data['data_rate'] = int(metadata[0])
    mocap_data['camera_rate'] = int(metadata[1])
    mocap_data['num_frames'] = int(metadata[2])
    mocap_data['num_markers'] = int(metadata[3])
    mocap_data['units'] = metadata[4]
    mocap_data['orig_data_rate'] = int(metadata[5])
    mocap_data['orig_data_frame'] = int(metadata[6])
    mocap_data['orig_num_frames'] = int(metadata[7])
    mocap_data['marker_names'] =  [x for x in data[3].strip().split("\t")[2:] if x!=""]
    
    #displacement data
    mocap_data['data'] = []   
    
    for j in range(0, mocap_data['num_markers']*3,3):
        marker_x = []
        marker_y = []
        marker_z = []
        for i in range(5,len(data)):
            data_row = data[i].strip().split("\t")[2:]
            marker_x.append(data_row[j])
            marker_y.append(data_row[j+1])
            marker_z.append(data_row[j+2])
    
            
        mocap_data['data'].append([marker_x,marker_y,marker_z])

    return mocap_data
