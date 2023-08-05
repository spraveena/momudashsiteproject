var chartView
function loadMarkerDropDown(vals){
    $("#select-marker").empty();
    $.each(vals, function(index, value) {
        $("#select-marker").append("<option>" + value + "</option>");
    });
}

function loadPatientDropDown(vals){
    $("#select-patient").empty();
    $.each(vals, function(index, value) {
        $("#select-patient").append("<li><a><p>" + value + "</p></a></li>");
    });
}

function loadYearDropdown(vals){
    $("#select-year").empty();
    $.each(vals, function(index, value) {
        $("#select-year").append("<option>" + value + "<option>");
    });
}

function updatePatientDetails(data){
    $('#patient_id').text(data.patient_id); 
    $('#num_sessions').text(data.num_sessions);
    $('#ave_score').text(data.ave_score);
    
}

function dispDataTable(){
	// console.log("Displaying data table")
	$('#session-history-table-holder').show();
    $('#session-history-table').show();
    // $('#table-subtitle').show();
    $('#chart-table-toggle').text("Chart View")
}

$('#chart-table-toggle').click(function(){
    $('#table-holder').toggle();   
    $('#table-subtitle').toggle();
    
    if ($('#chart-table-toggle').text() == "Chart View") {
        $('#chart-table-toggle').text("Table View");
        $('#session-hist-table-holder').hide();
        loadMonthlyChart()
		$('#session-history-chart').show()
        
    }           
    else{
        $('#chart-table-toggle').text("Chart View");
        $('#session-hist-table-holder').show();
		
        hideSessionHistChart();
    }
        

    
        
})


$('#select-marker').change(function(){
    var markerName = $('#select-marker').val();
    window.marker = patient_data['markerList'].indexOf(markerName)+1
    clearAllCharts();
    loadMetricChart('displacement',0)
    
})

$('#select-patient').click(function(e){
    //patient_id = $('#select-patient').val()
    patient_id = $(e.target).text()    
    $.ajax({
            type: "POST",
            url: "",
            data: {"patient_id":patient_id},
            success: function(data){
				
				
                changePatient = true;
                updateMetrics()
                window.sessionHistory.destroy();
                dat = data.sessions_list
				hideSessionHistChart();
                loadDataTable(dat);
                loadMonthlyChart(); 
                dispDataTable();
				
                
                updatePatientDetails(data);
                changePatient = false;
                
                
                

            }
        });   
})

$('#patient-search').keyup(function(){
    //patient_id = $('#select-patient').val()
    input = $('#patient-search').val().toUpperCase()
    listOfNames = document.getElementById("select-patient").getElementsByTagName("li")
    for (i = 0; i < listOfNames.length; i++) {
        a = listOfNames[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(input) > -1) {
            listOfNames[i].style.display = "";
        } else {
            listOfNames[i].style.display = "none";
        }
    }   
})




