 /*!
  * Sumo Number Formatter
  * http://sumofy.me/
  *
  * Copyright Think Sumo Creative Media Inc.
  * Developed by Jiez Lawsin
  * Released under the MIT license.
  * http://sumofy.me/
  *
  */

(function($) {
	$.fn.sumonumberformatter = function(options) {
		if(typeof _.each === 'undefined') {
			throw new Error('sumo-number-formatter requires Underscore.js to be loaded first');
		}

		var defaults = {  
			    commas: true, // enable/disable auto commas; true as enabled(default)
			    maxVal: null, // maximum valid value; null for infinite
			    minVal: 0, // minimum valid value; negative is not valid on default
				placesCount: 0 // decimal places count; no decimal places on default 
			};

		//Extend those options
		var options = $.extend(defaults, options); 

		return $(this).each(function(e) {
			var elem = $(this); // element

			processNumber(elem , options, null);
			bindEvents(elem, options);
		});
	}
})(jQuery);


function numberWithCommas(n) {
	var parts=n.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}


function clearValue(val) {
	var chars = val.toString().split('')
	var regex = /^[0-9.]+$/;
	var result = '';

	_.each(chars, function(char, index) {
		if (regex.test(char)) {
			result += char;
		} else {
			if (char == '-') {
				if (index == 0) {
					result += char;
				}
			}
		}
	});
	return (result !== '') ? result : 0;
}

function processNumber(elem, options, position) {
	var value = elem.val();
    var max = options.maxVal;
    var min = options.minVal;
    var decimal = options.placesCount;
    var comma = (elem.val().match(/,/g) || []).length;

    if(value) 
		value = clearValue(value);
    else
		value = 0;

    if(parseFloat(value) < parseFloat(min)) {
		min = parseFloat(min);
		if (options.commas) {
			elem.val(numberWithCommas(min.toFixed(decimal)));
		} else {
			elem.val(min.toFixed(decimal));
		}
    } else {
		if(max) {
			if(parseFloat(value) >= parseFloat(max))
				value = max;  
		} 
      
		var formatted_value;
		
		if (options.commas) {
			formatted_value = numberWithCommas(parseFloat(value).toFixed(decimal));
		} else {
			formatted_value = parseFloat(value).toFixed(decimal);
		}

		elem.val(formatted_value);
    }

    if(comma < (elem.val().match(/,/g) || []).length) 
		comma = 1;
	else if(comma > (elem.val().match(/,/g) || []).length)
		comma = -1;
	else
		comma = 0

	if(position != null) {
	    elem.setCursorPosition(position + comma);
	}
}

function bindEvents(elem, options) {
	elem.on('change', function(e) {
		console.log('change');
		processNumber($(this), options, $(this).getCursorPosition());
	});
}
