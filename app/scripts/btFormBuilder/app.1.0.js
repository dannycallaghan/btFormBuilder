(function () {

  'use strict';

  angular.module('btFormBuilder', ['btFormBuilderGenerator', 'btFormBuilderReader', 'btFormBuilderElements', 'ui.bootstrap']);
  angular.module('btFormBuilderGenerator', ['btUtils']);
  angular.module('btFormBuilderReader', []);
  angular.module('btFormBuilderElements', ['btFormBuilderElementTemplates']);
  angular.module('btFormBuilderElementTemplates', []);
  angular.module('btUtils', []);

  angular
    .module('btFormBuilderElementTemplates')
    .run(['$templateCache', function ($templateCache) {
      $templateCache.put('templates/btFormBuilderElementText.html', btFormBuilderElementTextTemplate());
      $templateCache.put('templates/btFormBuilderElementRadio.html', btFormBuilderElementRadioTemplate());
      $templateCache.put('templates/btFormBuilderElementSelect.html', btFormBuilderElementSelectTemplate());
      $templateCache.put('templates/btFormBuilderElementCheckbox.html', btFormBuilderElementCheckboxTemplate());
      $templateCache.put('templates/btFormBuilderElementDatepicker.html', btFormBuilderElementDatepickerTemplate());
      $templateCache.put('templates/btFormBuilderElementTextarea.html', btFormBuilderElementTextareaTemplate());
      $templateCache.put('templates/btFormBuilderToggleView.html', btFormBuilderToggleViewTemplate());
    }]);

  angular
    .module('btFormBuilderElementTemplates')
    .factory('btFormBuilderElementTemplateService', function ($q, $templateCache) {
      return {
        get : get
      };
      function get(type) {
        var deferred = $q.defer(),
          templates = {
            'default': 'templates/btFormBuilderElementText.html',
            'text': 'templates/btFormBuilderElementText.html',
            'radio': 'templates/btFormBuilderElementRadio.html',
            'select': 'templates/btFormBuilderElementSelect.html',
            'checkbox': 'templates/btFormBuilderElementCheckbox.html',
            'datepicker': 'templates/btFormBuilderElementDatepicker.html',
            'textarea': 'templates/btFormBuilderElementTextarea.html'
          };
        deferred.resolve($templateCache.get(templates[type] || templates['default']));
        return deferred.promise;
      }
    });

  angular
    .module('btUtils')
    .factory('utils', function () {
      return {
        generateGuid : generateGuid
      }
      function generateGuid () {
        var s = [],
          hexDigits = "0123456789abcdef",
          i;
        for (i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];
        return s.join("");
      }
    });

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderGeneratorToggleView', function ($templateCache) {
      return {
        restrict: 'A',
        replace: true,
        template: $templateCache.get('templates/btFormBuilderToggleView.html'),
        controller: function ($scope) {
          $scope.toggle = function () {
            $scope.toggled = !$scope.toggled;
          }
        }
      }
    });

  angular
    .module('btFormBuilder')
    .factory('btFormBuilderDataService', function () {
      var data, builder, elementTemplate, savedForm;
      data = {
        details: {
          submit : 'Send',
          cancel : 'Cancel',
          success : 'Thank you. Your form has been submitted.',
          error : 'Sorry, we could not submit your form.',
          name: ''
        },
        elements: []
        //elements: [
        //  {
        //    elementType: "field",
        //    guid: "f207ddffba7d9b4b27b8715bab463ad4eaae",
        //    name: "Test 1",
        //    type: "select",
        //    options: [
        //      {
        //        label : 'Alpha',
        //        value : 'alpha'
        //      }
        //    ]
        //  }
        //]
      };
      builder = {
        element : {
          type : 'element'
        }
      };
      return {
        data : data,
        builder : builder,
        //savedForm : savedForm,
        getSavedForm : getSavedForm,
        setSavedForm : setSavedForm
      };
      function getSavedForm () {
        return savedForm;
      }
      function setSavedForm () {
        savedForm = angular.copy(data);
      }
    });

  angular
    .module('btFormBuilderGenerator')
    .factory('btFormBuilderGeneratorTabsService', function () {
      var tabs;
      return {
        getTabs : getTabs,
        tab : tab
      };
      function getTabs () {
        tabs = [
          { title:'Settings'},
          { title:'Form Elements', disabled: true },
          { title:'Layout', disabled: true },
          { title:'Preview', disabled: true }
        ];
        return tabs;
      }
      function tab (index, property, value) {
        tabs[index][property] = value;
      }
    });

  angular
    .module('btFormBuilderReader')
    .directive('btFormBuilderReaderForm', ['btFormBuilderDataService', function (btFormBuilderDataService) {
      return {
        restrict: 'A',
        controllerAs: 'reader',
        controller: function ($scope) {
          var reader = this;
          $scope.$on('formSaved', function (event, data) {
            reader.form = btFormBuilderDataService.getSavedForm();
          });
        }
      }
    }]);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderGeneratorForm', ['btFormBuilderDataService', 'btFormBuilderGeneratorTabsService', function (btFormBuilderDataService, btFormBuilderGeneratorTabsService) {
      return {
        restrict: 'A',
        controllerAs: 'form',
        controller: function ($scope) {
          var form = this;
          form.data = btFormBuilderDataService.data;
          form.savedForm = btFormBuilderDataService.getSavedForm();
          form.builder = btFormBuilderDataService.builder;
          form.tabs = btFormBuilderGeneratorTabsService.getTabs();
          form.selectTab = function (index) {
            btFormBuilderGeneratorTabsService.tab(index, 'active', true);
          };
          $scope.$watch('form.data.details.name', function (newValue, oldValue) {
            btFormBuilderGeneratorTabsService.tab(1, 'disabled', (!newValue || !newValue.length ? true : false));
          });
          $scope.$watch('form.data.elements.length', function (newValue, oldValue) {
            if (newValue !== oldValue) {
              btFormBuilderGeneratorTabsService.tab(2, 'disabled', (newValue < 2 ? true : false));
            }
          });
        },
        compile: function (tElement, tAttrs) {
          return {
            post: function (scope, iElement, iAttrs, form) {
              form.showJSON = function () {
                alert(JSON.stringify(form.data));
              };
              form.saveForPreview = function () {

                btFormBuilderDataService.setSavedForm();

                //form.savedForm = angular.copy(form.data);
                form.selectTab(3);
                scope.$broadcast('formSaved');
                //alert(JSON.stringify(btFormBuilderDataService.getSavedForm()));
              };
            }
          }
        }
      }
    }]);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderCreateElement', ['utils', 'btFormBuilderDataService', function (utils, btFormBuilderDataService) {
      return {
        restrict: 'A',
        controllerAs: 'create',
        controller: function () {
          var create = this,
            element;
          create.createElement = createElement;
          create.reset = reset;
          create.data = {
            elementType : 'field'
          };
          function createElement () {
            // TODO: Want this to be a template in the btFormBuilderDataService service, but can't find a good deep copy/extend solution yet
            var element = {},
              guid = utils.generateGuid();
            element[guid] = {
              elementType : create.data.elementType,
              name: create.data.name,
              type: 'text',
              value: '',
              options: [
                {
                  label : ''
                }
              ]
            };
            btFormBuilderDataService.data.elements.push(element);
            create.reset();
          }
          function reset () {
            create.data = {
              elementType : 'field'
            };
            create['form-builder-create-element'].$setPristine();
          }
        }
      }
    }]);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderConfigElement', [function () {
      return {
        restrict: 'A',
        controllerAs: 'config',
        controller: function () {
          var config = this;
        }
      }
    }]);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderConfigFieldset', [function () {
      return {
        restrict: 'A',
        controllerAs: 'fieldset',
        controller: function () {
          var fieldset = this;
        }
      }
    }]);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderConfigField', ['btFormBuilderDataService', function (btFormBuilderDataService) {
      return {
        restrict: 'A',
        controllerAs: 'field',
        controller: function () {
          var field = this;
          field.types = [
            {
              value : 'text',
              label : 'Text box'
            },
            {
              value : 'textarea',
              label : 'Textarea (large text box)'
            },
            {
              value : 'select',
              label : 'Select (a.k.a. dropdown)'
            },
            {
              value : 'datepicker',
              label : 'Date'
            }
          ];
          field.addOption = function (element) {
            var option = {
              value : '',
              label : ''
            }
            element.options.push(option);
          };
          field.removeOption = function (element, option) {
            var index = element.options.indexOf(option);
            if (index !== -1) {
              if (element.defaultValue === option.value) {
                delete element.defaultValue;
              }
              element.options.splice(element.options.indexOf(option), 1);
            }
          };
          field.setDefaultValue = function (element, option) {
            element.defaultValue = option.defaultValue ? option.value : '';
          }
        }
      }
    }]);

  angular
    .module('btFormBuilderElements')
    .directive('btFormBuilderElement', ['$compile', '$templateCache', '$q', '$parse', 'btFormBuilderElementTemplateService', function ($compile, $templateCache, $q, $parse, btFormBuilderElementTemplateService) {
      return {
        restrict: 'A',
        replace: true,
        scope : {
          ngModel : '='
        },
        controller : function ($scope) {
          // TODO: Sort all this datepicker stuff out
          $scope.clear = function () {
            $scope.dt = null;
          };
          $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
          };
          $scope.datePicker = {
            dateOptions : {
              formatYear: 'yy',
              startingDay: 1,
              showWeeks: false,
              defaultDate: '31/10/2014'
            }
          };
        },
        compile: function (tElement, tAttrs) {
          return {
            post: function (scope, iElement, iAttrs) {
              var type = iAttrs.type;
              scope.element = {
                label : iAttrs.label,
                required: iAttrs.isRequired && iAttrs.isRequired === 'true' ? true : false,
                inline: iAttrs.inline && iAttrs.inline === 'false' ? false : true,
                placeholder: iAttrs.placeholder || '',
                id: iAttrs.id,
                displayLabel: iAttrs.displayLabel && iAttrs.displayLabel === 'false' ? false : true,
                options: iAttrs.options ? $parse(iAttrs.options)(scope) : [],
                model: iAttrs.model,
                help: iAttrs.help,
                prompt: iAttrs.prompt
              };
              // TODO: Review this. Hate it.
              if (type === 'text') {
                iAttrs.$observe('isRequired', function (newValue, oldValue) {
                  if (newValue !== oldValue) {
                    scope.element.required = iAttrs.isRequired && iAttrs.isRequired === 'true' ? true : false
                  }
                });
              }
              var template = btFormBuilderElementTemplateService.get(type)
                .then(function (response) {
                  iElement.html(response);
                  $compile(iElement.contents())(scope);
                });
            }
          }
        }
      }
    }]);

  // input[type=text]
  function btFormBuilderElementTextTemplate () {
    var template = '' +
      '<div class="form-group has-feedback">' +
      ' <label for="{{::element.id}}" data-ng-if="element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span></label>' +
      ' <input class="form-control"' +
      '   type="text"' +
      '   value="hello"' +
      '   id="{{::element.id}}"' +
      '   placeholder="{{element.placeholder}}"' +
      '   data-ng-required="element.required"' +
      '   data-ng-model="ngModel[element.model]"' +
      ' />' +
      ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
      ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
      '</div>';
    return template;
  }

  // textarea
  function btFormBuilderElementTextareaTemplate () {
    var template = '' +
      '<div class="form-group has-feedback">' +
      ' <label for="{{::element.id}}" data-ng-if="element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span></label>' +
      ' <textarea class="form-control"' +
      '   id="{{::element.id}}"' +
      '   placeholder="{{element.placeholder}}"' +
      '   data-ng-required="element.required"' +
      '   data-ng-model="ngModel[element.model]"' +
      ' />' +
      ' </textarea>' +
      ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
      ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
      '</div>';
    return template;
  }

  // input[type=radio]
  function btFormBuilderElementRadioTemplate () {
    var template = '' +
      '<div class="form-group has-feedback">' +
      ' <label for="{{::element.id}}" class="radio-label" data-ng-if="::element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span></label>' +
      ' <div ng-class="{ \'radio-inline\' : element.inline, \'radio\' : !element.inline }" data-ng-repeat="choice in ::element.options">' +
      '   <label>' +
      '     <input' +
      '       id="{{::element.id}}"' +
      '       type="radio"' +
      '       value="{{::choice.value}}"' +
      '       data-ng-required="element.required"' +
      '       data-ng-model="ngModel[element.model]"' +
      '       data-ng-checked="ngModel[element.model] === choice.value" ' +
      '     />' +
      '     {{::choice.label}}' +
      '   </label>' +
      ' </div>';
    ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
    ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
    '</div>';
    return template;
  }

  // select
  function btFormBuilderElementSelectTemplate () {
    var template = '' +
      '<div class="form-group has-feedback">' +
      ' <label for="{{::element.id}}" class="radio-label" data-ng-if="::element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span></label>' +
      '  <select class="form-control"' +
      '   id="{{::element.id}}"' +
      '   data-ng-required="element.required"' +
      '   data-ng-model="ngModel[element.model]"' +
      '   data-ng-options="choice.label as choice.label for choice in ::element.options"' +
      '   >' +
      '     <option data-ng-if="element.prompt" value="">{{::element.prompt}}</option>' +
      ' </select>';
    ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
    ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
    '</div>';
    return template;
  }

  // input[type=checkbox]
  function btFormBuilderElementCheckboxTemplate () {
    var template = '' +
      '<div class="form-group checkbox">' +
      ' <label for="{{::element.id}}" class="radio-label" data-ng-if="::element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span>' +
      '     <input' +
      '       id="{{::element.id}}"' +
      '       type="checkbox"' +
      '       data-ng-required="element.required"' +
      '       data-ng-model="ngModel[element.model]"' +
      '     />' +
      '     {{::choice.label}}' +
      ' </label>' +
      ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
      ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
      '</div>';
    return template;
  }

  // Datepicker
  function btFormBuilderElementDatepickerTemplate () {
    var template = '' +
      '<div class="form-group">' +
      ' <label for="{{::element.id}}" class="radio-label" data-ng-if="::element.label && element.displayLabel">{{::element.label}} <span data-ng-if="element.required" class="required">*</span>' +
      ' <p class="input-group">' +
        // TODO: Sort all this datepicker stuff out
      '   <input type="text" class="form-control" btfb-element-datepicker ' +
      '     data-datepicker-popup="dd/MM/yyyy" ' +
      '     data-ng-required="element.required"' +
      '     data-ng-model="ngModel[element.model]"' +
      '     data-datepicker-options="datePicker.dateOptions" ' +
      '     placeholder="{{element.placeholder}}"' +
      '     data-is-open="opened"' +
      '   />' +
      '   <span class="input-group-btn">' +
      '     <button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>' +
      '   </span>' +
      ' </p>' +
      ' <span class="help-block" data-ng-if="::element.help">{{::element.help}}</span>' +
      ' <span class="glyphicon glyphicon-remove form-control-feedback"></span>' +
      '</div>';
    return template;
  }

  // Toggle view switch
  function btFormBuilderToggleViewTemplate () {
    var template = '' +
      '<div class="pull-right pointer"><i data-ng-if="!toggled" class="glyphicon glyphicon-chevron-down" data-ng-click="toggle()"></i><i data-ng-if="toggled" class="glyphicon glyphicon-chevron-up" data-ng-click="toggle()"></i></div>';
    return template;
  }

})();
