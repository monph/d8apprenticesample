<?php

/**
 * @file
 * Form customizations for the credit_due theme.
 */

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Implements hook_form_alter().
 */
function credit_due_form_views_form_content_page_1_alter(&$form, FormStateInterface $form_state) {
  $form['actions']['submit']['#value'] = t('Apply');
  $form['header']['node_bulk_form']['actions']['submit']['#value'] = t('Apply');
  $form['header']['node_bulk_form']['action']['#options']['none'] = t('Bulk Operations');
  $form['header']['node_bulk_form']['action']['#default_value'] = 'none';
}

/**
 * Implements hook_form_FORM_ID_alter().
 */
function credit_due_form_node_type_edit_form_alter(&$form, FormStateInterface $form_state) {
  $ct_config = $form_state->getFormObject()->getEntity();
  $ct_theme_config = $ct_config->getThirdPartySetting('credit_due', 'credit_due_ct_config');
  $form['menu']['show_left_sidebar'] = [
    '#type' => 'checkbox',
    '#title' => t('Display in left sidebar'),
    '#default_value' => is_null($ct_theme_config) ? 1 : (isset($ct_theme_config['show_left_sidebar']) ? $ct_theme_config['show_left_sidebar'] : 1),
  ];
  $form['actions']['submit']['#submit'][] = 'credit_due_ct_config_entity_save';
}

/**
 * Additional submit handler for content type form for saving sidebar settings.
 */
function credit_due_ct_config_entity_save($form, FormStateInterface $form_state) {
  $settings = [];
  $show_left_sidebar = $form_state->getValue('show_left_sidebar');
  $entity = $form_state->getFormObject()->getEntity();

  if (!is_null($show_left_sidebar)) {
    $settings['show_left_sidebar'] = $show_left_sidebar;
  }
  $entity->setThirdPartySetting('credit_due', 'credit_due_ct_config', $settings);
  $entity->save();
}

/**
 * Implements hook_form_BASE_FORM_ID_alter().
 */
