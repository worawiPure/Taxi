var moment = require('moment');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var department = require('../models/department');
var user = require('../models/users');
var layer = require('../models/level_user');
var pname = require('../models/users');
/* GET users listing. */

router.get('/user' ,function(req,res) {
    if (req.session.level_user_id != 3 && req.session.level_user_id != 2 ){
        res.render('./page/access_denied')
    }else {
        var db = req.db;
        var data = {};
        user.getList(db)
            .then(function (rows) {
                data.users = rows;
                return department.getList(db)
            })
            .then(function (rows) {
                data.departments = rows;
                return layer.getList(db)
            })
            .then(function (rows) {
                data.layers = rows;
                return pname.getPname(db)
            })
            .then(function (rows) {
                console.log(rows);
                data.pnames = rows;
                res.render('page/user', {data: data});
            }, function (err) {
                console.log(err);
                res.render('page/user', {data: {users: [], departments: [], layers: [], pnames: []}});
            })
    }
});

router.get('/comfirm_user' ,function(req,res) {
    if (req.session.level_user_id != 3 && req.session.level_user_id != 2 ){
        res.render('./page/access_denied')
    }else {
        var db = req.db;
        var data = {};
        user.getList(db)
            .then(function (rows) {
                data.users = rows;
                return department.getList(db)
            })
            .then(function (rows) {
                data.departments = rows;
                return layer.getList(db)
            })
            .then(function (rows) {
                data.layers = rows;
                return pname.getPname(db)
            })
            .then(function (rows) {
                console.log(rows);
                data.pnames = rows;
                res.render('page/comfirm_user', {data: data});
            }, function (err) {
                console.log(err);
                res.render('page/comfirm_user', {data: {users: [], departments: [], layers: [], pnames: []}});
            })
    }
});


router.get('/register' ,function(req,res) {
    var db = req.db;
    var data = {};
    user.getList(db)
        .then(function(rows) {
            data.users = rows;
            return department.getList(db)
        })
        .then(function(rows){
            data.departments=rows;
            return layer.getList(db)
        })
        .then(function(rows){
            data.layers=rows;
            return pname.getPname(db)
        })
        .then(function(rows){
            console.log(rows);
            data.pnames=rows;
            res.render('page/register',{data:data});
        },function(err){
            console.log(err);
            res.render('page/register',{data:{users:[],departments:[],layers:[],pnames:[]}});
        })
});

router.get('/department',function(req,res){
    if (req.session.level_user_id != 3 && req.session.level_user_id != 2 ){
        res.render('./page/access_denied')
    }else {
        var db = req.db;
        var data = {};
        department.getList(db)
            .then(function (rows) {
                data.departments = rows;
                res.render('page/department', {data: data});
            }, function (err) {
                res.render('page/department', {data: {departments: []}})
            })
    }
})

