$(function(){
    var get_Comfirm_UserRisk = function(){
        $.ajax({
            method:'POST',
            url:'/users/get_comfirm_users',
            dataType:'json'

        })
            .success(function(data){
                var $tblRisk = $('#tblRiskUsers > tbody');
                $tblRisk.empty();
                var i=0;
                _.forEach(data.rows, function(v){
                    i++;
                    var html = '<tr> ' +
                        '<td> ' + i + ' </td>'+
                        '<td> ' + v.Nameuser + ' </td>'+
                        '<td> ' + v.user + ' </td>'+
                        '<td> ' + v.level_username + ' </td>'+
                        '<td> ' + v.depname + ' </td>'+
                        '<td> '+
                        '   <div class="btn-group btn-group-sm" role="group"> '+
                        '<button  class="btn dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"> '+
                        '<i class="fa fa-cogs"> </i> </button> '+
                        '<ul class="dropdown-menu"> '+
                        '<li> '+
                        '<a href="#" data-action="edit" data-id="'+ v.id +'" data-username="'+ v.user +'" data-fullname="'+ v.Nameuser +'"  data-depname="'+ v.depname +'" data-level_username="'+ v.level_username +'" ) > '+
                        '<i class="fa.fa-edit"> </i> ยืนยัน </a></li></ul></div> ';
                    $tblRisk.append(html);

                })
            })
    };


    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var username = $(this).data('username');
        var fullname = $(this).data('fullname');
        var depname = $(this).data('depname');
        var level_username = $(this).data('level_username');
        var id = $(this).data('id');

        $('#txtUsername').val(username);
        $('#txtPname').val(fullname);
        $('#txtDepartment').val(depname);
        $('#txtLevel').val(level_username);
        $('#txtId').val(id);
        $("#mdlComfirm").modal({
            backdrop:'static',
            keyboard:false
        })
    });

    $('#mdlComfirm').on('hidden.bs.modal', function (e) {
        $('#txtUsername').val('');
        $('#txtPname').val('');
        $('#txtDepartment').val('');
        $('#txtLevel').val('');
        $('#txtId').val(''); // do something...
    });

    $('#btnComfirm').on('click',function(e){
        e.preventDefault();
        var id = $('#txtId').val();

                $.ajax({
                    method:'POST',
                    url:'/users/post_comfirm_users',
                    dataType:'json',
                    data:{
                        id:id
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('ยืนยันผู้ใช้งานเรีนบร้อยแล้ว');
                            $('#mdlComfirm').modal('hide');
                            get_Comfirm_UserRisk();
                        } else {
                            console.log(data.msg);
                            alert('ไม่สามารถบันทึได้')
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
    });
    get_Comfirm_UserRisk();
})