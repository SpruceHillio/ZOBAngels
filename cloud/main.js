/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
var mandrill = require('mandrill'),
    config = require('cloud/config'),
    texts = require('cloud/texts'),
    model = require('cloud/shared/model'),
    data = require('cloud/shared/data'),
    moment = require('cloud/moment-timezone-with-data');
mandrill.initialize('__MANDRILL_API_KEY___');
var helpers = require('cloud/helpers')(config,model,texts,moment),
    security = require('cloud/security')(config,model,texts,moment);
var triggers = require('cloud/triggers')(config,model,texts,helpers,security,moment),
    jobs = require('cloud/jobs')(config,model,data,texts,helpers,security,moment,mandrill),
    functions = require('cloud/functions')(config,model,texts,helpers,security,moment);

/**
 * Trigger definitions
 */
Parse.Cloud.beforeSave('Assignment',triggers.Assignment.beforeSave.checkForDuplicate);

Parse.Cloud.afterSave('Assignment', triggers.Assignment.afterSave.postToSlack);

Parse.Cloud.afterDelete('Assignment', triggers.Assignment.afterDelete.postToSlack);

Parse.Cloud.afterSave(Parse.User, triggers.User.afterSave.assignAdminRole);

Parse.Cloud.afterSave('Inventory', triggers.Inventory.afterSave.createAuditLog);

Parse.Cloud.afterDelete('Inventory', triggers.Inventory.afterDelete.createAuditLog);

/**
 * Job definitions
 */
Parse.Cloud.job('informAngels',jobs.informAngels);

Parse.Cloud.job('angelStatus',jobs.angelStatus);

Parse.Cloud.job('createInventoryOrder',jobs.createInventoryOrder);

/**
 * Function definitions
 */
Parse.Cloud.define('sectionsWithAssignments',function(request,response) {
    functions.sectionsWithAssignments(request,response);
});

Parse.Cloud.define('facebookPinnedPost', function(request,response) {
    functions.facebookPinnedPost(request,response);
});

Parse.Cloud.define('timezoneTest', function(request,response) {
    functions.timezoneTest(request,response);
});

Parse.Cloud.define('initRoles',function(request,response) {
    security.initRoles(request,response);
});

Parse.Cloud.define('createInventoryOrder',function(request,response) {
    jobs.createInventoryOrder(request,response);
});

Parse.Cloud.define('readOrCreateShift',function(request,response) {
    functions.readOrCreateShift(request,response);
});