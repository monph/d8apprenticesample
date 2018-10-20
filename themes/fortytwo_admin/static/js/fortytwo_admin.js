(function ( $, Drupal, window, document, undefined ) {

  Drupal.behaviors.fortytwoAdminMain = {
    constants: {
      LAYOUT: {
        adaptive: false,
        fluid: false
      },

      MEDIA_QUERIES: {
        desktop: "all and (min-width: 1248px)",

        tablet: {
          both: "all and (min-width: 768px) and (max-width: 1247px)",
          portrait: "all and (min-width: 768px) and (max-width: 1001px)",
          landscape: "all and (min-width: 1002px) and (max-width: 1247px)"
        },

        mobile: {
          both: "all and (min-width: 0px) and (max-width: 767px)",
          portrait: "all and (min-width: 0px) and (max-width: 479px)",
          landscape: "all and (min-width: 480px) and (max-width: 767px)"
        }
      }
    },

    attach: function (context, settings) {
      // Apply Prettify.
      $('select:not(".no-prettify"):not(multiple), input[type="file"]:not(".no-prettify")').each(function () {
        new Drupal.ft_prettify({el: this});
      });
    }
  };

  Drupal.behaviors.customCKEditorConfig = {
    attach: function (context, settings) {
      if (typeof CKEDITOR !== "undefined") {
        CKEDITOR.config.uiColor = "#edf1f5";
      }
    }
  };

})(jQuery, Drupal, this, this.document);
