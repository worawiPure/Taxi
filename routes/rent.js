var express = require('express');
var _ = require('lodash');
var moment = require('moment');
var json2xls = require('json2xls');
var router = express.Router();
var level_user = require('../models/users');
var show = require('../models/report_stat');
var save = require('../models/report_stat');
var edit = require('../models/report_stat');
var remove = require('../models/report_stat');
var utils = require('../models/utils');
var option_list = require('../models/option_list');
var rent_taxi = require('../models/rent_taxi');
var hosxp_service = require('../models/hos_service');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var lodash = require('lodash');
var Q = require('q');
var numeral = require('numeral');
var pdf = require('html-pdf');
var gulp = require('gulp');
var data = require('gulp-data');
var jade = require('gulp-jade');
var rimraf = require('rimraf');
var utf8 = require('utf-8');
var iconv = require('iconv-lite');

/* GET home page. */
router.get('/save_car_today', function(req, res, next) {
    if (req.session.level_user_id != 1){
        res.render('./page/access_denied')
    } else {
        var db =req.db;
        var data = {};
        option_list.getList_taxi(db)
            .then(function(rows){
                console.log(rows);
                data.taxis =rows;
                return option_list.getList_person_taxi(db);
            })
            .then(function(rows){
                console.log(rows)
                data.person_taxis =rows;
                return option_list.getList_rent_type(db);
            })
            .then(function(rows){
                console.log(rows)
                data.rent_types =rows;
                res.render('page/add_rent_taxi',{data:data});      
            },function(err){
                res.render('page/add_rent_taxi',{
                    data:{taxis:[],person_taxis:[],rent_types:[]}
                });
            });
    }});

router.post('/save_rent', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.username = req.session.username; 
    data.date_update = moment(req.session.date_now , 'DD-MM-YYYY').format('YYYY-MM-DD');  
    data.date_rent=moment(data.date_rent, 'DD/MM/YYYY').format('YYYY-MM-DD');
    console.log(data.sumprice_rent);
    if(data){
        rent_taxi.Check_personOrtaxi_total(db,data)
            .then(function(total){
                if (total) {
                    res.send({ok:false, msg:'บุคคลนี้ได้ทำการเช่ารถ Taxi แล้วในวันนี้'});
                } else {
                    rent_taxi.Save_rent(db,data)
                    .then(function() {
                    res.send({ok: true});
                },
                    function(err){
                    res.send({ok:false,msg:err})
                    })       
                }
            })
        
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/select_price',function(req,res){
    var id = req.body.id;
    var db = req.db;
    option_list.getList_price_rent(db,id)
        .then(function(rows){
            res.send({ok:true,rows:rows});
        },
        function(err){
            res.send({ok:false,msg:err})
        })
});
    
