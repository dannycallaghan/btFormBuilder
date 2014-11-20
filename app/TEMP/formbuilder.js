
var fb = angular.module('btFormBuilder', ['angularjs-dropdown-multiselect', 'ng-nestable', 'ui.bootstrap']);

fb.config(['$nestableProvider', function ($nestableProvider) {

  $nestableProvider.defaultOptions({
    maxDepth        : 3,
    group           : 0,
    listNodeName    : 'ol',
    itemNodeName    : 'li',
    rootClass       : 'dd',
    listClass       : 'dd-list',
    itemClass       : 'dd-item',
    dragClass       : 'dd-dragel',
    handleClass     : 'dd-handle',
    collapsedClass  : 'dd-collapsed',
    placeClass      : 'dd-placeholder',
    emptyClass      : 'dd-empty',
    expandBtnHTML   : '<button data-action="expand">Expand</button>',
    collapseBtnHTML : '<button data-action="collapse">Collapse</button>'
  });

}]);


fb.filter('normaliseForJs', function () {
  return function (value) {
    var result = '';
    if (value && value.length) {
      result = value.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      result = (result.charAt(0).toLowerCase() + result.substr(1)).replace(/\s/g,'');
    }
    return result;
  }
});

fb.controller('btFormBuilderController', ['$scope', '$modal', function ($scope, $modal) {

  $scope.fb = {
    data : {
      details: {
        clients: [],
        submit: 'Send',
        cancel: 'Cancel',
        success: 'Thank you. Your form has been submitted.',
        error: 'Sorry, we could not submit your form'
      },
      elements: []
    }
  };

  $scope.fb.builder = {
    show : {
      formConfiguration : false,
      formElements : false
    },
    cache : {},
    clientList : {
      data: [
        {
          id: 1,
          label: 'Boeing'
        },
        {
          id: 2,
          label: 'BetFair'
        },
        {
          id: 3,
          label: 'Home Office'
        },
        {
          id: 4,
          label: 'Metropolitan Police'
        }
      ],
      settings: {
        enableSearch: true,
        translationTexts: {
          buttonDefaultText : 'Select'
        }
      }
    }
  };

  $scope.generateJSFriendlyUUID = function () {
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
  };

  $scope.saveAll = function () {
    alert(JSON.stringify($scope.fb.data));
  };

  $scope.addFormElement = function () {
    if ($scope.fb && $scope.fb.data && $scope.fb.data.elements && $scope.fb.data.elements.push) {
      var obj = {
        item : {
          name    : $scope.fb.builder.element.name,
          type    : $scope.fb.builder.element.type,
          guid    : $scope.generateJSFriendlyUUID(),
          elementType : 'text',
          displayName   : $scope.fb.builder.element.name,
          inputSize : 'large',
          displayLabel : true,
          required: true,
          displayFieldsetLabel: true,
          toggleFieldSet: false
        },
        children: []
      };
      $scope.fb.data.elements.push(obj);
      $scope.clearAddFormElementForm();
    }
  };

  $scope.clearAddFormElementForm = function () {
    $scope.fb.builder.element.name = '';
    $scope.createFormElement.$setPristine();
  };

  $scope.openItem = null;

  $scope.toggleFormElementDetails = function (item) {

    if ($scope.openItem !== item.guid) {
      $scope.fb.builder.show[$scope.openItem] = false;
    }
    $scope.fb.builder.show[item.guid] = !$scope.fb.builder.show[item.guid];
    $('div.ng-nestable')[ $scope.fb.builder.show[item.guid] ? 'addClass' : 'removeClass' ]('no-drag');
    $scope.openItem = $scope.fb.builder.show[item.guid] ? item.guid : null;

    if ($scope.fb.builder.cache && $scope.fb.builder.cache[item.guid]) {
      //console.log(item.inputSize, $scope.fb.builder.cache[item.guid].inputSize);
    }

    //if (open) {
    //$scope.fb.builder.cache = $scope.fb.builder.cache || {};
    $scope.fb.builder.cache[item.guid] = angular.copy(item);
    //console.log(item.inputSize);
    //}

    //console.log($scope.fb.builder.cache[item.guid]);

  };

  $scope.removeFormElement = function (element) {
    var scope = $scope,
      modalInstance = $modal.open({
        templateUrl: 'removeModal.html',
        controller: function ($scope) {

          $scope.removeModal = {
            type : element.type,
            ok : function () {
              scope.fb.data.elements.splice(element, 1);
              modalInstance.dismiss('cancel');
            },
            cancel : function () {
              modalInstance.dismiss('cancel');
            }
          };

        },
        size: 'sm'
      });
  };

}]);

