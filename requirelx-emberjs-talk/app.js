var App = Ember.Application.create();
App.ApplicationAdapter = DS.FixtureAdapter;

App.Note = DS.Model.extend({
  title: DS.attr( 'string' ),
  body: DS.attr( 'string' )
});

App.Note.FIXTURES = [
  { id: 1, title: 'joke', body: 'ah! ah!' },
  { id: 2, title: 'idea', body: 'do NOT do talks about ember.js' }
];

App.Router.map(function() {
  this.resource('notes', function() {
    this.resource('note', { path: '/:note_id' }),
    this.route('new')
  });
});

App.NotesRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('note');
  }
});

App.NotesNewController = Ember.ObjectController.extend({
  actions: {
    createNote: function () {
      var title = this.get('newTitle');
      var body = this.get('newBody');

      var note = this.store.createRecord('note', {
        title: title,
        body: body
      });

      this.set('newTitle', '');
      this.set('newBody', '');

      note.save();
    }
  }
});

App.NoteController = Ember.ObjectController.extend({
  bodyRemaining: function() {
    var body = this.get('content').get('body');
    return (140 - body.length);
  }.property('model.body'),

  actions: {
    editNote: function() {
      this.set('isEditing', true);
    },
    updateNote: function () {
      this.set('isEditing', false);
      this.get('model').save();
    }
  }
});

Ember.Handlebars.registerBoundHelper('displayRemaining', function(value) {
  var cssClass = 'secondary';
  if (value < 0) {
    cssClass = 'alert';
  }
  return new Handlebars.SafeString('<span class="radius ' + cssClass + ' label">' + value + '</span>');
});
