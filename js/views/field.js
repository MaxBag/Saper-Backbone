var app = app || {};
app.Field = Backbone.View.extend({
  
  className: "field",

  initialize : function() {
    _.extend(this, Backbone.Events);
    this.obj = this.model.toJSON() || {width: 8, height: 8};
    this.count = this.obj.width * this.obj.height;
    this.countMines = Math.round(this.count/4);
    this.obj['countMines'] = this.countMines;
    this.obj['count'] = this.count;
    this.arrRightSide = [];
    this.$app = $('#app');
    this.children;
    this.render();
    Backbone.on('onReset', this.createField, this);
    Backbone.trigger('setOptions', this.obj);
  },

  events : {
    'click .cell' : 'onCellClick',
    'contextmenu' : 'markMine'
  },

  render : function() {
    this.createField();
    this.$app.append(this.$el);

    var newWidth = (this.$el.css('width').slice(0,-2))*this.obj.width;
    var newHeight = (this.$el.css('height').slice(0,-2))*this.obj.height;
    this.$el.css('width', newWidth);
    this.$el.css('height', newHeight);
  },

  createField : function() {
    this.$el.empty();
    for(var i=0; i < this.count; i++) {
      var cell = $('<div class=cell></div>');
      cell.attr('data-cell', i);
      this.$el.append(cell);
    }

    this.createMines();
    this.createPosition();
   
  },
  
  createMines : function() {
    var mines = 0;

    while(mines < this.countMines) {
      var r = Math.round(Math.random()*this.count);
      this.children = this.$el.children('.cell');
      var child = this.children.eq(r);

      if(!child.hasClass('is-mine')) {
        mines++;
        child.addClass('is-mine');
      }
    }
    
  },

  createPosition : function() {
    let children = this.children;
    let that = this;
    let countMineAround = 0;

    function checkNegative(i) {
      if(i < 0) {
        return;
      }else {
        return i;
      }
    }

    function borderCellsLeft(cell, i) {

        if(cell.next().hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-(that.obj.width-1))).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-that.obj.width)).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+that.obj.width).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+(that.obj.width+1)).hasClass('is-mine')) {
          countMineAround++;
        }
      
    }

    function borderCellsRight(cell, i) {

        if(cell.prev().hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-that.obj.width)).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-(that.obj.width+1))).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+(that.obj.width-1)).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+that.obj.width).hasClass('is-mine')) {
          countMineAround++;
        }
      
    }

    function otherCells(cell,i) {
       if(cell.next().hasClass('is-mine')) {
          countMineAround++;
        }

        if(cell.prev().hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-(that.obj.width-1))).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-that.obj.width)).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(checkNegative(i-(that.obj.width+1))).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+(that.obj.width-1)).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+that.obj.width).hasClass('is-mine')) {
          countMineAround++;
        }

        if(children.eq(i+(that.obj.width+1)).hasClass('is-mine')) {
          countMineAround++;
        }
    }

    function rightSideField() {
      for(var j = that.obj.width -1; j < that.count; j+=that.obj.width) {
        that.arrRightSide.push(j);
        
      }
    }

    rightSideField();

    for(let i = 0; i < this.children.length; i++) {


      let cell = this.children.eq(i);

      if(cell.hasClass('is-mine')) {
        continue;
      }else {

        if(i == 0 || i%this.obj.width === 0 ) {
          borderCellsLeft(cell, i);

        cell.html(countMineAround);
        }else if(this.arrRightSide.indexOf(i) >= 0){
          borderCellsRight(cell, i);

        cell.html(countMineAround);
        }else {
           otherCells(cell, i);

        cell.html(countMineAround);
        } 
     }
        countMineAround = 0;
    }
    
  },

  onCellClick : function(e) {
    var target = $(e.target);
      var countEmptyCells = 0;
    var that = this;

    function setStyleForOpenCells(el) {
      el.addClass('is-opened');
    }

    function checkNegative(i) {
      if(i < 0) {
        return;
      }else {
        return i;
      }
    }

    function isEexistZero(el) {
      if(el.html() == '0' && !el.hasClass('is-opened')) {
        return true;
      }else {false;}
    }
    
    function search(el) {
      var next,prev,up,down,searchNext, searchPrev, searchUp, searchDown;

      if(el.hasClass('is-opened')) {return;}

       next = el.next();
       prev = el.prev();
       up = that.children.eq(checkNegative(el.data('cell') - that.obj.width));
       down = that.children.eq(checkNegative(el.data('cell') + that.obj.width));

      if((el.data('cell') == 0 || el.data('cell')%that.obj.width == 0) && isEexistZero(el) ) {
	if(isEexistZero(next)) {
          searchNext = next;
        }
        if(isEexistZero(up)) {
          searchUp = up;
        }
        if(isEexistZero(down)) {
          searchDown = down;
        }
        
      Backbone.trigger('cellOpened', 1);
      }else if(that.arrRightSide.indexOf(el.data('cell')) >=0 && isEexistZero(el) ) {

        if(isEexistZero(prev)) {
          searchPrev = prev;

        }
        if(isEexistZero(up)) {
          searchUp = up;

        }
        if(isEexistZero(down)) {
          searchDown = down;
        }
        Backbone.trigger('cellOpened', 1);

      }else if(isEexistZero(el)){
        if(isEexistZero(next)) {
          searchNext = next;
        }       
        if(isEexistZero(prev)) {
          searchPrev = prev;

        }
        if(isEexistZero(up)) {
          searchUp = up;
        }
        if(isEexistZero(down)) {
          searchDown = down;
        }
        Backbone.trigger('cellOpened', 1);

      }
      setStyleForOpenCells(el);

      if(searchNext) {
        setTimeout(function() {
           search(searchNext);
        }, 0);
      }
      if(searchPrev) {
        setTimeout(function() {
          search(searchPrev);
        }, 0);
      }
      if(searchUp) {
        setTimeout(function() {
          search(searchUp);
        }, 0);
      }
      if(searchDown) {
        setTimeout(function() {
          search(searchDown);
        }, 0);
      }
      
    }

    function openAllCells() {
      that.children.each(function(){
        if($(this).html() == '0') {$(this).html('');}
        $(this).addClass('is-opened').removeClass('markMine');
      });

    }

    if(target.hasClass('is-mine') && !target.hasClass('is-opened')) {
      alert('game over');
      openAllCells();
      Backbone.trigger('gameOver');
    }else if(target.html() !== '0') {
      if(!target.hasClass('is-opened')) {
        target.addClass('is-opened').removeClass('markMine');
        Backbone.trigger('cellOpened', 1);
      }
    }else {
      search(target);
    }
  },

  markMine : function (e) {
    this.trigger('tt');
    var target = $(e.target);
    e.preventDefault();
    if(!target.hasClass('is-opened')) {
      target.toggleClass('markMine');
    }
  }

});
