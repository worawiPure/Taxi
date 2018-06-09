var Q = require('q');

module.exports = {

  report_service_pttype_total_opd: function(db2,data){
      var q = Q.defer();
      var sql =  'SELECT ROUND(sum(v.income),2) as total FROM vn_stat v   '+
                 'WHERE v.vstdate BETWEEN ? AND ?                         '+  
                 'AND v.pttype = ?                                        ';
      db2.raw(sql,[data.date1,data.date2,data.pttype])
          .then(function(rows){
              q.resolve(rows[0][0].total)
          })
          .catch(function(err){
              console.log(err)
              q.reject(err)
          });
      return q.promise;
  },

  getList_pttype: function(db2){
      var q = Q.defer();
      db2('pttype')
          .select('pttype','name')
          .where('isuse', "Y" )
          .orderBy('pttype')
          .then(function (rows){
              q.resolve(rows);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
  },
  
  search_service_pttype_summed_opd: function(db2,data){
        var q = Q.defer();
        var sql =   'SELECT v.vstdate,count(v.vn) as visit,ROUND(sum(v.income),2) as sum_income FROM vn_stat v   '+
                    'WHERE v.vstdate BETWEEN ? AND ?                                                             '+  
                    'AND v.pttype = ?                                                                            '+
                    'GROUP BY v.vstdate                                                                          ';
        db2.raw(sql,[data.date1,data.date2,data.pttype])
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    search_service_pttype_summed_ipd: function(db2,data){
        var q = Q.defer();
        var sql =   'SELECT a.regdate as vstdate,count(a.an) as visit,sum(a.income) as sum_income FROM an_stat a '+
                    'WHERE a.regdate BETWEEN ? AND ?                                                             '+
                    'AND a.pttype = ?                                                                            '+
                    'GROUP BY a.regdate                                                                          ';
        db2.raw(sql,[data.date1,data.date2,data.pttype])
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    search_service_pttype_detail_opd: function(db2,data){
        var q = Q.defer();
        var sql =   'SELECT v.vstdate,v.income,v.hn,o.vsttime,concat(p.pname,p.fname," ",p.lname) as person_name  FROM vn_stat v '+
                    'INNER JOIN ovst o ON v.vn=o.vn                                                                              '+
                    'LEFT JOIN patient p ON p.hn=v.hn                                                                            '+
                    'WHERE v.vstdate = ?                                                                                         '+                           
                    'AND v.pttype = ?                                                                                            ';
        db2.raw(sql,[data.vstdate,data.pttype])
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },
////////////////////////////////////////////////////////////////////////////////////////////////////
    getList_Department: function(db,depcode){
      var q = Q.defer();
      db('department')
          .select('id','depname','depcode')
          .where('depcode',depcode)
          .then(function (rows){
              q.resolve(rows);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
  },

    getSubList: function(db){
        var q = Q.defer();
        db('department')
            .select('depcode')
            .orderBy('depcode','ASC')
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    save_department: function(db,depname,depcode){
        var q = Q.defer();
        db('department')
            .insert({depname:depname,depcode:depcode})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(db){
                q.reject(err);
            });
        return q.promise;
    },

    remove_department: function(db,id){
        var q = Q.defer();
        db('department')
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

    update_department: function(db,id,depname,depcode){
        var q = Q.defer();
        db('department')
            .update({depname:depname,depcode:depcode})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    }
  };