router.post('/get_department',function(req,res){
    var db = req.db;
    var data = {};
   department.getList(db)
        .then(function (rows){
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});


router.post('/save_department', function(req,res){
    var db = req.db;
    var depname = req.body.depname;
    var depcode = req.body.depcode;
    if (depname && depcode){
        console.log(depcode)
        db('department')
            .select()
            .where({depcode:depcode})
            .then(function(rows){
                if(!rows.length){
                    department.save_department(db,depname,depcode)
                        .then(function(){
                            res.send({ok:true})
                        }, function(err){
                            res.send({ok:false,msg:err})
                        })
                }
                else {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                }
            })
            .catch(function(err){
                res.send({ok:false, msg:err});
            });
    }
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/update_department', function(req,res){
    var db = req.db;
    var depname = req.body.depname;
    var depcode = req.body.depcode;
    var id = req.body.id;
    if (id && depname && depcode){
        db('department')
            .select()
            .where({depcode:depcode})
            .then(function(rows){
                if(!rows.length){
                    department.update_department(db,id,depname,depcode)
                        .then(function(){
                            res.send({ok:true})
                        }, function(err){
                            res.send({ok:false,msg:err})
                        })
                }
                else {
                    res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                }
            })
            .catch(function(err){
                res.send({ok:false, msg:err});
            });
    }
    else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/get_risk_users',function(req,res){
    var db = req.db;
    var startpage = parseInt(req.body.startRecord);
    user.getSubAll(db,startpage)
        .then(function (rows){
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/get_risk_users_total',function(req,res){
    var db = req.db;
    user.getSubAll_total(db)
        .then(function (total){
            res.send({ok:true,total:total})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/get_comfirm_users',function(req,res){
    var db = req.db;
    var data = {};
    user.get_comfirm_user(db)
        .then(function (rows){
            res.send({ok:true,rows:rows})
        },function(err) {
            res.send({ok:false,msg:err})
        }
    )
});


router.post('/save_user', function(req,res){
    var db = req.db;
    var username = req.body.username;
    var password = req.body.password;
    var newPassword = crypto.createHash('md5').update(password).digest('hex');
    var level_user_id = req.body.level_user_id;
    var pname = req.body.pname;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var depcode = req.body.depcode;
    if(username && password && level_user_id && pname && fname && lname && depcode){
        user.save_user(db,username,newPassword,level_user_id,pname,fname,lname,depcode)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});


router.post('/remove_users', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        user.remove_user(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/remove_department', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        department.remove_department(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});



router.post('/update_users', function(req,res){
    var db = req.db;
    var username = req.body.username;
    var pname = req.body.pname;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var depcode = req.body.depcode;
    var level_user_id = req.body.level_user_id;
    var id = req.body.id;
    if(id && username && pname && fname && lname && depcode && level_user_id){
        user.update_user(db,id,username,level_user_id,pname,fname,lname,depcode)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/post_comfirm_users', function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        user.post_update_user(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.get('/login', function(req, res, next) {
  res.render('page/login');//page/login.jade
});

router.get('/logout',function(req,res){
  req.session.destroy();
  res.redirect('/users/login');
});

router.post('/check_register',function(req,res){
    var db=req.db;
    var data = req.body.data;
    console.log(data);
    var encryptPass = crypto.createHash('md5').update(data.password).digest('hex');
    data.password = encryptPass;
    db('risk_user')
        .select()
        .where({user:data.username})
        .then(function(rows){
            if(!rows.length){
                user.save_user2(db,data)
                    .then(function () {
                        res.send({ok: true});
                    },
                    function(err){
                        res.send({ok:false,msg:err})
                    })
            }else{
                res.send({ok: false, msg: 'ข้อมุลซ้ำ'});
            }
        })
});

router.post('/edit_user',function(req,res){
    var db=req.db;
    var data = req.body.data;
        user.save_user3(db,data)
            .then(function (rows) {
                res.send({ok: true});
            }, function(err){
                res.send({ok:false,msg:err})
            })
});

router.post('/edit_user_password',function(req,res) {
    var db = req.db;
    var username =req.body.username;
    var password =req.body.password;
    var id =req.body.id;
    var encryptPass = crypto.createHash('md5').update(password).digest('hex');
    console.log(username,encryptPass,id);
            user.save_user4(db,id,username,encryptPass)
                .then(function () {
                    res.send({ok: true});
                    }, function (err) {
                    res.send({ok: false, msg: err})
                })
});

router.post('/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var encryptPass = crypto.createHash('md5').update(password).digest('hex');
  var db=req.db;
  db('user as u')
      .select()
      .where({user:username, password:encryptPass, comfirm: 'Y'})
      .then(function(rows) {
          console.log(rows);
          if (rows.length > 0) {
              req.session.logged = true;
              req.session.level_user_id = rows[0].level_user_id;
              req.session.username = username;
              req.session.fullname = rows[0].fname + ' ' + rows[0].lname;
              req.session.date_now = moment().format("DD-MM-YYYY");
              if (req.session.level_user_id == 1) {
                  res.send({ok: true});
              } else {
                  res.send({ok: false});
              }
          }
          else {
              res.send({ok: false});
          }
      });
      //.catch(function(err){
      //  console.log(err);
      //  res.render('page/login',{departments:[] });
      //});
});

router.get('/user_profile',function(req,res){
    var db = req.db;
    var data = {};
    data.username = req.session.username ;
    console.log(req.session.username)
    user.getUser_edit(db,data)
        .then(function (rows) {
            data.users = rows[0];
            console.log(data);
            return pname.getPname(db)
        })
        .then(function (rows){
            data.pnames=rows;
            return department.getList(db)
        })
        .then(function (rows){
            data.departments=rows;
            res.render('page/user_profile',{data:data});
        },function(err) {
            console.log(err);
            res.render('page/user_profile',{data:{users:[],pnames:[],departments:[]}});
        })
});

router.get('/user_senior_profile',function(req,res){
    var db = req.db;
    var data = {};
    data.username = req.session.username ;
    console.log(req.session.username)
    user.getUser_edit(db,data)
        .then(function (rows) {
            data.users = rows[0];
            console.log(data);
            return pname.getPname(db)
        })
        .then(function (rows){
            data.pnames=rows;
            return department.getList(db)
        })
        .then(function (rows){
            data.departments=rows;
            res.render('page/user_senior_profile',{data:data});
        },function(err) {
            console.log(err);
            res.render('page/user_senior_profile',{data:{users:[],pnames:[],departments:[]}});
        })
});

router.get('/admin_profile',function(req,res){
    var db = req.db;
    var data = {};
    data.username = req.session.username ;
    console.log(req.session.username)
    user.getUser_edit(db,data)
        .then(function (rows) {
            data.users = rows[0];
            console.log(data);
            return pname.getPname(db)
        })
        .then(function (rows){
            data.pnames=rows;
            return department.getList(db)
        })
        .then(function (rows){
            data.departments=rows;
            res.render('page/admin_profile',{data:data});
        },function(err) {
            console.log(err);
            res.render('page/admin_profile',{data:{users:[],pnames:[],departments:[]}});
        })
});


module.exports = router;
