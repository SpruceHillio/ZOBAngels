/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
(function(global,factory) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = factory();
    }
    else if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        if (typeof global.ZOBAngels === 'undefined') {
            global.ZOBAngels = {};
        }
        global.ZOBAngels.model = factory();
    }
})(this,function() {
    return function(config,model,texts,helpers,moment) {
        return {
            _resolveRolesForRole: function(role) {
                return new Parse.Query(Parse.Role).equalTo('roles',role).find().then(function(roles) {
                    return Parse.Promise.as({
                        role: role,
                        roleName: role.getName(),
                        roles: roles,
                        allRoles: []
                    });
                });
            },
            _collectRoles: function(roleContainer) {
                if (0 === roleContainer.roles.length) {
                    return [roleContainer.roleName];
                }
                else {
                    return roleContainer.roles.map(function(role) {
                        return self._collectRoles(self._rolesById[role.id]);
                    }).reduce(function(a,b) {
                        Array.prototype.push.apply(a,b);
                        return a;
                    },[roleContainer.roleName]);
                }
            },

            initRoles: function(request,response) {
                var roleACL = new Parse.ACL();
                roleACL.setPublicReadAccess(true);
                roleACL.setPublicWriteAccess(false);
                roleACL.setRoleWriteAccess('admin',true);
                var admin = new Parse.Role('admin',roleACL),
                    orga = new Parse.Role('orga',roleACL),
                    archangel = new Parse.Role('archangel',roleACL),
                    medical = new Parse.Role('medical',roleACL),
                    translator = new Parse.Role('translator',roleACL),
                    angel = new Parse.Role('angel',roleACL);
                admin.save().then(function (result) {
                    console.log('saved admin role');
                    admin = result;
                    orga.getRoles().add(admin);
                    return orga.save();
                }).then(function(result) {
                    console.log('saved orga role');
                    orga = result;
                    archangel.getRoles().add(orga);
                    return archangel.save();
                }).then(function(result) {
                    console.log('saved archangel role');
                    archangel = result;
                    medical.getRoles().add(admin);
                    return medical.save();
                }).then(function(result) {
                    console.log('saved medical role');
                    medical = result;
                    translator.getRoles().add(admin);
                    return translator.save();
                }).then(function (result) {
                    console.log('saved translator role');
                    translator = result;
                    angel.getRoles().add(translator);
                    angel.getRoles().add(medical);
                    angel.getRoles().add(archangel);
                    return angel.save();
                }).then(function(result) {
                    console.log('saved angel role');
                    angel = result;
                    response.success({
                        success: true
                    });
                }, function(error) {
                    response.error(error);
                });
            },

            roles: function(user) {
                var promise = new Parse.Promise(),
                    self = this,
                    len,
                    i,current,
                    rolesById = {};
                new Parse.Query(Parse.Role).find().then(function(roles) {
                    return Parse.Promise.when(roles.map(function(role) {
                        return self._resolveRolesForRole(role);
                    }));
                }).then(function() {
                    len = arguments.length;
                    for (i=0; i<len; i+=1) {
                        current = arguments[i];
                        rolesById[current.role.id] = current;
                    }
                    for (i=0; i<len; i+=1) {
                        current = arguments[i];
                        Array.prototype.push.apply(current.allRoles,self._collectRoles(current));
                    }
                    return new Parse.Query(Parse.Role).equalTo('users',user).find();
                }).then(function(roles) {
                    roles = roles.map(function(role) {
                        var roles = [];
                        Array.prototype.push.apply(roles,rolesById[role.id].allRoles);
                        return roles;
                    }).reduce(function(a,b) {
                        Array.prototype.push.apply(a,b);
                        return a;
                    },[]);
                    promise.resolve(roles);
                },function(error) {
                    promise.reject(error);
                });
                return promise;
            },

            hasRole: function(user,role) {
                var promise = new Parse.Promise();
                this.roles(user).then(function(roles) {
                    promise.resolve(-1 < roles.indexOf(role));
                },function(error) {
                    promise.reject(error);
                });
                return promise;
            }
        };
    };
});