$(function(){
    //
    //var getregister = function(){
    //    $.ajax({
    //        method:'GET',
    //        url:'users/register',
    //        dataType:'json'
    //    })
    //        .success(function(data){
    //            if(data.ok) {
    //                getregister();
    //            } else {
    //                alert('ติดต่อฐานไม่ได้')
    //            }
    //        })
    //        .error(function(xhr, status, err){
    //            console.log(err);
    //            alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
    //        })
    //};


    $('#btnSaveregister').on('click', function(e){
        //   console.log($(this).val());
        var data = {};
        data.username = $('#txtUsername').val();
        data.password = $('#txtPassword').val();
        data.pname = $('#slPname').val();
        data.fname = $('#txtName').val();
        data.lname = $('#txtLname').val();
        data.department = $('#slDepartment').val();

        if(!data.username|| !data.password || !data.pname|| !data.fname || !data.lname || !data.department ) {
            $('#divAlert').fadeIn('slow');
            setTimeout(function () {
                $('#divAlert').fadeOut('slow');
            }, 2000)
        } else {
            $.ajax({
                type: "POST",
                url: "/users/check_register",
                contentType: 'application/json',
                data:JSON.stringify({data: data})
            })
                .success(function (data) {
                    if (data.ok) {
                        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
                        window.location.href="/users/user";
                    } else {
                        $('#divDuplicated').fadeIn();
                        setTimeout(function () {
                            $('#divDuplicated').fadeOut();
                        }, 2000)
                        //alert(data.msg);
                    }

                })
                .error(function (xhr, status, err) {
                    alert("ไม่สามารถเชื่อมต่อกับแม่ข่ายได้")
                })
        }
    });

})