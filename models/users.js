var Q = require('q');

module.exports = {

    getList: function(db){
        var q = Q.defer();
        db('user_opd')
            .select()
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    getPname: function(db){
        var q = Q.defer();
        db('pname')
            .select()
            .then(function (rows){
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            }) ;
        return q.promise;
    },

    save_user: function(db,username,password,level_user_id,pname,fname,lname,depcode){
        var q = Q.defer();
        db('user_opd')
            .insert({user:username,password:password,level_user_id:level_user_id,pname:pname,fname:fname,lname:lname,depcode:depcode})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    save_user2: function(db,data){
        var q = Q.defer();
        db('user_opd')
            .insert({user:data.username,password:data.password,level_user_id:1,pname:data.pname,fname:data.fname,lname:data.lname,depcode:data.department})
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    save_user3: function(db,data){
        var q = Q.defer();
        db('user_opd')
            .update({user:data.username,pname:data.pname,fname:data.fname,lname:data.lname,depcode:data.department})
            .where('id',data.id)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    save_user4: function(db,id,username,encryptPass){
        var q = Q.defer();
        db('user_opd')
            .update({user:username,password:encryptPass})
            .where('id',id)
            .then(function (rows) {
                q.resolve(rows);
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },


    remove_user: function(db,id){
        var q = Q.defer();
        db('user_opd')
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

    update_user: function(db,id,username,level_user_id,pname,fname,lname,depcode){
       var q = Q.defer();
        db('user_opd')
            .update({user:username,level_user_id:level_user_id,pname:pname,fname:fname,lname:lname,depcode:depcode})
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    post_update_user: function(db,id){
        var q = Q.defer();
        db('user_opd')
            .update({comfirm: 'Y' })
            .where('id',id)
            .then(function(){
                q.resolve();
            })
            .catch(function(err){
                q.reject(err);
            });
        return q.promise;
    },

    getSubAll: function(db,startpage){
        var q = Q.defer();
        var sql =   'SELECT u.*,concat(p.name,u.fname," ",u.lname) as Nameuser,u.user,u.password,r.level_username,d.depname FROM user_opd u '+
        'LEFT OUTER JOIN pname p ON p.id=u.pname '+
        'LEFT OUTER JOIN opd_leveluser r ON r.level_user_id=u.level_user_id '+
        'LEFT OUTER JOIN department d ON d.depcode=u.depcode  '+
        'where u.comfirm is not null '+
        'order by u.level_user_id desc '+
        'Limit 5 offset ? ';
        db.raw(sql,[startpage])
            .then(function(rows){
                console.log(rows[0]);
                q.resolve(rows[0])
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    getSubAll_total: function(db){
        var q = Q.defer();
        var sql =   'SELECT count(*) as total FROM opd_user u '+
        'where u.comfirm is not null '+
        'order by u.level_user_id desc'    ;
        db.raw(sql)
            .then(function(rows){
                console.log(rows[0][0].total);
                q.resolve(rows[0][0].total)
            })
            .catch(function(err){
                console.log(err)
                q.reject(err)
            });
        return q.promise;
    },

    get_comfirm_user: function(db){
        var q = Q.defer();
        var sql =   'SELECT u.*,concat(p.name,u.fname," ",u.lname) as Nameuser,u.user,u.password,r.level_username,d.depname FROM opd_user u '+
            'LEFT OUTER JOIN pname p ON p.id=u.pname '+
            'LEFT OUTER JOIN opd_leveluser r ON r.level_user_id=u.level_user_id '+
            'LEFT OUTER JOIN department d ON d.depcode=u.depcode  '+
            'where u.comfirm is null '+
            'order by u.level_user_id desc'   ;
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
    },

    getUser_edit: function(db,data){
            var q = Q.defer();
            var sql =   'SELECT u.*,concat(p.name,u.fname," ",u.lname) as Nameuser,u.user,u.password,d.depname,p.name FROM user_opd u '+
        'LEFT OUTER JOIN pname p ON p.id=u.pname   '+
        'LEFT OUTER JOIN department d ON d.depcode=u.depcode   '+
        'where u.user = ? ';
            db.raw(sql,[data.username])
                .then(function(rows){
                    console.log(rows[0]);
                    q.resolve(rows[0])
                })
                .catch(function(err){
                    console.log(err)
                    q.reject(err)
                });
            return q.promise;
        },

    getUser_show: function(db,username){
            var q = Q.defer();
            var sql =   'SELECT CONCAT(p.`name`,u.fname," ",u.lname) as Uname,th_level FROM opd_user u '+
                        'LEFT OUTER JOIN pname p ON p.id=u.pname  '+
                        'LEFT OUTER JOIN opd_leveluser l ON u.level_user_id=l.id '+
                        'where u.user = ? ';
            db.raw(sql,[username])
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