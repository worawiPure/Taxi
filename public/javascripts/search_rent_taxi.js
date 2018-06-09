$(function(){
    var setTable = function(data){
        var $tblRent = $('#tblRent_search > tbody');
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
    $('#btnPrint').fadeOut();
    $('#btnSearch').on('click', function(e){
        e.preventDefault();
        var data = {};
        var date_search1 = $('#Date_Search1').val();
        var date_search2 = $('#Date_Search2').val();
        var personx = $('#slPersonx').val();
        data.date1 = date_search1;
        data.date2 = date_search2;
        data.personx = personx;
        console.log(data);
        if (!data.date1){
            sweetAlert("Oops...", "กรุณาเลือกวันที่เช่าเริ่มต้น!", "error");
        } else if (!data.date2){
            sweetAlert("Oops...", "กรุณาเลือกวันที่่เช่าสิ้นสุด!", "error");
        } else if (moment(data.date2,'DD/MM/YYYY').format('YYYY-MM-DD') < moment(data.date1,'DD/MM/YYYY').format('YYYY-MM-DD') ){
            sweetAlert("Oops...", "คุณเลือกช่วงวันที่ไม่ถูกต้อง!", "error"); 
        } else { 
            if(data.personx == 0 ){
                $.ajax({
                type: "POST",
                url: "/rent/search_rent_taxi_detail",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(data)
            })
                .success(function(data){
                    $('#btnPrint').fadeIn();
                    setTable(data);
                });
            }  else {
                $.ajax({
                type: "POST",
                url: "/rent/search_rent_taxi_detail_person",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(data)
            })
                .success(function(data){
                    $('#btnPrint').fadeIn();
                    setTable(data);
                });
            }  
            } 
            
    });

    $('#btnPrint').on('click', function(e){
        e.preventDefault();
        var data = {};
        var date_report1 = $('#Date_Search1').val();
        var date_report2 = $('#Date_Search2').val();
        var personx = $('#slPersonx').val();
        //var Number_row = $('#txtNumber_row').val();
        data.date_report1 = date_report1;
        data.date_report2 = date_report2;
        data.personx = personx;
        data.date_report1=moment(data.date_report1, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.date_report2=moment(data.date_report2, 'DD/MM/YYYY').format('YYYY-MM-DD');       
        // data.Number_row = Number_row;
        if (personx == 0) {
            window.open('/rent/search_rent_date/'+ data.date_report1 +'/'+ data.date_report2, '_blank');
        } else {
            window.open('/rent/search_rent_date_person/'+ data.date_report1 +'/'+ data.date_report2 +'/'+ data.personx, '_blank');
        }
    });

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
        data.date_rent = $('#txtDate_rent').val();
        data.person = $('#slPerson').val();
        data.license_taxi = $('#slLicense_taxi').val();
        data.type_rent = $('#slType_rent').val();
        data.price_rent = $('#txtPrice_rent').val();
        data.special_pay = $('#txtSpecial_pay').val();
        data.note_special_pay = $('#txtNote_special_pay').val();
        data.id = $('#txtId').val();
        data.sumprice_rent = (data.price_rent - data.special_pay );
        
        if (!data.date_rent){
            sweetAlert("Oops...", "กรุณาเลือกวันที่เช่า!", "error");
        } else if (!data.person){
            sweetAlert("Oops...", "กรุณาเลือกบุคคลที่เช่า!", "error"); 
        } else if (!data.license_taxi){
            sweetAlert("Oops...", "กรุณาเลือกรถ Taxi !", "error"); 
        } else if (!data.type_rent){
            sweetAlert("Oops...", "กรุณาเลือกประเภทการเช่า !", "error");    
        } else if (!data.special_pay){
            sweetAlert("Oops...", "กรุณาระบุค่าเช่าพิเศษ (ไม่มีให้ใส่เลข 0 ) !", "error");
        } else if (data.sumprice_rent < 0 ) {
            sweetAlert("Oops...", "ค่าบริการพิเศษมากกว่าค่าเช่ารถ !", "error");    
            $('#txtSpecial_pay').val('');
        } else {
            if (confirm('คุณต้องการบันทึกรายการนี้ ใช่หรือไม่')) {
                if(data.id) { 
                    $.ajax({
                        type: "POST",
                        url: "/rent/edit_rent",
                        contentType: 'application/json',
                        data:JSON.stringify({data: data})
                    })
                        .success(function (data) {
                            if (data.ok) {
                                swal("แก้ไขข้อมูลเรียบร้อย!", "กดปุ่มตกลง", "success");
                                $('#mdlNew').modal('hide');
                                    e.preventDefault();
                                        var data = {};
                                        var date_search1 = $('#Date_Search1').val();
                                        var date_search2 = $('#Date_Search2').val();
                                        data.date1 = date_search1;
                                        data.date2 = date_search2;
                                        if (!data.date1){
                                            sweetAlert("Oops...", "กรุณาเลือกวันที่เช่าเริ่มต้น!", "error");
                                        } else if (!data.date2){
                                            sweetAlert("Oops...", "กรุณาเลือกวันที่่เช่าสิ้นสุด!", "error");
                                        } else if (moment(data.date2,'DD/MM/YYYY').format('YYYY-MM-DD') < moment(data.date1,'DD/MM/YYYY').format('YYYY-MM-DD') ){
                                            sweetAlert("Oops...", "คุณเลือกช่วงวันที่ไม่ถูกต้อง!", "error"); 
                                        } else {  
                                            $.ajax({
                                                type: "POST",
                                                url: "/rent/search_rent_taxi_detail",
                                                contentType:'application/json',
                                                dataType:'json',
                                                data: JSON.stringify(data)
                                            })
                                                .success(function(data){
                                                    $('#btnPrint').fadeIn();
                                                    setTable(data);
                                                });
                                            }    
                            } else {
                                console.log(data.msg);
                                sweetAlert("Oops...", "ไม่สามารถแก้ไขข้อมูลได้!", "error");
                            }
                        })
                        .error(function (xhr, status, err) {
                            console.log(err);
                            sweetAlert("Oops...", "กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย!", "error");
                        })
                } else {
                            sweetAlert("Oops...", "ไม่มีเลข ID ในการแก้ไข!", "error");
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
                        e.preventDefault();
                            var data = {};
                            var date_search1 = $('#Date_Search1').val();
                            var date_search2 = $('#Date_Search2').val();
                            data.date1 = date_search1;
                            data.date2 = date_search2;
                            if (!data.date1){
                                sweetAlert("Oops...", "กรุณาเลือกวันที่เช่าเริ่มต้น!", "error");
                            } else if (!data.date2){
                                sweetAlert("Oops...", "กรุณาเลือกวันที่่เช่าสิ้นสุด!", "error");
                            } else if (moment(data.date2,'DD/MM/YYYY').format('YYYY-MM-DD') < moment(data.date1,'DD/MM/YYYY').format('YYYY-MM-DD') ){
                                sweetAlert("Oops...", "คุณเลือกช่วงวันที่ไม่ถูกต้อง!", "error"); 
                            } else {  
                                $.ajax({
                                    type: "POST",
                                    url: "/rent/search_rent_taxi_detail",
                                    contentType:'application/json',
                                    dataType:'json',
                                    data: JSON.stringify(data)
                                })
                                    .success(function(data){
                                        $('#btnPrint').fadeIn();
                                        setTable(data);
                                    });
                                }   
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
});