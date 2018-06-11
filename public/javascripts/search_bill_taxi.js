$(function(){
    var setTable = function(data){
        var $tblBill = $('#tblBill_search > tbody');
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
                url: "/bill/search_bill_taxi_detail",
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
                url: "/bill/search_bill_taxi_detail_person",
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
            window.open('/bill/search_bill_date/'+ data.date_report1 +'/'+ data.date_report2, '_blank');
        } else {
            window.open('/bill/search_bill_date_person/'+ data.date_report1 +'/'+ data.date_report2 +'/'+ data.personx, '_blank');
        }
    });

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
                                    e.preventDefault();
                                        var data = {};
                                        var date_search1 = $('#Date_Search1').val();
                                        var date_search2 = $('#Date_Search2').val();
                                        var personx = $('#slPersonx').val();
                                        data.date1 = date_search1;
                                        data.date2 = date_search2;
                                        data.personx = personx;
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
                                                    url: "/bill/search_bill_taxi_detail",
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
                                                    url: "/bill/search_bill_taxi_detail_person",
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
                url:'/bill/remove_bill',
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
                        var personx = $('#slPersonx').val();
                        data.date1 = date_search1;
                        data.date2 = date_search2;
                        data.personx = personx;
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
                                    url: "/bill/search_bill_taxi_detail",
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
                                    url: "/bill/search_bill_taxi_detail_person",
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