//Displays chart over sessions

var changeInSession;
var changeDispData;
var changeVelData;
var changeAutoCorrData;
var changePrecData;
var changePatient

var chartSessionData;

var sessionOverviewChart;
var dispChart;
var autocorrChart;
var velChart;
var precChart;
var sessionHistChart
var sessionHistVelChart
var sessionHistSmoothnessChart
var sessionsByMonthChart


var trial_num
var maxTime
var TimeList

function drawDispChart(x_disp,y_disp,z_disp,annotations){
    
       
    ctx = $("#displacement")[0].getContext('2d');
            dispChart = new Chart(ctx, {              
                type: 'line',
                data: {
                    datasets: [{
                        label: 'y-Right Shoulder',
                        data:x_disp,
                        borderColor: "rgba(58,31,93,1)",
                        backgroundColor:"rgba(58,31,93,1)",
                        borderWidth:2,
                        pointStyle:'rectRounded',
                        fill:false

                    },
                    {
                        label: 'y-Right Hand',
                        data:y_disp,
                        borderColor:"rgba(200,54,96, 1)",
                        backgroundColor:"rgba(200,54,96, 1)",
                        borderWidth:2,
                        pointStyle:'rectRounded',
                        fill:false
 
                    },
                    {
                        label: 'z-Right Hand',
                        data:z_disp,
                        borderColor: "rgba(225,82,73, 1)",
                        backgroundColor:"rgba(225,82,73, 1)",
                        borderWidth:2,
                        pointStyle:'rectRounded',
                        fill:false

                    }
                              ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Displacement ',
                        fontColor:'#000',
                        fontSize:16
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            name:'Dispalcement (m)',
                            position:'left',
                            ticks: {
                                min:0,
                                fontSize:12,
                                fontColor:'#000'
                            },
                            gridLines: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false
                            },
                            scaleLabel: {
                                labelString:'Displacement (m)',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }],
                        xAxes: [{
                            type:'linear',
                            display:true,
                            gridLines: {
                                display: false,
                                drawOnChartArea: false,
                                drawTicks: false
                            },
                            ticks: {
                                min:0,max:maxTime,
                                stepSize: 0.5,
                                fontSize:12,
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Time (s)',
                                id:'time',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }]
                    },
                    legend:{
                        display: true,
                        position:'right',
                        labels:{
                            usePointStyle:true,
                            fontColor:'#000',
                            padding:5,
                            fontSize:12
                        },                        
                    },
                    tooltips: {
                        displayColors:true,
                        mode:'nearest',
                        intersect:false,
                        callbacks: {
                            title: function(tooltipItem, data) {
                                var datasetLabel = ' Displacement Information ';
                                return datasetLabel;
                            },
                            label: function(tooltipItem, data) { 
                                
                                var label = [data.datasets[tooltipItem.datasetIndex].label +": "+Math.round(tooltipItem.yLabel * 100) / 100]
                                label.push("Time: "+Math.round(tooltipItem.xLabel * 100) / 100);
                                return label;
                            }
                        }
                    },
                    annotation: {
                        annotations:annotations
                    },
                    plugins: {
                        zoom: {
 
                            zoom: {
                                // Boolean to enable zooming
                                enabled: true,

                                // Enable drag-to-zoom behavior
                                drag: true,
                                drag: {
                                 	 borderColor: 'rgba(225,225,225,0.3)',
                                 	 borderWidth: 5,
                                 	 backgroundColor: 'rgb(225,225,225)'
                                 },

                                // Zooming directions. Remove the appropriate direction to disable
                                // Eg. 'y' would only allow zooming in the y direction
                                mode: 'xy',

                                rangeMin: {
                                    // Format of min zoom range depends on scale type
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    // Format of max zoom range depends on scale type
                                    x: null,
                                    y: null
                                },

                                // Speed of zoom via mouse wheel
                                // (percentage of zoom on a wheel event)
                                speed: 0.1,
                            }
                        }
                    }
                }
            }); 
}