router.post('/rent_total_today' ,function(req,res) {
    var db = req.db;
    var _today = moment().format('YYYY-MM-DD');
    rent_taxi.Rent_total_today(db,_today)
        .then(function(total) {
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/rent_detail_today' ,function(req,res) {
    var db = req.db;
    var _today = moment().format('YYYY-MM-DD');
    var startpage  = parseInt(req.body.startRecord);
    rent_taxi.Rent_detail_today(db,_today,startpage)
        .then(function(rows) {
            console.log(rows);
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/edit_rent', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.username = req.session.username; 
    data.date_update = moment(req.session.date_now , 'DD-MM-YYYY').format('YYYY-MM-DD');  
    data.date_rent=moment(data.date_rent, 'DD/MM/YYYY').format('YYYY-MM-DD');
    console.log(data);
    if(data){
            rent_taxi.Update_rent(db,data)
            .then(function(){
            res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});



router.post('/remove_rent',function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        rent_taxi.Remove_rent(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.get('/search_rent_taxi', function(req, res, next) {
    if (req.session.level_user_id != 1){
        res.render('./page/access_denied')
    } else {
        var db =req.db;
        var data = {};
        option_list.getList_taxi(db)
            .then(function(rows){
                console.log(rows);
                data.taxis =rows;
                return option_list.getList_person_taxi(db);
            })
            .then(function(rows){
                console.log(rows)
                data.person_taxis =rows;
                return option_list.getList_rent_type(db);
            })
            .then(function(rows){
                console.log(rows)
                data.rent_types =rows;
                res.render('page/search_rent_taxi',{data:data});      
            },function(err){
                res.render('page/search_rent_taxi',{
                    data:{taxis:[],person_taxis:[],rent_types:[]}
                });
            });
    }});

router.post('/search_rent_taxi_detail',function(req,res){
    var db = req.db;
    var data = {};
    data.date1 = req.body.date1;
    data.date2 = req.body.date2;
    data.date1=moment(data.date1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.date2=moment(data.date2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    rent_taxi.Search_rent_taxi(db,data)
        .then(function(rows){
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});
   
router.post('/search_rent_taxi_detail_person',function(req,res){
    var db = req.db;
    var data = {};
    data.date1 = req.body.date1;
    data.date2 = req.body.date2;
    data.personx = req.body.personx;
    data.date1=moment(data.date1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.date2=moment(data.date2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    rent_taxi.Search_rent_taxi_person(db,data)
        .then(function(rows){
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});
    
router.get('/search_rent_date/:date_report1/:date_report2', function (req, res, next) {
    var db = req.db;
    var json = {};
    json.detail=[];
    var date1 = req.params.date_report1;
    var date2 = req.params.date_report2;
    console.log(date1,date2);
    rent_taxi.Sum_pay_rent_search(db,date1,date2)
        .then(function(rows){
            json.total_pay = numeral(rows).format('0,0.00');
            return rent_taxi.Sum_special_search(db,date1,date2)
        })
        .then(function(rows){
            json.total_special_pay = numeral(rows).format('0,0.00');
            return rent_taxi.Sum_price_search(db,date1,date2)
        })
        .then(function(rows){
            json.total_price = numeral(rows).format('0,0.00');
            return rent_taxi.Search_rent_date(db,date1,date2)
        })
        .then(function(rows){
            console.log(rows);
            rows.forEach(function (v) {
                var obj = {
                    date_rental: moment(v.date_rental).format('DD/MM/YYYY'),
                    person: v.Pt,
                    license_plate: v.license_plate,
                    type_rent: v.type_rent,
                    cost_rent: v.cost_rent,
                    special_pay: v.special_pay,
                    sumprice_rent: v.sumprice_rent 
                }
                json.detail.push(obj)
            })
            //console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_rent_search.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_rent_search.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "18mm",
                        contents: '<div style="text-align: center"><h2>รายการเช่ารถ ตั้งแต่ '+ moment(date1).format('DD/MM/YYYY') +' - '+ moment(date2).format('DD/MM/YYYY') +'</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ new Date() +'</small></span>'
                    }
                };

                var pdfName = './templates/pdf/report_rent_date' + moment().format('x') + '.pdf';

                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/search_rent_date_person/:date_report1/:date_report2/:personx', function (req, res, next) {
    var db = req.db;
    var json = {};
    json.detail=[];
    var date1 = req.params.date_report1;
    var date2 = req.params.date_report2;
    var personx = req.params.personx;
    console.log(date1,date2,personx);
    rent_taxi.Sum_pay_rent_search_person(db,date1,date2,personx)
        .then(function(rows){
            json.total_pay = numeral(rows).format('0,0.00');
            return rent_taxi.Sum_special_search_person(db,date1,date2,personx)
        })
        .then(function(rows){
            json.total_special_pay = numeral(rows).format('0,0.00');
            return rent_taxi.Sum_price_search_person(db,date1,date2,personx)
        })
        .then(function(rows){
            json.total_price = numeral(rows).format('0,0.00');
            return option_list.getList_person_id(db,personx)
        })
        .then(function(rows){
            json.person_name = rows[0];
            return rent_taxi.Search_rent_date_person(db,date1,date2,personx)
        })
        .then(function(rows){
            rows.forEach(function (v) {
                var obj = {
                    date_rental: moment(v.date_rental).format('DD/MM/YYYY'),
                    person: v.Pt,
                    license_plate: v.license_plate,
                    type_rent: v.type_rent,
                    cost_rent: v.cost_rent,
                    special_pay: v.special_pay,
                    sumprice_rent: v.sumprice_rent 
                }
                json.detail.push(obj)
            })
            //console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_rent_search_person.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_rent_search_person.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "18mm",
                        contents: '<div style="text-align: center"><h2>รายการเช่ารถ '+ json.person_name.person +' ตั้งแต่ '+ moment(date1).format('DD/MM/YYYY') +' - '+ moment(date2).format('DD/MM/YYYY') +'</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ new Date() +'</small></span>'
                    }
                };

                var pdfName = './templates/pdf/report_rent'+ json.person_name.person +''+ moment().format('x') + '.pdf';

                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});



////////////////////////////////////////////////////**************************//////////////////////////// */
router.post('/save_company', function(req,res){
    var db = req.db;
    var name = req.body.shop;
    var address = req.body.address;
    var tel =req.body.tel;
    var service = req.body.service;
        if (name){
            console.log(name);
            company.check_duplicated_company(db,name)
                .then(function (total) {
                    if (total) {
                        res.send({ok:false, msg:'ข้อมูลซ้ำ'});
                    } else {
                        company.save_company(db,name,address,tel,service)
                            .then(function(){
                                console.log('Saved');
                                res.send({ok:true})
                            }, function(err){
                                console.log(err);
                                res.send({ok:false,msg:err})
                            })
                    }
                });
        }
        else {
            res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
        }
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/service_pttype_summed', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var db2 =req.db2;
        var data = {};
        hosxp_service.getList_pttype(db2)
            .then(function(rows){
                data.hosxp_services = rows;
                console.log(data.hosxp_services);
                res.render('page/hosxp_service_pttype_summed',{data:data});
            },function(err){
                console.log(err);
                res.render('page/hosxp_service_pttype_summed',{
                data:{hosxp_services:[]}
                });
            });
    }});

router.post('/search_service_pttype_summed' ,function(req,res) {
    var db2 = req.db2;
    var data = {};
    data.date1 = moment(req.body.date1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.date2 = moment(req.body.date2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.type = req.body.type;
    data.pttype = req.body.pttype;
    if (data.type == 1){
        hosxp_service.search_service_pttype_summed_opd(db2,data)
        .then(function(rows){
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
    } 
    else {
        hosxp_service.search_service_pttype_summed_ipd(db2,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
    }
   
});        

router.post('/search_service_pttype_detail' ,function(req,res) {
    var db2 = req.db2;
    var data = {};
    data.vstdate = moment(req.body.vstdate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.type = req.body.type;
    data.pttype = req.body.pttype;
    console.log(data);
    if (data.type == 1){
        hosxp_service.search_service_pttype_detail_opd(db2,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
    } 
    else {
        hosxp_service.search_service_pttype_summed_ipd(db2,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
    }
   
});        

////////////////////////////////////////////////////////////////////

router.get('/main_report', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var db =req.db;
        var data = {};
        department.getList(db)
            .then(function(rows){
                data.departments =rows;
                res.render('page/main_report',{data:data});
            },function(err){
                console.log(err);
                res.render('page/main_report',{
                    data:{re_stars:[],departments:[]}
                });
            });
    }});


router.get('/report_stat', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        var db =req.db;
        var data = {};
        department.getList(db)
            .then(function(rows){
                data.departments =rows;
                res.render('page/report_stat',{data:data});
            },function(err){
                console.log(err);
                res.render('page/report_stat',{
                    data:{re_stars:[],departments:[]}
                });
            });
    }});

router.post('/get_report_stat_total' ,function(req,res) {
    var db = req.db;
    var _year = moment().format('YYYY');
    var _month = moment().format('MM');
    show.report_stat_total(db,_month,_year)
        .then(function(total) {
            res.send({ok:true,total:total})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/get_report_stat' ,function(req,res) {
    var db = req.db;
    var _year = moment().format('YYYY');
    var _month = moment().format('MM');
    var startpage  = parseInt(req.body.startRecord);
    show.report_stat_of_month(db,_month,_year,startpage)
        .then(function(rows) {
            console.log(rows);
            res.send({ok:true,rows:rows})
        },function(err){
            res.send({ok:false,msg:err})
        }
    )
});

router.post('/edit_report', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.report_date=moment(data.report_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if(data){
        edit.update_report(db,data)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/remove_report',function(req,res){
    var db = req.db;
    var id = req.body.id;
    if(id){
        remove.remove_report(db,id)
            .then(function(){
                res.send({ok:true})
            },function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/save_report', function(req,res){
    var db = req.db;
    var data = req.body.data;
    data.report_date=moment(data.report_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
    if(data){
        console.log(data);
        save.Save_report(db,data)
            .then(function() {
                res.send({ok: true});
            },
            function(err){
                res.send({ok:false,msg:err})
            })
    } else {
        res.send({ok:false,msg:'ข้อมูลไม่สมบูรณ์'})
    }
});

router.post('/search_report_date',function(req,res){
    var db = req.db;
    var data = {};
    data.date1 = req.body.date1;
    data.date2 = req.body.date2;
    data.date1=moment(data.date1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.date2=moment(data.date2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    show.search_date(db,data)
        .then(function(rows){
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/report_terminal/:date_report1/:date_report2', function (req, res, next) {
    var db = req.db;
    var json = {};
    json.detail=[];
    var date1 = req.params.date_report1;
    var date2 = req.params.date_report2;
    console.log(date1,date2);
    show.report_terminal(db,date1,date2)
        .then(function(rows){
            console.log(rows);
            rows.forEach(function (v) {
                var obj = {
                    report_date: moment(v.report_date).format('DD/MM/YYYY'),
                    detail: v.detail,
                    depname: v.depname
                }
                json.detail.push(obj)
            })
            //console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_terminal.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_terminal.html', 'utf8')
                var options = {
                    format: 'A4',
                    header:{
                        height: "18mm",
                        contents: '<div style="text-align: center"><h2>รายการ รายงานที่ขอ ตั้งแต่ '+ moment(date1).format('DD/MM/YYYY') +' - '+ moment(date2).format('DD/MM/YYYY') +'</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ new Date() +'</small></span>'
                    }
                };

                var pdfName = './templates/pdf/report-' + moment().format('x') + '.pdf';

                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        });
    // ensure directory
});

router.get('/report_summary', function(req, res, next) {
    if (req.session.level_user_id != 2){
        res.render('./page/access_denied')
    } else {
        res.render('page/report_summary');
    }});

router.post('/show_report_summary',function(req,res){
    var db = req.db;
    var data = {};
    data.date1 = req.body.date1;
    data.date2 = req.body.date2;
    data.date1=moment(data.date1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    data.date2=moment(data.date2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    console.log(data);
    show.show_report_summary(db,data)
        .then(function(rows){
            console.log(rows);
            res.send({ok: true,rows:rows});
        },
        function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/print_report_summary/:date_report1/:date_report2', function (req, res, next) {
    var db = req.db;
    var json = {};
    var date1 = req.params.date_report1;
    var date2 = req.params.date_report2;
    console.log(date1,date2);
    show.show_report_summary2(db,date1,date2)
        .then(function(rows){
            json.detail = rows;
            console.log(json.detail);
            fse.ensureDirSync('./templates/html');
            fse.ensureDirSync('./templates/pdf');
            var destPath = './templates/html/' + moment().format('x');
            fse.ensureDirSync(destPath);
            json.img = './img/sign.png';
            // Create pdf
            gulp.task('html', function (cb) {
                return gulp.src('./templates/report_summary_date.jade')
                    .pipe(data(function () {
                        return json;
                    }))
                    .pipe(jade())
                    .pipe(gulp.dest(destPath));
                cb();
            });

            gulp.task('pdf', ['html'], function () {
                var html = fs.readFileSync(destPath + '/report_summary_date.html', 'utf8')
                var options = {
                    format: 'A4',
                    orientation: "landscape",
                    header:{
                        height: "18mm",
                        contents: '<div style="text-align: center"><h2>รายงานประจำเดือน ตั้งแต่ '+ moment(date1).format('DD/MM/YYYY') +' - '+ moment(date2).format('DD/MM/YYYY') +'</h2></div>'
                    },
                    footer: {
                        height: "15mm",
                        contents: '<span style="color: #444;"><small>Printed: '+ new Date() +'</small></span>'
                    }
                };

                var pdfName = './templates/pdf/report-' + moment().format('x') + '.pdf';

                pdf.create(html, options).toFile(pdfName, function(err, resp) {
                    if (err) {
                        res.send({ok: false, msg: err});
                    } else {
                        res.download(pdfName, function () {
                            rimraf.sync(destPath);
                            fse.removeSync(pdfName);
                        });
                    }
                });
            });
            // Convert html to pdf
            gulp.start('pdf');

        },function(err){
            res.send({ok: false, msg: err});
        })
    // ensure directory
}),

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/export_report_normal/:start/:end',function(req, res){
    var db = req.db;
    var data = {};
   // var json = {};
    data.date_report_normal1 = req.params.start;
    data.date_report_normal2 = req.params.end;
    //data.number_row = req.params.number_row;
    //data.date_report_normal1=moment(data.date_report_normal1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    //data.date_report_normal2=moment(data.date_report_normal2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    show.export_normal(db,data)
        .then(function(rows){
        if (rows.length > 0 ){
        //json = _.sampleSize(rows,[data.number_row])  สุ่มค่าจากจำนวนแถวที่เราต้องการ
            //console.log(rows);
            //json = rows[;
            //var xls = json2xls(rows);
            var exportPath = './templates/xls';
            fse.ensureDirSync(exportPath);
            var exportFile = path.join(exportPath, 'OPD_Time-' + moment().format('x') + '.xls');
            //fs.writeFile(exportFile, xls, 'binary');
            var json2xls = require('json2xls');
            //var json = {
            //    foo: 'bar',
            //    qux: 'moo',
            //    poo: 123,
            //    stux: new Date()
            //};
            //
            //console.log(json);
            var xls = json2xls(rows);
            fs.writeFileSync(exportFile, xls, 'binary');
            res.download(exportFile, function () {
                //rimraf.sync(export);
                fse.removeSync(exportFile);
            });
        } else {
            res.send({ok:false,msg:'ไม่มีข้อมูลในช่วงที่เลือกครับ'})
        }
        },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
        })
});

router.get('/export_report_special/:start/:end',function(req, res){
    var db = req.db;
    var data = {};
    //var json = {};
    data.date_report_special1 = req.params.start;
    data.date_report_special2 = req.params.end;
    //data.number_row2 = req.params.number_row2;
    //data.date_report_special1=moment(data.date_report_special1, 'DD/MM/YYYY').format('YYYY-MM-DD');
    //data.date_report_special2=moment(data.date_report_special2, 'DD/MM/YYYY').format('YYYY-MM-DD');
    show.export_special(db,data)
        .then(function(rows){
            if (rows.length > 0 ) {
                //json = _.sampleSize(rows, [data.number_row2]) สุ่มค่าจากจำนวนแถวที่เราต้องการ
                //console.log(rows);
                //json = rows[;
                //var xls = json2xls(rows);
                var exportPath = './templates/xls';
                fse.ensureDirSync(exportPath);
                var exportFile = path.join(exportPath, 'OPD_Time-' + moment().format('x') + '.xls');
                //fs.writeFile(exportFile, xls, 'binary');
                var json2xls = require('json2xls');
                //var json = {
                //    foo: 'bar',
                //    qux: 'moo',
                //    poo: 123,
                //    stux: new Date()
                //};
                //
                //console.log(json);
                var xls = json2xls(rows);
                fs.writeFileSync(exportFile, xls, 'binary');
                res.download(exportFile, function () {
                    //rimraf.sync(export);
                    fse.removeSync(exportFile);
                });
            } else {
                res.send({ok:false,msg:'ไม่มีข้อมูลในช่วงที่เลือกครับ'})
            }
            },function(err){
            console.log(err);
            res.send({ok:false,msg:err})
            })
});

module.exports = router;
