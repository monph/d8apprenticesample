(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.drupalexp_theme = {
    attach: function () {
      /* Page loading */
      $(window).on('load', function () {
        $('#dexp-loader').fadeOut(300);
      }).on('beforeunload', function () {
        $('#dexp-loader').fadeIn(100);
      });
      setTimeout(function () {
        $('#dexp-loader').fadeOut(300);
      }, 10000);

      /* Contextual menu on page with header overlay */
      setTimeout(function () {
        $('.sticky-wrapper', 'body.header-overlay').once('contextual-fix').each(function () {
          $(this).next().find('.contextual').css({top: 100});
        });
      }, 1000);

      /* Custom padding*/
      $('.custompadding').once('custompadding').each(function () {
        var $this = $(this), padding = $this.data('padding'), $rows = $(this).find('.row');
        if (isNaN(parseInt(padding)) || padding == 15 || padding < 0)
          return;
        if ($rows.length === 0) {
          $this.css({
            marginLeft: -padding + 'px',
            marginRight: -padding + 'px'
          });
          $this.find('>*[class*=col-]').css({
            paddingLeft: padding + 'px',
            paddingRight: padding + 'px'
          });
        } else {
          $rows.each(function () {
            if ($(this).parents('.row', $this).length === 0) {
              $(this).css({
                marginLeft: -padding + 'px',
                marginRight: -padding + 'px'
              });
              $(this).find('>*[class*=col-]').css({
                paddingLeft: padding + 'px',
                paddingRight: padding + 'px'
              });
            }
          });
        }
      });

      /* Goto top */
      $('#go-to-top').once('click').each(function () {
        $(window).scroll(function () {
          if ($(this).scrollTop() > 200) {
            $('#go-to-top').css({
              bottom: "32px"
            });
          } else {
            $('#go-to-top').css({
              bottom: "-100px"
            });
          }
        });
        $(this).click(function (e) {
          e.preventDefault();
          $('html, body').animate({
            scrollTop: '0px'
          }, 1500);
        });
      });
      
      /* Fix empty section */
      $('.dexp-section').once('check-height').each(function(){
        if($(this).height() === 1){ 
          $(this).find('[class*=col-]').css({minHeight:0});
        }
      });
    }
  };
})(jQuery, Drupal);