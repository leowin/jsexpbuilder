(function ($) {
    $.fn.jsExpBuilder = function (fn, o) { // both fn and o are [optional]
        return this.each(function () { // each() allows you to keep internal data separate for each DOM object that's being manipulated in case the jQuery object (from the original selector that generated this jQuery) is being referenced for later use
            var $this = $(this); // in case $this is referenced in the short cuts

            // short cut methods
            if (fn === "method1") {
                if ($this.data("method1"))  // if not initialized method invocation fails
                    $this.data("method1")() // the () invokes the method passing user options
            } else if (fn === "method2") {
                if ($this.data("method2"))
                    $this.data("method2")()
            } else if (fn === "method3") {
                if ($this.data("method3"))
                    $this.data("method3")(o) // passing the user options to the method
            } else if (fn === "destroy") {
                if ($this.data("destroy"))
                    $this.data("destroy")()
            }
            // continue with initial configuration

            var _data1,
                _data2,
                _default = { // contains all default parameters for any functions that may be called
                    param1: "value #1",
                    param2: "value #2",
                },
                _options = {
                    param1: (o === undefined) ? _default.param1 : (o.param1 === undefined) ? _default.param1 : o.param1,
                    param2: (o === undefined) ? _default.param2 : (o.param2 === undefined) ? _default.param2 : o.param2,

                }
            method1 = function () {
                // do something that requires no parameters
                return;
            },
            method2 = function () {
                // do some other thing that requires no parameters
                return;
            },
            method3 = function () {
                // does something with param1
                // _options can be reset from the user options parameter - (o) - from within any of these methods as is done above
                return;
            },
            initialize = function () {
                // may or may not use data1, data2, param1 and param2
                $this
                    .data("method1", method1)
                    .data("method2", method2)
                    .data("method3", method3)
                    .data("destroy", destroy);
            },
            destroy = function () {
                // be sure to unbind any events that were bound in initialize(), then:
                $this
                    .removeData("method1", method1)
                    .removeData("method2", method2)
                    .removeData("method3", method3)
                    .removeData("destroy", destroy);
            }
            initialize();
        }) // end of each()
    } // end of function        
})(jQuery);






var rootcondition = '<table class="dropable" cellspacing="0"><tr class="droptarget operator"><td class="seperator" ><img src="res/remove.png" alt="Remove" class="remove" /><select><option value="and">And</option><option value="or">Or</option></select></td>';
rootcondition += '<td><div class="querystmts"></div><div><img class="add" src="res/add.png" alt="Add" /> <button class="addroot">+()</button></div>';
rootcondition += '</td></tr></table>';

var statement = '<div draggable="true" class="draggable droptarget stmt" ><span class="handle"> H </span><img src="res/remove.png" alt="Remove" class="remove" />'

statement += '<select class="col">';
statement += '<option value="code">Code</option>';
statement += '<option value="country">Country</option>';
statement += '<option value="capital">Capital</option>';
statement += '<option value="govt">Government</option>';
statement += '<option value="cont">Continent</option>';
statement += '<option value="national">Nationalhood</option>';
statement += '<option value="area">Area(km2)</option>';
statement += '<option value="pop">Population</option>';
statement += '<option value="gdp">GDP($M)</option>';
statement += '<option value="g8">G8</option>';
statement += '</select>';

statement += '<select class="op">';
statement += '<option value="contains">contains</option>';
statement += '<option value="startswith">starts with</option>';
statement += '<option value="endswith">ends with</option>';
statement += '<option value="doesnotcontain">does not contain</option>';
statement += '<option value="doesnotstartwith">does not start with</option>';
statement += '<option value="national">does not end with</option>';
statement += '<option value="area">equals</option>';
statement += '<option value="pop">not equal</option>';
statement += '<option value="gdp">less than</option>';
statement += '<option value="g8">greater than</option>';
statement += '<option value="g8">less than or equal to</option>';
statement += '<option value="g8">greater than or equal to</option>';
statement += '<option value="g8">between</option>';
statement += '<option value="g8">is null</option>';
statement += '<option value="g8">is not null</option>';
statement += '<option value="g8">matches other field</option>';
statement += '<option value="g8">differs from field</option>';
statement += '</select>'

statement += '<input type="text" /></div>';

var addqueryroot = function (sel, isroot) {
    $(sel).append(rootcondition).find('.dropable').on('dragover', dragover).on('drop', drop).on('dragleave', dragleave);
    var q = $(sel).find('table');
    var l = q.length;
    var elem = q;
    if (l > 1) {
        elem = $(q[l - 1]);
    }

    //If root element remove the close image
    if (isroot) {
        elem.find('td >.remove').detach();
    }
    else {
        elem.find('td >.remove').click(function () {
            // td>tr>tbody>table
            $(this).parent().parent().parent().parent().detach();
        });
    }

    // Add the default staement segment to the root condition
    var newEle = $(statement).appendTo(elem.find('td >.querystmts'));

    if (isroot) {
        $(newEle).on('dragstart', dragstart).on('dragend', dragend);
    }
    // Add the head class to the first statement
    elem.find('td >.querystmts div >.remove').addClass('head');

    // Handle click for adding new statement segment
    // When a new statement is added add a condition to handle remove click.
    elem.find('td div >.add').click(function () {
        $(this).parent().siblings('.querystmts').append(statement)
            .on('dragstart', dragstart).on('dragend', dragend);
        var stmts = $(this).parent().siblings('.querystmts').find('div >.remove').filter(':not(.head)');
        stmts.unbind('click');
        stmts.click(function () {
            $(this).parent().detach();
        });
    });

    // Handle click to add new root condition
    elem.find('td div > .addroot').click(function () {
        addqueryroot($(this).parent(), false);
    });
};
var dragEvent = null;
var placeholder = null;
var dragged = null;
var placeholderPosition = null;
var placeholderPositionBefore = null;
var placeholderRect = null;

