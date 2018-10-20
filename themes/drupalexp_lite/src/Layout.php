<?php

namespace Drupal\drupalexp_lite;

use Drupal\drupalexp_lite\DrupalExp;

class Layout extends \stdClass {

  public static function alterForm(&$form) {
    $theme = DrupalExp::get();
    $layouts = json_encode($theme->getLayouts());
    $coloptions = ['' => 'Not set', 1 => '1/12', 2 => '2/12', 3 => '3/12', 4 => '4/12', 5 => '5/12', 6 => '6/12', 7 => '7/12', 8 => '8/12', 9 => '9/12', 10 => '10/12', 11 => '11/12', 12 => '12/12'];
    $form['layout_settings'] = [
      '#type' => 'details',
      '#title' => t('Layout settings'),
      '#description' => '',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'drupalexp_theme_settings',
      '#weight' => -1,
    ];
    $form['layout_settings']['drupalexp_layouts_edit'] = [
      '#type' => 'container',
      '#title' => t('Edit layout'),
    ];
    $form['layout_settings']['drupalexp_layouts_edit']['layout_name'] = [
      '#type' => 'textfield',
      '#title' => t('Title'),
      '#size' => '',
      '#attributes' => ['data-key' => 'title'],
    ];
    $form['layout_settings']['drupalexp_layouts_edit']['layout_default'] = [
      '#type' => 'checkbox',
      '#title' => t('Set as default'),
    ];
    $form['layout_settings']['drupalexp_layouts_edit']['dexp_layout_pages'] = [
      '#type' => 'textarea',
      '#title' => t('Pages Assignment'),
      '#description' => t('List of pages to apply this layout. Enter one path per line. The \'*\' character is a wildcard. Example paths are blog for the blog page and blog/* for every personal blog. &lt;front&gt; is the front page.'),
      '#size' => '',
      '#states' => [
        'visible' => [
          ':input[name="layout_default"]' => ['checked' => FALSE],
        ],
      ],
    ];
    $form['layout_settings']['drupalexp_layouts'] = [
      '#type' => 'hidden',
      '#default_value' => $layouts,
    ];
    for ($i = 0; $i < 100; $i++) {
      $form['layout_settings']['dexp_layout_' . $i] = [
        '#type' => 'hidden',
      ];
    }
    $form['layout_settings']['drupalexp_layouts_ui'] = [
      '#markup' => '<a href="#" class="dexp-add-layout"><i class="fa fa-plus-circle"></i> New layout</a><ul id="dexp_layouts"></ul><div id="dexp_sections"></div>',
    ];

    $form['layout_settings']['drupalexp_add_section'] = [
      '#markup' => '<div id="drupalexp_add_section"><a href="#"><i class="fa fa-plus-circle"></i> Add section</a></div>',
    ];
    $form['layout_settings']['drupalexp_region_settings'] = [
      '#type' => 'container',
      '#title' => t('Region settings'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols'] = [
      '#type' => 'fieldset',
      '#title' => 'Colunms',
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols']['region_col_xl'] = [
      '#type' => 'select',
      '#options' => $coloptions,
      '#field_prefix' => '<i class="fa fa-desktop"></i>',
      '#attributes' => ['data-key' => 'colxl'],
      '#description' => t('>=1200px'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols']['region_col_lg'] = [
      '#type' => 'select',
      '#options' => $coloptions,
      '#field_prefix' => '<i class="fa fa-desktop"></i>',
      '#attributes' => ['data-key' => 'collg'],
      '#description' => t('>=992px'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols']['region_col_md'] = [
      '#type' => 'select',
      '#options' => $coloptions,
      '#field_prefix' => '<i class="fa fa-laptop"></i>',
      '#attributes' => ['data-key' => 'colmd'],
      '#description' => t('>=768px'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols']['region_col_sm'] = [
      '#type' => 'select',
      '#options' => $coloptions,
      '#field_prefix' => '<i class="fa fa-tablet"></i>',
      '#attributes' => ['data-key' => 'colsm'],
      '#description' => t('>=576px'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['cols']['region_col_xs'] = [
      '#type' => 'select',
      '#options' => $coloptions,
      '#field_prefix' => '<i class="fa fa-mobile-phone"></i>',
      '#attributes' => ['data-key' => 'colxs'],
      '#description' => t('<576px'),
    ];
    $form['layout_settings']['drupalexp_region_settings']['region_custom_class'] = [
      '#title' => 'Custom class',
      '#type' => 'textfield',
      '#attributes' => ['data-key' => 'custom_class'],
      '#description' => t('Helpfull classes: col, col-auto'),
    ];
    /*
      $form['layout_settings']['drupalexp_region_settings']['region_autosize'] = [
      '#type' => 'checkbox',
      '#title' => t('Auto resize column size'),
      '#attributes' => ['data-key' => 'autosize'],
      '#description' => t('The column size will auto caculate to fill full row'),
      ];
     */
    $form['layout_settings']['drupalexp_region_settings']['offset'] = [
      '#type' => 'fieldset',
      '#title' => 'Offsets',
      '#description' => '<a target="_blank" href="http://getbootstrap.com/docs/4.0/layout/grid/#offsetting-columns">What is offset?</a>',
    ];
    $form['layout_settings']['drupalexp_region_settings']['offset']['region_col_offset_xl'] = [
      '#type' => 'select',
      '#options' => [0 => 'Not set', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '#field_prefix' => 'XL',
      '#attributes' => ['data-key' => 'colxloffset'],
    ];
    $form['layout_settings']['drupalexp_region_settings']['offset']['region_col_offset_lg'] = [
      '#type' => 'select',
      '#options' => [0 => 'Not set', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '#field_prefix' => 'LG',
      '#attributes' => ['data-key' => 'collgoffset'],
    ];
    $form['layout_settings']['drupalexp_region_settings']['offset']['region_col_offset_md'] = [
      '#type' => 'select',
      '#options' => [0 => 'Not set', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '#field_prefix' => 'MD',
      '#attributes' => ['data-key' => 'colmdoffset'],
    ];
    $form['layout_settings']['drupalexp_region_settings']['offset']['region_col_offset_sm'] = [
      '#type' => 'select',
      '#options' => [0 => 'Not set', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '#field_prefix' => 'SM',
      '#attributes' => ['data-key' => 'colsmoffset'],
    ];
    $form['layout_settings']['drupalexp_region_settings']['offset']['region_col_offset_xs'] = [
      '#type' => 'select',
      '#options' => [0 => 'Not set', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '#field_prefix' => 'XS',
      '#attributes' => ['data-key' => 'colxsoffset'],
    ];
    //Section settings
    $form['layout_settings']['drupalexp_section_settings'] = [
      '#type' => 'container',
      '#title' => t('Section settings'),
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_title'] = [
      '#type' => 'textfield',
      '#title' => t('Section'),
      '#size' => '',
      '#attributes' => ['data-key' => 'title'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_fullwidth'] = [
      '#type' => 'select',
      '#title' => t('Full width'),
      '#options' => ['no' => 'No', 'yes' => 'Yes'],
      '#attributes' => ['data-key' => 'fullwidth'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_vphone'] = [
      '#type' => 'checkbox',
      '#title' => t('Visible Phone'),
      '#attributes' => ['data-key' => 'vphone'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_vtablet'] = [
      '#type' => 'checkbox',
      '#title' => t('Visible Tablet'),
      '#attributes' => ['data-key' => 'vtablet'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_vdesktop'] = [
      '#type' => 'checkbox',
      '#title' => t('Visible Desktop'),
      '#attributes' => ['data-key' => 'vdesktop'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_hphone'] = [
      '#type' => 'checkbox',
      '#title' => t('Hide on Phone'),
      '#attributes' => ['data-key' => 'hphone'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_htablet'] = [
      '#type' => 'checkbox',
      '#title' => t('Hide on Tablet'),
      '#attributes' => ['data-key' => 'htablet'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_hdesktop'] = [
      '#type' => 'checkbox',
      '#title' => t('Hide on Desktop'),
      '#attributes' => ['data-key' => 'hdesktop'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_background_color'] = [
      '#type' => 'textfield',
      '#title' => t('Background color'),
      '#size' => '',
      '#attributes' => ['data-key' => 'backgroundcolor'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_sticky'] = [
      '#type' => 'checkbox',
      '#title' => t('Sticky on top'),
      '#attributes' => ['data-key' => 'sticky'],
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_sticky_disable_mobile'] = [
      '#type' => 'checkbox',
      '#title' => t('Disable stick on mobile'),
      '#attributes' => ['data-key' => 'sticky_disable_mobile'],
        /* '#states' => [
          'visible' => [
          ':input[name=section_sticky]' => ['checked' => true],
          ],
          ], */
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_custom_class'] = [
      '#type' => 'textfield',
      '#title' => t('Custom class'),
      '#size' => '',
      '#attributes' => ['data-key' => 'custom_class'],
    ];
    $form['layout_settings']['reset_layouts'] = [
      '#type' => 'hidden',
      '#default_value' => 0,
    ];
    $form['layout_settings']['drupalexp_section_settings']['section_colpadding'] = [
      '#type' => 'textfield',
      '#title' => t('Custom column padding'),
      '#description' => t('Leave blank to use default bootstrap padding (15px)'),
      '#field_suffix' => 'px',
      '#size' => '',
      '#attributes' => ['data-key' => 'colpadding'],
    ];
    $form['#attached']['drupalSettings']['drupalexp_layouts'] = $theme->getLayouts();
    $form['#validate'][] = 'Drupal\drupalexp_lite\Layout::formValidate';
    $form['actions']['btn_reset_layouts'] = [
      '#type' => 'button',
      '#value' => t('Reset layouts'),
    ];
  }

  public static function formValidate(&$form, &$form_state) {
    $layouts = '';
    $i = 0;
    $values = $form_state->getValues();
    if ($values['reset_layouts']) {
      $theme = str_replace('.settings', '', $values['config_key']);
      $default_config = \Symfony\Component\Yaml\Yaml::parse(drupal_get_path('theme', $theme) . '/config/optional/' . $theme . '.settings.yml');
      $layouts = $default_config['drupalexp_layouts'];
    }
    else {
      while (!empty($values['dexp_layout_' . $i]) && $i < 100) {
        $layouts .= $values['dexp_layout_' . $i];
        $i++;
      }
      if (json_decode($layouts) === NULL) {
        $form_state->setError($form['layout_settings'], t('Layouts Error'));
      }
    }
    $form_state->setValue('drupalexp_layouts', $layouts);
  }

}
