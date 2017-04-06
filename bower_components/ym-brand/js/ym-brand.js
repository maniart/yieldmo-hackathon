/* jshint ignore:start */

var ymUIKit = ymUIKit || {};

/*
 * FORM ELEMENTS
 *
 */
ymUIKit.formElements = {

  // Holder for calendars.
  calendars: {},

  // Set up input elements for a form.
  init: function() {

    // Set initial state for the elements.
    function textInputInitialState(item) {
      if (ymUIKit.utils.elementIsBlank(item)) {
        ymUIKit.formElements.textInputRestingState(item);
      } else {
        ymUIKit.formElements.textInputActiveState(item);
      }
    }

    // Set up listeners for the elements.
    function textInputListeners(item) {
      item.onfocus = function() {
        ymUIKit.formElements.textInputActiveState(item);
      };
      item.onblur = function() {
        if (ymUIKit.utils.elementIsBlank(item)) {
          ymUIKit.formElements.textInputRestingState(item);
        }
      };
      item.onkeyup = function(e) {
        ymUIKit.formElements.updateCharacterLimit();
        if (ymUIKit.utils.elementIsBlank(item)) {
          ymUIKit.formElements.textInputRestingState(item);
        } else {
          ymUIKit.formElements.textInputActiveState(item);
        }
      };
      ymUIKit.formElements.addCharacterLimit(item);
    }

    // Set up listeners for the elements.
    function colorInputListeners(item) {
      item.onchange = function(e) {
        ymUIKit.formElements.updateColorElement(item);
      };
    }

    function dateInputListeners(item) {

      // Hide calendar on scroll.
      var runOnScroll =  function() {
        if (document.getElementById('highsmithCal--offClicker')) {
          document.getElementById('highsmithCal--offClicker').click();
          ymUIKit.formElements.blurredByTab = true;
          var dateInputs = document.getElementsByClassName('ymb_input-date');
          for (var i = 0; i < dateInputs.length; i++) {
            var input = dateInputs[i];
            ymUIKit.formElements.textInputRestingState(input);
          }
        }

      };
      var elements = document.getElementsByTagName('*');
      elements = Array.prototype.slice.call(elements);
      elements.forEach(function(element) {
        element.addEventListener("scroll", runOnScroll);
      });

      // Create onclick listener to remove any Highsmith calendars.
      window.document.onkeyup = function(e) {
        if (e.keyCode == 9) {
          if (document.getElementById('highsmithCal--offClicker')) {
            document.getElementById('highsmithCal--offClicker').click();
          }
          ymUIKit.formElements.blurredByTab = true;
        }
      }

      item.onfocus = function(evt) {
        ymUIKit.formElements.textInputActiveState(item);

        setTimeout(function() {
          if (item.nextSibling.nextSibling) {
            item.nextSibling.nextSibling.click();
          } else if (item.nextSibling) {
            item.nextSibling.click();
          }

        }, 200);
      };
      item.onblur = function(e) {

        setTimeout(function() {
          // Do not lose focus on input if calendar is still visible.
          if (document.getElementById('highsmithCal')) {
            if (!ymUIKit.formElements.blurredByTab) {
              item.focus();
              return;
            } else {
              ymUIKit.formElements.blurredByTab = false;
            }
          }
          if (ymUIKit.utils.elementIsBlank(item)) {
            ymUIKit.formElements.textInputRestingState(item);
          }
        }, 550);
      };

      if (item.id) {

        // Uses the Highsmith bower package.  See
        // https://github.com/adamvanlente/highsmith for docs and usage.
        ymUIKit.formElements.calendars[item.id] =
          new Highsmith(item.id);
      }
    }

    // Fake a click on a date input and give it focus.
    function dateIconListeners(item) {
      item.onclick = function() {
        if (item.dataset && item.dataset.iconFor) {
          var id = item.dataset.iconFor;
          var el = document.getElementById(id);
          var clickEvent = new MouseEvent("click", {
              "view": window,
              "bubbles": true,
              "cancelable": false
          });
          el.dispatchEvent(clickEvent);
          el.focus();
          ymUIKit.formElements.textInputActiveState(el);
        }
      };
    }

    function fileInputListeners(item) {

      item.ondragenter = function(e) {
        ymUIKit.utils.addClassName(e.srcElement, 'ymb_input-file-dragover');
      }

      item.ondragleave = function(e) {
        ymUIKit.utils.removeClassName(e.srcElement, 'ymb_input-file-dragover');
      }

      var browseIconClass = 'ymb_file-input-browse';
      var icons = document.getElementsByClassName(browseIconClass);
      for (var i = 0; i < icons.length; i++) {
        var icon = icons[i];
        icon.onclick = function(e) {
          var el = e.srcElement;
          var className = el.className;
          if (className.search('empty') != -1) {
            var parent = el.parentElement;
            if (parent) {
              parent.click();
            }
          }
        }
      }
    }

    function drawerToggleListeners(item) {
      item.onclick = function(e) {
        var el = e.srcElement,
            drawer = el.nextSibling.nextSibling || el.nextSibling;
        var oldClass,
            newClass,
            oldDrawerClass,
            newDrawerClass;

        if (el.className.search('closed') != -1) {
          oldClass = 'ymb_input-drawer-header-closed';
          newClass = 'ymb_input-drawer-header-open';
          oldDrawerClass = 'ymb_input-drawer-contents-closed';
          newDrawerClass = 'ymb_input-drawer-contents-open';
        } else {
          oldClass = 'ymb_input-drawer-header-open';
          newClass = 'ymb_input-drawer-header-closed';
          oldDrawerClass = 'ymb_input-drawer-contents-open';
          newDrawerClass = 'ymb_input-drawer-contents-closed';
        }

        ymUIKit.utils.updateClassName(el, oldClass, newClass);
        ymUIKit.utils.updateClassName(drawer, oldDrawerClass, newDrawerClass);
      };
    }

    function dropdownToggleListeners(item) {
      item.onclick = function(e) {
        var optionList =
              e.srcElement.nextSibling.nextSibling || e.srcElement.nextSibling,
            oldClass = 'ymb_input-select-option-wrapper-closed',
            newClass = 'ymb_input-select-option-wrapper-opened';
        ymUIKit.utils.updateClassName(optionList, oldClass, newClass);
      };

      item.onfocus = function(e) {
        var optionList =
              e.srcElement.nextSibling.nextSibling || e.srcElement.nextSibling,
            oldClass = 'ymb_input-select-option-wrapper-closed',
            newClass = 'ymb_input-select-option-wrapper-opened';
        ymUIKit.utils.updateClassName(optionList, oldClass, newClass);
      };

      item.onblur = function(e) {
        setTimeout(function() {
          var optionList =
                e.srcElement.nextSibling.nextSibling || e.srcElement.nextSibling,
              oldClass = 'ymb_input-select-option-wrapper-opened',
              newClass = 'ymb_input-select-option-wrapper-closed';
          ymUIKit.utils.updateClassName(optionList, oldClass, newClass);
        }, 100);
      };

      window.document.onclick = function(e) {
        var el = e.srcElement,
            oldClass = 'ymb_input-select-option-wrapper-opened',
            newClass = 'ymb_input-select-option-wrapper-closed';
        var optionBlocks = document.getElementsByClassName('ymb_input-select-option-wrapper');
        if (!el) {
          return;
        }
        if (el.className.search('ymb_input-select-option') != -1) {
          return;
        }
        if (el.className == ('ymb_input-select')) {
          var ownOptionBlock =
              el.nextSibling.nextSibling || e.srcElement.nextSibling;
          for (var i = 0; i < optionBlocks.length; i++) {
            var optionBlock = optionBlocks[i];
            if (optionBlock != ownOptionBlock) {
              ymUIKit.utils.updateClassName(optionBlock, oldClass, newClass);
            }
          }
        } else {
          for (var i = 0; i < optionBlocks.length; i++) {
            var optionBlock = optionBlocks[i];
            ymUIKit.utils.updateClassName(optionBlock, oldClass, newClass);
          }
        }
      }
    }

    function dropdownOptionListeners(item) {
      item.onclick = function(e) {
        var el = e.srcElement,
            value = el.innerHTML,
            parent = getTrueParent(el.parentElement),
            input = getTrueInput(parent),
            oldClass = 'ymb_input-select-option-wrapper-opened',
            newClass = 'ymb_input-select-option-wrapper-closed';
        ymUIKit.utils.updateClassName(parent, oldClass, newClass);
        input.value = value;
      };

      function getTrueInput(el) {
        var inputs = el.getElementsByClassName('ymb_input-select');
        if (inputs[0]) {
          return inputs[0];
        } else {
          return undefined;
        }
      }

      function getTrueParent(el) {
        if (el.className.search('ymb_input-select-wrapper') !== -1) {
          return el;
        } else {
          return getTrueParent(el.parentElement);
        }
      }
    }

    // Iterate over inputs with class "className", and on each
    // input, perform each function within "functionArray".
    function assignFunctionsToInputs(className, functionArray) {
      var inputs = document.getElementsByClassName(className);
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        for (var j = 0; j < functionArray.length; j++) {
          var fn = functionArray[j];
          fn(input);
        }
      }
    }

    assignFunctionsToInputs('ymb_input-text', [
      textInputListeners,
      textInputInitialState
    ]);

    assignFunctionsToInputs('ymb_input-text-color', [
      textInputListeners,
      textInputInitialState
    ]);

    assignFunctionsToInputs('ymb_input-color', [
      colorInputListeners
    ]);

    assignFunctionsToInputs('ymb_input-date', [
      dateInputListeners
    ]);

    assignFunctionsToInputs('ymb_input-date-icon', [
      dateIconListeners
    ]);

    assignFunctionsToInputs('ymb_input-file', [
      fileInputListeners
    ]);

    assignFunctionsToInputs('ymb_input-drawer-header', [
      drawerToggleListeners
    ]);

    assignFunctionsToInputs('ymb_input-select', [
      dropdownToggleListeners
    ]);

    assignFunctionsToInputs('ymb_input-select-option', [
      dropdownOptionListeners
    ]);


  },

  updateCharacterLimit: function(e) {

    // Get input element and determine if there is a character limit.
    if (!e || !e.srcElement) { return; }
    var el = e.srcElement;
    if (el.dataset && el.dataset.characterLimit) {

      // Get character limit and counter content (ex 0/25).
      var charLimit = el.dataset.characterLimit,
          content;

      // Valid and Invalid classes for em that holds count (ex 0/25)
      var validClass = 'ymb_form-element-character-limit-valid',
          invalidClass = 'ymb_form-element-character-limit-invalid',
          inputErrorClass = 'ymb_input-text-label-invalid';

      // Default state to valid.
      var element = el.nextSibling.nextSibling || e.srcElement.nextSibling;
      ymUIKit.utils.updateClassName(element, invalidClass, validClass);
      ymUIKit.utils.removeClassName(el, inputErrorClass);

      // Set the count.
      if (!el.value) {
        content = '0/' + String(charLimit);
        el.dataset.invalid = false;
      } else {
        content = String(el.value).length + '/' + String(charLimit);

        // Check if invalid.
        if (el.value.length > Number(charLimit)) {
          ymUIKit.utils.updateClassName(element, validClass, invalidClass);
          ymUIKit.utils.addClassName(el, inputErrorClass);
          el.dataset.invalid = true;
        } else {
          el.dataset.invalid = false;
        }
      }
      element.innerHTML = content;
    }
  },

  // Perform some actions when a user drops a file.
  fileDropListener: function(id) {

    // Get the parent element for this file input, make sure it has the
    // correct className.
    var parentEl = document.getElementById(id);
    ymUIKit.utils.removeClassName(parentEl, 'ymb_input-file-dragover');

    // Determine which text to show when a file is dropped.
    var fileDroppedText = 'File Added!';
    if (parentEl.dataset && parentEl.dataset.fileDroppedMessage) {
      fileDroppedText = parentEl.dataset.fileDroppedMessage;
    }

    // File in the label and icon elements.
    var fileEl = document.getElementById(id);
    var children = fileEl.childNodes;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var childClass = child.className;
      if (childClass) {

        // Case for setting the input label.
        if (childClass.search('ymb_file-input-desc') != -1) {

          // Set data to remember the content of the label.
          parentEl.dataset.originalLabelText = child.innerHTML;
          var img = '<img ' +
            'src="http://s3.amazonaws.com/static.yieldmo.com/icons' +
            '/beta/green-check.png" class="ymb_file-input-green-checkmark"/>'
          child.innerHTML = img + fileDroppedText;
        }

        // Now change the class of the icon.
        if (childClass.search('ymb_file-input-browse') != -1) {
          child.className = child.className.replace('empty', 'dropped');
          child.onclick = function(evt) {
            var el = evt.target;
            if (el.className) {
              var iconClass = el.className;
              if (iconClass.search('dropped') != -1) {
                removeClick(evt, el);
              }
            }
          };
        }
      }
    }

    // // Perform some steps to remove the file.
    function removeClick(evt, el) {
      el.className = el.className.replace('dropped', 'empty');
      var sibling = el.previousSibling.previousSibling || el.previousSibling;
      var parent = el.previousSibling.parentElement || el.parentElement;
      var clickText = 'Click here or drag a file';
      if (parent.dataset && parent.dataset.originalLabelText) {
        clickText = parent.dataset.originalLabelText;
      }
      if (sibling) {
        sibling.innerHTML = clickText;
      }
      el.onclick = function(e) {
        var el = e.srcElement;
        var className = el.className;
        if (className.search('empty') != -1) {
          var parent = el.parentElement;
          if (parent) {
            parent.click();
          }
        }
      }
    }
  },

  // Set the active state for the input elements.
  textInputActiveState: function(item) {
    var oldClass = 'ymb_input-text-resting',
        newClass = 'ymb_input-text-active';
    ymUIKit.utils.updateClassName(item, oldClass, newClass);

    var label = item.previousSibling.previousSibling || item.previousSibling,
        oldLabelClass = 'ymb_input-text-label-resting',
        newLabelClass = 'ymb_input-text-label-active';
    if (label) {
      ymUIKit.utils.updateClassName(label, oldLabelClass, newLabelClass);
    }
  },

  // Set the resting state for the input elements.
  textInputRestingState: function(item) {
    var oldClass = 'ymb_input-text-active',
        newClass = 'ymb_input-text-resting';
    ymUIKit.utils.updateClassName(item, oldClass, newClass);

    if (ymUIKit.utils.elementIsBlank(item)) {
      var label = item.previousSibling.previousSibling || item.previousSibling,
          oldLabelClass = 'ymb_input-text-label-active',
          newLabelClass = 'ymb_input-text-label-resting';
      if (label) {
        ymUIKit.utils.updateClassName(label, oldLabelClass, newLabelClass);
      }
    }
  },

  addCharacterLimit: function(el) {
    if (el.dataset && el.dataset.characterLimit) {
      var charLimit = el.dataset.characterLimit;
      var em = document.createElement('em');
      em.className = 'ymb_form-element-character-limit ' +
        'ymb_form-element-character-limit-valid';
      var elContent;
      if (el.value) {
        var characters = String(el.value).length;
        elContent = characters + '/' + String(charLimit);
      } else {
        elContent = '0/' + String(charLimit);
      }
      em.innerHTML = elContent;
      var existingCounters = el.parentElement
        .getElementsByClassName('ymb_form-element-character-limit');
      if (!existingCounters.length) {
        el.parentElement.appendChild(em);
      }
    }
  },

  updateColorElement: function(el) {

    if (el.dataset && el.dataset.colorFor) {
      var color = el.value,
          input = document.getElementById(el.dataset.colorFor);
      if (color) {
        input.value = color;
        ymUIKit.formElements.textInputActiveState(input);
      } else {
        ymUIKit.formElements.textInputRestingState(input);
      }
    }
  }
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

