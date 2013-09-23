var app = app || {};

app.AppView = Backbone.View.extend({
    el: '#todoapp',
    statsTemplate: _.template($('#stats-template').html()),
    events: {
        'keypress #new-todo': 'createOnEnter',
        'click #clear-completed': 'clearCompleted',
        'click #toggle-all': 'toggleAllComplete'
    },
    initialize: function () {
        this.allCheckbox = this.$('#toggle-all')[0];
        this.$input = this.$('#new-todo');
        this.$footer = this.$('#footer');
        this.$main = this.$('#main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);

        app.Todos.fetch();
    },

    render: function () {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if (app.Todos.length) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining
            }));

            this.$('filters li a')
                .removeClass('selected')
                .filter('[href="#' + (app.TodoFilter || '') + '"]')
                .addClass('selected');
        } else {
            this.$main.hide();
            this.$footer.hide();
        }

        this.allCheckbox.checked = !remaining;
    },

    addOne: function (todo) {
        var view = new app.TodoView({
            model: todo
        });
        $('#todo-list').append(view.render().el);
    },

    addAll: function () {
        this.$('todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    filterOne: function (todo) {
        todo.trigger('visible');
    },

    filterAll: function () {
        app.Todos.each(this.filterOne, this);
    },

    newAttributes: function () {
        return {
            title: this.$input.val().trim(),
            order: app.Todos.nextOrder(),
            completed: false
        };
    },

    createOnEnter: function (event) {
        if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
            return;
        }
        app.Todos.create(this.newAttributes());
        this.$input.val('');
    },

    clearCompleted: function () {
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete: function () {
        var completed = this.allCheckbox.checked;

        app.Todos.each(function (todo) {
            todo.save({
                'completed': completed
            });
        });
    }

});

/*
the overall AppView is the top-level piece of UI

instead of generating a new element, bind to the existing skeleton of the App already present in the HTML with el:
el: element property that stores a selector targeting the DOM element within an ID of todoapp. In this case it refers to the matching <section id="todoapp"> in index.html \ the call to _.template uses Underscore's micro-templating to construct a statsTemplate object

statsTemplate: the template for the line of stats at the bottom of the app

initialize: at initialization we bind to the relevant events on the 'Todos' collection when items are added or changed / uses jQuery to cache the elements into local properties, then it binds to 2 events on the Todos collection (add and reset)

addOne: add a single todo item to the list by creating a view for it and appending its element to the <ul>
when an add event is fired the addOne() method is called and passed the new model. It creates an instance of TodoView, renders it and appends the resulting element to the Todo list

addAll: add all items in the Todos collection at once
when a reset event occurs, addAll() is called which iterates over all of the Todos currently in the collection and fires addOne() for each item

listenTo() implicitly sets the callback's context to the view and allows you to use 'this' within 'addAll()' to refer to the view


*/
