(function ($, Drupal) {
  'use strict';
  Drupal.behaviors.editPublishOptions = {
    attach: function attach(context) {
      $.each($('.expand-to-edit', context), function () {
        var $this = $(this);
        var $label = $this.find('label, .label').first();
        var value = $this.find('input').first().val();
        if ($this.hasClass('field--widget-datetime-timestamp')) {
          value += ' ' + $this.find('.form-time').first().val();
        }
        $label.append(': <b class="expand-to-edit-value">' + value + '</b>&nbsp;<a href="#" class="edit-expand-field">Edit</a>');
      });
      $('.edit-expand-field', context).click(function (e) {
        e.preventDefault();
        var $container = $(this).closest('.expand-to-edit');

        var $input = $container.find('input').first();

        $input.attr('data-prev-value', $input.val());
        if ($container.hasClass('field--widget-datetime-timestamp')) {
          var $input2 = $container.find('.form-time').first();
          $input2.attr('data-prev-value', $input2.val());
        }
        $container.addClass('is-expanded');
      });

      $('.save-cancel-ok', context).click(function (e) {
        e.preventDefault();
        var $container = $(this).closest('.expand-to-edit');
        var value = $container.find('input').first().val();
        if ($container.hasClass('field--widget-datetime-timestamp')) {
          value += ' ' + $container.find('.form-time').first().val();
        }
        $container.find('.expand-to-edit-value').text(value);
        $container.removeClass('is-expanded');
      });

      $('.save-cancel-cancel', context).click(function (e) {

        e.preventDefault();
        var $container = $(this).closest('.expand-to-edit');
        var $input = $container.find('input').first();
        $input.val($input.attr('data-prev-value'));
        if ($container.hasClass('field--widget-datetime-timestamp')) {
          var $input2 = $container.find('.form-time').first();
          $input2.val($input2.attr('data-prev-value'));
        }
        $container.removeClass('is-expanded');
      });
    }
  };

  Drupal.behaviors.nodeUrlAlias = {
    attach: function attach(context) {
      $('#edit-alias', context).click(function () {
        var $this = $(this);
        if ($this.hasClass('open-alias')) {
          $this.closest('fieldset').addClass('opened-alias-fieldset').find('.fieldset-wrapper').show(400);
          $this.text('Save');
          $this.removeClass('open-alias');
        }
        else {
          $this.closest('fieldset').removeClass('opened-alias-fieldset').find('.fieldset-wrapper').hide(400);
          $this.text('Edit');
          $this.addClass('open-alias');
        }
      });

      var nid = $('.current-url-alias').attr('data-nid');

      $('#edit-path-0-alias', context).keyup(function () {
        var message = $(this).val();
        if ($('.generated-automatic-message').length) {
          if ($('input#edit-path-0-pathauto').prop('checked')) {
            message = Drupal.t('Generated automatically with Pathauto');
          }
          else {
            if (message.length === 0) {
              message = Drupal.t('Will be based on node ID after saving');
            }
            else {
              message = window.location.origin + $(this).val();
            }
          }
          $('.generated-automatic-message').text(message);
        }
        else {
          if (message.length === 0) {
            if (nid > 0) {
              message = '/node/' + nid;
            }
            else {
              if ($('input#edit-path-0-pathauto').prop('checked')) {
                message = Drupal.t('Generated automatically with Pathauto');
              }
              else {
                message = Drupal.t('Will be based on node ID after saving');
              }
            }
          }
          else {
            message = window.location.origin + message;
          }
          $('.current-url-alias').html(message);
        }
      });

      $('input#edit-path-0-pathauto', context).change(function () {
        if ($(this).prop('checked')) {
          $('.generated-automatic-message').text(Drupal.t('Generated automatically with Pathauto'));
        }
        else {
          $('.generated-automatic-message').text($('#edit-path-0-alias').val());
        }
      });
    }
  };

  Drupal.behaviors.GotoSpecificPage = {
    attach: function attach(context) {

      function removeParam(key) {
        var url = document.location.href;
        var params = url.split('?');
        if (params.length === 1) {
          return document.location.href;
        }

        url = params[0] + '?';
        params = params[1];
        params = params.split('&');

        $.each(params, function (index, value) {
          var v = value.split('=');
          if (v[0] !== key) {
            url += value + '&';
          }
        });

        url = url.replace(/&$/, '');
        url = url.replace(/\?$/, '');

        return url;
      }

      $('#current-page-selector').keypress(function (e) {
        if (e.which === 13) {
          if (isNaN($(this).val())) {
            return;
          }

          var page = parseInt($(this).val()) - 1;
          var url = removeParam('page');
          var totalPages = parseInt($('.total-pages').first().text());

          if (page > totalPages) {
            page = totalPages - 1;
          }
          if (page <= 0) {
            page = 0;
          }

          if (url.indexOf('?') > -1) {
            window.location = url + '&page=' + page;
          }
          else {
            window.location = url + '?page=' + page;
          }
        }
      });
    }
  };

  Drupal.behaviors.hoverFitScreen = {
    attach: function attach(context) {
      $('.menu-item--expanded:not(.menu-item--active-trail)').hover(function () {
        var $exposedItem = $(this).find('ul.level-1').first();
        var itemTop = $exposedItem.offset().top;
        var itemBottom = itemTop + $exposedItem .outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        if (itemBottom > viewportBottom) {
          var top = viewportBottom - itemBottom - 60;
          $exposedItem.css('top', top);
        }
      },
      function () {
        var $exposedItem = $(this).find('ul.level-1').first();
        $exposedItem.css('top');
      });
    }
  };

  Drupal.behaviors.designateNestedTabs = {
    attach: function attach(context) {
      $.each($('.block-local-tasks-block', context), function(i, v) {
        var $this = $(this);
        var $navs = $this.find('.tabs nav');
        if ($navs.length > 1) {
          $this.addClass('nested-tabs');
        }
      });
    }
  };
  
  Drupal.behaviors.addressZeroHeightCkeditor = {
    attach: function attach(context) {
      // CKeditor is making some wysiwyg fields 0px high.
      // This catches it when that happens and corrects it.
      var obs = new MutationObserver(function(mutations, observer) {
        $.each(mutations, function (i, mutation) {
          var addedNodes = $(mutation.addedNodes);
          var selector = '.cke_contents';
          var filteredEls = addedNodes.find(selector).addBack(selector);
          filteredEls.each(function () {
            var target = document.getElementById($(this).attr('id'));
            var observer = new MutationObserver(function (mutations) {
              mutations.forEach(function (mutation) {
                if ($(mutation.target).css("height") === '0px') {
                  $(mutation.target).css("height", '200px');
                }
              });
            });
            var config = {
              attributes: true,
              attributeFilter: ['style']
            };
            observer.observe(target, config);
          });
        });
      });

      var wholePage = document.querySelector('body');
      obs.observe(wholePage, {childList: true, subtree: true});

    }
  };

  /*
  Addresses issue that will be fixed in core 8.6
  https://www.drupal.org/project/drupal/issues/2652850.
  Targeted at the one form element that could not be easily fixed in a preprocessor.
   */
  Drupal.behaviors.unescapeTranslationMessage = {
    attach: function attach(context) {
      var $delbutton = $('#edit-meta-actions-delete[hreflang]', context);
      if($delbutton.length) {
        var delbuttoncontents = $delbutton.html();
        var tempcontents = document.createElement('div');
        tempcontents.innerHTML = delbuttoncontents;
        var newdelbuttoncontents = tempcontents.childNodes.length === 0 ? "" : tempcontents.childNodes[0].nodeValue;
        $delbutton.html(newdelbuttoncontents);
      }
    }
  };
})(jQuery, Drupal);
