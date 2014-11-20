(function () {

  'use strict';

  angular.module('btFormBuilder', ['btFormBuilderGenerator', 'btFormBuilderReader', 'btFormBuilderElements', 'ui.bootstrap']);
  angular.module('btFormBuilderGenerator', ['btUtils', 'gridster']);
  angular.module('btFormBuilderReader', []);
  angular.module('btFormBuilderElements', ['btFormBuilderElementTemplates']);
  angular.module('btFormBuilderElementTemplates', []);
  angular.module('btUtils', []);

  angular
    .module('btFormBuilderGenerator')
    .directive('btFormBuilderLayout', [function () {
      return {
        restrict: 'A',
        controller: function ($scope) {

          $scope.gridsterOpts = {
            columns: 2, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 100, // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [20, 20], // the pixel distance between each widget
            outerMargin: false, // whether margins apply to outer edges of the grid
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // the minimum columns the grid must have
            minRows: 2, // the minimum height of the grid, in rows
            maxRows: 100,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            resizable: {
              enabled: true,
              handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
              //start: function(event, $element, widget) {}, // optional callback fired when resize is started,
              //resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
              //stop: function(event, $element, widget) { alert(JSON.stringify($scope.standardItems)); } // optional callback fired when item is finished resizing
            },
            draggable: {
              enabled: true, // whether dragging items is supported
              handle: '.my-class', // optional selector for resize handle
              //start: function(event, $element, widget) {}, // optional callback fired when drag is started,
              //drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
              //stop: function(event, $element, widget) { alert(JSON.stringify($scope.standardItems)); } // optional callback fired when item is finished dragging
            }
          };

          $scope.$watch('standardItems', function(newItems, oldItems){

            console.log('changed');


            // one of the items changed
          }, true);

          // these map directly to gridsterItem options
          $scope.standardItems = [
            {
              sizeX: 2,
              sizeY: 1,
              row: 0,
              col: 0
            },
            {
              sizeX: 2,
              sizeY: 1,
              row: 0,
              col: 0
            }
          ];

        }
      }
    }]);

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
    .factory('btFormBuilderElementTemplateService', ['$q', '$templateCache', function ($q, $templateCache) {
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
    }]);

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
      var data, builder, elementTemplate, savedForm, fieldTypes;
      //data = {
      //  details: {
      //    submit : 'Send',
      //    cancel : 'Cancel',
      //    success : 'Thank you. Your form has been submitted.',
      //    error : 'Sorry, we could not submit your form.',
      //    name: 'Hello'
      //  },
      //  elements: []
      //};

      data = {
        "details": {
          "submit": "Send",
          "cancel": "Cancel",
          "success": "Thank you. Your form has been submitted.",
          "error": "Sorry, we could not submit your form.",
          "name": "Hello"
        },
        "elements": [
          {
            "guid": "c677b1345d9a454dc858f7d57ff3644e1a65",
            "elementType": "field",
            "name": "One",
            "type": "text",
            "value": "",
            "options": [
              {
                "label": "",
                "$$hashKey": "object:65"
              }
            ],
            "sizeX": 2,
            "sizeY": 1,
            "row": 1,
            "col": 1,
            "$$hashKey": "object:58"
          },
          {
            "guid": "7a06e2d8c7a9ec43d7c8aebc3bb0d304d684",
            "elementType": "field",
            "name": "Two",
            "type": "text",
            "value": "",
            "options": [
              {
                "label": "",
                "$$hashKey": "object:85"
              }
            ],
            "sizeX": 2,
            "sizeY": 1,
            "row": 1,
            "col": 2,
            "$$hashKey": "object:78"
          },
          {
            "guid": "f77757c751b435494b58cb1582f750f89192",
            "elementType": "field",
            "name": "Three",
            "type": "text",
            "value": "",
            "options": [
              {
                "label": "",
                "$$hashKey": "object:105"
              }
            ],
            "sizeX": 2,
            "sizeY": 1,
            "row": 0,
            "col": 0,
            "$$hashKey": "object:98"
          }
        ]
      };

      builder = {
        element : {
          type : 'element'
        }
      };
      fieldTypes = [
        {
          label : 'Text box',
          value : 'text'
        },
        {
          label : 'Textarea (large text box)',
          value : 'textarea'
        },
        {
          label : 'Select (a.k.a. dropdown)',
          value : 'select'
        },
        {
          label : 'Date',
          value : 'datepicker'
        }
      ];
      return {
        data : data,
        builder : builder,
        getSavedForm : getSavedForm,
        setSavedForm : setSavedForm,
        getFieldTypes : getFieldTypes
      };
      function getSavedForm () {
        return savedForm;
      }
      function setSavedForm () {
        savedForm = angular.copy(data);
      }
      function getFieldTypes () {
        return fieldTypes;
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
          { title:'Layout', disabled: false },
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
          $scope.$on('formSaved', function (event) {
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
                form.selectTab(3);
                scope.$broadcast('formSaved');
              };
              form.saveComplete = function () {
                alert(JSON.stringify(btFormBuilderDataService.getSavedForm()));
              }
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
              element,
              index = 0;
          create.createElement = createElement;
          create.reset = reset;
          create.data = {
            elementType : 'field'
          };
          function createElement () {
            // TODO: Want this to be a template in the btFormBuilderDataService service, but can't find a good deep copy/extend solution yet
            var element = {
              guid : utils.generateGuid(),
              elementType : create.data.elementType,
              name: create.data.name,
              type: 'text',
              value: '',
              options: [
                {
                  label : ''
                }
              ],
              sizeX: 2,
              sizeY: 1,
              row: index++,
              col: 0
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
          config.removeElement = function (element, elements) {
            var index = elements.indexOf(element);
            if (index !== -1) {
              elements.splice(index, 1);
            }
          };
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
        controller: function ($scope) {
          var field = this;
          field.types = btFormBuilderDataService.getFieldTypes();
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
              element.options.splice(index, 1);
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
                placeholder: iAttrs.placeholder || '',
                id: iAttrs.id,
                displayLabel: iAttrs.displayLabel && iAttrs.displayLabel === 'false' ? false : true,
                options: iAttrs.options ? $parse(iAttrs.options)(scope) : [],
                model: iAttrs.model,
                help: iAttrs.help,
                prompt: iAttrs.prompt,
                required: iAttrs.isRequired && iAttrs.isRequired === 'true' ? true : false,
                inline: iAttrs.inline && iAttrs.inline === 'false' ? false : true,
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
        '   data-ng-model="ngModel"' +
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
        '   data-ng-model="ngModel"' +
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
        '       data-ng-model="ngModel"' +
        '       data-ng-checked="ngModel === choice.value" ' +
        '       data-ng-disabled="choice.disabled"' +
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
        '   data-ng-model="ngModel"' +
        '   data-ng-options="choice.value as choice.label for choice in ::element.options"' +
        '   >' +
        '     <option data-ng-if="element.prompt" value="" selected="selected">{{::element.prompt}}</option>' +
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
        // TODO Had to reference a property on the model here. Can do it for now as it's the only checkbox, but MUST FIX
        '       data-ng-model="ngModel.required"' +
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
        '     data-ng-model="ngModel"' +
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
        '<span class="pointer"><i data-ng-if="!toggled" class="glyphicon glyphicon-chevron-down" data-ng-click="toggle()"></i><i data-ng-if="toggled" class="glyphicon glyphicon-chevron-up" data-ng-click="toggle()"></i></span>';
      return template;
    }

})();
