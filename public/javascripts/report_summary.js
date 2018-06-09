$(function() {
    $('#btnPrint').fadeOut('slow');
    var setTable = function(data){
        var $tblRisk = $('#tblReport_summary > tbody');
        $tblRisk.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + v.depname + ' </td>'+
                '<td>' + v.M1  + ' </td>'+
                '<td>' + v.M2  + ' </td>'+
                '<td>' + v.M3  + ' </td>'+
                '<td>' + v.M4  + ' </td>'+
                '<td>' + v.M5  + ' </td>'+
                '<td>' + v.M6  + ' </td>'+
                '<td>' + v.M7  + ' </td>'+
                '<td>' + v.M8  + ' </td>'+
                '<td>' + v.M9  + ' </td>'+
                '<td>' + v.M10  + ' </td>'+
                '<td>' + v.M11  + ' </td>'+
                '<td>' + v.M12  + ' </td>';
            html += '</div></td> ';

            $tblRisk.append(html);
        });
        $('[data-toggle="tooltip"]').tooltip();
        }
        $('#btnSearch').on('click', function(e){
            e.preventDefault();
            var data = {};
            var search1 = $('#Date_Search_summary1').val();
            var search2 = $('#Date_Search_summary2').val();

            data.date1 =  search1;
            data.date2 = search2;

            if(!data.date1 || !data.date2  ) {
                $('#divAlert').fadeIn('slow');
            } else{
                console.log(data);
                $('#divAlert').fadeOut('slow');
                    $.ajax({
                        type: "POST",
                        url: "/show_report_summary",
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    })
                    .success(function(data) {
                        setTable(data);
                        $('#btnPrint').fadeIn('slow');
                    })
                    .error(function (xhr, status, err) {
                        alert(err);
                    })
            }
        });

        $('#btnPrint').on('click', function(e){
            e.preventDefault();
            var data = {};
            var search1 = $('#Date_Search_summary1').val();
            var search2 = $('#Date_Search_summary2').val();
            data.date_report1 = search1;
            data.date_report2 = search2;
            data.date_report1=moment(data.date_report1, 'DD/MM/YYYY').format('YYYY-MM-DD');
            data.date_report2=moment(data.date_report2, 'DD/MM/YYYY').format('YYYY-MM-DD');
            window.open('/print_report_summary/' + data.date_report1 + '/' + data.date_report2, '_blank')
        });
});
