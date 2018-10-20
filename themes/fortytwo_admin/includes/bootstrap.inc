<?php

/**
 * @file
 * bootstrap.inc
 *
 * Contains theme preprocessors to bootstrapize components.
 */

use Drupal\Component\Utility\SafeMarkup;
use Drupal\Core\Url;
use \Drupal\Core\Link;

require_once dirname(__FILE__) . '/fortytwo_admin.inc';

/**
 * Implements hook_preprocess_html().
 */
function fortytwo_admin_preprocess_html(array &$variables) {
  /* @var $user Drupal\Core\Session\AccountProxy */
  $user = $variables['user'];

  // Setup the theme basics.
  fortytwo_admin_get_theme($variables);

  $variables['fortytwo_admin_layout_login'] = theme_get_setting('fortytwo_admin_layout_login');
  if (!empty($variables['fortytwo_admin_layout_login']) && $user->isAnonymous()) {
    if (!isset($variables['attributes']['class'])) {
      $variables['attributes']['class'] = array();
    }
    $variables['attributes']['class'][] = 'ft-layout-login';

    $current_path = \Drupal::service('path.current')->getPath();
    $current_path = str_replace('/', '-', substr($current_path, 1));
    $variables['attributes']['class'][] = $current_path;

    $url = Url::fromUri('https://www.flickr.com/photos/meddygarnet/', array('attributes' => array('target' => '_blank')));
    $name = Link::fromTextAndUrl('Morgan', $url);

    $url = Url::fromUri('https://www.flickr.com/photos/meddygarnet/5760264604', array('attributes' => array('target' => '_blank')));
    $flickr = Link::fromTextAndUrl('flickr', $url);

    $variables['page']['fortytwo_admin_credit'] = (string) t('The background image is created by %name and can be downloaded from %flickr', array(
      '%name'   => $name->toString(),
      '%flickr' => $flickr->toString(),
    ));
  }

  $color_profile = theme_get_setting('fortytwo_admin_color_profile');
  if (!empty($color_profile)) {
    $variables['attributes']['class'][] = 'ft-profile-' . $color_profile;
  }
  else {
    $variables['attributes']['class'][] = 'ft-profile-marvin';
  }

  // Add our own class to the body.
  $variables['attributes']['class'][] = 'fortytwo-admin';

  // Add an extra class to the body when on the administration page.
  $current_path = \Drupal::service('path.current')->getPath();
  if ($current_path == '/admin/config') {
    $variables['attributes']['class'][] = 'fortytwo-admin-config-page';
  }

  // Add current path to body classes.
  $system_path = \Drupal::service('path.current')->getPath();
  $extra_classes = explode('/', $system_path);
  array_walk($extra_classes, function (&$item) {
    $item = 'path-' . $item;
  });
  array_shift($extra_classes);

  // Add the body classes to the attributes array.
  if (isset($variables['attributes']['class']) && is_array($variables['attributes']['class'])) {
    $variables['attributes']['class'] = array_merge($variables['attributes']['class'], $extra_classes);
  }
  elseif (isset($variables['attributes']['class']) && is_a($variables['attributes']['class'], 'Drupal\Core\Template\AttributeArray')) {
    $variables['attributes']['class'] = array_merge($variables['attributes']['class']->value(), $extra_classes);
  }
  else {
    $variables['attributes']['class'] = $extra_classes;
  }

  // Change the mime type of the favicon to make it work in all browsers.
  $favicon = theme_get_setting('favicon');
  $type = 'image/x-icon';
  $variables['#attached']['html_head_link'][] = array(
    array(
      'rel'  => 'shortcut icon',
      'href' => $favicon['url'],
      'type' => $type,
    ),
  );
}

/**
 * Implements hook_preprocess_block().
 *
 * Clean up the div classes for blocks
 */
function fortytwo_admin_preprocess_block(array &$variables) {
  // Replace first occurance of block- to clean up the ID's.
  if (substr($variables['attributes']['id'], 0, 6) === 'block-') {
    $variables['attributes']['id'] = substr($variables['attributes']['id'], 6);
  }

  $theme = \Drupal::theme()->getActiveTheme()->getName();
  if (strstr($variables['attributes']['id'], $theme)) {
    $variables['attributes']['id'] = str_replace($theme . '-', '', $variables['attributes']['id']);
  }
}

/**
 * Override or insert variables into the node templates.
 *
 * @param array $variables
 *   An array of variables to pass to the theme template.
 * @param string $hook
 *   The name of the template being rendered ("node" in this case.)
 */
function fortytwo_admin_preprocess_node(array &$variables, $hook) {
  /** @var \Drupal\node\Entity\Node $node */
  $node = $variables['node'];
  $function = __FUNCTION__ . '_' . $node->bundle();
  if (function_exists($function)) {
    $function($variables, $hook);
  }
}

