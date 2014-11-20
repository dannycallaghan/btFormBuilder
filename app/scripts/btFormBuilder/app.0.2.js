(function () {

  'use strict';

  /**
   * Required modules
   */
  angular.module('btFormBuilder', ['btFormBuilderGenerator', 'btFormBuilderReader', 'btFormBuilderElements']);
  angular.module('btFormBuilderGenerator', []);
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
        controllerAs: 'form',
        controller: function () {

          var form = this;

          form.doSomething = function () {

            console.log(1);

          };

          form.hello = 'World';


          form.generator = {
            config : {
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
                }
              ]
            },
            settings : {
              // TODO: Client list
              // Form name
              fields : [
                {
                  type: 'text',
                  name: 'form-name',
                  label: 'Form display name',
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
                  value: 'Foo',
                  on_change: form.doSomething,
                  trim: true,
                  disabled: false
                }/*,
                 // TODO: Form identifier
                 // Intro text
                 {
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
                 on_change: form.doSomething,
                 trim: true,
                 disabled: false
                 },
                 // Save button
                 {
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
                 on_change: form.doSomething,
                 trim: true,
                 disabled: false
                 },
                 // Cancel button
                 {
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
                 on_change: form.doSomething,
                 trim: true,
                 disabled: false
                 },
                 // Success message
                 {
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
                 on_change: form.doSomething,
                 trim: true,
                 disabled: false
                 },
                 // Error message
                 {
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
                 on_change: form.doSomething,
                 trim: true,
                 disabled: false
                 }
                 */
              ]
            },
            configuration : {

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

  /**
   * btFormBuilderElements Directives
   */
    // Element/wrapper
  angular
    .module('btFormBuilderGenerator')
    .directive('btfbElement', function () {
      return {
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: 'templates/btfbElement.html'
      }
    });

  // Form field
  angular
    .module('btFormBuilderGenerator')
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
            'password': 'templates/btfbElementPassword.html'
          };
        deferred.resolve($templateCache.get(templates[type] || templates['default']));
        return deferred.promise;
      };
      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'template.html',
        scope: {
          features : '='
        },
        controller: function ($scope) {

          console.log($scope.features);

        }
      }
    });

  angular
    .module('btFormBuilderElements')
    .directive('btfbElementDatepicker', function () {
      return {
        restrict: 'A',
        controller: function ($scope) {

          $scope.today = function() {
            $scope.dt = new Date();
          };

          $scope.today();

          $scope.clear = function () {
            $scope.dt = null;
          };

          $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
          };

          $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
          };

          $scope.toggleMin();

          $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
          };

          $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          $scope.format = $scope.formats[0];

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

  // Text input
  function btfbElementTextTemplate () {
    var template = '' +
        // TODO: create ID filter
      '<div><label for="features.id" data-ng-if="features.display_label">{{features.label}} <span class="required" data-ng-if="features.required">*</span></label>' +
        // TODO: create ID filter and name filter
      '<input class="form-control" id="features.id" name="{{features.name | normaliseForJs}}" data-required="features.required" data-ng-minlength="features.min_length" data-ng-maxlength="features.max_length" data-ng-pattern="features.validation_pattern"  data-ng-trim="features.trim" data-ng-model="features.value" type="text" placeholder="{{features.placeholder}}" data-ng-disabled="features.disabled" ng-change="features.on_change()" />' +
      '<span class="help-block" data-ng-if="features.min_length && features.display_min_length">Minimum length: {{features.min_length}} characters</span>' +
      '<span class="help-block" data-ng-if="features.max_length && features.display_max_length">Maximum length: {{features.max_length}} characters</span>' +
        // TODO: implement character count
      '<span class="help-block" data-ng-if="(features.min_length || features.max_length) && features.display_dynamic_character_count">Current character count: TODO characters</span>' +
      '<span class="help-block" data-ng-if="features.help_text">{{features.help_text}}</span></div>';
    return template;
  }

  // Textarea
  function btfbElementTextareaTemplate () {
    var template = '' +
        // TODO: create ID filter
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
      '<input class="form-control" type="checkbox" data-ng-model="features.value" data-ng-change="features.on_change()" />';
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

})();
