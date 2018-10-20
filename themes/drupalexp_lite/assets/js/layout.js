(function ($, Drupal, drupalSettings) {
  'use strict';
  var DRUPALEXP = DRUPALEXP || {};
  DRUPALEXP.currentRegion = null;
  DRUPALEXP.currentLayout = null;
  DRUPALEXP.currentLayoutIndex = null;
  DRUPALEXP.currentPreset = null;
  DRUPALEXP.currentSection = null;
  
  DRUPALEXP.keyGen = function (title) {
    return title.replace(/[^a-z0-9]/g, function (s) {
      var c = s.charCodeAt(0);
      if (c == 32)
        return '-';
      if (c >= 65 && c <= 90)
        return s.toLowerCase();
      return '__' + ('000' + c.toString(16)).slice(-4);
    });
  };
  DRUPALEXP.draw = function (layout) {
    $('div#dexp_sections').html('');
    $(layout.sections).each(function () {
      this.regions == this.regions || [];
      var section = $('<div>');
      section.data({
        backgroundcolor: this.backgroundcolor || '',
        colpadding: this.colpadding || '',
        custom_class: this.custom_class || '',
        fullwidth: this.fullwidth || 'no',
        hdesktop: this.hdesktop || false,
        hphone: this.hphone || false,
        htablet: this.htablet || false,
        key: this.key || "",
        sticky: this.sticky || false,
        sticky_disable_mobile: this.sticky_disable_mobile || false,
        title: this.title || "",
        vdesktop: this.vdesktop || false,
        vphone: this.vphone || false,
        vtablet: this.vtablet || false,
        weight: this.weight || 0,
      });
      section.css({
        backgroundColor: this.backgroundcolor
      });
      section.addClass('dexp-section');
      if (this.key == 'unassigned') {
        section.addClass('dexp-section-unassigned');
      }
      var sectionHeader = $('<div class="dexp-section-header">');
      sectionHeader.append('<i class="fa fa-arrows section-sortable"></i>');
      sectionHeader.append('<span class="section_title">' + this.title + '</span>');
      sectionHeader.append('<i class="fa fa-gears section-settings pull-right"></i>');
      section.append(sectionHeader);
      section.append('<div class="container-fluid"><div class="dexp-section-inner row"></div></div>');
      $('div#dexp_sections').append(section);
      $('div#dexp_sections').sortable({
        handle: '.section-sortable',
        cancel: '.dexp-section-unassigned',
      });
      $(this.regions).each(function () {
        var region = $('<div>');
        region.addClass('dexp-region');
        this.colxl = this.colxl || '';
        this.collg = this.collg || '';
        this.colmd = this.colmd || '';
        this.colsm = this.colsm || '';
        this.colxs = this.colxs || '';
        this.colxloffset = this.colxloffset || 0;
        this.collgoffset = this.collgoffset || 0;
        this.colmdoffset = this.colmdoffset || 0;
        this.colsmoffset = this.colsmoffset || 0;
        this.colxsoffset = this.colxsoffset || 0;
        region.data({
          colxl: this.colxl,
          collg: this.collg,
          colmd: this.colmd,
          colsm: this.colsm,
          colxs: this.colxs,
          colxloffset: this.colxloffset,
          collgoffset: this.collgoffset,
          colmdoffset: this.colmdoffset,
          colsmoffset: this.colsmoffset,
          colxsoffset: this.colxsoffset,
          custom_class: this.custom_class || '',
          autosize: this.autosize || false,
          key: this.key || '',
          title: this.title || '',
          weight: this.weight || 0
        });
        region.append('<div class="region-inner"><i class="fa fa-arrows region-sortable"></i>' + this.title + '<i class="fa fa-gears region-settings pull-right"></i></div>');
        if(this.colxl){ region.addClass('col-xl-' + this.colxl); }
        if(this.collg){ region.addClass('col-lg-' + this.collg); }
        if(this.colmd){ region.addClass('col-md-' + this.colmd); }
        if(this.colsm){ region.addClass('col-sm-' + this.colsm); }
        if(this.colxs){ region.addClass('col-xs-' + this.colxs); }
        region.addClass('offset-xl-' + this.colxloffset);
        region.addClass('offset-lg-' + this.collgoffset);
        region.addClass('offset-md-' + this.colmdoffset);
        region.addClass('offset-sm-' + this.colsmoffset);
        region.addClass('offset-xs-' + this.colxsoffset);
        region.addClass(this.custom_class);
        section.find('.dexp-section-inner').append(region);
      });
      $('.dexp-section-inner').sortable({
        handle: '.region-sortable',
        connectWith: '.dexp-section-inner'
      });
    });
    Drupal.attachBehaviors(document.getElementById('dexp_sections'));
  };

  DRUPALEXP.saveLayout = function () {
    if (DRUPALEXP.currentLayoutIndex == null)
      return false;
    drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].sections = [];
    $('.dexp-section').each(function (index) {
      var section = {
        backgroundcolor: $(this).data('backgroundcolor'),
        colpadding: $(this).data('colpadding'),
        custom_class: $(this).data('custom_class'),
        fullwidth: $(this).data('fullwidth'),
        hdesktop: $(this).data('hdesktop'),
        hphone: $(this).data('hphone'),
        htablet: $(this).data('htablet'),
        key: $(this).data('key'),
        sticky: $(this).data('sticky'),
        sticky_disable_mobile: $(this).data('sticky_disable_mobile'),
        title: $(this).data('title'),
        vdesktop: $(this).data('vdesktop'),
        vphone: $(this).data('vphone'),
        vtablet: $(this).data('vtablet'),
        weight: index,
        regions: []
      };
      $($(this).find('.dexp-region')).each(function (index) {
        var region = {
          colxl: $(this).data('colxl'),
          collg: $(this).data('collg'),
          colmd: $(this).data('colmd'),
          colsm: $(this).data('colsm'),
          colxs: $(this).data('colxs'),
          colxloffset: $(this).data('colxloffset'),
          collgoffset: $(this).data('collgoffset'),
          colmdoffset: $(this).data('colmdoffset'),
          colsmoffset: $(this).data('colsmoffset'),
          colxsoffset: $(this).data('colxsoffset'),
          autosize: $(this).data('autosize'),
          custom_class: $(this).data('custom_class'),
          key: $(this).data('key'),
          title: $(this).data('title'),
          weight: index
        };
        section.regions.push(region);
      });
      drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].sections.push(section);
    });
  };

  DRUPALEXP.setFormVal = function (context, element) {
    $('[data-key]', context).each(function () {
      if ($(this).is('[type=checkbox]')) {
        $(this).prop('checked', $(element).data($(this).data('key')));
      } else {
        $(this).val($(element).data($(this).data('key')));
      }
    });
  };

  DRUPALEXP.saveFormVal = function (context, element) {
    $('[data-key]', context).each(function () {
      if ($(this).is('[type=checkbox]')) {
        $(element).data($(this).data('key'), $(this).is(':checked'));
      } else {
        $(element).data($(this).data('key'), $(this).val());
      }
    });
  };

  /*Layout settings*/
  Drupal.behaviors.drupalexp_init = {
    attach: function (context, settings) {
      $('ul#dexp_layouts', context).find('li').remove();
      $(settings.drupalexp_layouts).each(function (index) {
        var tab = $('<li class="dexp_layout">');
        tab.data({
          title: this.title,
          key: this.key,
          pages: this.pages,
          isdefault: this.isdefault
        });
        var defaultText = "";
        if (this.isdefault) {
          defaultText = '<span style="color:#ff0000">*</span>';
        }
        tab.append('<a href="#" class="layout-title">' + this.title + defaultText + '</a>');
        tab.append('<span class="fa fa-gears layout-settings"></span>');
        tab.find('.layout-title').on('click', function (e) {
          e.preventDefault();
          DRUPALEXP.saveLayout();
          DRUPALEXP.currentLayoutIndex = index;
          $('.dexp_layout').removeClass('active');
          $(this).closest('.dexp_layout').addClass('active');
          DRUPALEXP.draw(drupalSettings.drupalexp_layouts[index]);
          return false;
        });
        $('ul#dexp_layouts', context).append(tab);
      });
    }
  };

  Drupal.behaviors.drupalexp_layout_settings = {
    attach: function (context, settings) {
      $('#edit-drupalexp-layouts-edit').dialog({
        autoOpen: false,
        title: Drupal.t('Layout settings'),
        width: '60%',
        height: 400,
        modal: true,
        open: function () {
          var layout = settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex];
          $('[name=layout_name]').val(layout.title);
          $('[name=layout_default]').attr('checked', layout.isdefault);
          $('[name=dexp_layout_pages]').val(layout.pages);
          if (layout.isdefault) {
            $('[name=dexp_layout_pages]').closest('.form-item').hide();
          } else {
            $('[name=dexp_layout_pages]').closest('.form-item').show();
          }
        },
        buttons: [
          {
            text: Drupal.t('Save'),
            click: function () {
              drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].title = $('[name=layout_name]').val();
              drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].key = DRUPALEXP.keyGen($('[name=layout_name]').val());
              drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].pages = $('[name=dexp_layout_pages]').val();
              drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].isdefault = $('[name=layout_default]').is(':checked');
              if (drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].isdefault) {
                $(drupalSettings.drupalexp_layouts).each(function (index) {
                  if (index != DRUPALEXP.currentLayoutIndex) {
                    drupalSettings.drupalexp_layouts[index].isdefault = false;
                  }
                });
              } else {
                var hasdefault = false;
                $(drupalSettings.drupalexp_layouts).each(function (index) {
                  if (drupalSettings.drupalexp_layouts[index].isdefault) {
                    hasdefault = drupalSettings.drupalexp_layouts[index].isdefault;
                  }
                });
                if (!hasdefault)
                  drupalSettings.drupalexp_layouts[0].isdefault = true;
              }
              Drupal.attachBehaviors();
              $('ul#dexp_layouts li:eq(' + DRUPALEXP.currentLayoutIndex + ') .layout-title').trigger('click');
              $(this).dialog('close');
            }
          },
          {
            text: Drupal.t('Clone layout'),
            click: function () {
              DRUPALEXP.saveLayout(drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
              var newLayout = {};
              $.extend(true, newLayout, drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
              newLayout.title = 'copy of ' + newLayout.title;
              newLayout.isdefault = false;
              newLayout.pages = '';
              drupalSettings.drupalexp_layouts.push(newLayout);
              Drupal.attachBehaviors();
              $('ul#dexp_layouts li:last .layout-title').trigger('click');
              $(this).dialog('close');
            }
          },
          {
            text: Drupal.t('Remove layout'),
            click: function () {
              if (settings.drupalexp_layouts.length == 1) {
                alert(Drupal.t('Can not remove this layout'));
              } else if (confirm(Drupal.t('Are you sure you want to remove this layout?'))) {
                drupalSettings.drupalexp_layouts.splice(DRUPALEXP.currentLayoutIndex, 1);
                DRUPALEXP.currentLayoutIndex = null;
                Drupal.attachBehaviors();
                $('ul#dexp_layouts li:first .layout-title').trigger('click');
                $(this).dialog('close');
              }
            }
          },
          {
            text: Drupal.t('Cancel'),
            click: function () {
              $(this).dialog('close');
            }
          }
        ]
      });
      $('.layout-settings', context).once('click').on('click', function () {
        DRUPALEXP.currentLayout = $(this).closest('.dexp_layout');
        $('#edit-drupalexp-layouts-edit').dialog('open');
      });
    }
  };

  Drupal.behaviors.drupalexp_section_settings = {
    attach: function (context, settings) {
      $('#edit-drupalexp-section-settings', context).dialog({
        autoOpen: false,
        title: Drupal.t('Section settings'),
        width: '60%',
        height: 500,
        modal: true,
        open: function (event, ui) {
          DRUPALEXP.setFormVal('#edit-drupalexp-section-settings', DRUPALEXP.currentSection);
        },
        buttons: [
          {
            text: Drupal.t('Save'),
            click: function () {
              DRUPALEXP.saveFormVal('#edit-drupalexp-section-settings', DRUPALEXP.currentSection);
              DRUPALEXP.currentSection.find('.section_title').text(DRUPALEXP.currentSection.data('title'));
              DRUPALEXP.saveLayout(settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
              DRUPALEXP.draw(settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
              $(this).dialog('close');
            }
          }, {
            text: Drupal.t('Remove section'),
            click: function () {
              if (confirm(Drupal.t('Are you sure you want to remove this section?'))) {
                DRUPALEXP.currentSection.find('.dexp-region').each(function () {
                  $('.dexp-section-unassigned ul').append($(this));
                });
                DRUPALEXP.currentSection.remove();
                DRUPALEXP.saveLayout(drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
                $(this).dialog('close');
              }
            }
          }
        ]
      });

      $('.section-settings').once('click').on('click', function () {
        DRUPALEXP.currentSection = $(this).closest('.dexp-section');
        $('#edit-drupalexp-section-settings').dialog('open');
      });
    }
  };

  Drupal.behaviors.drupalexp_region_settings = {
    attach: function (context, settings) {
      $('#edit-drupalexp-region-settings', context).dialog({
        autoOpen: false,
        title: Drupal.t('Region settings'),
        width: '70%',
        height: 400,
        modal: true,
        open: function (event, ui) {
          DRUPALEXP.setFormVal('#edit-drupalexp-region-settings', DRUPALEXP.currentRegion);
        },
        buttons: [
          {
            text: Drupal.t('Save'),
            click: function () {
              DRUPALEXP.saveFormVal('#edit-drupalexp-region-settings', DRUPALEXP.currentRegion);
              DRUPALEXP.currentRegion.attr('class', '');
              DRUPALEXP.currentRegion.addClass('dexp-region');
              DRUPALEXP.currentRegion.addClass('col-xl-' + $('[name=region_col_xl]').val());
              DRUPALEXP.currentRegion.addClass('col-lg-' + $('[name=region_col_lg]').val());
              DRUPALEXP.currentRegion.addClass('col-md-' + $('[name=region_col_md]').val());
              DRUPALEXP.currentRegion.addClass('col-sm-' + $('[name=region_col_sm]').val());
              DRUPALEXP.currentRegion.addClass('col-xs-' + $('[name=region_col_xs]').val());
              DRUPALEXP.currentRegion.addClass('offset-xl-' + $('[name=region_col_offset_xl]').val());
              DRUPALEXP.currentRegion.addClass('offset-lg-' + $('[name=region_col_offset_lg]').val());
              DRUPALEXP.currentRegion.addClass('offset-md-' + $('[name=region_col_offset_md]').val());
              DRUPALEXP.currentRegion.addClass('offset-sm-' + $('[name=region_col_offset_sm]').val());
              DRUPALEXP.currentRegion.addClass('offset-xs-' + $('[name=region_col_offset_xs]').val());
              DRUPALEXP.currentRegion.addClass($('[name=region_custom_class]').val());
              $(this).dialog('close');
            }
          },
          {
            text: Drupal.t('Cancel'),
            click: function () {
              $(this).dialog('close');
            }
          }
        ]
      });
      //});
      $('.region-settings').on('click', function () {
        DRUPALEXP.currentRegion = $(this).closest('.dexp-region');
        $('#edit-drupalexp-region-settings').dialog('open');
      });
    }
  }

  Drupal.behaviors.drupalexp_add_section = {
    attach: function (context, settings) {
      $('body').once('section-settings').append('<div id="drupalexp_add_section_dialog" title="Add section">Section: <input type="text" class="form-text" name="section_name"/></div>');
      $('#drupalexp_add_section_dialog').dialog({
        autoOpen: false,
        modal: true,
        width: 300,
        height: 200,
        buttons: [
          {
            text: Drupal.t('Save'),
            click: function () {
              DRUPALEXP.saveLayout();
              if ($('[name=section_name]').val().trim() != '') {
                var newSection = {
                  title: $('[name=section_name]').val().trim(),
                  key: DRUPALEXP.keyGen($('[name=section_name]').val().trim()),
                  regions: []
                };
                settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].sections.splice(settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex].sections.length - 1, 0, newSection);
                DRUPALEXP.draw(settings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
              }
              $('[name=section_name]').val('');
              $(this).dialog('close');
            }
          }
        ]
      });
      $('#drupalexp_add_section a').on('click', function () {
        $('#drupalexp_add_section_dialog').dialog('open');
        return false;
      });
    }
  };

  Drupal.behaviors.drupalexp_add_layout = {
    attach: function () {
      $('.dexp-add-layout').once('click').on('click', function () {
        DRUPALEXP.saveLayout(drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
        var newLayout = {
          title: Drupal.t('New Layout'),
          key: DRUPALEXP.keyGen(Drupal.t('New Layout'))
        };
        var unassigned_section = {
          key: 'unassigned',
          title: Drupal.t('Unassigned'),
          regions: []
        };
        $(drupalSettings.drupalexp_layouts[0].sections).each(function () {
          $(this.regions).each(function () {
            var region = {};
            $.extend(true, region, this);
            unassigned_section.regions.push(region);
          });
        });
        newLayout.sections = [unassigned_section];
        drupalSettings.drupalexp_layouts.push(newLayout);
        Drupal.attachBehaviors();
        $('ul#dexp_layouts li:last .layout-title').trigger('click');
        return false;
      });
    }
  };

  Drupal.behaviors.drupalexp_form_submit = {
    attach: function () {
      $('form#system-theme-settings').once('drupalexp-layout-submit').submit(function () {
        DRUPALEXP.saveLayout(drupalSettings.drupalexp_layouts[DRUPALEXP.currentLayoutIndex]);
        var layoutstr = JSON.stringify(drupalSettings.drupalexp_layouts);
        var layoutstrs = layoutstr.match(/.{1,10000}/g);
        for (var i = 0; i < layoutstrs.length; i++) {
          $('[name=dexp_layout_' + i + ']').val(layoutstrs[i]);
        }
        $('input[name=drupalexp_layouts]').val('');
        return true;
      });
      $('#edit-btn-reset-layouts').once('click').click(function(e){
        e.preventDefault();
        if(confirm('All your changes will be lose? This action cannot be undone.')){
          $('input[name=reset_layouts]').val(1);
          $('#edit-submit').trigger('click');
        }
      });
    }
  };
  $(document).ready(function () {
    $('ul#dexp_layouts li:eq(0) .layout-title').trigger('click');
  });
})(jQuery, Drupal, drupalSettings);