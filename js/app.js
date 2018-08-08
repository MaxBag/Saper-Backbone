// site/js/app.js
var app = app || {};
$(function() {  
  //var ventResult = _.extend({}, Backbone.Events);
  //var ventField = _.extend({}, Backbone.Events);
  var result = new app.Result();
  var dimensionModel = new app.Dimension();
  var field = new app.Field({model: dimensionModel});
//field.aa();
});
