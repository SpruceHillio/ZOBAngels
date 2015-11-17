/**
 * @license ZOB Angels
 * (c) 2015 SpruceHill.io GmbH
 * License: MIT
 */
var config = require('cloud/config'),
    texts = require('cloud/texts'),
    model = require('cloud/shared/model'),
    moment = require('moment');
var helpers = require('cloud/helpers')(config,model,texts,moment),
    security = require('cloud/security')(config,model,texts,moment);
var triggers = require('cloud/triggers')(config,model,texts,helpers,security,moment),
    jobs = require('cloud/jobs')(config,model,texts,helpers,security,moment),
    functions = require('cloud/functions')(config,model,texts,helpers,security,moment);

/**
 * Trigger definitions
 */
Parse.Cloud.beforeSave('Assignment',triggers.Assignment.beforeSave.checkForDuplicate);

Parse.Cloud.afterSave('Assignment', triggers.Assignment.afterSave.postToSlack);

Parse.Cloud.afterDelete('Assignment', triggers.Assignment.afterDelete.postToSlack);

Parse.Cloud.afterSave(Parse.User, triggers.User.afterSave.assignAdminRole);

/**
 * Job definitions
 */
Parse.Cloud.job('informAngels',jobs.informAngels);

Parse.Cloud.job('angelStatus',jobs.angelStatus);

/**
 * Function definitions
 */
Parse.Cloud.define('sectionsWithAssignments',function(request,response) {
    functions.sectionsWithAssignments(request,response);
});

Parse.Cloud.define('initRoles',function(request,response) {
    security.initRoles(request,response);
});