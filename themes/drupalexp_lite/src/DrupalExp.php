<?php

namespace Drupal\drupalexp_lite;

use \Drupal\Core\Render\Element;
use \Symfony\Component\Yaml\Yaml;
use \Drupal\Component\Utility\Html;

class DrupalExp extends \stdClass {

  protected $theme;
  protected $page;
  protected $settings;

  public function __construct($theme_name = null) {
    if ($theme_name == null) {
      $this->theme = \Drupal::theme()->getActiveTheme();
    }
    else {
      $this->theme = \Drupal::service('theme.initialization')->getActiveThemeByName($theme_name);
    }
  }

  /**
   * 
   * @return \Drupal\drupalexp\DrupalExp
   */
  public static function get(&$page = null) {
    $drupal_static = &drupal_static(__CLASS__ . __FUNCTION__);
    $theme_name = \Drupal::theme()->getActiveTheme()->getName();
    if (!isset($drupal_static[$theme_name])) {
      $drupal_static[$theme_name] = new DrupalExp();
    }
    if ($page) {
      $drupal_static[$theme_name]->setPage($page);
    }
    return $drupal_static[$theme_name];
  }

  /**
   * 
   * @param type $page
   */
  public function setPage(&$page) {
    $this->page = $page;
  }

  /**
   * 
   * @return type
   */
  public function getTheme() {
    return $this->theme;
  }

  /**
   * 
   * @return all layouts
   */
  public function getLayouts() {
    $drupal_static = &drupal_static(__CLASS__ . __FUNCTION__);
    if (!isset($drupal_static)) {
      $layoutStr = $this->getSetting('drupalexp_layouts');
      $drupal_static = $this->adjustRegions(json_decode($layoutStr));
    }
    return $drupal_static;
  }

  /**
   * $return active layout
   */
  public function getActiveLayout() {
    $return = &drupal_static(__CLASS__ . __FUNCTION__);
    if (!isset($return)) {
      $return = $this->getLayouts()[0];
      $path = \Drupal::service('path.current')->getPath();
      $alias = \Drupal::service('path.alias_manager')->getAliasByPath($path);
      foreach ($this->getLayouts() as $layout) {
        if (isset($layout->pages) && $layout->pages && (\Drupal::service('path.matcher')->matchPath($path, $layout->pages) || \Drupal::service('path.matcher')->matchPath($alias, $layout->pages))) {
          $return = $layout;
          break;
        }
        if (isset($layout->isdefault) && $layout->isdefault) {
          $return = $layout;
        }
      }
    }
    return $return;
  }

  /**
   * Update regions
   */
  private function adjustRegions($layouts) {
    //Add new region
    //Init default layouts
    if (empty($layouts)) {
      $layouts = [
        (object) [
          'key' => 'default',
          'title' => 'Default',
          'sections' => [
            (object) [
              'key' => 'unassigned',
              'title' => 'Unassigned',
              'regions' => []
            ]
          ],
        ]
      ];
    }
    $theme_regions = system_region_list($this->theme->getName());
    foreach ($theme_regions as $region_key => $regionObj) {
      foreach ($layouts as $layout) {
        $region_exists = false;
        $unassigned_section = null;
        foreach ($layout->sections as $section_index => $section) {
          if ($section->key == 'unassigned') {
            $unassigned_section = $section_index;
          }
          foreach ($section->regions as $region) {
            if ($region_key == $region->key) {
              $region_exists = true;
              $region->title = $regionObj->__toString();
            }
          }
        }
        if ($unassigned_section === null) {
          $newsection = new \stdClass();
          $newsection->key = 'unassigned';
          $newsection->title = 'Unassigned';
          $layout->sections[] = $newsection;
        }
        if (!$region_exists) {
          $newregion = new \stdClass();
          $newregion->key = $region_key;
          $newregion->title = $regionObj->__toString();
          $newregion->colxs = 6;
          $newregion->colsm = 6;
          $newregion->colmd = 6;
          $newregion->collg = 6;
          $layout->sections[$unassigned_section]->regions[] = $newregion;
        }
      }
    }
    //Remove regions
    foreach ($layouts as $layout) {
      foreach ($layout->sections as &$section) {
        foreach ($section->regions as $index => $region) {
          if (!in_array($region->key, $this->theme->getRegions())) {
            unset($section->regions[$index]);
          }
        }
        $section->regions = array_values($section->regions);
      }
    }

    return $layouts;
  }

  /**
   * 
   * @return type
   */
  public function render() {
    $content = [];
    foreach ($this->getActiveLayout()->sections as $section) {
      if ($section_content = $this->sectionRender($section)) {
        $content[] = $section_content;
      }
    }
    return $content;
  }

  /**
   * 
   * @param type $section
   * @return type
   */
  public function sectionRender($section) {
    if (empty($section->regions) || $section->key == 'unassigned') {
      return [];
    }
    $section_content = [];
    foreach ($section->regions as $region) {
      $region_out = $this->regionRender($region);
      if (!empty($region_out)) {
        $section_content[] = $region_out;
      }
    }
    return [
      '#theme' => 'section',
      '#content' => $section_content,
      '#section' => $section,
    ];
  }

  /**
   * 
   * @param type $region
   * @return type
   */
  public function regionRender($region) {
    $return = $this->page['page'][$region->key];
    return empty($return) ? null : $return; // $this->page['page'][$region->key];
  }

  /**
   * 
   * @param type $setting_name
   * @param type $theme
   * @depth type booland
   * @return setting value
   */
  public function getSetting($setting_name, $default = NULL, $theme = NULL, $depth = TRUE) {
    if ($theme === NULL) {
      $theme = $this->theme->getName();
    }
    $setting_value = theme_get_setting($setting_name, $theme);
    if ($setting_value === NULL && $depth) {
      $baseThemes = $this->theme->getBaseThemes();
      foreach ($baseThemes as $baseTheme) {
        $setting_value = $this->getSetting($setting_name, NULL, $baseTheme->getName(), FALSE);
        if ($setting_value != NULL)
          break;
      }
    }
    return $setting_value === NULL ? $default : $setting_value;
  }

  /**
   * 
   * @param type $key
   * @param type $dethp
   * @return type
   */
  public function getInfo($key = NULL) {
    $info = Yaml::parse(file_get_contents($this->theme->getExtension()->getPathname()));
    if ($key == NULL) {
      return $info;
    }
    elseif (isset($info[$key])) {
      return $info[$key];
    }
    else {
      foreach ($this->theme->getBaseThemes() as $base_theme) {
        $base_info = Yaml::parse(file_get_contents($base_theme->getExtension()->getPathname()));
        if (isset($base_info[$key])) {
          return $base_info[$key];
        }
      }
      return [];
    }
  }

  /**
   * 
   * @param type $region_key
   * @return boolean
   */
  public function getRegionByKey($region_key) {
    $layout = $this->getActiveLayout();
    foreach ($layout->sections as $section) {
      foreach ($section->regions as $region) {
        if ($region->key == $region_key) {
          return $region;
        }
      }
    }
    return FALSE;
  }

}