/* jshint ignore:end */

/* jshint ignore:start */

/**
 ** Javascript functionality for ym-brand components.
 **
 **
 */

var ymUIKit = ymUIKit || {};

/* Run the following functions after page loads. */
setTimeout(function() {
  ymUIKit.init();
}, 1000);

ymUIKit.init = function() {
  ymUIKit.setupMenuListeners();
  ymUIKit.formElements.init();
  ymUIKit.progressIndicators.init();
};

/*
 * MAIN HEADER AND MENU FUNCTIONALITY
 *
 */
 ymUIKit.setupMenuListeners = function() {

   // Add listener to menu bars.
   if (document.getElementById('ymb_header-menu-bars')) {

     if (ymUIKit.menuListenerTimer) {
       window.clearInterval(ymUIKit.menuListenerTimer);
     }

     ymUIKit.menuListenerTimer = setTimeout(function() {
       var old_element = document.getElementById('ymb_header-menu-bars');
       var new_element = old_element.cloneNode(true);
       old_element.parentNode.replaceChild(new_element, old_element);
       new_element.addEventListener('click', ymbToggleYieldmoMenu);
     }, 100);
   }

   // Build in functionality for menu toggle if all elements exist.
   function ymbToggleYieldmoMenu() {
     var menuBars = document.getElementById('ymb_header-menu-bars'),
         c = menuBars.className;

     if (c.search('active') != -1) {
       ymUIKit.ymb_toggleYieldmoMenuOff();
     } else {
       ymUIKit.ymb_toggleYieldmoMenuOn();
     }
   }
 };

 // Toggle menu to ON.
 ymUIKit.ymb_toggleYieldmoMenuOn = function() {
   var updateClass = ymUIKit.utils.updateClassNameById,
       addClass = ymUIKit.utils.addClassNameById;
   updateClass('ymb_header-menu-bars', 'initial', 'active');
   updateClass('ymb_header-bar', 'initial', 'active');
   updateClass('ymb_sidenav', 'initial', 'active');
   addClass('ymb_header-logo', 'ymb_header-logo-active');
   addClass('ymb_header-application-name',
            'ymb_header-application-name-active');
   ymUIKit.utils.updateLinkOpacity('0.0');
 };

 // Toggle menu to OFF.
 ymUIKit.ymb_toggleYieldmoMenuOff = function() {
   var updateClass = ymUIKit.utils.updateClassNameById,
       removeClass = ymUIKit.utils.removeClassNameById;
   updateClass('ymb_header-menu-bars', 'active', 'initial');
   updateClass('ymb_header-bar', 'active', 'initial');
   updateClass('ymb_sidenav', 'active', 'initial');
   removeClass('ymb_header-logo', 'ymb_header-logo-active');
   removeClass('ymb_header-application-name',
               'ymb_header-application-name-active');
   ymUIKit.utils.updateLinkOpacity('1.0');
 };
