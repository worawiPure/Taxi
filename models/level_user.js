var Q = require('q');

module.exports = {

    getList: function(db){
        var q = Q.defer();
        db('risk_leveluser')
            .select()
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    getSubAll: function(db){
        var q = Q.defer();
        var sql =   'SELECT rs.id,rs.name_sub_program,rs.program_id,rp.program_risk ' +
            'FROM risk_sub_program as rs '+
            'INNER JOIN risk_program as rp ON rp.id=rs.program_id';
        db.raw(sql)
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    }
};