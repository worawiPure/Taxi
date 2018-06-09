$(function(){
    var setTable = function(data){
        var $tblRent = $('#tblRent_today > tbody');
        $tblRent.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.date_rental).format('DD/MM/YYYY') + ' </td>'+
                '<td> ' + v.Pt + ' </td>'+
                '<td> ' + v.license_plate + ' </td>'+
                '<td> ' + v.type_rent + ' </td>'+
                '<td> ' + v.cost_rent + ' </td>'+
                '<td> ' + v.special_pay + ' </td>'+
                '<td> ' + v.sumprice_rent + ' </td>'+
                '<td> '+
                '   <div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" data-action="edit" data-id="'+ v.id +'" data-date_rent="'+ moment(v.date_rental).format('DD/MM/YYYY') +'" data-person="'+ v.person_id +'" '+
                'data-license_taxi="'+ v.taxi_id +'" data-type_rent="'+ v.type_rental +'" data-price_rent="'+ v.cost_rent +'" data-special_pay="'+ v.special_pay +'"  '+
                'data-note_special_pay="'+ v.note_special_pay +'" > '+
                '<i class="fa fa-pencil fa-fw"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'" > '+
                '<i class="fa fa-trash"> </i> ลบ </a></li></ul></div> ';
            $tblRent.append(html);
        })
    };

    var getRent_today = function(){
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
        $('#divPrice_taxi').fadeIn();
        var date_rent = $(this).data('date_rent');
        var person = $(this).data('person');
        var license_taxi = $(this).data('license_taxi');
        var type_rent = $(this).data('type_rent');
        var price_rent = $(this).data('price_rent');
        var special_pay = $(this).data('special_pay');
        var note_special_pay = $(this).data('note_special_pay');
        var id = $(this).data('id');

        $('#txtDate_rent').val(date_rent);
        $('#slPerson').val(person);
        $('#slLicense_taxi').val(license_taxi);
        $('#slType_rent').val(type_rent);
        $('#txtPrice_rent').val(price_rent);
        $('#txtSpecial_pay').val(special_pay);
        $('#txtNote_special_pay').val(note_special_pay);
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

   $('#divPrice_taxi').fadeOut();

    $('#mdlNew').on('hidden.bs.modal', function (e) {
        $('#txtDate_rent').val('');
        $('#slPerson').val('');
        $('#slLicense_taxi').val('');
        $('#slType_rent').val('');
        $('#txtSpecial_pay').val('');
        $('#txtNote_special_pay').val('');
        $('#txtPrice_rent').val('');
        $('#txtId').val(''); // do something...
    });

    $(document).on('change', '#slType_rent', function (e) {
       var id = $(this).val();
       console.log(id);
        if(id){
            $.ajax({
                url:'/rent/select_price',
                method:'POST',
                data:{id:id}
            })
                .success(function (data) {
                    var $text_price = $('#txtPrice_rent');
                    $text_price.empty();
                    _.forEach(data.rows, function (v) {
                        $text_price.val(v.price);
                    });
                    $('#divPrice_taxi').fadeIn();
                })
                .error(function(xhr,status,err){
            })
        } else{
           sweetAlert("Oops...", "กรุณาเลือกประเภทการเช่า!", "error");
        }
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
                                getRent_today(data);
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
                                getRent_today(data);
                            } else {
                                console.log(data.msg);
                                sweetAlert("Oops...", "บุคคลนี้ได้ทำการเช่ารถ Taxi หรือ รถ Taxi มีการเช่าแล้วในวันนี้!", "error");
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
                url:'/rent/remove_rent',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        swal("ลบข้อมูลเรียบร้อยแล้ว!", "กดปุ่มตกลง!", "success");
                        getRent_today(data);
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
    getRent_today();
});