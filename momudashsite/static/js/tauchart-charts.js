//Displays chart over sessions
function loadTauSessionHistory(){

    if(window.sessionHistChart == null){
        var sessions = patient_data['sessions'];
        //Make object array for instances where there's only one session
        if (!Array.isArray(sessions)){
            chartdata = [sessions];
        }else{
            chartdata = sessions;
        }        
        //Draw chart
        window.sessionHistChart = new Taucharts.Chart({
            guide: {
                x: {label: {text: 'Session Number'}},
                y: {label: {text: 'Average Score'}},
            },      
            data:sessions,
            type:'scatterplot',
            y:'average_score',
            x:'session_id',
            color:'average_smoothness',
            size:0.4,
            plugins:[
            Taucharts.api.plugins.get('tooltip')({
                fields: ['time', 'average_score','average_smoothness'],
                formatters: {      
                    time: {label: "Date"},    
                    average_smoothness: {label: "Average Smoothness",format:d3.format(".2f")},
                    average_score:{label:"Average Score"}
                }
            }),
            Taucharts.api.plugins.get('legend')(),
            ],
            settings:{
                animationSpeed:10,
                fitModel:'entire-view'
            }
        });
        $('#session-history-chart').show();
        sessionHistChart.renderTo('#session-history-chart');

    
    }
    else{
        $('#session-history-chart').show();
    }    
}

//Displays Session Overview
function displayTauSessionOverview(session){

    if(window.sessionOverviewChart == null){
        
        
        
        //Make item array for instances where there's only one trial
        if (!Array.isArray(session))
            chartdata = [session];
        else
            chartdata = session;
        
        //Retrieve all exercise types
        var exerciseTypes = [];
        for (i = 0; i< chartdata.length;i++ ){
            exerciseTypes.push(chartdata[i]['exerciseTypes'])
        }
        
        //Draw chart       
//        window.sessionOverviewChart = new Taucharts.Chart({
//            guide: {
//                x: {label: {text: 'Trial ID'}},
//                y: {label: {text: 'Trial Score'}},
//            },   
//            data: chartdata,
//            type:'scatterplot',
//            y:'trialscore',
//            x:'trialnum',
//            color:'smoothness_score',
//            size:0.4,
//            plugins:
//            [
//                Taucharts.api.plugins.get('tooltip')({
//                    fields: ['trialnum','trialscore', 'smoothness_score','exerciseType'],
//                    formatters: {
//                        trialnum: {label: "Trial ID"},
//                        trialscore: {label: "Trial Score"},                       
//                        smoothness_score:{label:"Smoothness Score",format:d3.format(".2f")},
//                        exerciseType:{label:"Type of Exercise"}
//                    }
//                }),
//                Taucharts.api.plugins.get('legend')(),
//            ],
//            settings:{
//                animationSpeed:0,
//            }
//        });
        var ctx = $("#session-overview-chart")[0].getContext('2d');
        window.sessionOverviewChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: chartdata,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) {
                            var datasetLabel = data.datasets[tooltipItem[0].datasetIndex].label || 'Other';
                            return datasetLabel;
                        },
                        label: function(tooltipItem, data) {
                            var label = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                            if (label) {
                                label += ': ';
                            }
                            return label;
                        }
                    }
                }
            }
        });

        //Hide Session History heading and replace with Metric Panel
        hideAllChartContent();
        clearTabDisplay();
        $('#item-chart-header').hide();
        $('#session-record-header').show();
            
        highlightTab(0);
        $('#session-overview-chart').show();
        sessionOverviewChart.renderTo('#session-overview-chart');
        
    }
    
    //If recreate == false
    else{
        hideAllChartContent();
        clearTabDisplay();
        $('#item-chart-header').hide();
        $('#session-record-header').show();       
        highlightTab(0);
        $('#session-overview-chart').show();
    }
};

