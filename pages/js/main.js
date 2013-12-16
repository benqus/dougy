(function (window, $) {
  var $window = $(window);
  var $document = $(document);
  
  var menu = {
    $menu: undefined,
    $items: undefined,
    $selected: undefined,
    
    y: 0,
    
    offset: {
      "left": 0,
      "top": 0
    },
    
    sections: {},
    
    init: function () {
      var that = this;
      var span = $('a[href=' + window.location.hash + '] span')[0];
      
      that.$items = $('.menu a');
      that.$menu = $('.menu');
      
      that.offset = that.$menu.offset();
      
      $document
        .on('click', '.menu a', function (evt) {
          that.selectMenuItem(evt.target);
        });
      
      $window
        .on('scroll', function () {
          that.repositionMenu($window.scrollTop());
        });

      that.selectMenuItem(span);
    },
    
    selectMenuItem: function (selected) {
      this.$items.removeClass('active');
      this.$selected = $(selected).closest('a').addClass('active');
    },
    
    repositionMenu: function (y) {
      var top = this.offset.top;
      
      this.$menu.css({
        "top": (y > top ? (y - top) : 0)
      });
      
      return this;
    }
  };
  
  $document
    .ready(function () {
      menu.init();
    });
  
}(window, jQuery));