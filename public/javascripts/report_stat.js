$(function(){
    var setTable = function(data){
        var $tblStat = $('#tblReport_stat > tbody');
        $tblStat.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.report_date).format('DD/MM/YYYY') + ' </td>'+
                '<td> ' + v.detail + ' </td>'+
                '<td> ' + v.depname + ' </td>'+
                '<td> '+
                '   <div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" data-action="edit" data-id="'+ v.id +'" data-report_date="'+ moment(v.report_date).format('DD/MM/YYYY') +'" data-detail="'+ v.detail +'" '+
                'data-depcode="'+ v.depcode +'" > '+
                '<i class="fa fa-pencil fa-fw"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'" > '+
                '<i class="fa fa-trash"> </i> ลบ </a></li></ul></div> ';
            $tblStat.append(html);
        })
    };

    var getReport_stat = function(){
        $.ajax({
            method:'POST',
            url:'/get_report_stat_total',
            dataType:'json'
        })
            .success(function(data){
                //setTable(data);
                $("#paging").paging(data.total, {
                    format: "< . (qq -) nnncnnn (- pp) . >",
                    perpage: 10,
                    lapping: 0,
                    page: 1,
                    onSelect: function (page) {
                        var startRecord = this.slice[0];
                        console.log(this.slice);
                        $.ajax({
                            method:'POST',
                            url:'/get_report_stat',
                            dataType:'json',
                            contentType:'application/json',
                            data: JSON.stringify({startRecord:startRecord})
                        })
                            .success(function(data){
                                setTable(data);
                            })
                        // Index.getService(start, end, startRecord, function (err, rows) {
                        //     if (err) console.log(err);
                        //     else Index.setServiceList(rows);
                        // });
                    },
                    onFormat: function (type) {
                        switch (type) {
                            case 'block':

                                if (!this.active)
                                    return '<li class="disabled"><a href="">' + this.value + '</a></li>';
                                else if (this.value != this.page)
                                    return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';
                                return '<li class="active"><a href="#">' + this.value + '</a></li>';

                            case 'right':
                            case 'left':

                                if (!this.active) {
                                    return "";
                                }
                                return '<li><a href="#' + this.value + '">' + this.value + '</a></li>';

                            case 'next':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&raquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&raquo;</a></li>';

                            case 'prev':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&laquo;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&laquo;</a></li>';

                            case 'first':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&lt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&lt;</a></li>';

                            case 'last':

                                if (this.active) {
                                    return '<li><a href="#' + this.value + '">&gt;</a></li>';
                                }
                                return '<li class="disabled"><a href="">&gt;</a></li>';

                            case 'fill':
                                if (this.active) {
                                    return '<li class="disabled"><a href="#">...</a></li>';
                                }
                        }
                        return ""; // return nothing for missing branches
                    }
                });

            })
    };

    $('#Block_Search').fadeOut();
    $('#btnShowSearch').on('click',function(e){
        $('#Block_Search').fadeIn();
        $('#Block_Show_report').fadeOut();
        $('#btnPrint').fadeOut();
    });
    $('#close_Search').on('click',function(e){
        $('#Block_Search').fadeOut();
        $('#Block_Show_report').fadeIn();
            getReport_stat();
        $('#Date_Search1').val('');
        $('#Date_Search2').val('');
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
        e.preventDefault();
        var data = {};
        var date_search1 = $('#Date_Search1').val();
        var date_search2 = $('#Date_Search2').val();
        data.date1 = date_search1;
        data.date2 = date_search2;
        $.ajax({
            type: "POST",
            url: "/search_report_date",
            contentType:'application/json',
            dataType:'json',
            data: JSON.stringify(data)
        })
            .success(function(data){
                $('#Block_Show_report').fadeIn();
                $('#btnPrint').fadeIn();
                setTable(data);
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
    getReport_stat();
});