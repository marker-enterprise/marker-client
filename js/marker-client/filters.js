'use strict';

/* Filters */
var app = angular.module('marker-client.filters', []);

app.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }]);
app.filter('urlify', function() {
    return function(text) {
        if (text) {
            return text.replace(/(^\-+|[^a-zA-Z0-9\/_| -]+|\-+$)/g, '')
                    .toLowerCase()
                    .replace(/[\/_| -]+/g, '-');
        }
    };
});
app.filter('safetitle', function() {
    return function(text) {
        if (text) {
            return text.replace(/(^\-+|[^a-zA-Z0-9\/_| -]+|\-+$)/g, '')
                    .toLowerCase()
                    .replace(/[\/_| -]+/g, '');
        }
    };
});
app.filter('checkmark', function() {
    return function(input) {
        return Number(input) ? '\u2713' : '\u2718';
    };
});

// camelCase To Human Filter
// ---------------------
// Converts a camelCase string to a human readable string.
// i.e. myVariableName => My Variable Name


app.filter('camelCaseToHuman', function() {
    return function(input) {
        return input.charAt(0).toUpperCase() + input.substr(1).replace(/[A-Z]/g, ' $&');
    };
});


app.filter('label', function() {
    return function(input, type, text) {
        return input ? '<span class="label label-' + type + '">' + text + '</span>' : '';
    };
});



app.filter('field_view_41', function() {
    return function(field, keys) {
        var values = [];
        keys = keys.split(',');
        keys.forEach(function(k) {
            values.push(field[k]);
        })
        return values.join(' - ');
    };
});


/**
 * Truncate Filter
 * @Param text
 * @Param length, default is 10
 * @Param end, default is "..."
 * @return string
 */
app.filter('truncate', function() {
    return function(text, length, end) {
        text = $('<div/>').text(text).text();
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }

    };
});

app.filter('filename', function() {
    return function(input) {
        if (input)
            return input.split('/').reverse()[0];
    }
});

app.filter('invertColor', function() {
    return function(color) {
        color = color.substring(1); // remove #
        color = parseInt(color, 16); // convert to integer
        color = 0xFFFFFF ^ color; // invert three bytes
        color = color.toString(16); // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color; // prepend #
        return color;
    }
});