/* jshint ignore:end */

/* jshint ignore:start */

var ymUIKit = ymUIKit || {};

/*
 * PROGRESS INDICATORS
 *
 */
ymUIKit.progressIndicators = {

  init: function() {
    ymUIKit.progressIndicators.setupProgressIndicators();
  },

  setupProgressIndicators: function() {
    var allElements = document.getElementsByClassName('ymb_progress-indicator');
    for (var i = 0; i < allElements.length; i++) {
      var el = allElements[i];
      ymUIKit.progressIndicators.fillProgressIndicator(el);
    }
  },

  fillProgressIndicator: function(el) {
    el.innerHTML = '';
    var data = el.dataset,
        totalSteps = Number(data.totalSteps),
        currentStep = Number(data.currentStep);

    if (!totalSteps || !currentStep) {
      var errMsg = 'Please include data-total-steps and data-current step ' +
          'with each progress indicator element.';
      console.error(errMsg);
      return;
    }

    for (var i = 0; i < totalSteps; i++) {
      var stepCircle = ymUIKit.progressIndicators.createCircle(i, currentStep);
      el.appendChild(stepCircle);

      var stepBar = ymUIKit.progressIndicators.createStepBar(i, currentStep);
      if (i < totalSteps - 1) {
        el.appendChild(stepBar);
      }
    }

  },

  createCircle: function(index, currentStep) {
    var label = document.createElement('label'),
        number = index + 1,
        state;
    if (number < currentStep) {
      state = 'complete';
    } else if (number == currentStep) {
      state = 'active';
    } else {
      state = 'empty';
    }
    label.className = 'ymb_progress-indicator-number ' +
                      'ymb_progress-indicator-number-' + state +
                      ' ymb_font-bold';
    label.title = index;
    label.innerHTML = number;
    return label;
  },

  createStepBar: function(index, currentStep) {
    var parentLabel = document.createElement('label'),
        childLabel = document.createElement('label'),
        number = index + 1,
        state;

    if (number < currentStep) {
      state = 'filled';
    } else {
      state = 'empty';
    }
    parentLabel.className = 'ymb_progress-indicator-bar-wrapper';
    childLabel.className = 'ymb_progress-indicator-bar-inner ' +
                           'ymb_progress-indicator-bar-inner-' + state;
    childLabel.title = index;
    parentLabel.appendChild(childLabel);
    return parentLabel;
  },

  moveForward: function(id) {
    var element = document.getElementById(id),
        currentStep = element.dataset.currentStep,
        totalSteps = element.dataset.totalSteps,
        nextStep = Number(currentStep) + 1;
    if (currentStep > totalSteps) {
      return element.dataset;
    }
    return ymUIKit.progressIndicators.goToStep(id, nextStep);
  },

  moveBackward: function(id) {
    var element = document.getElementById(id),
        currentStep = element.dataset.currentStep,
        nextStep = Number(currentStep) - 1;
    if (currentStep == 1) {
      return element.dataset;
    }
    return ymUIKit.progressIndicators.goToStep(id, nextStep);
  },

  goToStep: function(id, stepNumber) {

    var element = document.getElementById(id),
        totalSteps = element.dataset.totalSteps,
        activeClass = 'ymb_progress-indicator-number-active',
        emptyClass = 'ymb_progress-indicator-number-empty',
        completeClass = 'ymb_progress-indicator-number-complete',
        emptyBarClass = 'ymb_progress-indicator-bar-inner-empty',
        filledBarClass = 'ymb_progress-indicator-bar-inner-filled',
        circleClass = 'ymb_progress-indicator-number',
        barClass = 'ymb_progress-indicator-bar-inner',
        circles = element.getElementsByClassName(circleClass),
        bars = element.getElementsByClassName(barClass);

    // No step numbers lower than 1.
    if (stepNumber < 1) {
      stepNumber = 1;
    }

    // Don't let step number be more than 1 greater than total steps.
    if (stepNumber > totalSteps) {
      stepNumber = Number(totalSteps) + 1;
    }

    for (var i = 0; i < circles.length; i++) {
      var circle = circles[i],
          circleStepNumber = i + 1;

      if (circleStepNumber < stepNumber) {
        ymUIKit.utils.removeClassName(circle, emptyClass);
        ymUIKit.utils.removeClassName(circle, activeClass);
        ymUIKit.utils.addClassName(circle, completeClass);
      } else if (circleStepNumber == stepNumber) {
        ymUIKit.utils.removeClassName(circle, emptyClass);
        ymUIKit.utils.addClassName(circle, activeClass);
        ymUIKit.utils.removeClassName(circle, completeClass);
      } else if (circleStepNumber > stepNumber) {
        ymUIKit.utils.addClassName(circle, emptyClass);
        ymUIKit.utils.removeClassName(circle, activeClass);
        ymUIKit.utils.removeClassName(circle, completeClass);
      }
    }

    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i],
          barStepNumber = i + 1;
      if (barStepNumber < stepNumber) {
        ymUIKit.utils.addClassName(bar, filledBarClass);
        ymUIKit.utils.removeClassName(bar, emptyBarClass);
      } else {
        ymUIKit.utils.removeClassName(bar, filledBarClass);
        ymUIKit.utils.addClassName(bar, emptyBarClass);
      }
    }
    element.dataset.currentStep = stepNumber;
    return element.dataset;
  }
};

