var Q = require('q');

module.exports = {

        Save_rent: function (db,data){
            var q = Q.defer();
            db('taxi_income')
                .insert({
                    date_rental: data.date_rent,
                    person_id: data.person,
                    taxi_id: data.license_taxi,
                    type_rental: data.type_rent,
                    cost_rent: data.price_rent,
                    special_pay: data.special_pay,
                    sumprice_rent: data.sumprice_rent,
                    note_special_pay: data.note_special_pay,  
                    date_update: data.date_update,
                    user_edit: data.username
                })
                .then(function(rows) {
                    q.resolve(rows);
                })
                .catch(function (err){
                    q.reject(err);
                });
            return q.promise;
        },

        Check_personOrtaxi_total: function(db,data){
            var q = Q.defer();
            var sql =   'SELECT count(*) as total FROM taxi_income ' +
                        'WHERE date_rental = ? '+
                        'AND   ( person_id = ?  '+
                        'OR taxi_id = ? )     ';
            db.raw(sql,[data.date_rent,data.person,data.license_taxi])
                .then(function(rows){
                    console.log(rows[0]);
                    q.resolve(rows[0][0].total)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Check_taxi_total: function(db,data){
            var q = Q.defer();
            var sql =   'SELECT count(*) as total FROM taxi_income ' +
                        'WHERE date_rental = ? '+
                        'AND taxi_id = ?       ';
            db.raw(sql,[data.date_rent,data.license_taxi])
                .then(function(rows){
                    console.log(rows[0]);
                    q.resolve(rows[0][0].total)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Rent_total_today: function(db,_today){
            var q = Q.defer();
            var sql =   'SELECT count(*) as total FROM taxi_income '+
                        'WHERE date_rental = ?  ';
            db.raw(sql,[_today])
                .then(function(rows){
                    console.log(rows[0]);
                    q.resolve(rows[0][0].total)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Rent_detail_today: function(db,_today,startpage){
            var q = Q.defer();
            var sql = 'SELECT t.id,t.date_rental,t.person_id,concat(p.pname,p.fname," ",p.lname) AS Pt, '+
            't.taxi_id,l.license_plate,t.type_rental,r.name as type_rent,t.cost_rent,t.special_pay,t.sumprice_rent,t.note_special_pay FROM taxi_income t '+
            'LEFT JOIN person_taxi p ON p.id=t.person_id '+
            'LEFT JOIN license_taxi l ON l.id=t.taxi_id '+
            'LEFT JOIN rent_type r ON r.id=t.type_rental '+
            'WHERE date_rental = ?  '+
            'limit 30 offset ? ';
            db.raw(sql,[_today,startpage])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    console.log(rows);
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Update_rent: function (db,data) {
            var q = Q.defer();
            db('taxi_income')
                .update({
                    date_rental: data.date_rent,
                    person_id: data.person,
                    taxi_id: data.license_taxi,
                    type_rental: data.type_rent,
                    cost_rent: data.price_rent,
                    special_pay: data.special_pay,
                    note_special_pay: data.note_special_pay,
                    sumprice_rent: data.sumprice_rent,
                    date_update: data.date_update,
                    user_edit: data.username
                })
                .where('id',data.id)
                .then(function (rows) {
                    q.resolve(rows);
                })
                .catch(function (err) {
                    q.reject(err);
                });
            return q.promise;
        },

        Remove_rent: function(db,id){
            var q = Q.defer();
            db('taxi_income')
                .delete()
                .where('id',id)
                .then(function(){
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
        },

        Search_rent_taxi: function(db,data){
            var q = Q.defer();
            var sql = 'SELECT t.id,t.date_rental,t.person_id,concat(p.pname,p.fname," ",p.lname) AS Pt, '+
            't.taxi_id,l.license_plate,t.type_rental,r.name as type_rent,t.cost_rent,t.special_pay,t.sumprice_rent,t.note_special_pay FROM taxi_income t '+
            'LEFT JOIN person_taxi p ON p.id=t.person_id '+
            'LEFT JOIN license_taxi l ON l.id=t.taxi_id '+
            'LEFT JOIN rent_type r ON r.id=t.type_rental '+
            'WHERE date_rental BETWEEN ? AND ?  '+
            'ORDER BY t.date_rental ';
            db.raw(sql,[data.date1,data.date2])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Search_rent_taxi_person: function(db,data){
            var q = Q.defer();
            var sql = 'SELECT t.id,t.date_rental,t.person_id,concat(p.pname,p.fname," ",p.lname) AS Pt, '+
            't.taxi_id,l.license_plate,t.type_rental,r.name as type_rent,t.cost_rent,t.special_pay,t.sumprice_rent,t.note_special_pay FROM taxi_income t '+
            'LEFT JOIN person_taxi p ON p.id=t.person_id '+
            'LEFT JOIN license_taxi l ON l.id=t.taxi_id '+
            'LEFT JOIN rent_type r ON r.id=t.type_rental '+
            'WHERE date_rental BETWEEN ? AND ?  '+
            'AND t.person_id = ? '+
            'ORDER BY t.date_rental ';
            db.raw(sql,[data.date1,data.date2,data.personx])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Search_rent_date: function(db,date1,date2){
            var q = Q.defer();
            var sql = 'SELECT t.id,t.date_rental,t.person_id,concat(p.pname,p.fname," ",p.lname) AS Pt, '+
            't.taxi_id,l.license_plate,t.type_rental,r.name as type_rent,t.cost_rent,t.special_pay,t.sumprice_rent,t.note_special_pay FROM taxi_income t '+
            'LEFT JOIN person_taxi p ON p.id=t.person_id '+
            'LEFT JOIN license_taxi l ON l.id=t.taxi_id '+
            'LEFT JOIN rent_type r ON r.id=t.type_rental '+
            'WHERE date_rental BETWEEN ? AND ?  '+
            'ORDER BY t.date_rental ';
            db.raw(sql,[date1,date2])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Search_rent_date_person: function(db,date1,date2,personx){
            var q = Q.defer();
            var sql = 'SELECT t.id,t.date_rental,t.person_id,concat(p.pname,p.fname," ",p.lname) AS Pt, '+
            't.taxi_id,l.license_plate,t.type_rental,r.name as type_rent,t.cost_rent,t.special_pay,t.sumprice_rent,t.note_special_pay FROM taxi_income t '+
            'LEFT JOIN person_taxi p ON p.id=t.person_id '+
            'LEFT JOIN license_taxi l ON l.id=t.taxi_id '+
            'LEFT JOIN rent_type r ON r.id=t.type_rental '+
            'WHERE date_rental BETWEEN ? AND ?  '+
            'AND person_id = ? '+
            'ORDER BY t.date_rental ';
            db.raw(sql,[date1,date2,personx])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_pay_rent_search: function(db,date1,date2){
            var q = Q.defer();
            var sql =   'SELECT sum(cost_rent) as total_pay FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ?  ';
            db.raw(sql,[date1,date2])
                .then(function(rows){
                    q.resolve(rows[0][0].total_pay)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_pay_rent_search_person: function(db,date1,date2,personx){
            var q = Q.defer();
            var sql =   'SELECT sum(cost_rent) as total_pay FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ? '+
                        'AND person_id = ?   ';
            db.raw(sql,[date1,date2,personx])
                .then(function(rows){
                    q.resolve(rows[0][0].total_pay)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },
        
        Sum_special_search: function(db,date1,date2){
            var q = Q.defer();
            var sql =   'SELECT sum(special_pay) as total_special_pay FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ?  ';
            db.raw(sql,[date1,date2])
                .then(function(rows){
                    q.resolve(rows[0][0].total_special_pay)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_special_search_person: function(db,date1,date2,personx){
            var q = Q.defer();
            var sql =   'SELECT sum(special_pay) as total_special_pay FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ?  '+
                        'AND person_id = ? ';
            db.raw(sql,[date1,date2,personx])
                .then(function(rows){
                    q.resolve(rows[0][0].total_special_pay)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_price_search: function(db,date1,date2){
            var q = Q.defer();
            var sql =   'SELECT sum(sumprice_rent) as total_price FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ?  ';
            db.raw(sql,[date1,date2])
                .then(function(rows){
                    q.resolve(rows[0][0].total_price)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_price_search_person: function(db,date1,date2,personx){
            var q = Q.defer();
            var sql =   'SELECT sum(sumprice_rent) as total_price FROM taxi_income '+
                        'WHERE date_rental BETWEEN ? AND ?  '+
                        'AND person_id = ? ';
            db.raw(sql,[date1,date2,personx])
                .then(function(rows){
                    q.resolve(rows[0][0].total_price)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        Sum_price_rent_person: function(db,personx){
            var q = Q.defer();
            var sql =   'SELECT sum(sumprice_rent) as total_rent_person FROM taxi_income '+
                        'WHERE  person_id = ? ';
            db.raw(sql,[personx])
                .then(function(rows){
                    q.resolve(rows[0][0].total_rent_person)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

//////////////////////////////////////////////////////////////////

        report_stat_total: function(db,_month,_year){
            var q = Q.defer();
            var sql =   'SELECT count(*) as total FROM stat s ' +
                'WHERE ( MONTH(s.report_date) = ? ' +
                'AND YEAR(s.report_date) = ? )   ';
            db.raw(sql,[_month,_year])
                .then(function(rows){
                    console.log(rows[0]);
                    q.resolve(rows[0][0].total)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        report_stat_of_month: function(db,_month,_year,startpage){
            var q = Q.defer();
            var sql = 'SELECT r.*,d.depname FROM stat r '+
            'LEFT JOIN department d ON d.depcode=r.depcode '+
            'WHERE ( MONTH(r.report_date) = ? '+
            'AND YEAR(r.report_date) = ? ) '+
            'ORDER BY r.report_date DESC limit 10 offset ? ';
            db.raw(sql,[_month,_year,startpage])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    console.log(rows);
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        update_report: function (db,data) {
            var q = Q.defer();
            db('stat')
                .update({
                    report_date: data.report_date,
                    detail: data.detail,
                    depcode: data.depcode
                })
                .where('id',data.id)
                .then(function (rows) {
                    q.resolve(rows);
                })
                .catch(function (err) {
                    q.reject(err);
                });
            return q.promise;
        },

        remove_report: function(db,id){
            var q = Q.defer();
            db('stat')
                .delete()
                .where('id',id)
                .then(function(){
                    q.resolve();
                })
                .catch(function(err){
                    q.reject(err);
                });
            return q.promise;
        },

        

        search_date: function(db,data){
            var q = Q.defer();
            var sql = 'SELECT r.*,d.depname FROM stat r '+
                'LEFT JOIN department d ON d.depcode=r.depcode '+
                'WHERE r.report_date BETWEEN ? AND ? '+
                'ORDER BY r.report_date  ';
            db.raw(sql,[data.date1,data.date2])
                //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

        show_report_summary: function(db,data){
            var q = Q.defer();
            var sql = ' SELECT d.depname,        '+
            '(select count(*) FROM stat s    '+
            'WHERE s.report_date BETWEEN ? and ?  '+
            'and month(s.report_date) = 1 AND d.depcode=s.depcode ) as M1, '+
            '(select count(*) FROM stat s   '+
            'WHERE s.report_date BETWEEN ? and ?   '+
            'and month(s.report_date) = 2 AND d.depcode=s.depcode ) as M2, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ?  '+
            'and month(s.report_date) = 3 AND d.depcode=s.depcode ) as M3, '+
            '(select count(*) FROM stat s  '+
            'WHERE s.report_date BETWEEN ? and ?   '+
            'and month(s.report_date) = 4 AND d.depcode=s.depcode ) as M4, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 5 AND d.depcode=s.depcode ) as M5, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 6 AND d.depcode=s.depcode ) as M6, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 7 AND d.depcode=s.depcode ) as M7, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 8 AND d.depcode=s.depcode ) as M8, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 9 AND d.depcode=s.depcode ) as M9, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 10 AND d.depcode=s.depcode ) as M10, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 11 AND d.depcode=s.depcode ) as M11, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 12 AND d.depcode=s.depcode ) as M12 '+
            'from department d '+
            'HAVING M1 > 0 OR M2 > 0 OR M3 > 0 OR M4 > 0 OR M5 > 0 OR M6 > 0 '+
            'OR M7 > 0 OR M8 > 0 OR M9 > 0 OR M10 > 0 OR M11 > 0 OR M12 > 0 '+
            'ORDER BY d.id ASC  ';
            db.raw(sql,[data.date1,data.date2,data.date1,data.date2,data.date1,data.date2,data.date1,data.date2,
                data.date1,data.date2,data.date1,data.date2,data.date1,data.date2,data.date1,data.date2,
                data.date1,data.date2,data.date1,data.date2,data.date1,data.date2,data.date1,data.date2])
                .then(function(rows){
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

    report_terminal: function(db,date1,date2){
        var q = Q.defer();
        var sql = 'SELECT r.*,d.depname FROM stat r '+
            'LEFT JOIN department d ON d.depcode=r.depcode '+
            'WHERE r.report_date BETWEEN ? AND ? '+
            'ORDER BY r.report_date  ';
        db.raw(sql,[date1,date2])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    show_report_summary2: function(db,date1,date2){
        var q = Q.defer();
        var sql = ' SELECT d.depname,        '+
            '(select count(*) FROM stat s    '+
            'WHERE s.report_date BETWEEN ? and ?  '+
            'and month(s.report_date) = 1 AND d.depcode=s.depcode ) as M1, '+
            '(select count(*) FROM stat s   '+
            'WHERE s.report_date BETWEEN ? and ?   '+
            'and month(s.report_date) = 2 AND d.depcode=s.depcode ) as M2, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ?  '+
            'and month(s.report_date) = 3 AND d.depcode=s.depcode ) as M3, '+
            '(select count(*) FROM stat s  '+
            'WHERE s.report_date BETWEEN ? and ?   '+
            'and month(s.report_date) = 4 AND d.depcode=s.depcode ) as M4, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 5 AND d.depcode=s.depcode ) as M5, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 6 AND d.depcode=s.depcode ) as M6, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 7 AND d.depcode=s.depcode ) as M7, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 8 AND d.depcode=s.depcode ) as M8, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 9 AND d.depcode=s.depcode ) as M9, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 10 AND d.depcode=s.depcode ) as M10, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 11 AND d.depcode=s.depcode ) as M11, '+
            '(select count(*) FROM stat s '+
            'WHERE s.report_date BETWEEN ? and ? '+
            'and month(s.report_date) = 12 AND d.depcode=s.depcode ) as M12 '+
            'from department d '+
            'HAVING M1 > 0 OR M2 > 0 OR M3 > 0 OR M4 > 0 OR M5 > 0 OR M6 > 0 '+
            'OR M7 > 0 OR M8 > 0 OR M9 > 0 OR M10 > 0 OR M11 > 0 OR M12 > 0 '+
            'ORDER BY d.id ASC  ';
        db.raw(sql,[date1,date2,date1,date2,date1,date2,date1,date2,
            date1,date2,date1,date2,date1,date2,date1,date2,
            date1,date2,date1,date2,date1,date2,date1,date2])
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      getList_Type_service: function(db){
          var q = Q.defer();
          db('service_type')
              .select('id','name')
              .orderBy('id','ASC')
              .then(function (rows){
                  q.resolve(rows);
              })
              .catch(function(err){
                  q.reject(err);
              }) ;
              return q.promise;
      },

    getList_Type_treatment: function(db){
        var q = Q.defer();
        db('service_treament')
            .select('id','name')
            .orderBy('id','ASC')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },





    getOPD_total: function (db,data) {
        var q = Q.defer();
        var sql = 'SELECT count(*) as total FROM service_time as s                  '+
            'LEFT JOIN service_type as t ON t.id=s.service_type                      '+
            'LEFT JOIN service_treament as r ON r.id=s.treatment_type                '+
            'WHERE vstdate BETWEEN ? AND ?                                          ';
        db.raw(sql,[data.date1,data.date2])
            .then(function (rows) {
                q.resolve(rows[0][0].total)
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    getOPD_page: function (db,date_search1,date_search2,startpage) {
        var q = Q.defer();
        var sql = 'SELECT s.*,t.name as Type,r.name as Treament FROM service_time as s '+
            'LEFT JOIN service_type as t ON t.id=s.service_type                      '+
            'LEFT JOIN service_treament as r ON r.id=s.treatment_type                '+
            'WHERE vstdate BETWEEN ? AND ?  limit 10 offset ? ';
        db.raw(sql,[date_search1,date_search2,startpage])
            .then(function (rows) {
                q.resolve(rows[0])
            })
            .catch(function (err) {
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    export_special: function(db,data){
        var q = Q.defer();
        var sql = 'SELECT DATE_FORMAT(vstdate,"%m-%d-%Y") as "วันที่",hn,round(time_to_sec((TIMEDIFF(finish_card,vsttime_card)))/60) as "ห้องบัตร" ,    '+
            'round(time_to_sec((TIMEDIFF(vsttime_screen,finish_card)))/60) as "รอซักประวัติ" ,              '+
            'round(time_to_sec((TIMEDIFF(finish_screen,vsttime_screen)))/60) as "ซักประวัติ" ,              '+
            'round(time_to_sec((TIMEDIFF(vsttime_doctor,finish_screen)))/60) as "รอตรวจ",               '+
            'round(time_to_sec((TIMEDIFF(finish_doctor,vsttime_doctor)))/60) as "ตรวจเฉพาะ OPD",            '+
            'round(time_to_sec((TIMEDIFF(finish_lab,vsttime_lab)))/60) as "ห้อง lab",               '+
            'round(time_to_sec((TIMEDIFF(finish_xray,vsttime_xray)))/60) as "ห้อง Xray",        '+
            'round(time_to_sec((TIMEDIFF(finish_ekg,vsttime_ekg)))/60) as "ห้อง ekg",           '+
            'round(time_to_sec((TIMEDIFF(finish_other,vsttime_other)))/60) as "อื่นๆ",          '+
            'round(time_to_sec((TIMEDIFF(vsttime_appointment,vsttime_doctor)))/60) as "ระยะเวลาตรวจพิเศษ", '+
            'round(time_to_sec((TIMEDIFF(finish_appointment,vsttime_appointment)))/60) as "ให้คำแนะนำ",     '+
            'round(time_to_sec((TIMEDIFF(finish_drugs,finish_appointment)))/60) as "รอรับยา",                '+
            'round(time_to_sec((TIMEDIFF(finish_appointment,finish_card)))/60) as "รอคอยซักประวัติ ถึง ให้คำแนะนำหลังตรวจ", '+
            'round(time_to_sec((TIMEDIFF(finish_drugs,vsttime_card)))/60) as "ทำบัตร - รับยากลับบ้าน"           '+
            'FROM service_time                                                                                  '+
            'WHERE vstdate BETWEEN ? AND ?                                                   '+
            'AND treatment_type = "2"  ';

        db.raw(sql,[data.date_report_special1,data.date_report_special2])
            .then(function (rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
    },

    export_normal: function(db,data){
        var q = Q.defer();
        var sql = 'SELECT DATE_FORMAT(vstdate,"%m-%d-%Y") as "วันที่",hn,round(time_to_sec((TIMEDIFF(finish_card,vsttime_card)))/60) as "ห้องบัตร" ,    '+
            'round(time_to_sec((TIMEDIFF(vsttime_screen,finish_card)))/60) as "รอซักประวัติ" ,              '+
            'round(time_to_sec((TIMEDIFF(finish_screen,vsttime_screen)))/60) as "ซักประวัติ" ,              '+
            'round(time_to_sec((TIMEDIFF(vsttime_doctor,finish_screen)))/60) as "รอตรวจ",               '+
            'round(time_to_sec((TIMEDIFF(finish_doctor,vsttime_doctor)))/60) as "ตรวจเฉพาะ OPD",            '+
            'round(time_to_sec((TIMEDIFF(finish_appointment,vsttime_appointment)))/60) as "ให้คำแนะนำ",     '+
            'round(time_to_sec((TIMEDIFF(finish_drugs,finish_appointment)))/60) as "รอรับยา",                '+
            'round(time_to_sec((TIMEDIFF(finish_appointment,finish_card)))/60) as "รอคอยซักประวัติ ถึง ให้คำแนะนำหลังตรวจ", '+
            'round(time_to_sec((TIMEDIFF(finish_drugs,vsttime_card)))/60) as "ทำบัตร - รับยากลับบ้าน"           '+
            'FROM service_time                                                                                  '+
            'WHERE vstdate BETWEEN ? AND ?                                                   '+
            'AND treatment_type = "1"  ';

        db.raw(sql,[data.date_report_normal1,data.date_report_normal2])
            .then(function (rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
    }
};