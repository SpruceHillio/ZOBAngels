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