$(document).ready(function() {
    $('#btnLogin').on('click',function(e) {
        e.preventDefault();
        var username = $('#txtUsername').val();
        var password = $('#txtPassword').val();
        $.ajax({
            method:'POST',
            url:'/users/login',
            dataType:'json',
            data:{
                username:username,
                password:password
            }
        })
            .success(function(data){
                if(data.ok) {
                    window.location.href="/main_report";
                } else {
                    sweetAlert("Oops...", "Check User Password!", "error");
                }
            })
            .error(function(xhr, status, err){
                console.log(err);
                alert('กรุณาตรวจสอบการเชื่อมต่อกับแม่ข่าย')
            })
    });
})