function drawVelChart(vel){

    var ctx = $("#velocity")[0].getContext('2d');
            velChart = new Chart(ctx, {
                
                type: 'line',
                data: {
                    datasets: [{
                        label: 'velocity',
                        data:vel,
                        borderColor: "rgba(58,31,93,1)",
                        backgroundColor:"rgba(58,31,93,1)",
                        borderWidth:3,
                        pointStyle:'rectRounded',
                        fill:false

                        }
                      ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Velocity ',
                        fontColor:'#000',
                        fontSize:16
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            name:'Velocity (m/s)',
                            position:'left',
                            ticks: {
                                
                                fontSize:12,
                                fontStyle:'bold',
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Velocity (m/s)',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }],
                        xAxes: [{
                            type:'linear',
                            display:true,
                            ticks: {
                                max:maxTime,
                                stepSize: 0.5,
                                fontSize:12,
                                fontStyle:'bold',
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Time (s)',
                                id:'time',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }]
                    },

                    legend:{
                        display: false,
                        position:'right',
                        labels:{
                            boxWidth:15,
                            usePointStyle:true
                        }
                    },
                    tooltips: {
                        displayColors:true,
                        mode:'nearest',
                        intersect:false,
                        callbacks: {
                            title: function(tooltipItem, data) {
                                var datasetLabel = ' Velocity Information ';
                                return datasetLabel;
                            },
                            label: function(tooltipItem, data) { 
                                
                                var label = [data.datasets[tooltipItem.datasetIndex].label +": "+Math.round(tooltipItem.yLabel * 100) / 100]
                                label.push("Time: "+Math.round(tooltipItem.xLabel * 100) / 100);
                                return label;
                            }
                        }
                    },
                    plugins: {
                        zoom: {
                            // Container for zoom options
                            zoom: {
                                // Boolean to enable zooming
                                enabled: true,

                                // Enable drag-to-zoom behavior
                                drag: true,

                                // Drag-to-zoom rectangle style can be customized
                                 drag: {
                                 	 borderColor: 'rgba(225,225,225,0.3)',
                                 	 borderWidth: 5,
                                 	 backgroundColor: 'rgb(225,225,225)'
                                 },

                                // Zooming directions. Remove the appropriate direction to disable
                                // Eg. 'y' would only allow zooming in the y direction
                                mode: 'xy',

                                rangeMin: {
                                    // Format of min zoom range depends on scale type
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    // Format of max zoom range depends on scale type
                                    x: null,
                                    y: null
                                },

                                // Speed of zoom via mouse wheel
                                // (percentage of zoom on a wheel event)
                                speed: 0.1,

                            }
                        }
                    }
                }
            }); 
}

function drawAutoCorrChart(autocorr){

    var ctx = $("#autocorrelation")[0].getContext('2d');
            autocorrChart = new Chart(ctx, {
                
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Autocorrelation',
                        data:autocorr,
                        borderColor: "rgba(58,31,93,1)",
                        backgroundColor:"rgba(58,31,93,1)",
                        borderWidth:3,
                        pointStyle:'rectRounded',
                        fill:false

                        }
                      ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Autocorrelation',
                        fontColor:'#000',
                        fontSize:16
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            name:'Autocorrelation',
                            position:'left',
                            ticks: {
                                //min:0,max:3
                                fontSize:12,
                                fontStyle:'bold',
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Autocorrelation',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }],
                        xAxes: [{
                            type:'linear',
                            display:true,
                            ticks: {
                                min:0,
                                stepSize: 100,
                                fontSize:12,
                                fontStyle:'bold'
                                
                            },
                            scaleLabel: {
                                labelString:'Lags',
                                id:'lags',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }]
                    },

                    legend:{
                        display: false,
                        position:'right',
                        labels:{
                            boxWidth:15,
                            usePointStyle:true
                        }
                    },
                    tooltips: {
                        displayColors:true,
                        mode:'nearest',
                        intersect:false,
                        callbacks: {
                            title: function(tooltipItem, data) {
                                var datasetLabel = ' Autocorrelation Information ';
                                return datasetLabel;
                            },
                            label: function(tooltipItem, data) { 
                                
                                var label = [data.datasets[tooltipItem.datasetIndex].label +": "+Math.round(tooltipItem.yLabel)]
                                label.push("Lags: "+Math.round(tooltipItem.xLabel * 100) / 100);
                                return label;
                            }
                        }
                    },
                    plugins: {
                        zoom: {
                            // Container for zoom options
                            zoom: {
                                // Boolean to enable zooming
                                enabled: true,

                                // Enable drag-to-zoom behavior
                                drag: true,

                                // Drag-to-zoom rectangle style can be customized
                                 drag: {
                                 	 borderColor: 'rgba(225,225,225,0.3)',
                                 	 borderWidth: 5,
                                 	 backgroundColor: 'rgb(225,225,225)'
                                 },

                                // Zooming directions. Remove the appropriate direction to disable
                                // Eg. 'y' would only allow zooming in the y direction
                                mode: 'xy',

                                rangeMin: {
                                    // Format of min zoom range depends on scale type
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    // Format of max zoom range depends on scale type
                                    x: null,
                                    y: null
                                },

                                // Speed of zoom via mouse wheel
                                // (percentage of zoom on a wheel event)
                                speed: 0.1,

                            }
                        }
                    }
                }
            }); 
}

function drawPrecChart(prec,ideal_freq,max_val){


    var ctx = $("#precision")[0].getContext('2d');
            precChart = new Chart(ctx, {
                
                type: 'line',
                data: {
                    datasets: [{
                        label: 'Amplitude Spectrum',
                        data:prec,
                        borderColor: "rgba(58,31,93,1)",
                        backgroundColor:"rgba(58,31,93,1)",
                        borderWidth:3,
                        pointStyle:'rectRounded',
                        fill:false,
                        lineTension: 0.1

                        }
                      ]
                },
                options: {
                    responsive: true,
                    title: {
                        display: true,
                        text: 'Amplitude Spectrum ',
                        fontColor:'#000',
                        fontSize:16
                    },
                    elements: {
                        point:{
                            radius: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            name:'Amplitude Spectrum',
                            position:'left',
                            ticks: {
                                min:0,
                                max:max_val,
                                fontSize:12,
                                fontStyle:'bold',
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Amplitude Spectrum',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }],
                        xAxes: [{
                            type:'linear',
                            display:true,
                            ticks: {
                                min:0,
                                stepSize: 0.2,
                                max:1.5,
                                fontSize:12,
                                fontStyle:'bold',
                                fontColor:'#000'
                            },
                            scaleLabel: {
                                labelString:'Frequency (Hz)',
                                id:'frequency',
                                display:true,
                                fontColor:'#000',
                                fontSize:14,
                                //fontStyle:'bold'
                            }
                        }]
                    },

                    legend:{
                        display: false,
                        position:'right',
                        labels:{
                            boxWidth:15,
                            usePointStyle:true
                        }
                    },
                    tooltips: {
                        displayColors:true,
                        mode:'nearest',
                        intersect:false,
                        callbacks: {
                            title: function(tooltipItem, data) {
                                var datasetLabel = ' Amplitude Spectrum ';
                                return datasetLabel;
                            },
                            label: function(tooltipItem, data) { 
                                
                                var label = [data.datasets[tooltipItem.datasetIndex].label +": "+Math.round(tooltipItem.yLabel)]
                                label.push("Frequency: "+Math.round(tooltipItem.xLabel * 100) / 100);
                                return label;
                            }
                        }
                    },
                    annotation: {
                        annotations: [{
                            type: 'line',
                            mode: 'vertical',
                            scaleID: 'x-axis-0',
                            value: ideal_freq,
                            borderColor: 'rgba(200,54,96, 1)',
                            borderWidth: 1.5,
                            borderDash: [10, 5],
                            label: {
                                enabled: true,
                                content: 'Ideal Frequency',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                fontFamily: "muli",
                                fontSize: 15,
                                fontStyle: "bold",
                                fontColor: "#000",
                                position: "top",
                            }
                          }                      
                        ]
                    },
                    plugins: {
                        zoom: {
                            // Container for zoom options
                            zoom: {
                                // Boolean to enable zooming
                                enabled: true,

                                // Enable drag-to-zoom behavior
                                drag: true,

                                // Drag-to-zoom rectangle style can be customized
                                 drag: {
                                 	 borderColor: 'rgba(225,225,225,0.3)',
                                 	 borderWidth: 5,
                                 	 backgroundColor: 'rgb(225,225,225)'
                                 },

                                // Zooming directions. Remove the appropriate direction to disable
                                // Eg. 'y' would only allow zooming in the y direction
                                mode: 'xy',

                                rangeMin: {
                                    // Format of min zoom range depends on scale type
                                    x: null,
                                    y: null
                                },
                                rangeMax: {
                                    // Format of max zoom range depends on scale type
                                    x: null,
                                    y: null
                                },

                                // Speed of zoom via mouse wheel
                                // (percentage of zoom on a wheel event)
                                speed: 0.1,

                            }
                        }
                    }
                }
            }); 
}

function drawSessionOverviewChart(arr,arr2,tracks){
//    console.log(arr)
//    console.log(arr2)
    var ctx = $("#session-overview-chart")[0].getContext('2d');
        
        //Draw Chart
        sessionOverviewChart = new Chart(ctx, {
            
            type: 'line',
            data: {
                datasets: [{
                    label: 'Autocorrelation',
                    yAxesGroup:'Autocorrelation',
                    yAxisID:'y-axis-1',
                    data:arr,
                    borderColor: "rgba(58,31,93,1)",
                    backgroundColor:"rgba(58,31,93,1)",
                    fill:false
                },
               {
                    label: 'Smoothness',
                    yAxesGroup:'Smoothness',
                    yAxisID:'y-axis-2',
                    data:arr2,
                    borderColor: "rgba(200,54,96, 1)",
                    backgroundColor:"rgba(200,54,96, 1)",
                    fill:false
                },
                {
                    label: 'Tracks',
                    data:tracks,
                    visible:false
                }
                          ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Autocorrelation and Smoothness over Trials',
                    fontSize:16,
                    fontColor:'#000'
                },
                scales: {
                    yAxes: [{
                        id:'y-axis-1',
                        name:'Autocorrelation',
                        position:'left',
                        ticks: {
                            //min:0,
                            stepSize: 10,
                            fontSize:12,
                            fontColor:'#000'
                        },
                        scaleLabel: {
                            labelString:'Autocorrelation',
                            display:true,
                            fontColor:'#000',
                            fontSize:16,
                            fontStyle:'bold'
                        }
                    },
                    {
                        id:'y-axis-2',
                        name: 'Smoothness',
                        type: 'linear',
                        position: 'right',
                        scalePositionLeft: false,
                        scaleLabel: {
                            labelString:'Smoothness',
                            display:true,
                            fontColor:'#000',
                            fontSize:16,
                            fontStyle:'bold'
                        },
                        ticks:{
                            max:0
                        }
     
                    }
                           ],
                    xAxes: [{
                        type:'linear',
                        ticks: {
                            min:1,
                            stepSize: 1,
                            fontSize:13,
                            fontColor:'#000',
                            callback: function(value, index, values) {
                                if (value > 0)
                                    return 'Trial ' + value;
                                else
                                    return value
                            }
                        }
                    }]
                },
                
                legend:{
                    display: true,
                    fontSize:12,
                    labels:{
                        filter: function (legendItem, chartData) {
                            if (legendItem.datasetIndex<2)
                                return chartData.datasets[legendItem.datasetIndex].label
                        }
                    },
                        
                },
                tooltips: {
                    displayColors:false,
                    mode:'nearest',
                    custom: function(tooltip) {
                        if (!tooltip) return;
                        // disable displaying the color box;
                        tooltip.displayColors = false;
                    },
                    callbacks: {
                        title: function(tooltipItem, data) {
                            var datasetLabel = 'Trial Information';
                            return datasetLabel;
                        },
                        label: function(tooltipItem, data) 
                        {                           
                            var label = ["- Trial Number: "+Math.round(tooltipItem.xLabel * 100) / 100];
                            label.push("- Autocorrelation Score: "+Math.round(data.datasets[0].data[tooltipItem.index].y * 100) / 100);
                            label.push("- Smoothness Score: "+Math.round(data.datasets[1].data[tooltipItem.index].y* 100) / 100);
                            label.push("- Audio Track: "+data.datasets[2].data[tooltipItem.index])
                            return label;
                        }
                    }
                },
                events: ['mousemove','click']
            }
        });
    
    $('#session-overview-chart').click( function(evt) {
      var activePoint = sessionOverviewChart.getElementAtEvent(evt)[0];
      if (activePoint) {
        var chartData = activePoint['_chart'].config.data;
        var idx = activePoint['_index'];
        trial_num = idx

        updateMetrics()
          
        retrieveDispData(trial_num)
      }
    });
}

  
//Displays Session Overview
function displaySessionOverview(session,sessionChange){
    hideAllChartContent();
    clearTabDisplay();
    changeInSession = sessionChange;   
    
    if (changeInSession){
        updateMetrics()
    }
    
    //Make item array for instances where there's only one trial
    if (!Array.isArray(session))
        chartdata = [session];
    else
        chartdata = session;
    
    chartSessionData = chartdata;
    //Retrieve all required data for chart
    var arr = [],arr2=[]
    var audioTracks=[];

    for (var i = 0;i < chartdata.length;i++){
        arr.push({
            x:chartdata[i]['trialnum'],
            y:chartdata[i]['autocorrelation_score'],
            //r:12

        });
        arr2.push({
            x:chartdata[i]['trialnum'],
            y:chartdata[i]['smoothness_score'],
            //r:12
        })
        audioTracks.push(chartdata[i]['audio_track']);
   
    }


    if(sessionOverviewChart == null){
        drawSessionOverviewChart(arr,arr2,audioTracks);        
    }
    
    //If recreate == false
    else{
        //Update Data if there is change in session
       if (changeInSession == true){
           sessionOverviewChart.data.datasets[0].data = arr;
           sessionOverviewChart.data.datasets[1].data = arr2;
           sessionOverviewChart.data.datasets[2].data = audioTracks;
            
           sessionOverviewChart.update();
       }        
    }
    
    //Hide Session History heading and replace with Metric Panel

    //$('#item-chart-header').hide();
    $('#session-record-header').show();

    highlightTab(0);
    $('#session-overview-chart').show();
    $('#metric-dropdown').hide(); 
    $('#chart-card').attr('class','col-md-12');
};

function loadDispChart(data){
    maxTime = data['audio_beats'][data['audio_beats'].length-1]
//    console.log(data.marker_id[1])
    var x_disp = [];
    var y_disp = [];
    var z_disp = [];
    var limits=[data.lower_limit,data.upper_limit];
    for (var i = 0;i < data.disp[data.marker_id[0]][0].length;i++){
        x_disp.push({
            x:data.frametime[i],
            y:data.disp[data.marker_id[1]][1][i],
        });
        y_disp.push({
            x:data.frametime[i],
            y:data.disp[data.marker_id[0]][1][i],
        });
        z_disp.push({
            x:data.frametime[i],
            y:data.disp[data.marker_id[0]][2][i],
        })
    }
    
     annotations = []
    for(i = 0; i< data['audio_beats'].length;i++){
        obj = {
                type: 'line',
                mode: 'vertical',
                scaleID: 'x-axis-0',
                value: data['audio_beats'][i],
                borderColor: 'rgb(111 30 81)',
                borderWidth: 0.5,
            };
        annotations.push(obj);
    }
    upper_limit = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: limits[1],
        borderColor: 'rgba(111, 30, 81,1)',
        borderWidth: 1,
        label: {
            enabled: true,
            content: 'Upper Limit',
            backgroundColor: 'rgba(255,255,255,0.5)',
            fontFamily: "muli",
            fontSize: 13,
            fontStyle: "bold",
            fontColor: "#000",
            position: "right",
        }
    };
    annotations.push(upper_limit)                        
    lower_limit = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y-axis-0',
        value: limits[0],
        borderColor: 'rgb(111 30 81)',
        borderWidth: 1,
        label: {
            enabled: true,
            content: 'Lower Limit',
            backgroundColor: 'rgba(255,255,255,0.5)',
            fontFamily: "muli",
            fontSize: 13,
            fontStyle: "bold",
            fontColor: "#000",
            position: "right",
        }
    };
    annotations.push(lower_limit)
    
    //If chart does not exist
    if(dispChart == null){
        drawDispChart(x_disp,y_disp,z_disp,annotations);                  
    }
    //If chart already exists
    else{
        if (changeDispData == true){
            dispChart.data.datasets[0].data = x_disp;
            dispChart.data.datasets[1].data = y_disp;
            dispChart.data.datasets[2].data = z_disp;
            dispChart.options.annotation.annotations = annotations;
            dispChart.update();
                 
        }   

    }
    clearTabDisplay();
    highlightTab(1);
    document.getElementById('displacement').style.display = "block";
}

function loadVelChart(data){

    var vel = [];

    for (var i = 0;i < data.vel[data.marker_id].length;i++){
        vel.push({
            x:data.frametime[i],
            y:data.vel[data.marker_id][i],
        });
    }
    //If chart does not exist
    if(velChart == null){
        drawVelChart(vel);                  
    }
    //If chart already exists
    else{
        if (changeVelData == true){
            velChart.data.datasets[0].data = vel;
            velChart.update();
        }           
    }
    clearTabDisplay();
    highlightTab(2);
    document.getElementById('velocity').style.display = "block";
}

function loadAutoCorrChart(data){

    var autocorr = [];
    for (var i = 0;i < data.autocorr[data.marker_id].length;i++){
        autocorr.push({
            x:data.lags[i],
            y:data.autocorr[data.marker_id][i],
        });
    }
    //If chart does not exist
    if(autocorrChart == null){
        drawAutoCorrChart(autocorr);                  
    }
    //If chart already exists
    else{
        if (changeAutoCorrData == true){
            autocorrChart.data.datasets[0].data = autocorr;
            autocorrChart.update();
        }           
    }
    clearTabDisplay();
    highlightTab(3);
    document.getElementById('autocorrelation').style.display = "block";
}

function loadPrecChart(data){

    var prec = [];
    
    for (var i = 0;i < data.spec[data.marker_id].length;i++){
        prec.push({
            x:data.frq[i],
            y:data.spec[data.marker_id][i],
        });
    }
    d = prec.map(d => d.y)
    max_val = Math.ceil(((Math.max(...d.slice(1)) + 100)/100))*100
    //If chart does not exist
    if(precChart == null){
        drawPrecChart(prec,data.ideal_freq,max_val);                  
    }
    //If chart already exists
    else{
        if (changePrecData == true){
            precChart.data.datasets[0].data = prec;
            precChart.options.scales.yAxes[0].ticks.max = max_val
            precChart.options.annotation.annotations.value = data.ideal_freq
            precChart.update();

        }           
    }
    clearTabDisplay();
    highlightTab(4);
    document.getElementById('precision').style.display = "block";
}

function clearAllCharts(){
//    console.log("Cleared all charts")
            if(sessionOverviewChart != null){
                sessionOverviewChart.destroy()
                sessionOverviewChart = null;
            }
            if(dispChart != null){
                dispChart.destroy()
                dispChart = null;
            }
            if(autocorrChart != null){
                autocorrChart.destroy()
                autocorrChart = null;
            }
            if(velChart != null){
                velChart.destroy()
                velChart = null;
            }
             if(precChart != null){
                precChart.destroy()
                precChart = null;
            }
}


function loadMonthlyChart(){
    var dates = [], years=[], maxYear
    sessions = dat
    const months = ["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthCount=new Array(12).fill(0);
    timeList = dat.map(timeList => timeList.time);
    
    //Get years involved
    for (i = 0; i < timeList.length;i++){
        year = timeList[i].split(",")[0].split("-")[2]      
        //2018, 2019
        if (!years.includes(year)){
            
            years.push(timeList[i].split(",")[0].split("-")[2])
        }
        maxYear = Math.max(year)
    }

//    //Time format 01-08-2019, 14:04

    
    for (i=0;i < timeList.length;i++){
        dates.push({
            x:months[timeList[i].split(",")[0].split("-")[1]-1],
            //y:parseFloat(String(timeList[i].split(",")[1]).replace(":",".")),
            y:timeList[i].split(",")[0].split("-")[0],
            r:8
        });
    }

    
    if (sessionsByMonthChart == null){
        drawMonthlyChart(months,dates);
    }
    
    
    if(changePatient){
        sessionsByMonthChart.data.datasets[0].data = dates;
        sessionsByMonthChart.update()
    }
    //$('#session-history-chart').show();
    
}

function drawMonthlyChart(labels,data){
     var ctx = $("#session-history-chart")[0].getContext('2d');
        //Draw Chart
        sessionsByMonthChart = new Chart(ctx, {
            type: 'bubble',
            data: {
                labels:labels,
                datasets: [{
                    label: 'Sessions over Months',
                    data:data,
                    borderColor: "rgba(200,54,96, 1)",
                    backgroundColor:"rgba(200,54,96, 0.8)",
                    //borderWidth:3,
                    fill:false,
                }],
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Sessions over Months',
                    fontSize:16,
                    fontColor:'#000'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min:0,max:31,
                            fontSize:13,
                            fontColor:'#000',
                            stepSize:1,
                            minor:false
                        },
                        scaleLabel: {
                            labelString:'Day',
                            display:true,
                            fontColor:'#000',
                            fontSize:13,
                            fontStyle:'bold'
                        },
                        gridLines: {
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false
                        },
                    }],

                    xAxes: [{
                        type: 'category',
                        labels:labels,
                       // barPercentage: 0.2,
                        //minBarLength: 12,
                        stepSize:1
                    }]
                },

                legend:{
                    display: false
                },
                tooltips: {
                    displayColors:false,
                    mode:'nearest',
                    callbacks: {
                        title: function(tooltipItem, data) {
                            var datasetLabel = 'Session Information';
                            return datasetLabel;
                        },
                        label: function(tooltipItem, data) { 
                            var label = [];
                            label.push("Date: "+ data['datasets'][tooltipItem.datasetIndex]['data'][tooltipItem.index]['x']+ " - "+Math.round(tooltipItem.yLabel));
                            return label;
                        }
                    }
                },
                events: ['mousemove','click']
            }
        });
    
      $('#session-history-chart').click( function(evt) {
      var activePoint = sessionsByMonthChart.getElementAtEvent(evt)[0];
      if (activePoint) {
        var chartData = activePoint['_chart'].config.data;
        var idx = activePoint['_index'];
      retrieveSessionDetails(idx)
      }
    });
    
    
}