fb.directive('btFormBuilder', ['$filter', function ($filter) {
  return {

    restrict : 'A',
    controller : 'btFormBuilderController',

    link : function (scope, element) {

      scope.$watch('fb.data.details.identifier', function (newValue) {
        scope.fb.data.details.name = $filter('normaliseForJs')(newValue);
      });

      scope.$watchCollection('fb.data.details.clients', function (newValue) {
        var result = [];
        _.each(scope.fb.builder.clientList.data, function (item) {
          _.each(newValue, function (obj) {
            if (item.id === obj.id) {
              result.push(item.label);
            }
          });
        });

        result = result.toString().replace(/,/g, ', ');

        if (result.indexOf(',') !== -1) {
          result = result.replace(/,(?=[^,]*$)/, ' and ');
        }

        scope.fb.builder.clientList.displayLabels = result.toString().replace(/,/g, ', ');
      });

    }

  }
}]);

fb.constant("btFormBuilderElementTypes", [
  {name : 'text', description : 'Text (standard text input box)'},
  {name : 'textarea', description : 'Textarea (large, scrollable text input box)'}//,
  //{name : 'select', description : 'Select (a.k.a. a dropdown)'}
]);

fb.directive('btFormBuilderElementPicker', ['btFormBuilderElementTypes', function (btFormBuilderElementTypes) {
  return {
    restrict: 'E',
    replace: true,
    template:   '<ng-form name="fbElementForm{{$item.guid}}">' +
    '   <div class="form-group">' +
    '       <label>Form Element Type<span class="required">*</span></label>' +
    '       <select class="form-control" ng-model="$item.elementType">' +
    '           <option ng-selected="$item.elementType === type.name" ng-repeat="type in btFormBuilderElementTypes" value="{{type.name}}">{{type.description}}</option>' +
    '       </select>' +
    '   </div>' +
    '   <bt-form-builder-form-element type="{{$item.elementType}}"></bt-form-builder-form-element>' +
    '</ng-form>',
    link : function (scope, element, attrs) {
      scope.btFormBuilderElementTypes = btFormBuilderElementTypes;
    }
  }
}]);

fb.directive('btFormBuilderFieldset', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl:   '/Views/Directives/btFormBuilderFieldset.html',
    link : function (scope, element, attrs) {
      //scope.btFormBuilderElementTypes = btFormBuilderElementTypes;
    }
  }
}]);

fb.directive('btFormBuilderFormElement', ['$filter', function ($filter) {
  return {
    restrict: 'E',
    replace: true,

    templateUrl : '/Views/Directives/btFormBuilderElement.html',
    link : function (scope, element, attrs) {

      scope.regex = {
        number : /^[1-9]{1}[0-9]*$/
      };

      scope.screen = {
        showMinLength : false
      };

      scope.$watch('$item.required', function (newValue, oldValue) {
        if (newValue === true) {
          checkRequired()
        } else {
          scope.$item.minLength = '';
        }
      });

      var checkRequired = function () {
        if (!scope.$item.minLength || !scope.$item.minLength.length || !angular.isNumber(parseInt(scope.$item.minLength, 10)) || parseInt(scope.$item.minLength, 10) < 1) {
          scope.$item.minLength = 1;
        }
      }

      scope.$item.pattern = scope.$item.pattern || 'any';

      scope.$item.label = scope.$item.label || scope.$item.displayName;

      scope.cancelFormElementEdit = function () {
        scope.$item = scope.fb.builder.cache[scope.$item.guid];
        scope.$item.pattern = scope.$item.pattern || 'any';
        scope.$item.label = scope.$item.label || scope.$item.displayName;

        if (scope.$item.required === true ) {
          checkRequired();
        } else {
          scope.$item.minLength = '';
        }

        scope.toggleFormElementDetails(scope.$item);

      };

      scope.save = function () {

        console.log('clicked');

        scope.toggleFormElementDetails(scope.$item);


      }

    }
  }
}]);


