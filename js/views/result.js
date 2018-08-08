var app = app || {};
app.Result = Backbone.View.extend({

  className : "controls",

  initialize : function() {
    _.extend(this, Backbone.Events);
    this.options;
    this.$app = $('#app');
    this.$opened = $('<div class="opened"></div>').html('Opened: ');
    this.$openedValue = $('<span class="opened-value"></span>').html(0);
    this.$btnReset = $('<button class="btn"></button>').html('Reset');
    this.render();
    this.listenTo(app.Field, 'tt', this.check);
    Backbone.on('cellOpened', this.addScore, this);
    Backbone.on('gameOver', this.maxScore, this);
    Backbone.on('setOptions', this.setOptions, this);
  },

  events : {
    'click .btn' : 'reset'
  },
  check : function() {console.log('aaa')},
  render : function() {
    this.$el.append(this.$opened.append(this.$openedValue)).append(this.$btnReset);
    this.$app.append(this.$el);
  },

  reset : function() {
    this.$openedValue.html("0");
    Backbone.trigger('onReset');
  },

  addScore : function(score) {
    this.$openedValue.text(+this.$openedValue.text() + score);
    if(+this.$openedValue.text() == (this.options.width * this.options.height) - this.options.countMines) {
      alert('You win');
      this.maxScore();
    }
  },

  maxScore : function() {
    this.$openedValue.text(this.options.count);
  },

  setOptions : function(opt) {
    this.options = opt;
  }


});
