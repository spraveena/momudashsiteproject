function loadDataTable(dat){
//    console.log(dat)
    window.sessionHistory = $('#session-history-table').DataTable( {
                
                data:dat,              
                scrollY:true,
                searching: false,
                lengthChange: false,
                select: {
                    items: 'row'
                },
                pageLength: 4,
                columns:[
                    {data:'session_id'},
                    {data:'time'},
                    {data:'average_score'},
                    {data:'mean_velocity'},
                    {data:'autocorr_score'}
                ]
    } );
    
    $('#session-history-table tbody').on('click','tr', function() {
        var sessionChange;
        window.sessionId;

        currentRow = window.sessionHistory.row(this).data();
        retrieveSessionDetails(currentRow.session_id)
        
    });
    
}


function loadLeaderboardTable(){
   $.ajax({
            type:"POST",
            url:"leaderboard/",
            success:function(data){
                $('session-history-chart').hide()
                window.leaderboardTable = $('#leaderboard-table').DataTable({
                    data:data.leaderboard_list,
                    scrollY:true,
                    searching:false,
                    lengthChange: false,
                    select: {
                        items: 'row'
                    },
                    pageLength: 10,
                    columns:[
                        {data:'patient_id'},
                        {data:'ave_score'}
                    ]

                })
            }
        });
    
}
       
    

function retrieveSessionDetails(sessionID){
    $.ajax({
        type: "POST",
        url: "session_id/",
        data: {"session_id":sessionID},
        success: function(data){
            window.sessionData = data.session_data
            $('#prompt').hide();
            window.sessionId = sessionID;
            sessionChange = true;                  
            displaySessionOverview(data.session_data,sessionChange);
        }
    });
}
            