/*!
 * Angular nestable 0.0.1
 * Copyright (c) 2014 Kamil Pekala
 * https://github.com/kamilkp/ng-nestable
 */
angular.module('ng-nestable', []).provider('$nestable', function() {
  var modelName = '$item';
  var defaultOptions = {};
  this.$get = function() {
    return {
      modelName: modelName,
      defaultOptions: defaultOptions
    }
  };
  this.modelName = function(value) {
    modelName = value
  };
  this.defaultOptions = function(value) {
    defaultOptions = value
  }
}).directive('ngNestable', ['$compile', '$nestable', function($compile, $nestable) {
  return {
    restrict: 'AC',
    require: 'ngModel',
    compile: function(element) {
      var itemTemplate = element.html();
      element.empty();
      return function($scope, $element, $attrs, $ngModel) {
        var options = $.extend({}, $nestable.defaultOptions, $scope.$eval($attrs.ngNestable));
        $scope.$watchCollection(function() {
          return $ngModel.$modelValue
        }, function(model) {
          if (model) {
            model = runFormatters(model, $ngModel);
            var root = buildNestableHtml(model, itemTemplate);
            $element.empty().append(root);
            $compile(root)($scope);
            root.nestable(options);
            root.on('change', function(event) {
              if (event.target.type === 'checkbox') {
                return;
              }
              $ngModel.$setViewValue(root.nestable('serialize'));
              $scope && $scope.$root && $scope.$root.$$phase || $scope.$apply();
            })
          }
        })
      }
    },
    controller: angular.noop
  };

  function buildNestableHtml(model, tpl) {
    var root = $('<div class="dd"></div>');
    var rootList = $('<ol class="dd-list"></ol>').appendTo(root);
    model.forEach(function f(item) {
      var list = Array.prototype.slice.call(arguments).slice(-1)[0];
      if (!(list instanceof $)) list = rootList;
      var listItem = $('<li class="dd-item"></li>');
      var listElement = $('<div bt-form-builder-element class="dd-handle"></div>');
      listElement.append(tpl).appendTo(listItem);
      list.append(listItem);
      listItem.data('item', item.item);
      if (isArray(item.children) && item.children.length > 0) {
        var subRoot = $('<ol class="dd-list"></ol>').appendTo(listItem);
        item.children.forEach(function(item) {
          f.apply(this, Array.prototype.slice.call(arguments).concat([subRoot]))
        })
      }
    });
    return root
  }

  function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  function runFormatters(value, ctrl) {
    var formatters = ctrl.$formatters,
      idx = formatters.length;
    ctrl.$modelValue = value;
    while (idx--) {
      value = formatters[idx](value)
    }
    return value
  }
}]).directive('btFormBuilderElement', ['$nestable', function($nestable) {
  return {
    scope: true,
    require: '^ngNestable',
    link: function(scope, element) {
      scope[$nestable.modelName] = element.parent().data('item');
      element.find('a').on('mousedown', function($event) {
        $event.stopPropagation();
        $(this).on('mouseup', function($event) {})
      });
    }
  }
}]);

/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 * PLEASE NOTE - I've had to make some changes to this, so you can't just replace it with an updated version. Do a diff first - Danny Callaghan
 */
