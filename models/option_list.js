var Q = require('q');

module.exports = {

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

    getList_rent_type: function(db){
        var q = Q.defer();
        var sql = 'SELECT id,concat(name," : ",price) as rent_type,price  FROM rent_type ' ;
        db.raw(sql)
          .then(function (rows){
              q.resolve(rows[0]);
          })
          .catch(function(err){
              q.reject(err);
          }) ;
          return q.promise;
  },

    getList_price_rent: function (db,id) {
        var q = Q.defer();
        db('rent_type')
            .select('price')
            .where('id',id)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function (err) {
                q.reject(err);
            });
        return q.promise;
    },

    getList_person_taxi: function(db){
        var q = Q.defer();
        var sql = 'SELECT id,concat(pname,fname," ",lname) as person FROM person_taxi '+
                  'WHERE status = "Y" ' ;
        db.raw(sql)
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
    },

    getList_person_id: function(db,personx){
        var q = Q.defer();
        var sql = 'SELECT id,concat(pname,fname," ",lname) as person FROM person_taxi '+
                  'WHERE status = "Y" '+ 
                  'AND id = ? ';
        db.raw(sql,[personx])
            //var sql = db.raw(sql,[data.date,data.username]).toSQL() คำสั่งเช็ค ค่า และคำสั่ง SQL
            .then(function(rows){
                q.resolve(rows[0])
            })
            .catch(function(err){
                q.reject(err)
            });
        return q.promise;
}
};