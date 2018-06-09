$(function() {
    $('#btnPrint').fadeOut('slow');
    $('#divlevel').fadeOut();
    $(document).on('change', '#slRisk_type', function (e) {
        var id = $(this).val();
        if(id){
            $.ajax({
                url:'/report_risk/sl_level',
                method:'POST',
                data:{id:id}
            })
                .success(function(data){
                    var $sl = $('#divlevel');
                    $sl.empty();
                    _.forEach(data.rows, function(t){
                        console.log(data.rows);
                        $sl.append('<option value="'+ t.id+'">'+ t.risk_level +'</option> ');
                    });
                    $('#divlevel').fadeIn();
                    $('#btnPrint').fadeOut('slow');
                })
                .error(function(xhr,status,err){

                })
        } else{
            alert('กรุณาเลือกกลุ่มความเสี่ยง');
        }
    });

    var setTable = function(data){
        var $tblRisk = $('#tblReport_terminal > tbody');
        $tblRisk.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.Date_Time).format('DD/MM/YYYY HH:mm') + ' </td>'+
                '<td>' + v.risk_detail  + ' </td>'+
                '<td>' + v.name_sub_program  + ' </td>'+
                '<td>' + v.program_risk  + ' </td>'+
                '<td>' + v.Type  + ' </td>'+
                '<td>' + v.Leve  + ' </td>'+
                '<td>' + v.depname  + ' </td>'+
                '<td>' + v.confirm  + ' </td>';

            html += '</div></td> ';
            $tblRisk.append(html);
        });
        $('[data-toggle="tooltip"]').tooltip();
    }



        $('#btnSearch').on('click', function(e){
            e.preventDefault();
            var data = {};
            var searchrisk1 = $('#Date_Searchrisk1').val();
            var searchrisk2 = $('#Date_Searchrisk2').val();
            var risk_type = $('#slRisk_type').val();
            var risk_level = $('#divlevel').val();

            data.date1 =  searchrisk1;
            data.date2 = searchrisk2;
            data.risk_type = risk_type;
            data.risk_level = risk_level;

            if(!data.date1 || !data.date2 || !data.risk_type || !data.risk_level) {
                $('#divAlert').fadeIn('slow');
            } else{
                console.log(data)
                $('#divAlert').fadeOut('slow');
                $('#btnPrint').fadeIn('slow');
                    $.ajax({
                        type: "POST",
                        url: "/report_risk/report_level",
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    })
                    .success(function(data) {
                        setTable(data);
                    })
                    .error(function (xhr, status, err) {
                        alert(err);
                    })
            }
        });

        $('#btnPrint').on('click', function(e){
            e.preventDefault();
            var data = {};
            var searchrisk1 = $('#Date_Searchrisk1').val();
            var searchrisk2 = $('#Date_Searchrisk2').val();
            var risk_type = $('#slRisk_type').val();
            var risk_level = $('#divlevel').val();

            window.open('/prints/report_level/' + searchrisk1 + '/' + searchrisk2 + '/' + risk_type + '/' + risk_level)

        });


})