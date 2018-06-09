$(function(){
    var setTable = function(data){
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
                '<a href="#" data-action="edit" data-id="'+ v.id +'" data-username="'+ v.user +'" data-password="'+ v.password +'"  data-pname="'+ v.pname +'"  data-fname="'+ v.fname +'"  data-lname="'+ v.lname +'"  data-depcode="'+ v.depcode +'" data-level_user_id="'+ v.level_user_id +'" ) > '+
                '<i class="fa.fa-edit"> </i> แก้ไข </a></li> '+
                '<li> '+
                '<a href="#" data-action="remove" data-id="'+ v.id +'">'+
                '<i class="fa fa-trash"> </i>ลบ </a></li></ul></div> ';
            $tblRisk.append(html);

        })
    }

    var getUserRisk = function(){
        $.ajax({
            method:'POST',
            url:'/users/get_risk_users_total',
            dataType:'json'

        })
            .success(function(data){
                $("#paging").paging(data.total, {
                    format: "< . (qq -) nnncnnn (- pp) . >",
                    perpage: 5,
                    lapping: 0,
                    page: 1,
                    onSelect: function (page) {
                        var startRecord = this.slice[0];
                        console.log(this.slice);
                        $.ajax({
                            method:'POST',
                            url:'/users/get_risk_users',
                            dataType:'json',
                            contentType:'application/json',
                            data: JSON.stringify({startRecord:startRecord})
                        })
                            .success(function(data){
                                setTable(data);
                                console.log(data)
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

    $(document).on('click','a[data-action="remove"]', function(e){
        e.preventDefault();
        var id = $(this).data('id');
        if(confirm('คุณต้องการลบรายการนี้ ใช่หรือไม่')){
            $.ajax({
                method:'POST',
                url:'/users/remove_users',
                dataType:'json',
                data:{
                    id:id
                }
            })
                .success(function(data){
                    if(data.ok) {
                        alert('ลบเสร็จเรีนบร้อยแล้ว');
                        getUserRisk()
                    } else {
                        console.log(data.msg);
                        alert('ไม่สามารถบันทึได้')
                    }
                })
                .error(function(xhr, status, err){
                    console.log(err);
                    alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                })
        }
    });

    $(document).on('click','a[data-action="edit"]',function(e){
        e.preventDefault();
        var username = $(this).data('username');
       // var password = $(this).data('password');
        var pname = $(this).data('pname');
        var fname = $(this).data('fname');
        var lname = $(this).data('lname');
        var depcode = $(this).data('depcode');
        var level_user_id = $(this).data('level_user_id');
        var id = $(this).data('id');

        $('#txtUsername').val(username);
     //   $('#txtPassword').val(password);
        $('#slPname').val(pname);
        $('#txtFname').val(fname);
        $('#txtLname').val(lname);
        $('#slDepartment').val(depcode);
        $('#slLayer').val(level_user_id);
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
        $('#txtUsername').val('');
        $('#txtPassword').val('');
        $('#slPname').val('');
        $('#txtFname').val('');
        $('#txtLname').val('');
        $('#slDepartment').val('');
        $('#slLayer').val('');
        $('#txtId').val('');// do something...
    });

    $('#btnSave').on('click',function(e){
        e.preventDefault();
        var username = $('#txtUsername').val();
        var password = $('#txtPassword').val();
        var pname = $('#slPname').val();
        var fname = $('#txtFname').val();
        var lname = $('#txtLname').val();
        var depcode = $('#slDepartment').val();
        var level_user_id = $('#slLayer').val();
        var id = $('#txtId').val();

        if(username && pname && fname && lname && depcode && level_user_id){
            if(id){
                $.ajax({
                    method:'POST',
                    url:'/users/update_users',
                    dataType:'json',
                    data:{
                        username:username,
                        pname:pname,
                        fname:fname,
                        lname:lname,
                        depcode:depcode,
                        level_user_id:level_user_id,
                        id:id
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('แก้ไขเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getUserRisk();
                        } else {
                            console.log(data.msg);
                            alert('ไม่สามารถบันทึได้')
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }else{
                $.ajax({
                    method:'POST',
                    url:'/users/save_user',
                    dataType:'json',
                    data:{
                        username:username,
                        password:password,
                        level_user_id:level_user_id,
                        pname:pname,
                        fname:fname,
                        lname:lname,
                        depcode:depcode
                    }
                })
                    .success(function(data){
                        if(data.ok) {
                            alert('บันทึกเสร็จเรีนบร้อยแล้ว');
                            $('#mdlNew').modal('hide');
                            getUserRisk();
                        } else {
                            console.log(data.msg);
                            alert('ไม่สามารถบันทึได้')
                        }
                    })
                    .error(function(xhr, status, err){
                        console.log(err);
                        alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
                    })
            }

            //save

        } else{
            alert('กรุณากรอกข้อมูลให้ครบ')
        }
    });
    getUserRisk();
})