/* jshint ignore:start */

var ymUIKit = ymUIKit || {};

/*
 * UTILS
 *
 */
ymUIKit.utils = {

  elementIsBlank: function(element) {
    return element.value === '' || !element.value;
  },

  updateClassNameById: function(id, newClass, oldClass) {
    if (document.getElementById(id)) {
      var el = document.getElementById(id);
      ymUIKit.utils.updateClassName(el, newClass, oldClass);
    }
  },

  updateClassName: function(el, newClass, oldClass) {
    if (!el || !el.className) { return; }
    return el.className = el.className.replace(newClass, oldClass);
  },

  addClassNameById: function(id, newClass) {
    if (document.getElementById(id)) {
      var el = document.getElementById(id);
      ymUIKit.utils.addClassName(el, newClass);
    }
  },

  addClassName: function(el, newClass) {
    if (!el || !el.className) { return; }
    if (el.className.search(newClass) == -1) {
      el.className = el.className + ' ' + newClass;
    }
  },

  removeClassNameById: function(id, oldClass) {
    if (document.getElementById(id)) {
      var el = document.getElementById(id);
      ymUIKit.utils.removeClassName(el, oldClass);
    }
  },

  removeClassName: function(el, oldClass) {
    if (!el || !el.className) { return; }
    if (el.className.search(oldClass) != -1) {
      el.className = el.className.replace(oldClass, '');
    }
  },

  updateLinkOpacity: function(opacity) {
    var links = document.getElementsByClassName('ymb_header-topnav-link');
    for (var i = 0; i < links.length; i++) {
      links[i].style.opacity = opacity;
    }
  }
};

/* jshint ignore:end */