;
(function($, window, document, undefined) {
  var hasTouch = 'ontouchstart' in document;
  var hasPointerEvents = (function() {
    var el = document.createElement('div'),
      docEl = document.documentElement;
    if (!('pointerEvents' in el.style)) {
      return false
    }
    el.style.pointerEvents = 'auto';
    el.style.pointerEvents = 'x';
    docEl.appendChild(el);
    var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
    docEl.removeChild(el);
    return !!supports
  })();
  var defaults = {
    listNodeName: 'ol',
    itemNodeName: 'li',
    rootClass: 'dd',
    listClass: 'dd-list',
    itemClass: 'dd-item',
    dragClass: 'dd-dragel',
    handleClass: 'dd-handle',
    collapsedClass: 'dd-collapsed',
    placeClass: 'dd-placeholder',
    noDragClass: 'dd-nodrag',
    emptyClass: 'dd-empty',
    expandBtnHTML: '<button data-action="expand" type="button">Expand</button>',
    collapseBtnHTML: '<button data-action="collapse" type="button">Collapse</button>',
    group: 0,
    maxDepth: 5,
    threshold: 20
  };

  function Plugin(element, options) {
    this.w = $(document);
    this.el = $(element);
    this.options = $.extend({}, defaults, options);
    this.init()
  }
  Plugin.prototype = {
    init: function() {
      var list = this;
      list.reset();
      list.el.data('nestable-group', this.options.group);
      list.placeEl = $('<div class="' + list.options.placeClass + '"/>');
      $.each(this.el.find(list.options.itemNodeName), function(k, el) {
        list.setParent($(el))
      });
      /*
       list.el.on('click', 'button', function(e) {
       if (list.dragEl) {
       return
       }
       var target = $(e.currentTarget),
       action = target.data('action'),
       item = target.parent(list.options.itemNodeName);
       if (action === 'collapse') {
       list.collapseItem(item)
       }
       if (action === 'expand') {
       list.expandItem(item)
       }
       });
       */
      var onStartEvent = function(e) {
        if ($(list.el).parents('div.ng-nestable').hasClass('no-drag')) {
          return true;
        }
        var handle = $(e.target);
        if (!handle.hasClass(list.options.handleClass)) {
          if (handle.closest('.' + list.options.noDragClass).length) {
            return
          }
          handle = handle.closest('.' + list.options.handleClass)
        }
        if (!handle.length || list.dragEl) {
          return
        }
        list.isTouch = /^touch/.test(e.type);
        if (list.isTouch && e.touches.length !== 1) {
          return
        }
        e.preventDefault();
        list.dragStart(e.touches ? e.touches[0] : e)
      };
      var onMoveEvent = function(e) {
        if (list.dragEl) {
          e.preventDefault();
          list.dragMove(e.touches ? e.touches[0] : e)
        }
      };
      var onEndEvent = function(e) {
        if (list.dragEl) {
          e.preventDefault();
          list.dragStop(e.touches ? e.touches[0] : e)
        }
      };
      if (hasTouch) {
        list.el[0].addEventListener('touchstart', onStartEvent, false);
        window.addEventListener('touchmove', onMoveEvent, false);
        window.addEventListener('touchend', onEndEvent, false);
        window.addEventListener('touchcancel', onEndEvent, false)
      }

      list.el.on('mousedown', onStartEvent);
      list.w.on('mousemove', onMoveEvent);
      list.w.on('mouseup', onEndEvent)
    },
    serialize: function() {
      var data, depth = 0,
        list = this;
      step = function(level, depth) {
        var array = [],
          items = level.children(list.options.itemNodeName);
        items.each(function() {
          var li = $(this),
            item = $.extend({}, li.data()),
            sub = li.children(list.options.listNodeName);
          if (sub.length) {
            item.children = step(sub, depth + 1)
          }
          array.push(item)
        });
        return array
      };
      data = step(list.el.find(list.options.listNodeName).first(), depth);
      return data
    },
    serialise: function() {
      return this.serialize()
    },
    reset: function() {
      this.mouse = {
        offsetX: 0,
        offsetY: 0,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        nowX: 0,
        nowY: 0,
        distX: 0,
        distY: 0,
        dirAx: 0,
        dirX: 0,
        dirY: 0,
        lastDirX: 0,
        lastDirY: 0,
        distAxX: 0,
        distAxY: 0
      };
      this.isTouch = false;
      this.moving = false;
      this.dragEl = null;
      this.dragRootEl = null;
      this.dragDepth = 0;
      this.hasNewRoot = false;
      this.pointEl = null
    },
    expandItem: function(li) {
      li.removeClass(this.options.collapsedClass);
      li.children('[data-action="expand"]').hide();
      li.children('[data-action="collapse"]').show();
      li.children(this.options.listNodeName).show()
    },
    collapseItem: function(li) {
      var lists = li.children(this.options.listNodeName);
      if (lists.length) {
        li.addClass(this.options.collapsedClass);
        li.children('[data-action="collapse"]').hide();
        li.children('[data-action="expand"]').show();
        li.children(this.options.listNodeName).hide()
      }
    },
    expandAll: function() {
      var list = this;
      list.el.find(list.options.itemNodeName).each(function() {
        list.expandItem($(this))
      })
    },
    collapseAll: function() {
      var list = this;
      list.el.find(list.options.itemNodeName).each(function() {
        list.collapseItem($(this))
      })
    },
    setParent: function(li) {
      if (li.children(this.options.listNodeName).length) {
        li.prepend($(this.options.expandBtnHTML));
        li.prepend($(this.options.collapseBtnHTML))
      }
      li.children('[data-action="expand"]').hide()
    },
    unsetParent: function(li) {
      li.removeClass(this.options.collapsedClass);
      li.children('[data-action]').remove();
      li.children(this.options.listNodeName).remove()
    },
    dragStart: function(e) {
      var mouse = this.mouse,
        target = $(e.target),
        dragItem = target.closest(this.options.itemNodeName);
      this.placeEl.css('height', dragItem.height());
      mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
      mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
      mouse.startX = mouse.lastX = e.pageX;
      mouse.startY = mouse.lastY = e.pageY;
      this.dragRootEl = this.el;
      this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
      this.dragEl.css('width', dragItem.width());
      dragItem.after(this.placeEl);
      dragItem[0].parentNode.removeChild(dragItem[0]);
      dragItem.appendTo(this.dragEl);
      $(document.body).append(this.dragEl);
      this.dragEl.css({
        'left': e.pageX - mouse.offsetX,
        'top': e.pageY - mouse.offsetY
      });
      var i, depth, items = this.dragEl.find(this.options.itemNodeName);
      for (i = 0; i < items.length; i++) {
        depth = $(items[i]).parents(this.options.listNodeName).length;
        if (depth > this.dragDepth) {
          this.dragDepth = depth
        }
      }
    },
    dragStop: function(e) {
      var el = this.dragEl.children(this.options.itemNodeName).first();
      el[0].parentNode.removeChild(el[0]);
      this.placeEl.replaceWith(el);
      this.dragEl.remove();
      this.el.trigger('change');
      if (this.hasNewRoot) {
        this.dragRootEl.trigger('change')
      }
      this.reset()
    },
    dragMove: function(e) {
      var list, parent, prev, next, depth, opt = this.options,
        mouse = this.mouse;
      this.dragEl.css({
        'left': e.pageX - mouse.offsetX,
        'top': e.pageY - mouse.offsetY
      });
      mouse.lastX = mouse.nowX;
      mouse.lastY = mouse.nowY;
      mouse.nowX = e.pageX;
      mouse.nowY = e.pageY;
      mouse.distX = mouse.nowX - mouse.lastX;
      mouse.distY = mouse.nowY - mouse.lastY;
      mouse.lastDirX = mouse.dirX;
      mouse.lastDirY = mouse.dirY;
      mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
      mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
      var newAx = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;
      if (!mouse.moving) {
        mouse.dirAx = newAx;
        mouse.moving = true;
        return
      }
      if (mouse.dirAx !== newAx) {
        mouse.distAxX = 0;
        mouse.distAxY = 0
      } else {
        mouse.distAxX += Math.abs(mouse.distX);
        if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
          mouse.distAxX = 0
        }
        mouse.distAxY += Math.abs(mouse.distY);
        if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
          mouse.distAxY = 0
        }
      }
      mouse.dirAx = newAx;
      if (mouse.dirAx && mouse.distAxX >= opt.threshold) {
        mouse.distAxX = 0;
        prev = this.placeEl.prev(opt.itemNodeName);
        if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
          list = prev.find(opt.listNodeName).last();
          depth = this.placeEl.parents(opt.listNodeName).length;
          if (depth + this.dragDepth <= opt.maxDepth) {
            if (!list.length) {
              list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
              list.append(this.placeEl);
              prev.append(list);
              this.setParent(prev)
            } else {
              list = prev.children(opt.listNodeName).last();
              list.append(this.placeEl)
            }
          }
        }
        if (mouse.distX < 0) {
          next = this.placeEl.next(opt.itemNodeName);
          if (!next.length) {
            parent = this.placeEl.parent();
            this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
            if (!parent.children().length) {
              this.unsetParent(parent.parent())
            }
          }
        }
      }
      var isEmpty = false;
      if (!hasPointerEvents) {
        this.dragEl[0].style.visibility = 'hidden'
      }
      this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
      if (!hasPointerEvents) {
        this.dragEl[0].style.visibility = 'visible'
      }
      if (this.pointEl.hasClass(opt.handleClass)) {
        this.pointEl = this.pointEl.parent(opt.itemNodeName)
      }
      if (this.pointEl.hasClass(opt.emptyClass)) {
        isEmpty = true
      } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
        return
      }
      var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
        isNewRoot = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');
      if (!mouse.dirAx || isNewRoot || isEmpty) {
        if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
          return
        }
        depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
        if (depth > opt.maxDepth) {
          return
        }
        var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
        parent = this.placeEl.parent();
        if (isEmpty) {
          list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
          list.append(this.placeEl);
          this.pointEl.replaceWith(list)
        } else if (before) {
          this.pointEl.before(this.placeEl)
        } else {
          this.pointEl.after(this.placeEl)
        }
        if (!parent.children().length) {
          this.unsetParent(parent.parent())
        }
        if (!this.dragRootEl.find(opt.itemNodeName).length) {
          this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>')
        }
        if (isNewRoot) {
          this.dragRootEl = pointElRoot;
          this.hasNewRoot = this.el[0] !== this.dragRootEl[0]
        }
      }
    }
  };
  $.fn.nestable = function(params) {
    var lists = this,
      retval = this;
    lists.each(function() {
      var plugin = $(this).data("nestable");
      if (!plugin) {
        $(this).data("nestable", new Plugin(this, params));
        $(this).data("nestable-id", new Date().getTime())
      } else {
        if (typeof params === 'string' && typeof plugin[params] === 'function') {
          retval = plugin[params]()
        }
      }
    });
    return retval || lists
  }
})(window.jQuery || window.Zepto, window, document);











