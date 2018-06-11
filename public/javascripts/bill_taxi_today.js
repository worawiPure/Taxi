$(function(){
    var setTable = function(data){
        var $tblBill = $('#tblBill_today > tbody');
        $tblBill.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.date_bill).format('DD/MM/YYYY') + ' </td>'+
                '<td> ' + v.Pt + ' </td>'+
                '<td> ' + v.receive_money + ' </td>'+
                '<td> ' + v.note + ' </td>'+
                '<td> '+
                '   <div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" data-action="edit" data-id="'+ v.id +'" data-date_bill="'+ moment(v.date_bill).format('DD/MM/YYYY') +'" data-person="'+ v.person_id +'" '+
                'data-receive_money="'+ v.receive_money +'" data-note="'+ v.note +'"  '+
                '<i class="fa fa-pencil fa-fw"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'" > '+
                '<i class="fa fa-trash"> </i> ลบ </a></li></ul></div> ';
            $tblBill.append(html);
        })
    };

    var getBill_today = function(){
        $.ajax({
            method:'POST',
            url:'/bill/bill_total_today',
            dataType:'json'
        })
            .success(function(data){
                //setTable(data);
                $("#paging").paging(data.total, {
                    format: "< . (qq -) nnncnnn (- pp) . >",
                    perpage: 30,
                    lapping: 0,
                    page: 1,
                    onSelect: function (page) {
                        var startRecord = this.slice[0];
                        console.log(this.slice);
                        $.ajax({
                            method:'POST',
                            url:'/bill/bill_detail_today',
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

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var date_bill = $(this).data('date_bill');
        var person = $(this).data('person');
        var receive_money = $(this).data('receive_money');
        var note = $(this).data('note');
        var id = $(this).data('id');

        $('#txtDate_bill').val(date_bill);
        $('#slPerson').val(person);
        $('#txtPay').val(receive_money);
        $('#txtNote').val(note);
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
        $('#txtDate_bill').val('');
        $('#slPerson').val('');
        $('#txtPay').val('');
        $('#txtNote').val('');
        $('#txtId').val(''); // do something...
    });

    $('#btnSave').on('click',function(e){
        e.preventDefault();
        var data = {};
        data.date_bill = $('#txtDate_bill').val();
        data.person = $('#slPerson').val();
        data.pay = $('#txtPay').val();
        data.note = $('#txtNote').val();
        data.id = $('#txtId').val();
        console.log(data);
        if (!data.date_bill){
            sweetAlert("Oops...", "กรุณาเลือกวันที่ออกใบเสร็จ!", "error");
        } else if (!data.person){
            sweetAlert("Oops...", "กรุณาเลือกบุคคลที่เช่า!", "error"); 
        } else if (!data.pay){
            sweetAlert("Oops...", "กรุณาระบุจำนวนเงินที่จ่าย !", "error");
        } else {
            if (confirm('คุณต้องการบันทึกรายการนี้ ใช่หรือไม่')) {
                if(data.id) {
                    $.ajax({
                        type: "POST",
                        url: "/bill/edit_bill",
                        contentType: 'application/json',
                        data:JSON.stringify({data: data})
                    })
                        .success(function (data) {
                            if (data.ok) {
                                swal("แก้ไขข้อมูลเรียบร้อย!", "กดปุ่มตกลง", "success");
                                $('#mdlNew').modal('hide');
                                getBill_today(data);
                            } else {
                                console.log(data.msg);
                                sweetAlert("Oops...", "Taxi คันนี้ได้เช่า แล้วในวันนี้!", "error");
                            }
                        })
                        .error(function (xhr, status, err) {
                            console.log(err);
                            sweetAlert("Oops...", "กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย!", "error");
                        })
                } else {
                    $.ajax({
                        type: "POST",
                        url: "/bill/save_bill",
                        contentType: 'application/json',
                        data:JSON.stringify({data: data})
                    })
                        .success(function (data) {
                            if (data.ok) {
                                swal("บันทึกข้อมูลเรียบร้อยแล้ว!", "กดปุ่มตกลง!", "success");
                                $('#mdlNew').modal('hide');
                                getBill_today(data);
                            } else {
                                console.log(data.msg);
                                sweetAlert("Oops...", "ไม่สามารถบันทึกใบเสร็จได้!", "error");
                            }
                        })
                        .error(function (xhr, status, err) {
                            console.log(err);
                            sweetAlert("Oops...", "กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย!", "error");
                        })    
                }
        }} });

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/bill/remove_bill',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        swal("ลบข้อมูลเรียบร้อยแล้ว!", "กดปุ่มตกลง!", "success");
                        getBill_today(data);
                    } else {
                        console.log(data.msg);
                        sweetAlert("Oops...", "ไม่สามารถลบข้อมูลได้!", "error");
                    }
                })
                .error(function(xhr, status, err){
                    console.log(err);
                    sweetAlert("Oops...", "กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย!", "error");
                })
        }
    });
    getBill_today();
});