function credit_due_form_node_form_alter(&$form, FormStateInterface $form_state, $form_id) {
  $form_object = $form_state->getFormObject();
  $node = $form_object->getEntity();

  // Move the path settings (URL Alias) fields to directly below the title.
  $title_weight = isset($form['title']['#weight']) ? $form['title']['#weight'] : 0;
  unset($form['path_settings']['#group']);
  $form['path_settings']['#type'] = 'fieldset';
  $form['path_settings']['#weight'] = $title_weight + .5;

  // Reposition save/preview/delete to Publish tab.
  $form['meta']['actions'] = $form['actions'];
  $form['actions']['#access'] = FALSE;
  $form['meta']['actions']['delete']['#weight'] = 0;
  $form['meta']['actions']['#attributes']['class'][] = 'clearfix';
  $form['meta']['preview'] = $form['meta']['actions']['preview'];
  $form['meta']['preview']['#weight'] = 0;
  $form['meta']['actions']['preview']['#access'] = FALSE;

  // Change button and tab labels.
  $form['meta']['published']['#markup'] = t('Publish');
  $form['meta']['preview']['#value'] = t('Preview Changes');

  $actions = [
    '#prefix' => '<div class="save-cancel">',
    '#suffix' => '</div>',
    0 => [
      '#markup' => '<a href="#" class="button save-cancel-ok">' . t('OK') . '</a>',
    ],
    1 => [
      '#markup' => '<a href="#" class="save-cancel-cancel">' . t('Cancel') . '</a>',
    ],
  ];

  // Change "authored on" field to label-only that can be edited
  // by clicking "edit" and move to Publish tab.
  unset($form['created']['#group']);
  $form['meta']['created'] = $form['created'];
  $form['meta']['created']['#attributes']['class'][] = 'expand-to-edit';
  $form['meta']['created']['savecancel'] = $actions;
  unset($form['meta']['created']['widget']['#description']);
  unset($form['meta']['created']['widget'][0]['value']['#description']);
  $form['created']['#access'] = FALSE;
  unset($form['created']);

  // Change "authored by" field to label-only that can be edited
  // by clicking "edit" and move to Publish tab.
  unset($form['uid']['#group']);
  $form['meta']['uid'] = $form['uid'];
  $form['uid']['#access'] = FALSE;
  unset($form['meta']['uid']['widget']['#description']);
  unset($form['meta']['uid']['widget'][0]['target_id']['#description']);
  $form['meta']['uid']['#attributes']['class'][] = 'expand-to-edit';
  $form['meta']['uid']['savecancel'] = $actions;

  // Revision options are disabled for now, will support in future version.
  $form['revision_information']['#access'] = FALSE;


  // Move "published" checkbox from form bottom to Publish tab.
  unset($form['status']['#group']);
  $form['meta']['status'] = $form['status'];
  $form['status']['#access'] = FALSE;

  // Override Menu Entity's change to published field.
  if(isset($form['meta']['status']['widget'])) {
    unset($form['meta']['status']['widget']['#description']);
    $form['meta']['status']['widget']['#title'] = t('Published');
  }

  // Change order of items within the Publish tab.
  $form['meta']['created']['#weight'] = 8;
  $form['meta']['created']['#weight'] = 9;
  $form['meta']['changed']['#weight'] = 10;
  $form['meta']['status']['#weight'] = 11;

  // "Authoring information" tab is no longer necessary
  // because all elements have been moved to "Publish".
  $form['meta']['author']['#access'] = FALSE;

  // Add class to a few node form fields that bypass the white background.
  $form['title']['#attributes']['class'][] = 'no-white-bg';
  $form['path']['#attributes']['class'][] = 'no-white-bg';
  $form['path_settings']['#attributes']['class'][] = 'no-white-bg';

  if (!$node->isNew()) {
    $nid = $node->id();
    $alias = sprintf('<a href="%1$s">%1$s</a>', Drupal::request()->getSchemeAndHttpHost() . \Drupal::service('path.alias_manager')->getAliasByPath('/node/' . $node->id()));
  }
  else {
    $nid = 0;
    if (!empty($form['path']['widget'][0]['pathauto']['#default_value'])) {
      $alias = '<i class="generated-automatic-message">' . t('Generated automatically with Pathauto') . '</i>';
    }
    else {
      $alias = '<i class="generated-automatic-message">' . t('Will be based on node ID after saving') . '</i>';
    }
    $form['meta']['created']['#access'] = FALSE;
  }

  $form["path_settings"]["#title"] = sprintf('%1$s <span data-nid="%3$s" class="current-url-alias" id="display-url-alias">%2$s</span><a id="edit-alias" href="#" class="open-alias cd-tab">Edit</a>',
    t("URL Alias:")->__toString(),
    ($alias) ? $alias : '',
    $nid);
}

/**
 * Implements template_preprocess_details().
 * Adresses issue that will be fixed in 8.6
 * https://www.drupal.org/project/drupal/issues/2652850.
 */
function credit_due_preprocess_details(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#title'])) {
    $variables['title'] = ['#markup' => $element['#title']];
  }
}

/**
 * Implements template_preprocess_multiple_value_form().
 * Adresses issue that will be fixed in 8.6
 * https://www.drupal.org/project/drupal/issues/2652850.
 */
function credit_due_preprocess_multiple_value_form(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#title'])) {
    $variables['title'] = ['#markup' => $element['#title']];
  }
}

/**
 * Implements template_preprocess_HOOK().
 * Adresses issue that will be fixed in 8.6
 * https://www.drupal.org/project/drupal/issues/2652850.
 */
function credit_due_preprocess_datetime_wrapper(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#title'])) {
    $variables['title'] = ['#markup' => $element['#title']];
  }
}