/**
 * Override or insert variables into the field templates.
 *
 * @param array $variables
 *   An array of variables to pass to the theme template.
 * @param string $hook
 *   The name of the template being rendered ("node" in this case.)
 */
function fortytwo_admin_preprocess_field(array &$variables, $hook) {
  $element = $variables['element'];

  // There's some overhead in calling check_plain() so only call it if the label
  // variable is being displayed. Otherwise, set it to NULL to avoid PHP
  // warnings if a theme implementation accesses the variable even when it's
  // supposed to be hidden. If a theme implementation needs to print a hidden
  // label, it needs to supply a preprocess function that sets it to the
  // sanitized element title or whatever else is wanted in its place.
  $variables['label_hidden'] = ($element['#label_display'] == 'hidden');
  if (empty($variables['label'])) {
    $variables['label'] = $variables['label_hidden'] ? NULL : SafeMarkup::checkPlain($element['#title']);
  }
}

/**
 * Implements hook_preprocess_breadcrumb().
 */
function fortytwo_admin_preprocess_breadcrumb(&$variables) {
  $breadcrumb = &$variables['breadcrumb'];

  // Retrieve the breadcrumb settings.
  $show_breadcrumb_home = theme_get_setting('fortytwo_admin_breadcrumb_home');
  $add_trailing = theme_get_setting('fortytwo_admin_breadcrumb_trailing');
  $add_title = theme_get_setting('fortytwo_admin_breadcrumb_title');

  $variables['trailing'] = $add_trailing;

  // Optionally get rid of the homepage link.
  if (!$show_breadcrumb_home) {
    array_shift($breadcrumb);
  }

  if ($add_title && !empty($breadcrumb)) {
    $request = \Drupal::request();
    $route_match = \Drupal::routeMatch();
    $page_title = \Drupal::service('title_resolver')
      ->getTitle($request, $route_match->getRouteObject());

    if (!empty($page_title)) {
      $breadcrumb[] = array(
        'text' => $page_title,
      );
    }
  }
}

/**
 * Implements hook_page_attachments_alter().
 *
 * - Add meta tags to the html header.
 */
function fortytwo_admin_page_attachments_alter(&$variables) {
  // Add viewport element.
  $viewport = theme_get_setting('fortytwo_admin_viewport');
  if (!empty($viewport)) {
    $user_scalable = theme_get_setting('fortytwo_admin_viewport_user_scaleable');
    $initial_scale = theme_get_setting('fortytwo_admin_viewport_initial_scale');
    $minimum_scale = theme_get_setting('fortytwo_admin_viewport_minimum_scale');
    $maximum_scale = theme_get_setting('fortytwo_admin_viewport_maximum_scale');
    $content = "width=device-width, initial-scale=" . $initial_scale . ", minimum-scale=" . $minimum_scale . ", maximum-scale=" . $maximum_scale . ", user-scalable=" . $user_scalable;

    $element = array(
      array(
        '#tag'        => 'meta',
        '#attributes' => array(
          'name'    => 'viewport',
          'content' => $content,
        ),
      ),
      'viewport',
    );
    $variables['#attached']['html_head'][] = $element;
  }

  // Add cleartype.
  $cleartype = theme_get_setting('fortytwo_admin_cleartype');
  if (!empty($cleartype)) {
    $element = array(
      array(
        '#tag'        => 'meta',
        '#attributes' => array(
          'name'    => 'http-equiv',
          'content' => 'on',
        ),
      ),
      'cleartype',
    );

    $variables['#attached']['html_head'][] = $element;
  }
}

/**
 * Implements hook_form_alter().
 */
function fortytwo_admin_form_alter(&$form, \Drupal\Core\Form\FormStateInterface $form_state, $form_id) {
  $style_login_form = theme_get_setting('fortytwo_admin_layout_login');
  if (!empty($style_login_form)) {
    switch ($form_id) {
      case 'user_login_form':
        $form['name']['#title_display'] = 'invisible';
        $form['name']['#attributes'] = array(
          'placeholder' => $form['name']['#title']->render(),
        );
        unset($form['name']['#description']);
        $form['pass']['#title_display'] = 'invisible';
        $form['pass']['#attributes'] = array(
          'placeholder' => $form['pass']['#title']->render(),
        );
        unset($form['pass']['#description']);
        break;

      case 'user_pass':
        $form['mail']['#prefix'] = '<p class="description">';

        $form['name']['#title_display'] = 'invisible';
        $form['name']['#attributes'] = array(
          'placeholder' => $form['name']['#title']->render(),
        );
        break;

      case 'user_register_form':
        $form['account']['name']['#title_display'] = 'invisible';
        $form['account']['name']['#attributes'] = array(
          'placeholder' => $form['account']['name']['#title']->render(),
        );

        $form['account']['mail']['#title_display'] = 'invisible';
        $form['account']['mail']['#attributes'] = array(
          'placeholder' => $form['account']['mail']['#title']->render(),
        );

        break;
    }
  }
}
