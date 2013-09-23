var app = app || {};


//Todo Model
// The model has 'title', 'order', and 'completed' attributes

app.Todo = Backbone.Model.extend({
  //default attributes ensure that each todo created has 'title' and 'completed' keys
  defaults: {
  	title: '',
  	completed: false
  },

  //toggle the 'completed' state of this todo item
  toggle: function(){
  	this.save({
  		completed: !this.get('completed')
  	});
  }
});