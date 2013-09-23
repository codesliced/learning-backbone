var app = app || {};

//the collection of todos is backed by local storage instead of a remote server

var TodoList = Backbone.Collection.extend({
	model: app.Todo,
	localStorage: new Backbone.LocalStorage('todos-backbone'),
	completed: function(){
		return this.filter(function( todo ){
			return todo.get('completed');
		});
	},
	remaining: function(){
		return this.without.apply( this, this.completed() );
	},
	nextOrder: function(){
		if ( !this.length ){
			return 1;
		}
		return this.last().get('order') + 1;
	},
  comparator: function( todo ) {
  	return todo.get('order');
  }
});

app.Todos = new TodoList();


/* 
model: references the collection's model
localstorage: saves all of the todo items under the todos-backbone namespace
completed: filters down the list of all finished todo items / returns an array of finished todos
remaining: filters down the list to incomplete todo items / returns an array of unfinished todos
nextOrder: keeps the Todos in sequential order, despited being saved by unordered GUID in the db. this generartes the next order number for new items / implements a sequence generator
comparator: todos are sorted by their original insertion order / sorts items by their insertion order
last line: create the global collection of Todos

this.filter, this.without, and this.last are Underscore methodds that are mixed in to Backbone

*/