var dragstart = function (e) {
    dragEvent = event;
    event.stopPropagation();
    dragged = $(event.target);
    dragged.addClass('dragged');
}
var dragend = function (e) {
    if (dragged == null)
        return;
    dragged.removeClass('dragged');
    if (placeholder != null) {
        dragged.detach();
        placeholder.replaceWith(dragged);
    }
    dragged = null; placeholder = null;
    dragEvent = null;
   
}
var createPlaceholder = function (dragged) {
    if( dragged.is('stmt'))
        return dragged.clone();
    var stmt = $(statement);
    stmt.find('select').first().replaceWith(dragged.html());
    return stmt;
}
var drop = function (e) {
    console.log('drop');
}
var dragover = function (e) {
    //console.log('dragover', event, dragEvent);
    var dparent = $(event.toElement).closest('.operator');
    if ($(placeholder).closest('.operator').is(dparent))
        return;
    if (dragged.closest('.operator').is(dparent)) {
        setGhost(null);
        return;
    }

    //console.log(event.x, event.y);
    
    /*if (placeholder != null && hittest(event.x, event.y, placeholderRect)) {
        console.log('hit');
        return;
    }*/
    /*if (dp.is(placeholder)) 
        return;
    if (dp.is(dragged) && placeholder!=null) {
        setGhost(null);
        return;
    }*/
    dparent.addClass('emphasized');
    var ph = createPlaceholder(dragged);
    setGhost(ph, dparent.find('.querystmts').first());
}


var setGhost = function (newPlaceholder, destination, before) {
    console.log('setplaceholder', newPlaceholder)
    if (placeholderPosition != null && newPlaceholder != null && destination.is(placeholderPosition)) {
        //reuse same placeholder
        if (placeholderPositionBefore == before)
            return;
        else {
            placeholder.detach();
        }
    }
    if (placeholder != null) {
        placeholder.detach();
        placeholder = null;
        placeholderPosition = null;
    }
    if (newPlaceholder == null) {
        return;
    }
    placeholder = newPlaceholder.addClass('placeholder').removeClass('dragged').removeClass('emphasized');
    if (before) {
        destination.before(newPlaceholder);
    }
    else {
        destination.append(newPlaceholder);
        newPlaceholder.hide().slideDown();
    }
    placeholderPosition = destination;
    placeholderPositionBefore = before;
    placeholderRect = {left: placeholder.offset().left, top: placeholder.offset().top, width : placeholder.width(), height: placeholder.height() }
}

var dragleave = function (e) {
    //setGhost(null);
    $(event.toElement).closest('.droptarget').removeClass('emphasized');
}


//Recursive method to parse the condition and generate the query. Takes the selector for the root condition
var getCondition = function (rootsel) {
    //Get the columns from table (to find a clean way to do it later) //tbody>tr>td
    var elem = $(rootsel).children().children().children();
    //elem 0 is for operator, elem 1 is for expressions

    var q = {};
    var expressions = [];
    var nestedexpressions = [];

    var operator = $(elem[0]).find(':selected').val();
    q.operator = operator;

    // Get all the expressions in a condition
    var expressionelem = $(elem[1]).find('> .querystmts div');
    for (var i = 0; i < expressionelem.length; i++) {
        expressions[i] = {};
        var col = $(expressionelem[i]).find('.col :selected');
        var op = $(expressionelem[i]).find('.op :selected');
        expressions[i].colval = col.val();
        expressions[i].coldisp = col.text();
        expressions[i].opval = op.val();
        expressions[i].opdisp = op.text();
        expressions[i].val = $(expressionelem[i]).find(':text').val();
    }
    q.expressions = expressions;

    // Get all the nested expressions
	 if ($(elem[1]).find('> div > table').length != 0) {
       var len = $(elem[1]).find('> div > table').length;

        for (var k = 0; k < len; k++) {
           nestedexpressions[k] = getCondition($(elem[1]).find('> div > table')[k]);
        }
    }
    q.nestedexpressions = nestedexpressions;

    return q;
};

//Recursive method to iterate over the condition tree and generate the query
var getQuery = function (condition) {
    var op = [' ', condition.operator, ' '].join('');

    var e = [];
    var elen = condition.expressions.length;
    for (var i = 0; i < elen; i++) {
        var expr = condition.expressions[i];
        e.push(expr.colval + " " + expr.opval + " " + expr.val);
    }

    var n = [];
    var nlen = condition.nestedexpressions.length;
    for (var k = 0; k < nlen; k++) {
        var nestexpr = condition.nestedexpressions[k];
        var result = getQuery(nestexpr);
        n.push(result);
    }

    var q = [];
    if (e.length > 0)
        q.push(e.join(op));
		
    if (n.length > 0)
        q.push(n.join(op));

    return ['(', q.join(op), ')'].join(' ');
};


var hittest = function( x,y, rect) {
    if(x >=rect.left && x<=(rect.left + rect.width) && y >= rect.top && y<=(rect.top + rect.height))
        return true;
    else 
        return false;
}

$(function () {
    $('.fields .draggable').on('dragstart', dragstart).on('dragend', dragend);
});
