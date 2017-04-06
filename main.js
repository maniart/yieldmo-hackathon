var haps = (function(w, d, $) {



  function fadeOutPhone() {
    var $happyPhone = $('.happy-phone');
    $happyPhone.on('transitionEnd', function() {
      $happyPhone.addClass('display-none');
    });
    window.setTimeout(function() {
      $happyPhone.addClass('fade-out');
    }, 3000);
  }

  function init() {
    console.log('What\'s the haps?');
    fadeOutPhone();
  }

  return {
    init: init
  }

}(window, document, jQuery));

$(document).ready(haps.init);
