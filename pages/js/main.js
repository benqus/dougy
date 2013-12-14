(function (window, $) {
  
  var menu = {
    $items: undefined,
    $selected: undefined,
    
    init: function () {
      var that = this;
      var span = $('a[href=' + window.location.hash + '] span')[0];
      
      that.$items = $('.menu a');
      
      that.selectMenuItem(span);
      
      $(document)
        .on('click', '.menu a', function (evt) {
          that.selectMenuItem(evt.target);
        });
    },
    
    selectMenuItem: function (selected) {
      this.$items.removeClass('active');
      this.$selected = $(selected).closest('a').addClass('active');
    }
  };
  
  $(document)
    .ready(function () {
      menu.init();
    });
  
}(window, jQuery));