/*!
 * https://github.com/dotansimha/angularjs-dropdown-multiselect
 */
var directiveModule=angular.module("angularjs-dropdown-multiselect",[]);directiveModule.directive("ngDropdownMultiselect",["$filter","$document","$compile","$parse",function($filter,$document){return{restrict:"AE",scope:{selectedModel:"=",options:"=",extraSettings:"=",events:"=",searchFilter:"=?",translationTexts:"=",groupBy:"@"},template:function(element,attrs){var checkboxes=attrs.checkboxes?!0:!1,groups=attrs.groupBy?!0:!1,template='<div class="multiselect-parent btn-group dropdown-multiselect">';template+='<button type="button" class="dropdown-toggle" ng-class="settings.buttonClasses" ng-click="toggleDropdown()">{{getButtonText()}}&nbsp;<span class="caret"></span></button>',template+="<ul class=\"dropdown-menu dropdown-menu-form\" ng-style=\"{display: open ? 'block' : 'none', height : settings.scrollable ? settings.scrollableHeight : 'auto' }\" style=\"overflow: scroll\" >",template+='<li ng-hide="!settings.showCheckAll || settings.selectionLimit > 0"><a data-ng-click="selectAll()"><span class="glyphicon glyphicon-ok"></span>  {{texts.checkAll}}</a>',template+='<li ng-show="settings.showUncheckAll"><a data-ng-click="deselectAll();"><span class="glyphicon glyphicon-remove"></span>   {{texts.uncheckAll}}</a></li>',template+='<li ng-hide="(!settings.showCheckAll || settings.selectionLimit > 0) && !settings.showUncheckAll" class="divider"></li>',template+='<li ng-show="settings.enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>',template+='<li ng-show="settings.enableSearch" class="divider"></li>',groups?(template+='<li ng-repeat-start="option in orderedItems | filter: searchFilter" ng-show="getPropertyForObject(option, settings.groupBy) !== getPropertyForObject(orderedItems[$index - 1], settings.groupBy)" role="presentation" class="dropdown-header">{{ getGroupTitle(getPropertyForObject(option, settings.groupBy)) }}</li>',template+='<li ng-repeat-end role="presentation">'):template+='<li role="presentation" ng-repeat="option in options | filter: searchFilter">',template+='<a role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))">',template+=checkboxes?'<div class="checkbox"><label><input class="checkboxInput" type="checkbox" ng-click="checkboxClick($event, getPropertyForObject(option,settings.idProp))" ng-checked="isChecked(getPropertyForObject(option,settings.idProp))" /> {{getPropertyForObject(option, settings.displayProp)}}</label></div></a>':"<span data-ng-class=\"{'glyphicon glyphicon-ok': isChecked(getPropertyForObject(option,settings.idProp))}\"></span> {{getPropertyForObject(option, settings.displayProp)}}</a>",template+="</li>",template+='<li class="divider" ng-show="settings.selectionLimit > 1"></li>',template+='<li role="presentation" ng-show="settings.selectionLimit > 1"><a role="menuitem">{{selectedModel.length}} {{texts.selectionOf}} {{settings.selectionLimit}} {{texts.selectionCount}}</a></li>',template+="</ul>",template+="</div>",element.html(template)},link:function($scope,$element,$attrs){function getFindObj(id){var findObj={};return""===$scope.settings.externalIdProp?findObj[$scope.settings.idProp]=id:findObj[$scope.settings.externalIdProp]=id,findObj}function clearObject(object){for(var prop in object)delete object[prop]}var $dropdownTrigger=$element.children()[0];$scope.toggleDropdown=function(){$scope.open=!$scope.open},$scope.checkboxClick=function($event,id){$scope.setSelectedItem(id),$event.stopImmediatePropagation()},$scope.externalEvents={onItemSelect:angular.noop,onItemDeselect:angular.noop,onSelectAll:angular.noop,onDeselectAll:angular.noop,onInitDone:angular.noop,onMaxSelectionReached:angular.noop},$scope.settings={dynamicTitle:!0,scrollable:!1,scrollableHeight:"300px",closeOnBlur:!0,displayProp:"label",idProp:"id",externalIdProp:"id",enableSearch:!1,selectionLimit:0,showCheckAll:!0,showUncheckAll:!0,closeOnSelect:!1,buttonClasses:"btn btn-default",closeOnDeselect:!1,groupBy:$attrs.groupBy||void 0,groupByTextProvider:null,smartButtonMaxItems:0,smartButtonTextConverter:angular.noop},$scope.texts={checkAll:"Check All",uncheckAll:"Uncheck All",selectionCount:"checked",selectionOf:"/",searchPlaceholder:"Search...",buttonDefaultText:"Select",dynamicButtonTextSuffix:"checked"},$scope.searchFilter=$scope.searchFilter||"",angular.isDefined($scope.settings.groupBy)&&$scope.$watch("options",function(newValue){angular.isDefined(newValue)&&($scope.orderedItems=$filter("orderBy")(newValue,$scope.settings.groupBy))}),angular.extend($scope.settings,$scope.extraSettings||[]),angular.extend($scope.externalEvents,$scope.events||[]),angular.extend($scope.texts,$scope.translationTexts),$scope.singleSelection=1===$scope.settings.selectionLimit,$scope.singleSelection&&angular.isArray($scope.selectedModel)&&0===$scope.selectedModel.length&&clearObject($scope.selectedModel),$scope.settings.closeOnBlur&&$document.on("click",function(e){for(var target=e.target.parentElement,parentFound=!1;angular.isDefined(target)&&null!==target&&!parentFound;)_.contains(target.className.split(" "),"multiselect-parent")&&!parentFound&&target===$dropdownTrigger&&(parentFound=!0),target=target.parentElement;parentFound||$scope.$apply(function(){$scope.open=!1})}),$scope.getGroupTitle=function(groupValue){return null!==$scope.settings.groupByTextProvider?$scope.settings.groupByTextProvider(groupValue):groupValue},$scope.getButtonText=function(){if($scope.settings.dynamicTitle&&($scope.selectedModel.length>0||angular.isObject($scope.selectedModel)&&_.keys($scope.selectedModel).length>0)){if($scope.settings.smartButtonMaxItems>0){var itemsText=[];return angular.forEach($scope.options,function(optionItem){if($scope.isChecked($scope.getPropertyForObject(optionItem,$scope.settings.idProp))){var displayText=$scope.getPropertyForObject(optionItem,$scope.settings.displayProp),converterResponse=$scope.settings.smartButtonTextConverter(displayText,optionItem);itemsText.push(converterResponse?converterResponse:displayText)}}),$scope.selectedModel.length>$scope.settings.smartButtonMaxItems&&(itemsText=itemsText.slice(0,$scope.settings.smartButtonMaxItems),itemsText.push("...")),itemsText.join(", ")}var totalSelected;return totalSelected=$scope.singleSelection?null!==$scope.selectedModel&&angular.isDefined($scope.selectedModel[$scope.settings.idProp])?1:0:angular.isDefined($scope.selectedModel)?$scope.selectedModel.length:0,0===totalSelected?$scope.texts.buttonDefaultText:totalSelected+" "+$scope.texts.dynamicButtonTextSuffix}return $scope.texts.buttonDefaultText},$scope.getPropertyForObject=function(object,property){return angular.isDefined(object)&&object.hasOwnProperty(property)?object[property]:""},$scope.selectAll=function(){$scope.deselectAll(!1),$scope.externalEvents.onSelectAll(),angular.forEach($scope.options,function(value){$scope.setSelectedItem(value[$scope.settings.idProp],!0)})},$scope.deselectAll=function(sendEvent){sendEvent=sendEvent||!0,sendEvent&&$scope.externalEvents.onDeselectAll(),$scope.singleSelection?clearObject($scope.selectedModel):$scope.selectedModel.splice(0,$scope.selectedModel.length)},$scope.setSelectedItem=function(id,dontRemove){var findObj=getFindObj(id),finalObj=null;if(finalObj=""===$scope.settings.externalIdProp?_.find($scope.options,findObj):findObj,$scope.singleSelection)return clearObject($scope.selectedModel),angular.extend($scope.selectedModel,finalObj),void $scope.externalEvents.onItemSelect(finalObj);dontRemove=dontRemove||!1;var exists=-1!==_.findIndex($scope.selectedModel,findObj);!dontRemove&&exists?($scope.selectedModel.splice(_.findIndex($scope.selectedModel,findObj),1),$scope.externalEvents.onItemDeselect(findObj)):!exists&&(0===$scope.settings.selectionLimit||$scope.selectedModel.length<$scope.settings.selectionLimit)&&($scope.selectedModel.push(finalObj),$scope.externalEvents.onItemSelect(finalObj))},$scope.isChecked=function(id){return $scope.singleSelection?null!==$scope.selectedModel&&angular.isDefined($scope.selectedModel[$scope.settings.idProp])&&$scope.selectedModel[$scope.settings.idProp]===getFindObj(id)[$scope.settings.idProp]:-1!==_.findIndex($scope.selectedModel,getFindObj(id))},$scope.externalEvents.onInitDone()}}}]);