function loadTauMetricChart(metric,trialnum){
    var session = window.sessionData;
    console.log(session)
    //Clear display modes of tabs
    hideAllChartContent();
    clearTabDisplay();
    console.log("trialnum: "+trialnum)
    //Retrieve trial data to be used for chart
    if (!Array.isArray(session))
        trialdata = [[session][trialnum]][0];
    else
        trialdata = [session[trialnum]][0];
    console.log("Marker List")
    console.log(patient_data)
    //Dynamically fill up marker dropdowns and set current marker option
    loadMarkerDropDown(patient_data['markerList'])
    if (window.marker == null)
        window.marker = trialdata['markerIdx']
    $('#select-marker').val(patient_data['markerList'][marker-1])
    
    //Metric Matching
    if(metric ==="displacement"){

        //If chart does not exist
        if(window.dispChart == null){
            
            //trialdata = chartdata;
            var audioBeats = []
            for (var i = 0;i < trialdata['audioBeat'].length;i+=trialdata['beatIdxInterval']){
                audioBeats.push(trialdata['audioBeat'][i]);
            }

            //Create data array for displacement chart
            var arr = [];
            for (var i = 0;i < trialdata['displacement'][marker*3-2].length;i++){
                arr.push({
                    time:trialdata['frametime'][i],
                    'x-displacement':trialdata['displacement'][marker*3-3][i],
                    'y-displacement':trialdata['displacement'][marker*3-2][i],
                    'z-displacement':trialdata['displacement'][marker*3-1][i],
                    upper_limit:trialdata['exerciselimits'][1],
                    lower_limit:trialdata['exerciselimits'][0]
                    
                });
            }
            arr = arr.reduce(function (memo, row) {

                var keyVal = "dispx,y,z";
                var keyType = "displacement dimension";

                var r1 = _.clone(row);
                r1[keyType] = 'x-displacement';
                r1[keyVal] = row['x-displacement'];

                var r2 = _.clone(row);
                r2[keyType] = 'y-displacement';
                r2[keyVal] = row['y-displacement'];
                    
                var r3 = _.clone(row);
                r3[keyType] = 'z-displacement';
                r3[keyVal] = row['z-displacement'];
                

                return memo.concat([r1, r2, r3]);
            },[]);
//            window.dispChart = new Taucharts.Chart({
//                guide: {
//                    x: {label: {text: 'Time (s)'}, nice:false},
//                    y: {label: {text: 'Displacement (m)'}},
//                    color:{brewer:['rgb(233 90 36)' ,'rgb(0 98 102)', 'rgb(27 20 100)']}
//                },   
//                data: arr,
//                type:'line',
//                y:['dispx,y,z'],
//                x:'time',
//                color:'displacement dimension',
//                plugins:
//                [
//                    Taucharts.api.plugins.get('tooltip')({
//                        fields: ['time', 'x-displacement','y-displacement','z-displacement'],
//                        formatters: {      
//                            time: {label: "Time"},    
//                            'x-displacement': {label: "x-Displacement",format:d3.format(".2f")},
//                            'y-displacement': {label: "y-Displacement",format:d3.format(".2f")},
//                            'z-displacement': {label: "z-Displacement",format:d3.format(".2f")},
//                        }
//                    }),
//                    Taucharts.api.plugins.get('legend')(),
//                    Taucharts.api.plugins.get('quick-filter')(['time']),
//                    Taucharts.api.plugins.get('annotations')({
//                      items: [{
//                        dim: 'dispx,y,z',
//                        val: [trialdata['exerciselimits'][0]-trialdata['dispTolerance'],trialdata['exerciselimits'][0]+trialdata['dispTolerance']],
//                        text: 'Lower Limit',
//                        color: 'rgb(111 30 81)'
//                      }, {
//                        dim: 'dispx,y,z',
//                        val: [trialdata['exerciselimits'][1]-trialdata['dispTolerance'],trialdata['exerciselimits'][1]+trialdata['dispTolerance']],
//                        text: 'Upper Limit',
//                        color: 'rgb(111 30 81)'
//                      }]
//                    })
//                ],
//                settings:{
//                    animationSpeed:10,
//
//                }
//            });
            
            var ctx = $("#displacement")[0].getContext('2d');
            window.dispChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'Displacement',
                        data: chartdata,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
            
            //Display options for divs            
            highlightTab(1);
            document.getElementById(metric).style.display = "block";
            dispChart.renderTo('#displacement');           
        }
        //If chart already exists
        else{
            highlightTab(1);
            document.getElementById(metric).style.display = "block"; 
        }
    }
    
    
    
    if(metric ==="velocity"){
        //trialdata = chartdata[0]
        console.log("Velocity")
        console.log(trialdata['velocity'][marker])
        var arr=[];
        for (var i = 0;i < trialdata['velocity'][marker].length;i++){
            arr.push({
                time:trialdata['frametime'][i],
                vel:trialdata['velocity'][marker*3-2][i]
            });
        }
        //If chart does not exist
        if(window.velChart == null){
            window.velChart = new Taucharts.Chart({
                guide: {
                    x: {label: {text: 'Time (s)'}, nice:false},
                    y: {label: {text: 'Velocity (m/s)'}},
                    
                    color:{brewer:['rgb(0 98 102)']}
                },   
                data: arr,
                type:'line',
                y:'vel',
                x:'time',
                settings:{
                    animationSpeed:10,
                },
                plugins:
                [
                    Taucharts.api.plugins.get('tooltip')(),
                    Taucharts.api.plugins.get('legend')(),
                    Taucharts.api.plugins.get('quick-filter')(),
                    Taucharts.api.plugins.get('annotations')({
                        items: [{
                        dim: 'frequency',
                        val: trialdata['idealFreq'],
                        text: 'Ideal Frequency',
                        color: '#f52',
                        position:'front'
                      }]
                    })     
                ],
            });
            
            //Display options for divs            
            highlightTab(2);
            document.getElementById(metric).style.display = "block";
            velChart.renderTo('#velocity');           
        }
        //If chart already exists
        else{
            highlightTab(2);
            document.getElementById(metric).style.display = "block"; 
        }
    }
    
    if(metric ==="autocorrelation"){
        //trialdata = chartdata[0]
        var arr=[];
        for (var i = 0;i < trialdata['autocorrelation'][marker].length;i++){
            arr.push({
                lag:trialdata['lags'][i],
                autocor:trialdata['autocorrelation'][marker-1][i]
            });
        }
        //If chart does not exist
        if(window.autocorChart == null){
            window.autocorChart = new Taucharts.Chart({
                guide: {
                    x: {label: {text: 'Lags'}},
                    y: {label: {text: 'Circular Autocorrelation'}, min:Math.min(arr['autocor']), max:1,nice:false},
                    
                    color:{brewer:['rgb(0 98 102)']}
                },   
                data: arr,
                type:'bar',
                y:'autocor',
                x:'lag',
                settings:{
                    animationSpeed:10,
                },
                plugins:
                [
                    Taucharts.api.plugins.get('tooltip')(),
                    Taucharts.api.plugins.get('legend')(),
                ],
            });
            
            //Display options for divs            
            highlightTab(3);
            document.getElementById(metric).style.display = "block";
            autocorChart.renderTo('#autocorrelation');           
        }
        //If chart already exists
        else{
            highlightTab(3);
            document.getElementById(metric).style.display = "block"; 
        }
    }
    
    if(metric ==="precision"){
        //trialdata = chartdata[0]
        var arr=[];
        var freq = Array.apply(null, {length: trialdata['spectrum'][marker-1].length}).map(Number.call, Number);
        freq = freq.map(x => (x-1)*50/trialdata['spectrum'][marker-1].length).filter(function(frequency){ return frequency < 3});
        
        for (var i = 0;i < freq.length;i++){
            arr.push({
                frequency:freq[i],
                amp_spectrum:trialdata['spectrum'][marker-1][i]
            });
        }
        //If chart does not exist
        if(window.precChart == null){
            window.precChart = new Taucharts.Chart({
                guide: {
                    x: {label: {text: 'Frequency(Hz)'},nice:false},
                    y: {label: {text: 'Amplitude Spectrum'}},
                    
                    color:{brewer:['rgb(113 50 81)']}
                },   
                data: arr,
                type:'line',
                y:'amp_spectrum',
                x:'frequency',
                settings:{
                    animationSpeed:10,
                },
                plugins:
                [
                    Taucharts.api.plugins.get('tooltip')(),
                    Taucharts.api.plugins.get('legend')(),
                    Taucharts.api.plugins.get('quick-filter')(),
                    Taucharts.api.plugins.get('annotations')({
                      items: [{
                        dim: 'frequency',
                        val: trialdata['idealFreq'],
                        text: 'Ideal Frequency',
                        color: '#f52',
                        position:'front'
                      }]
                    })                    
                ],
            });
            
            //Display options for divs            
            highlightTab(4);
            document.getElementById(metric).style.display = "block";
            precChart.renderTo('#precision');           
        }
        //If chart already exists
        else{
            highlightTab(4);
            document.getElementById(metric).style.display = "block"; 
        }
          
    }
    $('#chart-card').attr('class','col-md-10');
    $('#metric-dropdown').show();  
    
    
}