
$(function(){
    var setTable = function(data){
        var $tblStat = $('#tblReport_stat > tbody');
        $tblStat.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.vstdate).format('DD/MM/YYYY') + ' </td>'+
                '<td> ' + v.visit + ' </td>'+
                '<td> ' + v.sum_income + ' </td> '+
                '<td> '+
                '<a href="#" class="mdlNew" data-action="viwe" data-vstdate="'+ moment(v.vstdate).format('DD/MM/YYYY') +'" > '+ 
                '<i class="fa fa-edit"> </i> ดูรายละเอียด </a></li> '+  
                '<td> ';
            $tblStat.append(html);
        })
    };

    var setTable_Detail = function(data){
        var $tblStat_Detail = $('#tblReport_detail > tbody');
        $tblStat_Detail.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.vstdate).format('DD/MM/YYYY') + ' '+ v.vsttime +' </td>'+
                '<td> ' + v.hn + ' </td>'+
                '<td> ' + v.person_name + ' </td> '+
                '<td> ' + v.income + ' </td> ';   
            $tblStat_Detail.append(html);
        })
    };

    $('#btnPrint').fadeOut();
    /*$('#close_Search').on('click',function(e){
        $('#Block_Search').fadeOut();
        $('#Block_Show_report').fadeIn();
            getReport_stat();
        $('#Date_Search1').val('');
        $('#Date_Search2').val('');
    });*/

    $(document).on('click','a[data-action="viwe"]',function(e){
         $('#mdlNew').loading({
            message: 'กำลังประมวลผล...'
        });
        e.preventDefault();
        var data = {};
        var type = $('#slType').val();
        var pttype = $('#slPttype').val();
        data.vstdate = $(this).data('vstdate');
        data.type = type;
        data.pttype = pttype;
        if (!data.vstdate){
            sweetAlert("Oops...", "ข้อมูลไม่สมบูรณ์(vstdate)", "error");
        } else if (!data.type){
            sweetAlert("Oops...", "ข้อมูลไม่สมบูรณ์(type)", "error");
        } else if (!data.pttype){
            sweetAlert("Oops...", "ข้อมูลไม่สมบูรณ์(pttype)", "error");
        }
        $.ajax({
            type: "POST",
            url: "/hos_service/search_service_pttype_detail",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
                setTable_Detail(data);
                $('#mdlNew').loading('stop');
            });    

        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#viwe').on('click',function(e){
        e.preventDefault();
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var report_date = $(this).data('report_date');
        var detail = $(this).data('detail');
        var depcode = $(this).data('depcode');
        var id = $(this).data('id');

        $('#txtDate_report').val(report_date);
        $('#txtDetail').val(detail);
        $('#slDepcode').val(depcode);
        $('#txtId').val(id);
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#btnShowModal').on('click',function(e){
        e.preventDefault();
        $("#mdlNew").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#mdlNew').on('hidden.bs.modal', function (e) {
        $('#txtDate_report').val('');
        $('#txtDetail').val('');
        $('#slDepcode').val('');
        $('#txtId').val(''); // do something...
    });

    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var data = {};
        data.report_date = $('#txtDate_report').val();
        data.detail = $('#txtDetail').val();
        data.depcode = $('#slDepcode').val();
        data.id = $('#txtId').val();

        if(data.id) {
            $.ajax({
                type: "POST",
                url: "/edit_report",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function (data) {
                    if (data.ok) {
                        alert('แก้ไขเสร็จเรียบร้อยแล้ว');
                        $('#mdlNew').modal('hide');
                        getReport_stat(data);
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถบันทึกได้')
                    }
                })
                .error(function (xhr, status, err) {
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        } else {
            $.ajax({
                type: "POST",
                url: "/save_report",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function (data) {
                    if (data.ok) {
                        alert('บันทึกสร็จเรียบร้อยแล้ว');
                        $('#mdlNew').modal('hide');
                        getReport_stat(data);
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถบันทึกได้')
                    }
                })
                .error(function (xhr, status, err) {
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        }
    });


    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/remove_report',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        getReport_stat(data);
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถลบข้อมูลได้')
                    }
                })
                .error(function(xhr, status, err){
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        }

    });

    $('#btnSearch').on('click', function(e){
        $('#tblReport_stat').loading({
            message: 'กำลังประมวลผล...'
        });
        e.preventDefault();
        var data = {};
        var date_search1 = $('#Date_Search1').val();
        var date_search2 = $('#Date_Search2').val();
        var type = $('#slType').val();
        var pttype = $('#slPttype').val();
        data.date1 = date_search1;
        data.date2 = date_search2;
        data.type = type;
        data.pttype = pttype;
        if (!data.date1){
            sweetAlert("Oops...", "เลือกช่วงวันที่ด้วยครับ", "error");
        } else if (!data.date2){
            sweetAlert("Oops...", "เลือกช่วงวันที่ด้วยครับ", "error");
        } else if (!data.type){
            sweetAlert("Oops...", "เลือกประเภทบริการด้วยครับ", "error");
        } else if (!data.pttype){
            sweetAlert("Oops...", "เลือกสิทธิด้วยครับ", "error");
        }
        $.ajax({
            type: "POST",
            url: "/hos_service/search_service_pttype_summed",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
                $('#btnPrint').fadeIn();
                setTable(data);
                $('#tblReport_stat').loading('stop');
            });
    });

    $('#btnPrint').on('click', function(e){
        e.preventDefault();
        var data = {};
        var date_report1 = $('#Date_Search1').val();
        var date_report2 = $('#Date_Search2').val();
        //var Number_row = $('#txtNumber_row').val();
        data.date_report1 = date_report1;
        data.date_report2 = date_report2;
        data.date_report1=moment(data.date_report1, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.date_report2=moment(data.date_report2, 'DD/MM/YYYY').format('YYYY-MM-DD');
        // data.Number_row = Number_row;
        window.open('/report_terminal/'+ data.date_report1 +'/'+ data.date_report2, '_blank');
    });
});