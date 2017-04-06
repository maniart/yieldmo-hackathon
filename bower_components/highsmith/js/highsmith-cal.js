/*
 * Highsmith - a simple, JS only calendar picker
 * with a handful of customization options.  Check out
 * the README for all options.
 */

var Highsmith = function(elementId, userOptions) {

    var colors = {
        ltGray : '#F1F1F1',
        gray   : '#DCDCDC',
        mdGray : 'rgb(202, 201, 201)',
        dkGray : '#333333',
        white  : "#FFFFFF"
    }

    // Default options, if none have been passed.
    var defaultOptions = {

        format              : 'mdy',
        customDate          : false,
        killButton          : false,
        resetDateButton     : false,
        disableOffClicker   : false,
        futureOnly          : false,
        style               : {
          disable           : false,
          month             : {
              bgColor       : colors.ltGray,
              color         : colors.dkGray,
              fontFamily    : 'Georgia, serif',
              fontSize      : '16px',
              labelSize     : '80%',
              padding       : '4px',
              toggleSize    : '10%'

          },
          year              : {
              bgColor       : colors.ltGray,
              color         : colors.dkGray,
              fontFamily    : 'Georgia, serif',
              fontSize      : '14px',
              labelSize     : '60%',
              padding       : '4px',
              toggleSize    : '10%'
          },
          days              : {
              bgColor       : colors.ltGray,
              color         : colors.dkGray,
              fontFamily    : 'Georgia, serif',
              fontSize      : '13px',
              height        : '16px',
              legendBgColor : colors.gray,
              legendColor   : colors.dkGray,
              nullBgColor   : colors.mdGray,
              padding       : '4px',
              width         : '20px'
          },
          globals: {
              fontFamily    : 'Georgia, serif',
              bgColor       : colors.white,
              border        : '1px solid ' + colors.ltGray,
              borderRadius  : '2px',
              downArrowIcon : '&#8672;',
              upArrowIcon   : '&#8674;',
              width         : '200px'
          },
          buttons           : {
              fontSize      : '12px',
              padding       : '4px'
          }
        }
    };

    // Get an element.
    function get(id) {
        return document.getElementById(id);
    }

    // Create a dom element.
    function create(type, id, content) {
        var el = document.createElement(type);

        id            = id || '';
        content       = content || '';
        var className = id || '';

        el.id         = id;
        el.className  = className;
        el.innerHTML  = content;

        return el;
    }

    function getCurrentCalendarDate() {
        if (options.customDate && el.value && el.value != '') {
            return new Date(el.value) == 'Invalid Date' ?
                new Date() : new Date(el.value);
        } else {
            return new Date();
        }
    }

    // Days of the week, in order.
    var dayList     = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday'];

    // Months of the year.
    var monthList   = [ 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Capture the default options as the current options.
    var options     = defaultOptions;

    // Update the options with any options passed by the user.
    updateOptions(userOptions);

    // The element being Highsmithed.
    var el          = get(elementId);
    el.readOnly     = true;

    // Set the starting date of the Cal.
    var currentCalendarDate = getCurrentCalendarDate();

    // The id of the calendar item.
    var calIdentity = 'highsmithCal';

    // Declare the globals we'll be using for the cal.
    var month,
        year,
        day,
        dayOfWeek,
        daysInMonth;

    /*
     * Set the calendar to the UI.  This is the main function; it is the click
     * action of the input attached to the calendar.  It builds the dom
     * elements of the calendar and renders it to the UI.
     */
    function setCalendar (event) {

        // If the calendar exists, remove it.
        if (get(calIdentity)) {
            removeCalendar();
        }

        // Set a div behind the cal.  Allows the calendar to close when the user
        // clicks away from it.
        setupOffClicker();

        // Create the calendar element.
        setupCalendar();

    }

    // When a user clicks away from the calendar, this div's onclick listener
    // removes the calendar.
    function setupOffClicker() {
        if (!options.disableOffClicker) {
            var div = create('div', 'highsmithCal--offClicker');
            if (!options.style.disable) {
                var styleOptions = {
                  'display'   : 'block',
                  'position'  : 'fixed',
                  'top'       : 0 + 'px',
                  'left'      : 0 + 'px',
                  'bottom'    : 0 + 'px',
                  'right'     : 0 + 'px',
                  'zIndex'    : '9999'
                };
                styleElement(div, styleOptions);
            }

            document.body.appendChild(div);
            // Close the calendar if the user clicks 'off' of it.
            div.addEventListener('click', function() {
                removeCalendar();
            });
        }
    }

    // Set up the calendar dom elements
    function setupCalendar() {

        var cal = create('div', calIdentity);

        // Add the month, year and day elements
        addMonth(cal);
        addYear(cal);
        addDayLegend(cal);
        addDayHolder(cal);

        // Add some global styles to the calendar.
        cal = styleCal(cal);

        document.body.appendChild(cal);

        addDays();
        addResetButton();
        addKillButton();
    }

    // Add the span that holds the month label and toggles.
    function addMonth(cal) {

        var style = options.style.month;

        // Create a span to hold the month, as well as buttons to toggle it
        // up or down.
        var monthSpan = create('span', 'highsmithCal--month')

        // Create a toggle icon to decrement the month.
        var downLabel = create('label', 'highsmithCal--month__decrement',
            options.style.globals.downArrowIcon)

        // Create a label
        var monthLabel = create('label', 'highsmithCal--month__label',
            monthList[month]);

        // Create a toggle icon to increment the month.
        var upLabel = create('label', 'highsmithCal--month__increment',
            options.style.globals.upArrowIcon);

        // Decrement the month when the toggle is clicked.
        downLabel.addEventListener('click', function() {
            decrementMonth();
        });

        // Increment the month when the toggle is clicked.
        upLabel.addEventListener('click', function() {
            incrementMonth();
        });

        styleMonthAndYear(monthSpan, monthLabel, upLabel, downLabel, style, cal);
    }

    // Add the year label and toggles to the calendar.
    function addYear(cal) {

        var style       = options.style.year;

        // Create a span to hold the year, as well as buttons to toggle it
        // up or down.
        var yearSpan    = create('span', 'highsmithCal--year')

        // Create a toggle icon to decrement the year.
        var downLabel   = create('label', 'highsmithCal--year__decrement',
                          options.style.globals.downArrowIcon)

        // Create a label
        var yearLabel   = create('label', 'highsmithCal--year__label', year);

        // Create a toggle icon to increment the year.
        var upLabel     = create('label', 'highsmithCal--year__increment',
                          options.style.globals.upArrowIcon);

        // Decrement the year when the button is clicked.
        downLabel.addEventListener('click', function() {
            decrementYear();
        });

        // Increment the year when the button is clicked.
        upLabel.addEventListener('click', function() {
            incrementYear();
        });

        styleMonthAndYear(yearSpan, yearLabel, upLabel, downLabel, style, cal);
    }

    // Style the month/year divs.
    function styleMonthAndYear(span, label, up, down, style, cal) {
        if (!options.style.disable) {
            var spanOptions   = {
                'fontSize'        : style.fontSize,
                'padding'         : style.padding,
                'backgroundColor' : style.bgColor,
                'color'           : style.color,
                'display'         : 'block'
            };
            var upOptions     = {
                'width'           : style.toggleSize,
                'height'          : style.toggleSize,
                'cursor'          : 'pointer'
            };
            var downOptions   = {
                'width'           : style.toggleSize,
                'height'          : style.toggleSize,
                'cursor'          : 'pointer'
            };
            var labelOptions  = {
                'width'           : style.labelSize,
              'display'           : 'inline-block'
            };

            styleElement(label, labelOptions);
            styleElement(down, downOptions);
            styleElement(up, upOptions);
            styleElement(span, spanOptions);
        }

        // Append the year items to the year holder.
        span.appendChild(down);
        span.appendChild(label);
        span.appendChild(up);

        // Append the year holder to the calendar.
        cal.appendChild(span)
    }

    // Add the reset button to the calendar.
    function addResetButton(div) {
        if (!get('highsmithCal--resetButton') &&
            options.resetDateButton) {
            var resetSpan =
                create('span', 'highsmithCal--resetButton', 'reset');
            styleButtons(resetSpan, resetDate);
        }
    }

    // Add the kill button to the calendar.
    function addKillButton(div) {
        if (!get('highsmithCal--killButton') &&
            options.killButton) {
              var killSpan =
                  create('span', 'highsmithCal--killButton', 'remove calendar');
              styleButtons(killSpan, killCalListener);
        }
    }

    // Style the kill/reset buttons.
    function styleButtons(button, clickFn) {
        var style = options.style.buttons;
        if (!options.style.disable) {
            var styleOptions = {
                'fontSize'        : style.fontSize,
                'padding'         : style.padding,
                'backgroundColor' : style.bgColor,
                'display'         : 'block',
                'cursor'          : 'pointer'
            };
            styleElement(button, styleOptions);
        }
        get('highsmithCal').appendChild(button);
        button.addEventListener('click', clickFn);
    }

    // Add day legend, the part of the cal that shows the days of the week.
    function addDayLegend(div) {

        var style = options.style.days;

        var dateHolder = create('span', 'highsmithCal--daysLegend');
        if (!options.style.disable) {
            var styleOptions = {
                'fontSize'          : style.fontSize,
                'color'             : style.color,
                'backgroundColor'   : style.legendBgColor,
                'display'           : 'block',
                'textAlign'         : 'left'
            };
            styleElement(dateHolder, styleOptions);
        }

        var days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];

        for (var i = 0; i < days.length; i++) {
            var dateElement = create('label', 'highsmithCal--daysLegend__label',
                days[i]);

            if (!options.style.disable) {
                var styleOptions = {
                    'padding'       : style.padding,
                    'width'         : style.width,
                    'height'        : style.height,
                    'color'         : style.legendColor,
                    'display'       : 'inline-block',
                    'textAlign'     : 'center'
                };
                styleElement(dateElement, styleOptions);
            }
            dateHolder.appendChild(dateElement);
        }
        div.appendChild(dateHolder);
    }

    // Add the part of the calendar that will hold the number days.
    function addDayHolder(div) {

        var style = options.style.days;

        var dateHolder = create('span', 'highsmithCal--dayHolder');
        if (!options.style.disable) {
            var styleOptions = {
                'fontSize': style.fontSize,
                'backgroundColor': style.bgColor,
                'display': 'block',
                'textAlign': 'left'
            };
            styleElement(dateHolder, styleOptions)
        }
        div.appendChild(dateHolder);
    }

    // Add the actual calendar days to the calendar.
    function addDays() {

        var s = options.style.days;

        var dateHolder = get('highsmithCal--dayHolder');
        dateHolder.innerHTML = '';

        var firstDay = new Date(year, month, 1).getDay();

        for (var i = 0; i < firstDay; i++) {
            var dateElement = create('label',
                'highsmithCal--dayHolder__nullLabel');
            if (!options.style.disable) {
                var styleOptions = {
                    'padding'         : s.padding,
                    'width'           : s.width,
                    'height'          : s.height,
                    'backgroundColor' : s.nullBgColor,
                    'display'         : 'inline-block',
                    'textAlign'       : 'center',
                    'verticalAlign'   : 'top'
                };
                styleElement(dateElement, styleOptions);
            }
            dateHolder.appendChild(dateElement);
        }

        var dayOne = new Date(year, month, 1);
        var lastDate = new Date(year, (month + 1), 1);
        var daysInMonth = (lastDate - dayOne) / (1000 * 60 * 60 * 24);

        for (var date = 1; date <= daysInMonth; date++) {

            var theDay = new Date(year, month, date);
            var isFuture = (theDay - new Date()) > 0;

            var dateElement = create('label', 'highsmithCal--dayHolder__label',
                date);

            if (!options.style.disable) {
              var styleOptions = {
                  'padding'         : s.padding,
                  'width'           : s.width,
                  'height'          : s.height,
                  'backgroundColor' : s.bgColor,
                  'display'         : 'inline-block',
                  'textAlign'       : 'center',
                  'verticalAlign'   : 'top',
                  'cursor'          : 'pointer',
                  'transition'      : 'all 0.2s'
              };
              // Highlight today on the calendar.
              // console.log(day, new Date().getDate());
              if (date == (new Date().getDate()) &&
                  month == (new Date()).getMonth()) {
                  styleOptions.border = '1px solid ' + s.color;
              }
              styleElement(dateElement, styleOptions);
            }

            if (options.futureOnly) {
                if (isFuture) {

                  dateElement.addEventListener('click', setDateToInput);

                  if (!options.style.disable) {
                      dateElement.addEventListener('mouseenter', function(e) {
                          e.target.style.backgroundColor = s.legendBgColor;
                      });

                      dateElement.addEventListener('mouseleave', function(e) {
                          e.target.style.background = 'none';
                      });
                  }

                } else {
                  dateElement.style.opacity = "0.2";
                }
            } else {
                dateElement.addEventListener('click', setDateToInput);
                dateElement.addEventListener('mouseenter', function(e) {
                    e.target.style.backgroundColor = s.legendBgColor;
                });

                dateElement.addEventListener('mouseleave', function(e) {
                    e.target.style.background = 'none';
                });
            }


            dateHolder.appendChild(dateElement);
        }

    }

    // Give the calendar some global stylings.
    function styleCal(cal) {

        var style = options.style.globals;
        var location = el.getBoundingClientRect();
        var trueTop =
            (location.top + document.body.scrollTop + location.height);

        if (!options.style.disable) {
            var styleOptions = {
                'fontFamily'        : style.fontFamily,
                'border'            : style.border,
                'backgroundColor'   : style.bgColor,
                'width'             : style.width,
                'borderRadius'      : style.borderRadius,
                'display'           : 'block',
                'position'          : 'absolute',
                'zIndex'            : '10000',
                'top'               : trueTop  + 'px',
                'left'              : location.left + 'px',
                'textAlign'         : 'center',
            };
            styleElement(cal, styleOptions);
        }
        return cal;
    }

    // Remove the calendar from the dom.
    function removeCalendar() {
        if (get('highsmithCal--offClicker')){
            get('highsmithCal--offClicker').remove();
        }
        if (get(calIdentity)) {
            get(calIdentity).remove();
        }
    }

    // Increment the calendar month.
    function incrementMonth() {
        month++;
        if (month > monthList.length - 1) {
            month = 0;
            year++;
        }
        updateCalendar();
    }

    // Decrement the calendar month.
    function decrementMonth() {
        month--;
        if (month < 0) {
            month = monthList.length - 1;
            year--;
        }
        updateCalendar();
    }

    // Increment the calendar year.
    function incrementYear() {
        year++;
        updateCalendar();
    }

    // Decrement the calendar year.
    function decrementYear() {
        year--;
        updateCalendar();
    }

    // Update the display of the calendar.
    function updateCalendar() {
        get('highsmithCal--month__label')
            .innerHTML = monthList[month];
        get('highsmithCal--year__label')
            .innerHTML = year;
        addDays();
    }

    // Reset calendar date and update the display.
    function resetDate() {
        resetToToday();
        updateCalendar();
    }

    // Reset to the default date, which is today's month/day.
    function resetToToday() {
        var date = currentCalendarDate;

        month = date.getMonth();
        year = date.getFullYear();
        day = date.getDate();
        dayOfWeek = date.getDay();
        daysInMonth = new Date(year, month, 0).getDate();
    }

    // Format the selected date, place it in the Highsmithed element, and remove
    // the calendar from the dom.
    function setDateToInput(event) {
        var day = event.target.innerHTML;
        var localMonth = String(month + 1);

        day = ('0' + day).slice(-2);
        localMonth = ('0' + localMonth).slice(-2);

        var val;
        if (options.format == 'mdy') {
            val = localMonth + '/' + day + '/' + year;
        } else if (options.format == 'ymd') {
            val = year + '/' + localMonth + '/' + day;
        } else {
            val = day + '/' + localMonth + '/' + year;
        }

        el.value = val;
        el.innerHTML = val;
        removeCalendar();
    }

    // Stop said Highsmith instance.
    function killCalListener() {
        removeCalendar();
        el.removeEventListener('click', setCalendar);
        el.readOnly = false;
    }

    // Log the current options to the dom.
    function showOptions() {
        console.log(options);
    }

    // Update the current options from a live instance of Highsmith.  Invoked
    // like so: hsInstance.updateOptions(optionsObject);
    function updateOptions(optionObject, optionsNode) {
        optionsNode = optionsNode || options;
        for (item in optionObject) {
          updateOptionsObject(optionObject, item, optionsNode)
        }
    }

    // Explore the customer user options and update the global options object.
    function updateOptionsObject(userOptions, item, optionsNode) {
        if (typeof optionsNode[item] != 'object') {
            optionsNode[item] = userOptions[item];
        } else {
            updateOptions(userOptions[item], optionsNode[item]);
        }
    }

    function styleElement(element, opts) {
        for (opt in opts) {
            element.s(opt, opts[opt]);
        }
    }

    // Custom function to remove a dom element without knowing its parent.
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    }

    Element.prototype.s = function(param, value) {
        this.style[param] = value;
    }

    // Add the calendar event listener to the Highsmithed element.
    el.addEventListener("click", setCalendar, false);

    // Reset the date to today.
    resetToToday();

    // Expose some public functions to the Highsmith instance.
    return {

      kill: killCalListener,
      showOptions: showOptions,
      updateOptions: updateOptions,
      removeCalendar: removeCalendar

    }
};
