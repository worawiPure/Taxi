var Q = require('q');

module.exports = {

    pay_total: function(db2){
            var q = Q.defer();
            var sql =   ' SELECT count(*) as total FROM an_stat   ';
            db2.raw(sql)
                .then(function(rows){
                    q.resolve(rows[0][0].total)
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },
////////////////////////////////////////////////////////////////////////////////////
    getList_taxi: function(db){
      var q = Q.defer();
      db('license_taxi')
          .select('id','license_plate','status')
          .where('status',1)
          .then(function (rows){
              q.resolve(rows);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
  },

    getList_person_taxi: function(db){
        var q = Q.defer();
        var sql = 'SELECT id,concat(pname,fname," ",lname) as person FROM person_taxi '+
                  'WHERE status = "Y" ' ;
        db.raw(sql)
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows)
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
},

    getList_person_taxi: function(db){
      var q = Q.defer();
      db('person_taxi')
          .select('id','license_plate','status')
          .where('status',1)
          .then(function (rows){
              q.resolve(rows);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
  },

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