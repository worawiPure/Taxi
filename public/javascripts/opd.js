$(function(){

    var setTable = function(data){
        var $tblOPD = $('#tblOPD_Service > tbody');
        $tblOPD.empty();
        var i=0;
        _.forEach(data.rows, function(v){
            i++;
            var html = '<tr> ' +
                '<td> ' + i + ' </td>'+
                '<td> ' + moment(v.vstdate).format('DD/MM/YYYY') + ' </td>'+
                '<td>' + v.hn  + ' </td>'+
                '<td>' + v.Type  + ' </td>'+
                '<td>' + v.Treatment  + ' </td>'+
                '<td> '+
                '   <div class="btn-group btn-group-sm" role="group"> '+
                '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                '<i class="fa fa-cogs"> </i> </button> '+
                '<ul class="dropdown-menu"> '+
                '<li> '+
                '<a href="#" data-action="edit" data-id="'+ v.id +'" data-service_date="'+ v.service_date +'" data-hn="'+ v.hn +'" ' +
                'data-service_type="'+ v.service_type +'" data-service_other="'+ v.service_other +'" data-service_treatment="'+ v.treatment_type +'" ' +
                'data-vsttime_card="'+ v.vsttime_card +'" data-finish_card="'+ v.finish_card +'" data-vsttime_screen="'+ v.vsttime_screen +'" ' +
                'data-finish_screen="'+ v.finish_screen +'" data-vsttime_doctor="'+ v.vsttime_doctor +'" data-finish_doctor="'+ v.finish_doctor +'" '+
                'data-vsttime_lab="'+ v.vsttime_lab +'" data-finish_lab="'+ v.finish_lab +'" data-vsttime_xray="'+ v.vsttime_xray +'" data-finish_xray="'+ v.finish_xray +'"' +
                'data-vsttime_ekg="'+ v.vsttime_ekg +'" data-finish_ekg="'+ v.finish_ekg +'" data-vsttime_other="'+ v.vsttime_other +'" ' +
                'data-finish_other="'+ v.finish_other +'" data-vsttime_appointment="'+ v.vsttime_appointment +'" data-finish_appointment="'+ v.finish_appointment +'" ' +
                'data-vsttime_drugs="'+ v.vsttime_drugs +'" data-finish_drugs="'+ v.finish_drugs +'") > '+
                '<i class="fa fa-pencil fa-fw"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'" > '+
                '<i class="fa fa-trash"> </i> ลบ </a></li></ul></div> ';

            html += '</div></td> ';
            $tblOPD.append(html);
        });
        $('[data-toggle="tooltip"]').tooltip();
    }

    $('#Block_Search').fadeOut();
    $('#Show_opdtime').fadeOut();
    $('#case_special').fadeOut();
    $('#show_service_other').fadeOut();
    $('#Block_Report_normal').fadeOut();
    $('#Block_Report_special').fadeOut();

    $('#btnShowSearch').on('click',function(e){
        $('#Block_Search').fadeIn();
        $('#Save_opdtime').fadeOut();
    });

    $('#close_Search').on('click',function(e){
        $('#Block_Search').fadeOut();
        $('#Save_opdtime').fadeIn();
        $('#Show_opdtime').fadeOut();
        $('#Date_Search1').val('');
        $('#Date_Search2').val('');
    });

    $('#close_Report_normal').on('click',function(e){
        $('#Save_opdtime').fadeIn();
        $('#Block_Search').fadeOut();
        $('#Show_opdtime').fadeOut();
        $('#Block_Report_normal').fadeOut();
        $('#Block_Report_special').fadeOut();
        $('#Date_Report_normal1').val('');
        $('#Date_Report_normal2').val('');
        $('#txtNumber_row').val('');
    });

    $('#close_Report_special').on('click',function(e){
        $('#Save_opdtime').fadeIn();
        $('#Block_Search').fadeOut();
        $('#Show_opdtime').fadeOut();
        $('#Block_Report_normal').fadeOut();
        $('#Block_Report_special').fadeOut();
        $('#Date_Report_special1').val('');
        $('#Date_Report_special2').val('');
        $('#txtNumber_row2').val('');
    });

    $('#send_block_report_normal').on('click',function(e){
        $('#Block_Report_normal').fadeIn();
        $('#Show_opdtime').fadeOut();
        $('#Block_Report_special').fadeOut();
        $('#Save_opdtime').fadeOut();
        $('#Block_Search').fadeOut();
        $('#Date_Report_normal1').val('');
        $('#Date_Report_normal2').val('');
        $('#txtNumber_row').val('');
    });

    $('#send_block_report_special').on('click',function(e){
        $('#Block_Report_special').fadeIn();
        $('#Show_opdtime').fadeOut();
        $('#Block_Report_normal').fadeOut();
        $('#Save_opdtime').fadeOut();
        $('#Block_Search').fadeOut();
        $('#Date_Report_special1').val('');
        $('#Date_Report_special2').val('');
        $('#txtNumber_row2').val('');
    });

    $('#slType_service').on('change', function (e) {
        $('#txtService_other').val('');
        //   console.log($(this).val());
        var id = $(this).val();
        if (id==4) {
            $('#show_service_other').fadeIn();
        } else {
            $('#show_service_other').fadeOut();
        }
    });

    $('#slTreatment_service').on('change', function (e) {
        //   console.log($(this).val());
        var id = $(this).val();
        if (id==2) {
            $('#txtVsttime_lab').val('');
            $('#txtFinish_lab').val('');
            $('#txtVsttime_xray').val('');
            $('#txtFinish_xray').val('');
            $('#txtVsttime_ekg').val('');
            $('#txtFinish_ekg').val('');
            $('#txtVsttime_other').val('');
            $('#txtFinish_other').val('');
            $('#case_special').fadeIn();
        } else {
            $('#case_special').fadeOut();
        }
    });

    $('#btnSave').on('click',function(e) {
        e.preventDefault();
        var data = {};
        data.service_date = $('#txtDate_service').val();
        data.hn = $('#txtHN').val();
        data.service_type = $('#slType_service').val();
        data.service_other = $('#txtService_other').val();
        data.treatment_type = $('#slTreatment_service').val();
        data.vsttime_card = $('#txtVsttime_card').val();
        data.finish_card = $('#txtFinish_card').val();
        data.vsttime_screen = $('#txtVsttime_screen').val();
        data.finish_screen = $('#txtFinish_screen').val();
        data.vsttime_doctor = $('#txtVsttime_doctor').val();
        data.finish_doctor = $('#txtFinish_doctor').val();
        data.vsttime_lab = $('#txtVsttime_lab').val();
        data.finish_lab = $('#txtFinish_lab').val();
        data.vsttime_xray = $('#txtVsttime_xray').val();
        data.finish_xray = $('#txtFinish_xray').val();
        data.vsttime_ekg = $('#txtVsttime_ekg').val();
        data.finish_ekg = $('#txtFinish_ekg').val();
        data.vsttime_other = $('#txtVsttime_other').val();
        data.finish_other = $('#txtFinish_other').val();
        data.vsttime_appointment = $('#txtVsttime_appointment').val();
        data.finish_appointment = $('#txtFinish_appointment').val();
        data.vsttime_drugs = $('#txtVsttime_drugs').val();
        data.finish_drugs = $('#txtFinish_drugs').val();

        console.log(data);

       if (!data.hn || !data.service_date || !data.service_type || !data.treatment_type || !data.vsttime_card || !data.finish_card ||
            !data.vsttime_screen || !data.finish_screen || !data.vsttime_doctor || !data.finish_doctor || !data.vsttime_appointment ||
            !data.finish_appointment || !data.vsttime_drugs || !data.finish_drugs) {
           alert('บันทึกข้อมูลไม่ครบถ้วน !! ');
       } else if (data.vsttime_lab > data.finish_lab) {
           alert('พบเวลาเริ่มต้นมากว่าเวลาเสร็จสิ้นที่ตรวจพิเศษ LAB');
       } else if (data.vsttime_xray > data.finish_xray) {
           alert('พบเวลาเริ่มต้นมากว่าเวลาเสร็จสิ้นที่ตรวจพิเศษ X-ray');
       } else if (data.vsttime_ekg > data.finish_ekg) {
           alert('พบเวลาเริ่มต้นมากว่าเวลาเสร็จสิ้นที่ตรวจพิเศษ EKG');
       } else if (data.vsttime_other > data.finish_other) {
           alert('พบเวลาเริ่มต้นมากว่าเวลาเสร็จสิ้นที่ตรวจพิเศษ อื่นๆ');
       } else if (data.vsttime_card > data.finish_card || data.vsttime_card > data.vsttime_screen || data.vsttime_card > data.finish_screen || data.vsttime_card > data.vsttime_doctor ||
           data.vsttime_card > data.finish_doctor || data.vsttime_card > data.vsttime_appointment || data.vsttime_card > data.finish_appointment ||
           data.vsttime_card > data.vsttime_drugs || data.vsttime_card > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.finish_card > data.vsttime_screen || data.finish_card > data.finish_screen || data.finish_card > data.vsttime_doctor ||
           data.finish_card > data.finish_doctor || data.finish_card > data.vsttime_appointment || data.finish_card > data.finish_appointment ||
           data.finish_card > data.vsttime_drugs || data.finish_card > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.vsttime_screen > data.finish_screen || data.vsttime_screen < data.vsttime_card || data.vsttime_screen < data.finish_card ||
           data.vsttime_screen > data.vsttime_doctor || data.vsttime_screen > data.finish_doctor || data.vsttime_screen > data.vsttime_appointment || data.vsttime_screen > data.finish_appointment ||
           data.vsttime_screen > data.vsttime_drugs || data.vsttime_screen > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.finish_screen < data.vsttime_screen || data.finish_screen < data.vsttime_card || data.finish_screen < data.finish_card ||
           data.finish_screen > data.vsttime_doctor || data.finish_screen > data.finish_doctor || data.finish_screen > data.vsttime_appointment || data.finish_screen > data.finish_appointment ||
           data.finish_screen > data.vsttime_drugs || data.finish_screen > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.vsttime_doctor > data.finish_doctor || data.vsttime_doctor < data.vsttime_card || data.vsttime_doctor < data.finish_card || data.vsttime_doctor < data.vsttime_screen || data.vsttime_doctor < data.finish_screen ||
           data.vsttime_doctor > data.vsttime_appointment || data.vsttime_doctor > data.finish_appointment ||
           data.vsttime_doctor > data.vsttime_drugs || data.vsttime_doctor > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.finish_doctor < data.vsttime_doctor || data.finish_doctor < data.vsttime_card || data.finish_doctor < data.finish_card || data.finish_doctor < data.vsttime_screen || data.finish_doctor < data.finish_screen ||
           data.finish_doctor > data.vsttime_appointment || data.finish_doctor > data.finish_appointment ||
           data.finish_doctor > data.vsttime_drugs || data.finish_doctor > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.vsttime_appointment > data.finish_appointment || data.vsttime_appointment < data.vsttime_card || data.vsttime_appointment < data.finish_card || data.vsttime_appointment < data.vsttime_screen || data.vsttime_appointment < data.finish_screen ||
           data.vsttime_appointment < data.vsttime_doctor || data.vsttime_appointment < data.finish_doctor ||
           data.vsttime_appointment > data.vsttime_drugs || data.vsttime_appointment > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if ( data.finish_appointment < data.vsttime_appointment || data.finish_appointment < data.vsttime_card || data.finish_appointment < data.finish_card || data.finish_appointment < data.vsttime_screen || data.finish_appointment < data.finish_screen ||
           data.finish_appointment < data.vsttime_doctor || data.finish_appointment < data.finish_doctor ||
           data.finish_appointment > data.vsttime_drugs || data.finish_appointment > data.finish_drugs) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.vsttime_drugs > data.finish_drugs || data.vsttime_drugs < data.vsttime_card || data.vsttime_drugs < data.finish_card || data.vsttime_drugs < data.vsttime_screen || data.vsttime_drugs < data.finish_screen ||
           data.vsttime_drugs < data.vsttime_doctor || data.vsttime_drugs < data.finish_doctor ||
           data.vsttime_drugs < data.vsttime_appointment   || data.vsttime_drugs < data.vsttime_appointment ) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else if (data.finish_drugs < data.vsttime_drugs || data.finish_drugs < data.vsttime_card || data.finish_drugs < data.finish_card || data.finish_drugs < data.vsttime_screen || data.finish_drugs < data.finish_screen ||
           data.finish_drugs < data.vsttime_doctor || data.finish_drugs < data.finish_doctor ||
           data.finish_drugs < data.vsttime_appointment   || data.finish_drugs < data.vsttime_appointment ) {
           alert('พบการลงช่วงเวลาไม่ถูกต้อง กรุณาเช็คเวลาใหม่ด้วยครับ !! ');
       } else {
                if(confirm('คุณต้องการบันทึกรายการนี้ ใช่หรือไม่')){
                    $.ajax({
                    type: "POST",
                    url: "/save_service",
                    contentType: 'application/json',
                    data:JSON.stringify({data: data})
                })
                    .success(function (data) {
                        alert('บันทึกข้อมูลเรียบร้อยแล้วครับ');
                        window.location.href="/opd";
                    })
                    .error(function (xhr, status, err) {
                        alert(err);
                    })
        }}
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
                url: "/search_date_opd",
                contentType:'application/json',
                dataType:'json',
                data: JSON.stringify(data)
            })
                .success(function(data){
                    $('#Show_opdtime').fadeIn();
                    setTable(data);
                });
        });

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var service_date = $(this).data('service_date');
        var hn = $(this).data('hn');
        var service_type = $(this).data('service_type');
        var service_other = $(this).data('service_other');
        var treatment_type = $(this).data('service_treatment');
        var vsttime_card = $(this).data('vsttime_card');
        var finish_card = $(this).data('finish_card');
        var vsttime_screen = $(this).data('vsttime_screen');
        var finish_screen = $(this).data('finish_screen');
        var vsttime_doctor  = $(this).data('vsttime_doctor');
        var finish_doctor = $(this).data('finish_doctor');
        var vsttime_lab = $(this).data('vsttime_lab');
        var finish_lab = $(this).data('finish_lab');
        var vsttime_xray = $(this).data('vsttime_xray');
        var finish_xray = $(this).data('finish_xray');
        var vsttime_ekg = $(this).data('vsttime_ekg');
        var finish_ekg = $(this).data('finish_ekg');
        var vsttime_other = $(this).data('vsttime_other');
        var finish_other = $(this).data('finish_other');
        var vsttime_appointment = $(this).data('vsttime_appointment');
        var finish_appointment = $(this).data('finish_appointment');
        var vsttime_drugs = $(this).data('vsttime_drugs');
        var finish_drugs = $(this).data('finish_drugs');
        var id = $(this).data('id');
        //var strServiceDate = moment(service_date).format('YYYY-MM-DD');
        //console.log(strServiceDate);
        $('#txtDate_service2').val(service_date);
        $('#txtHN2').val(hn);
        $('#slType_service2').val(service_type);
        $('#txtService_other2').val(service_other);
        $('#slTreatment_service2').val(treatment_type);
        $('#txtVsttime_card2').val(vsttime_card);
        $('#txtFinish_card2').val(finish_card);
        $('#txtVsttime_screen2').val(vsttime_screen);
        $('#txtFinish_screen2').val(finish_screen);
        $('#txtVsttime_doctor2').val(vsttime_doctor);
        $('#txtFinish_doctor2').val(finish_doctor);
        $('#txtVsttime_lab2').val(vsttime_lab);
        $('#txtFinish_lab2').val(finish_lab);
        $('#txtVsttime_xray2').val(vsttime_xray);
        $('#txtFinish_xray2').val(finish_xray);
        $('#txtVsttime_ekg2').val(vsttime_ekg);
        $('#txtFinish_ekg2').val(finish_ekg);
        $('#txtVsttime_other2').val(vsttime_other);
        $('#txtFinish_other2').val(finish_other);
        $('#txtVsttime_appointment2').val(vsttime_appointment);
        $('#txtFinish_appointment2').val(finish_appointment);
        $('#txtVsttime_drugs2').val(vsttime_drugs);
        $('#txtFinish_drugs2').val(finish_drugs);
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
        $('#txtDate_service2').val('');
        $('#txtHN2').val('');
        $('#slType_service2').val('');
        $('#txtService_other2').val('');
        $('#slTreatment_service2').val('');
        $('#txtVsttime_card2').val('');
        $('#txtFinish_card2').val('');
        $('#txtVsttime_screen2').val('');
        $('#txtFinish_screen2').val('');
        $('#txtVsttime_doctor2').val('');
        $('#txtFinish_doctor2').val('');
        $('#txtVsttime_lab2').val('');
        $('#txtFinish_lab2').val('');
        $('#txtVsttime_xray2').val('');
        $('#txtFinish_xray2').val('');
        $('#txtVsttime_ekg2').val('');
        $('#txtFinish_ekg2').val('');
        $('#txtVsttime_other2').val('');
        $('#txtFinish_other2').val('');
        $('#txtVsttime_appointment2').val('');
        $('#txtFinish_appointment2').val('');
        $('#txtVsttime_drugs2').val('');
        $('#txtFinish_drugs2').val('');
        $('#txtId').val(''); // do something...
    });

    $('#btnEdit').on('click',function(e){
        e.preventDefault();
        var data = {};
        data.service_date = $('#txtDate_service2').val();
        data.hn = $('#txtHN2').val();
        data.service_type = $('#slType_service2').val();
        data.service_other = $('#txtService_other2').val();
        data.treatment_type = $('#slTreatment_service2').val();
        data.vsttime_card = $('#txtVsttime_card2').val();
        data.finish_card = $('#txtFinish_card2').val();
        data.vsttime_screen = $('#txtVsttime_screen2').val();
        data.finish_screen = $('#txtFinish_screen2').val();
        data.vsttime_doctor = $('#txtVsttime_doctor2').val();
        data.finish_doctor = $('#txtFinish_doctor2').val();
        data.vsttime_lab = $('#txtVsttime_lab2').val();
        data.finish_lab = $('#txtFinish_lab2').val();
        data.vsttime_xray = $('#txtVsttime_xray2').val();
        data.finish_xray = $('#txtFinish_xray2').val();
        data.vsttime_ekg = $('#txtVsttime_ekg2').val();
        data.finish_ekg = $('#txtFinish_ekg2').val();
        data.vsttime_other = $('#txtVsttime_other2').val();
        data.finish_other = $('#txtFinish_other2').val();
        data.vsttime_appointment = $('#txtVsttime_appointment2').val();
        data.finish_appointment = $('#txtFinish_appointment2').val();
        data.vsttime_drugs = $('#txtVsttime_drugs2').val();
        data.finish_drugs = $('#txtFinish_drugs2').val();
        data.id = $('#txtId').val();

        if( data.id ) {
            $.ajax({
                type: "POST",
                url: "/edit_opd",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function (data) {
                    if (data.ok) {
                        alert('แก้ไขเสร็จเรียบร้อยแล้ว');
                        $('#mdlNew').modal('hide');

                            var data = {};
                            var date_search1 = $('#Date_Search1').val();
                            var date_search2 = $('#Date_Search2').val();
                            data.date1 = date_search1;
                            data.date2 = date_search2;
                            $.ajax({
                                type: "POST",
                                url: "/search_date_opd",
                                contentType:'application/json',
                                dataType:'json',
                                data: JSON.stringify(data)
                            })
                                .success(function(data){
                                    $('#Show_opdtime').fadeIn();
                                    setTable(data);
                                });

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
                    alert('ไม่สามารถยืนยัน ID ได้ ติดต่อ Admin');
        }});

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/remove_opd',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบข้อมูลเรียบร้อยแล้ว');
                        var data = {};
                        var date_search1 = $('#Date_Search1').val();
                        var date_search2 = $('#Date_Search2').val();
                        data.date1 = date_search1;
                        data.date2 = date_search2;
                        $.ajax({
                            type: "POST",
                            url: "/search_date_opd",
                            contentType:'application/json',
                            dataType:'json',
                            data: JSON.stringify(data)
                        })
                            .success(function(data){
                                $('#Show_opdtime').fadeIn();
                                setTable(data);
                            });
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

    $('#btnReport_normal').on('click', function(e){
        e.preventDefault();
        var data = {};
        var date_report_normal1 = $('#Date_Report_normal1').val();
        var date_report_normal2 = $('#Date_Report_normal2').val();
        //var Number_row = $('#txtNumber_row').val();
        data.date_report_normal1 = date_report_normal1;
        data.date_report_normal2 = date_report_normal2;
        data.date_report_normal1=moment(data.date_report_normal1, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.date_report_normal2=moment(data.date_report_normal2, 'DD/MM/YYYY').format('YYYY-MM-DD');
       // data.Number_row = Number_row;
        window.open('/export_report_normal/'+ data.date_report_normal1 +'/'+ data.date_report_normal2, '_blank');
    });

    $('#btnReport_special').on('click', function(e){
        e.preventDefault();
        var data = {};
        var date_report_special1 = $('#Date_Report_special1').val();
        var date_report_special2 = $('#Date_Report_special2').val();
       // var Number_row2 = $('#txtNumber_row2').val();
        data.date_report_special1 = date_report_special1;
        data.date_report_special2 = date_report_special2;
        data.date_report_special1=moment(data.date_report_special1, 'DD/MM/YYYY').format('YYYY-MM-DD');
        data.date_report_special2=moment(data.date_report_special2, 'DD/MM/YYYY').format('YYYY-MM-DD');
       // data.Number_row2 = Number_row2;
        window.open('/export_report_special/'+ data.date_report_special1 +'/'+ data.date_report_special2, '_blank');
    });
});