function displaySessionsOverDays(idx, timeList){
    monthIdx = idx+1
    relevantDates = []
    //Assume only one session per day 
    
    //Bubble chart for date by hour in a month
    for (i = 0; i<timeList.length; i++){
        month = timeList[i].split(",")[0].split("-")[1]
        if (monthIdx == month){
            relevantDates.push({
                x:timeList[i].split(",")[0].split("-")[0],
                y:timeList[i].split(",")[1].split(":")[0]
            })
            
        }       
    }
    
    //draw bubble chart
}

function updateMetrics(){
    changeDispData = true
    changeVelData = true
    changeAutoCorrData = true
    changePrecData = true
}
function hideSessionHistChart(){
    $('#chart-table-toggle').text("Chart View");
    $('#session-hist-table-holder').show();

    $('#session-history-chart').hide();
//    $('#session-history-velocity').hide();
//    $('#session-history-smoothness').hide();
    
}

////***************************************** Old session history graphs which displayed smoothness, game score and mean velocity in separate charts. Changed to bubble time chart ****************************************************************
//function drawSessionHistGameScoreChart(arr,smoothness_score,labels){
//    var ctx = $("#session-history-chart")[0].getContext('2d');
//
//    
//        //Draw Chart
//        sessionHistChart = new Chart(ctx, {
//
//            type: 'bar',
//            data: {
//                labels:labels,
//                datasets: [{
//                    label: 'Average Game Score',
//                    data:arr,
//                    borderColor: "rgba(58,31,93,1)",
//                    backgroundColor:"rgba(58,31,93,0.8)",
//                    borderWidth:3,
//                    fill:false,
//                }],
//            },
//            options: {
//                responsive: true,
//                title: {
//                    display: true,
//                    text: 'Average Game Score over Sessions',
//                    fontSize:16,
//                    fontColor:'#000'
//                },
//                scales: {
//                    yAxes: [{
//                        ticks: {
//                            min:0,
//                            fontSize:12,
//                            fontColor:'#000'
//                        },
//                        scaleLabel: {
//                            labelString:'Average Score',
//                            display:true,
//                            fontColor:'#000',
//                            fontSize:14,
//                            //fontStyle:'bold'
//                        }
//                    }],
//
//                    xAxes: [{
//                        barPercentage: 0.4,
//                        //barThickness: 12,
//                        //maxBarThickness: 12,
//                        minBarLength: 12,
//                    }]
//                },
//
//                legend:{
//                    display: false
//                },
//                tooltips: {
//                    displayColors:false,
//                    mode:'nearest',
//                    callbacks: {
//                        title: function(tooltipItem, data) {
//                            var datasetLabel = 'Session Information';
//                            return datasetLabel;
//                        },
//                        label: function(tooltipItem, data) { 
//                            var label = ["Session Number: "+tooltipItem.xLabel];
//                            label.push("Average Score: "+Math.round(tooltipItem.yLabel * 100) / 100);
//                            label.push("Average Smoothness: "+Math.round(smoothness_score[tooltipItem.index]['smoothness']* 100) / 100);
//
//
//                            return label;
//                        }
//                    }
//                }
//            }
//        });
//    
//}
////*************************************NOT USING THESE CHARTS ANYMORE****************************************************
//function drawSessionHistSmoothnessScoreChart(arr,smoothness_score,labels){
//    var ctx = $("#session-history-smoothness")[0].getContext('2d');
//        //Draw Chart
//        sessionHistSmoothnessChart = new Chart(ctx, {
//
//            type: 'bar',
//            data: {
//                labels:labels,
//                datasets: [{
//                    label: 'Average Smoothness Score over Sessions',
//                    data:arr,
//                    borderColor: "rgba(200,54,96, 1)",
//                    backgroundColor:"rgba(200,54,96, 0.8)",
//                    borderWidth:3,
//                    fill:false,
//                }],
//            },
//            options: {
//                responsive: true,
//                title: {
//                    display: true,
//                    text: 'Average Smoothness Score over Sessions',
//                    fontSize:16,
//                    fontColor:'#000'
//                },
//                scales: {
//                    yAxes: [{
//                        ticks: {
//                            max:0,
//                            fontSize:13,
//                            fontColor:'#000'
//                        },
//                        scaleLabel: {
//                            labelString:'Average Smoothness',
//                            display:true,
//                            fontColor:'#000',
//                            fontSize:13,
//                            //fontStyle:'bold'
//                        }
//                    }],
//
//                    xAxes: [{
//                        barPercentage: 0.4,
//                        //barThickness: 12,
//                        //maxBarThickness: 12,
//                        minBarLength: 12,
//                    }]
//                },
//
//                legend:{
//                    display: false
//                },
//                tooltips: {
//                    displayColors:false,
//                    mode:'nearest',
//                    callbacks: {
//                        title: function(tooltipItem, data) {
//                            var datasetLabel = 'Session Information';
//                            return datasetLabel;
//                        },
//                        label: function(tooltipItem, data) { 
//                            var label = ["Session Number: "+tooltipItem.xLabel];
//                            label.push("Average Score: "+Math.round(tooltipItem.yLabel * 100) / 100);
//                            label.push("Average Smoothness: "+Math.round(smoothness_score[tooltipItem.index]['smoothness']* 100) / 100);
//
//
//                            return label;
//                        }
//                    }
//                }
//            }
//        });
//    
//}
////************************************NOT USING THESE CHARTS ANYMORE****************************************************
//function drawSessionHistMeanVelChart(arr,smoothness_score,labels){
//
//    var ctx = $("#session-history-velocity")[0].getContext('2d');
//
//    
//        //Draw Chart
//        sessionHistVelChart = new Chart(ctx, {
//            
//            type: 'bar',
//            data: {
//                labels:labels,
//                datasets: [{
//                    label: 'Mean Velocity over Sessions',
//                    data:arr,
//                    borderColor: "rgba(225,82,73, 1)",
//                    backgroundColor:"rgba(225,82,73, 0.8)",
//                    borderWidth:3
//                }],
//            },
//            options: {
//                title: {
//                    display: true,
//                    text: 'Mean Velocity over Sessions',
//                    fontSize:16,
//                    fontColor:'#000'
//                },
//                scales: {
//                    yAxes: [{
//                        ticks: {
//                            min:0,
//                            fontSize:12,
//                            fontColor:'#000'
//                        },
//                        scaleLabel: {
//                            labelString:'Mean Velocity',
//                            display:true,
//                            fontColor:'#000',
//                            fontSize:14,
//                            //fontStyle:'bold'
//                        }
//                    }],
//
//                    xAxes: [{
//                        barPercentage: 0.4,
//                        //barThickness: 12,
//                        //maxBarThickness: 12,
//                        minBarLength: 12,
//                    }]
//                },
//
//                legend:{
//                    display: false
//                },
//                tooltips: {
//                    displayColors:false,
//                    mode:'nearest',
//                    callbacks: {
//                        title: function(tooltipItem, data) {
//                            var datasetLabel = 'Session Information';
//                            return datasetLabel;
//                        },
//                        label: function(tooltipItem, data) { 
//                            var label = ["Session Number: "+tooltipItem.xLabel];
//                            label.push("Average Score: "+Math.round(tooltipItem.yLabel * 100) / 100);
//                            label.push("Average Smoothness: "+Math.round(smoothness_score[tooltipItem.index]['smoothness']* 100) / 100);
//
//
//                            return label;
//                        }
//                    }
//                }
//            }
//        });
//    
//}
////************************************NOT USING THESE CHARTS ANYMORE******************************************************
//function loadSessionHistory(){
//    
//    sessions = dat
//        
//    //Make object array for instances where there's only one session
//    if (!Array.isArray(sessions)){
//        chartdata = [sessions];
//    }else{
//        chartdata = sessions;
//    }
//    arr = [];smoothness_score=[];smoothness_chart=[];velocity_chart = [];labels = []
//    for (var i = 0;i < chartdata.length;i++){
//        labels.push("Session " +String(chartdata[i]['session_id']))
//        arr.push(chartdata[i]['average_score']);
//        smoothness_chart.push(chartdata[i]['average_smoothness']);
//        velocity_chart.push(chartdata[i]['mean_velocity']);
//        smoothness_score.push({
//            smoothness:chartdata[i]['average_smoothness'],
//        });
//    }
//    if (sessionHistChart == null){       
//        //Draw chart
//        drawSessionHistGameScoreChart(arr,smoothness_score,labels)
//        drawSessionHistSmoothnessScoreChart(smoothness_chart,smoothness_score,labels)
//        drawSessionHistMeanVelChart(velocity_chart,smoothness_score,labels)
//    }
//    
//
//    else{
//        if(changePatient){
//            sessionHistChart.data.datasets[0].data = arr;
//            sessionHistChart.update();
//            sessionHistVelChart.data.datasets[0].data = velocity_chart
//            sessionHistVelChart.update();
//            sessionHistSmoothnessChart.data.datasets[0].data = smoothness_chart
//            sessionHistSmoothnessChart.update();
//            
//        }
//    }
//    showSessionHistCharts()
//}
////*****************************NOT USING THESE CHARTS ANYMORE*************************************************************

////************************************* NOT USING THESE CHARTS ANYMORE. REPLACED WITH TIME BUBBLE CHART *****************************************************************
//function showSessionHistCharts(){
//    $('#session-history-chart').show();
//    $('#session-history-velocity').show();
//    $('#session-history-smoothness').show();
//}
////************************************************************************************************************************


