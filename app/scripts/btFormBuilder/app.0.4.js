(function () {

  'use strict';

  /**
   * Required modules
   */
  angular.module('btFormBuilder', ['btFormBuilderGenerator', 'btFormBuilderReader', 'btFormBuilderElements']);
  angular.module('btFormBuilderGenerator', ['btFormBuilderGeneratorTemplates']);
  angular.module('btFormBuilderReader', []);
  angular.module('btFormBuilderElements', ['btFormBuilderElementTemplates', 'ui.bootstrap']);
  angular.module('btFormBuilderElementTemplates', []);

  /**
   * Cache templates
   */
  angular
    .module('btFormBuilderElementTemplates', [])
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('templates/btfbElement.html', btfbElementTemplate());
      $templateCache.put('templates/btfbElementText.html', btfbElementTextTemplate());
      $templateCache.put('templates/btfbElementTextarea.html', btfbElementTextareaTemplate());
      $templateCache.put('templates/btfbElementSelect.html', btfbElementSelectTemplate());
      $templateCache.put('templates/btfbElementDatepicker.html', btfbElementDatepickerTemplate());
      $templateCache.put('templates/btfbElementCheckbox.html', btfbElementCheckboxTemplate());
      $templateCache.put('templates/btfbElementPassword.html', btfbElementPasswordTemplate());
      $templateCache.put('templates/btfbElementRadio.html', btfbElementRadioTemplate());
      $templateCache.put('templates/btfbElementButton.html', btfbElementButtonTemplate());
      $templateCache.put('templates/btfbToggleView.html', btfbToggleViewTemplate());
    }]);

  angular
    .module('btFormBuilderGeneratorTemplates', [])
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('templates/btfbConfigerGroup.html', btfbConfigerGroupTemplate());
      $templateCache.put('templates/btfbConfigerFieldset.html', btfbConfigerFieldsetTemplate());
      $templateCache.put('templates/btfbConfigerElement.html', btfbConfigerElementTemplate());
    }]);

  /**
   * btFormBuilderGenerator Directives
   */
    // Main generator form
  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderForm', function () {
      return {
        restrict: 'A',
        controller: function ($scope, $timeout) {


          $scope.data = {
            settings : {
              name : 'Danny'
            }
          }



          $scope.doSomething = function (toggle) {

            console.log(1);
            $scope[toggle] = true;

          };

          $scope.alpha = false;

          $scope.generator = {
            config: {
              field_types: [
                {
                  type: 'text',
                  label: 'Text'
                },
                {
                  type: 'textarea',
                  label: 'Textarea'
                },
                {
                  type: 'select',
                  label: 'Select'
                },
                {
                  type: 'Checkbox',
                  label: 'checkbox'
                },
                {
                  type: 'Password',
                  label: 'password'
                },
                {
                  type: 'Date',
                  label: 'datepicker'
                },
                {
                  type: 'Radio',
                  label: 'radio'
                }
              ]
            },
            settings : {
              // TODO: Client list
              // Form name
              fields : [
                {
                  group: 'element',
                  type: 'text',
                  name: 'form-name',
                  label: $scope.data.settings.name,
                  display_label: true,
                  required: true,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. Witness Statement',
                  help_text: 'Visible to clients, as a link to this form template.',
                  value: $scope.data.settings.name,
                  on_change: $scope.doSomething,
                  trim: true,
                  disabled: false,
                  flag: null
                },
                // TODO: Form identifier
                // Intro text
                {
                  group: 'element',
                  type: 'textarea',
                  name: 'intro',
                  label: 'Introduction / Summary Text',
                  display_label: true,
                  required: false,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. The following form must be completed by the arresting officer.',
                  help_text: 'Introduction or summary text to be seen at the top of the form.',
                  value: '',
                  on_change: null,
                  trim: true,
                  disabled: false,
                  flag: null
                },
                // Save button
                {
                  group: 'element',
                  type: 'text',
                  name: 'submit-btn',
                  label: 'Submit button text',
                  display_label: true,
                  required: true,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. Save',
                  help_text: null,
                  value: '',
                  on_change: null,
                  trim: true,
                  disabled: false,
                  flag: null
                },
                // Cancel button
                {
                  group: 'element',
                  type: 'text',
                  name: 'cancel-btn',
                  label: 'Cancel button text',
                  display_label: true,
                  required: true,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. Reset',
                  help_text: null,
                  value: '',
                  on_change: null,
                  trim: true,
                  disabled: false,
                  flag: null
                },
                // Success message
                {
                  group: 'element',
                  type: 'textarea',
                  name: 'success-msg',
                  label: 'Success message',
                  display_label: true,
                  required: true,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. Thank you. Your form has been submitted.',
                  help_text: null,
                  value: '',
                  on_change: null,
                  trim: true,
                  disabled: false,
                  flag: null
                },
                // Error message
                {
                  group: 'element',
                  type: 'textarea',
                  name: 'error-msg',
                  label: 'Error message',
                  display_label: true,
                  required: true,
                  min_length: null,
                  display_min_length: null,
                  max_length: null,
                  display_max_length: null,
                  display_dynamic_character_count: false,
                  validation_pattern: null,
                  placeholder: 'e.g. Sorry we were unable to save your details.',
                  help_text: null,
                  value: '',
                  on_change: null,
                  trim: true,
                  disabled: false,
                  flag: null
                }
              ]
            },
            configuration : {
              sections : [
                {
                  group: 'fieldset'
                }
              ]
            }
          };

        }
      }
    });

  /**
   * btFormBuilderGenerator Filters
   */
  angular
    .module('btFormBuilderGenerator')
    .filter('normaliseForJs', function () {
      return function (value) {
        var result = '';
        if (value && value.length) {
          result = value.replace(/[-@£$%^&\*\(\)\{\}\[\]'"\+=:;<>\?!\,\.\/\\]/g,' ');
          result = result.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
          result = (result.charAt(0).toLowerCase() + result.substr(1)).replace(/[\s-]/g,'');
        }
        return result;
      }
    });


  angular
    .module('btFormBuilderReader')
    .directive('btfbElement', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/btfbElement.html'
      }
    });

  angular
    .module('btFormBuilderReader')
    .directive('btfbElementField', function ($compile, $templateCache, $q) {
      var getTemplateContents = function (type) {
        var deferred = $q.defer(),
          templates = {
            'default': 'templates/btfbElementText.html',
            'text': 'templates/btfbElementText.html',
            'textarea': 'templates/btfbElementTextarea.html',
            'select': 'templates/btfbElementSelect.html',
            'datepicker': 'templates/btfbElementDatepicker.html',
            'checkbox': 'templates/btfbElementCheckbox.html',
            'password': 'templates/btfbElementPassword.html',
            'radio': 'templates/btfbElementRadio.html',
            'button': 'templates/btfbElementButton.html'
          };
        deferred.resolve($templateCache.get(templates[type] || templates['default']));
        return deferred.promise;
      };
      return {
        restrict: 'A',
        replace: true,
        scope: {
          features : '='
        },
        compile: function (tElement, tAttrs) {
          return function (scope, iElement, iAttrs) {
            var template = getTemplateContents(scope.features.type)
              .then(function (response) {
                iElement.html(response);
                $compile(iElement.contents())(scope);
              });
          }
        }
      }
    });

  angular
    .module('btFormBuilderGenerator')
    .directive('btfbConfigerGroup', function ($templateCache) {
      return {
        restrict: 'A',
        replace: true,
        template: $templateCache.get('templates/btfbConfigerGroup.html'),
        controller : function ($scope) {

          $scope.add = function () {
            // TODO : disable the form button until form is valid, instead of...
            if (!$scope.configer.group.value || !$scope.configer.group.value.length) {
              return;
            }
            var obj = {
              group : $scope.configer.group.value
            };
            $scope.generator.configuration.sections.push(obj)
          };

          $scope.configer = {
            group : {
              group: 'element',
              type: 'radio',
              inline: true,
              name: 'group',
              label: 'Element type',
              display_label: true,
              required: true,
              value: 'element',
              options: [
                {
                  label: 'Element (input, select, textarea, etc)',
                  value: 'element'
                },
                {
                  label: 'Fieldset (a group of elements)',
                  value: 'fieldset'
                }
              ]
            },
            add : {
              group: 'element',
              type: 'button',
              name: 'add',
              label: 'Add',
              theme: 'primary',
              clicked: $scope.add
            }
          }

        }
      }
    });

  angular
    .module('btFormBuilderGenerator')
    .directive('btfbConfigerElement', function ($templateCache) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          features: '='
        },
        template: $templateCache.get('templates/btfbConfigerElement.html'),
        controller: function ($scope) {

          $scope.toggled = false;

        }
      }
    });

  angular
    .module('btFormBuilderGenerator')
    .directive('btfbConfigerFieldset', function ($templateCache) {
      return {
        restrict: 'A',
        replace: true,
        scope: {
          features: '='
        },
        template: $templateCache.get('templates/btfbConfigerFieldset.html'),
        controller: function ($scope) {

          $scope.toggled = false;

          $scope.fieldset = {
            visible : {
              group: 'element',
              type: 'checkbox',
              name: 'display-fieldset',
              label: 'Display fieldset',
              display_label: true,
              required: false,
              help_text: 'Display this fieldset to the user, or simply use for admin purposes.',
              value: ''
            },
            name : {
              group: 'element',
              type: 'text',
              name: 'label',
              label: 'Label',
              display_label: true,
              required: true,
              value: $scope.features.label
            }
          }

          $scope.fieldset.name.label = $scope.features.label;

        }
      }
    });

  angular
    .module('btFormBuilderReader')
    .directive('btfbToggleView', function ($templateCache) {
      return {
        restrict: 'A',
        replace: true,
        template: $templateCache.get('templates/btfbToggleView.html'),
        controller: function ($scope) {


          console.log($scope.toggled);


          $scope.toggle = function () {
            $scope.toggled = !$scope.toggled;
          }

        }
      }
    });












  /**
   * Directive templates
   */
  // Element wrapper
  function btfbElementTemplate () {
    var template = '' +
      '<div class="form-group has-feedback" data-ng-transclude></div>';
    return template;
  }

  // TODO: create ID filter
  // TODO: create ID filter and name filter
  // TODO: implement ng-maxlength
  // TODO: implement character count

  // Text input
  function btfbElementTextTemplate () {
    var template = '' +
      '<div><label for="features.id" data-ng-if="features.display_label">{{features.label}} <span class="required" data-ng-if="features.required">*</span></label>' +
      '<input class="form-control" id="features.id" name="{{features.name | normaliseForJs}}" data-required="features.required" data-ng-minlength="features.min_length" data-ng-pattern="features.validation_pattern" data-ng-trim="features.trim" data-ng-model="features.value" type="text" placeholder="{{features.placeholder}}" data-ng-disabled="features.disabled" data-ng-change="features.on_change()" />' +
      '<span class="help-block" data-ng-if="features.min_length && features.display_min_length">Minimum length: {{features.min_length}} characters</span>' +
      '<span class="help-block" data-ng-if="features.max_length && features.display_max_length">Maximum length: {{features.max_length}} characters</span>' +
      '<span class="help-block" data-ng-if="(features.min_length || features.max_length) && features.display_dynamic_character_count">Current character count: TODO characters</span>' +
      '<span class="help-block" data-ng-if="features.help_text">{{features.help_text}}</span></div>';
    return template;
  }

  // Textarea
  function btfbElementTextareaTemplate () {
    var template = '' +
      '<label for="features.id" data-ng-if="features.display_label">{{features.label}} <span class="required" data-ng-if="features.required">*</span></label>' +
      '<textarea class="form-control" id="features.id" name="{{features.name | normaliseForJs}}" data-required="features.required" data-ng-minlength="features.min_length" data-ng-maxlength="features.max_length" data-ng-pattern="features.validation_pattern" data-ng-change="features.on_change" data-ng-trim="features.trim" data-ng-model="features.value" placeholder="{{features.placeholder}}" data-ng-disabled="features.disabled"></textarea>';
    return template;
  }

  // Select
  function btfbElementSelectTemplate () {
    var template = '' +
      '<select class="form-control" data-ng-model="features.field_value" ' +
      'data-ng-options="option.option_label for option in features.field_options"' +
      '>' +
      '</select>';
    return template;
  }

  // Datepicker
  function btfbElementDatepickerTemplate () {
    var template = '' +
      '<p class="input-group">' +
      ' <input type="text" class="form-control" btfb-element-datepicker datepicker-popup="{{format}}" ng-model="dt" is-open="opened" min-date="minDate" max-date="\'2015-06-22\'" datepicker-options="dateOptions" date-disabled="disabled(date, mode)" ng-required="true" close-text="Close" />' +
      ' <span class="input-group-btn">' +
      '   <button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
      ' </span>' +
      '</p>';
    return template;
  }

  // Checkbox
  function btfbElementCheckboxTemplate () {
    var template = '' +
      '<div class="checkbox">' +
      ' <label for="{features.id}">' +
      '   <input type="checkbox" name="{{features.name}}" id="{{features.name}}" data-ng-model="features.value" data-ng-true-value="true" data-ng-false-value="false" value="{{option.value}}" data-ng-change="features.on_change()" />' +
      '   {{features.label}}' +
      ' </label>' +
      '</div>';
    return template;
  }

  // Radio
  function btfbElementRadioTemplate () {
    var template = '' +
      '<label for="features.id" data-ng-if="features.display_label">{{features.label}} <span class="required" data-ng-if="features.required">*</span></label><br />' +
      '<div ng-class="{ \'radio-inline\' : features.inline, \'radio\' : !features.inline }" data-ng-repeat="option in features.options">' +
      ' <label for="{{feature.name}}">' +
      '   <input type="radio" name="{{features.name}}" id="{{features.name}}" data-ng-model="features.value" data-ng-true-value="option.value" data-ng-false-value="" value="{{option.value}}" data-ng-change="features.on_change()" data-ng-checked="features.value === option.value" />' +
      '   {{option.label}}' +
      ' </label>' +
      '</div>';
    return template;
  }

  // Password input
  function btfbElementPasswordTemplate () {
    var template = '' +
        // TODO: create ID filter
      '<label for="features.id" data-ng-if="features.display_label">{{features.label}} ﻿<span class="required" data-ng-if="features.required">*</span></label>' +
        // TODO: create ID filter and name filter
      '<input class="form-control" id="features.id" name="features.name" data-required="features.required" data-ng-minlength="features.min_length" data-ng-maxlength="features.max_length" data-ng-pattern="features.validation_pattern" data-ng-change="features.on_change" type="password" data-ng-model="features.field_value" placeholder="{{features.placeholder}}" />' +
      '<span class="help-block" data-ng-if="features.min_length && features.display_min_length">Minimum length: {{features.min_length}} characters</span>' +
      '<span class="help-block" data-ng-if="features.max_length && features.display_max_length">Maximum length: {{features.max_length}} characters</span>' +
        // TODO: implement character count
      '<span class="help-block" data-ng-if="(features.min_length || features.max_length) && features.display_dynamic_character_count">Current character count: TODO characters</span>' +
      '<span class="help-block" data-ng-if="features.help_text">{{features.help_text}}</span>';
    return template;
  }

  // Button
  function btfbElementButtonTemplate () {
    var template = '' +
      '<button data-ng-disabled="features.disabled" data-ng-click="features.clicked()" name="features.name" id="features.id" class="btn btn-{{features.theme}}">{{features.label}}</button>';
    return template;
  }

  // Field group generator
  function btfbConfigerGroupTemplate () {
    var template = '' +
      '<div class="well white">' +
      ' <div btfb-element-field data-features="configer.group"></div>' +
        //' <div btfb-element-field data-features="configer.name"></div>' +
      ' <div btfb-element-field data-features="configer.add"></div>' +
      '</div>';
    return template;
  }

  // Field fieldset generator
  function btfbConfigerFieldsetTemplate () {
    var template = '' +
      '<div class="well">' +
      ' <div btfb-toggle-view></div>' +
      ' {{features.label}}' +
      '<input type="text" ng-model="features.label" />' +
      ' <div data-ng-show="toggled">' +
      '   <div btfb-element-field data-features="fieldset.name"></div>' +
      '   <div btfb-element-field data-features="fieldset.visible"></div>' +
      ' </div>' +
      '</div>';
    return template;
  }

  // Field element generator
  function btfbConfigerElementTemplate () {
    var template = '' +
      '<div class="well">' +
      ' <div btfb-toggle-view></div>' +
      ' {{features.label}}' +
      ' <div data-ng-show="toggled">Hello</div>' +
      ' <div btfb-element-field data-features="configer.group"></div>' +
        //' <div btfb-element-field data-features="configer.name"></div>' +
        //' <div btfb-element-field data-features="configer.add"></div>' +
      '</div>';
    return template;
  }

  // Toggle view switch
  function btfbToggleViewTemplate () {
    var template = '' +
      '<div class="pull-right pointer"><i data-ng-if="!toggled" class="glyphicon glyphicon-chevron-down" data-ng-click="toggle()"></i><i data-ng-if="toggled" class="glyphicon glyphicon-chevron-up" data-ng-click="toggle()"></i></div>';
    return template;
  }

})();
