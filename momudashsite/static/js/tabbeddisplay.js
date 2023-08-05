//function displayMetric(evt, metric) {   
//    hideAllChartContent();
//    clearTabDisplay();
//    evt.currentTarget.className += " active";
//    
//    
//    loadMetricChart(metric,0);
//}
function retrieveDispData(trial_num){
    hideAllChartContent();
    clearTabDisplay();
    $.ajax({
            type: "POST",
            url: "disp_data/",
            data: {
                "trial_num":trial_num,
                "session_id":window.sessionId
            },
            success: function(data){
                loadDispChart(data.disp_data);
                changeDispData = false
            }
        });
}

function disp_view(evt){
    hideAllChartContent();
    clearTabDisplay();
    if (changeDispData == true){
        if (trial_num == null){
            trial_num = 0           
        }
        retrieveDispData(trial_num)
    }
    else{
        highlightTab(1);
        document.getElementById('displacement').style.display = "block";
        }
    
    
}

function vel_view(evt){
    hideAllChartContent();
    clearTabDisplay();

    if (changeVelData == true){
        if (trial_num == null){
            trial_num = 0           
        }
        $.ajax({
            type: "POST",
            url: "vel_data/",
            data: {
                "trial_num":trial_num,
                "session_id":window.sessionId
            },
            success: function(data){
                loadVelChart(data.vel_data);
                changeVelData = false
            }
        });
    }
    else{
        highlightTab(2);
        document.getElementById('velocity').style.display = "block";
    }
    
}

function autocorr_view(evt){
    hideAllChartContent();
    clearTabDisplay();

    
    if(changeAutoCorrData == true){
        if (trial_num == null){
            trial_num = 0           
        }
        $.ajax({
            type: "POST",
            url: "autocorr_data/",
            data: {
                "trial_num":trial_num,
                "session_id":window.sessionId
            },
            success: function(data){
                loadAutoCorrChart(data.autocorr_data);
                changeAutoCorrData = false
            }
        });
    }
    else{
        highlightTab(3);
        document.getElementById('autocorrelation').style.display = "block";
        }
    
}

function prec_view(evt){
    hideAllChartContent();
    clearTabDisplay();

    if(changePrecData == true){
        if (trial_num == null){
            trial_num = 0           
        }
        $.ajax({
            type: "POST",
            url: "prec_data/",
            data: {
                "trial_num":trial_num,
                "session_id":window.sessionId
            },
            success: function(data){
                loadPrecChart(data.prec_data);
                changePrecData = false
            }
        });
    }
    else{
        highlightTab(4);
        document.getElementById('precision').style.display = "block";
        }
    
}

function clearTabDisplay(){
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

function highlightTab(index){
    tablinks = document.getElementsByClassName("tablinks");
    tablinks[index].className += " active";
}

//Hides all metric chart
function hideAllChartContent(){
    tabcontent = document.getElementsByClassName("ct-chart");
    for (i = 1; i < tabcontent.length; i++) {
        tabcontent[i].style.display="none"
    }
}