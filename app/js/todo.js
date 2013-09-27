$('.newTodo').on('click', function() {
    if($(this).text() == 'Todo [+]') {
        $('.newTodoInput').slideDown(500);
        $(this).html('Todo [-]');
    } else {
        $('.newTodoInput').slideUp(400);
        $(this).html('Todo [+]');
    }
});

function newTodo(form) {
    var urgencyRadio = parseInt($('.newTodoInput .todoInputRadio input[type="radio"]:checked').val()),
        title = form.title.value,
        extra = form.todoInputExtra.value,
        listSize = $('.doForgetList ul').length + 1,
        urgency = 'low';

    if(!(urgencyRadio >= 1 && urgencyRadio <= 3)) {
        alert('Please select the urgency.');
        exit;
    } else if(title.length < 1) {
        alert('The title is not long enough.');
        exit;
    } else if(extra.length > 132) {
        alert('Please make the extra note shorter');
        exit;
    }

    if(extra.length < 1) {extra = '';}

    switch(urgencyRadio) {
        case 2:
            urgency = 'med';
            break;
        case 3:
            urgency = 'high';
            break;
    }

    $('.doForgetList').prepend(
        '<ul class="doForgetTodo urgency-'+urgency+'" id="list'+listSize+'">'
        +'<li class="timer"><div>0 Day</div><div>0 Hour</div><div>0 Min</div><div>0 Sec</div></li>'
        +'<li class="message"><h4>'+title+'</h4><p>'+extra+'</p></li></ul>'
    );

    if(localExists) {
        var newObj = JSON.parse(localStorage['todo']);
        newObj["list"+listSize] = {
            time: +new Date(),
            urgency: urgency,
            title: title,
            extra: extra,
            listSize: listSize
        }

        localStorage.setItem('todo',JSON.stringify(newObj));
    }

    objTime["list"+listSize] = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    }
    $('.newTodoInput input[name="title"]').val('');
    $('.newTodoInput textarea').val('');
    $('.newTodo').html('Todo [+]');
    $('.newTodoInput').slideUp(400);
}

function exitEditTodo() {
    $('.editTodoInputBg').fadeOut('fast');
}

$('.doForgetList').on('click', '.doForgetTodo', function() {
    var listPos = $(this).offset();

    if($(this).is('.urgency-low-done, .urgency-med-done, .urgency-high-done'))  {
        $('.icon-checkmark').attr('class','icon-undo');
    }

    $('.todoEdit').attr("data-which",$(this).attr('id'));

    $('.todoEditBg').fadeIn('slow').find('.todoEdit').css({
        top: listPos.top,
        left: listPos.left
    });
});

$('.todoEditBg').on('click', function(evt) {
    var targ = $(evt.target),
        which =  $('.todoEdit').attr('data-which'),
        thisElement = $('#'+which);
    if(targ.is('.todoEdit li')) {
        if(targ.is('.icon-checkmark')) {
            thisElement.attr('class', 'doForgetTodo '+thisElement.attr('class').split(" ")[1]+'-done');
            if(localExists) {
                var todos = JSON.parse(localStorage['todo']);
                if(todos[which] != undefined) {
                    todos[which]['disabled'] = +new Date();
                    localStorage.setItem('todo', JSON.stringify(todos));
                    delete objTime[which];
                } else {
                    window.location = "";
                }
            }
        } else if(targ.is('.icon-undo')) {
            var newClass = thisElement.attr('class').split(" ")[1].split('-');
            thisElement.attr('class', 'doForgetTodo '+newClass[0]+'-'+newClass[1]);
            if(localExists) {
                var todos = JSON.parse(localStorage['todo']);
                if(todos[which] != undefined) {
                    delete todos[which]['disabled'];
                    localStorage.setItem('todo', JSON.stringify(todos));
                    objTime[which] = getTimePass(+new Date() - todos[which]['time']);
                } else {
                    window.location = "";
                }
            }
        } else if(targ.is('.icon-x')) {
            if(confirm('Are you sure you want to delete the Todo?')) {
                thisElement.remove();
                if(localExists) {
                    var todos = JSON.parse(localStorage['todo']);
                    if(todos[which] != undefined) {
                        delete todos[which];
                        localStorage.setItem('todo', JSON.stringify(todos));
                    } else {
                        window.location = "";
                    }
                }
            }
        } else if(targ.is('.icon-list')) {
            if(localExists) {
                var todos = JSON.parse(localStorage['todo']);
                if(todos[which] != undefined) {
                    $('.editTodoInputBg').fadeIn('slow');
                    $('.editUrgency-'+todos[which]['urgency']).attr('checked','checked');
                    $('.editTodoInput input[name="title"]').val(todos[which]['title']);
                    $('.editTodoInput input[name="listId"]').val(which);
                    $('.editTodoInput textarea').val(todos[which]['extra']);
                } else {
                    window.location = "";
                }
            }
        }
    }

    $(this).fadeOut('fast', function() {
        $('.icon-undo').attr('class','icon-checkmark');
    });
});

function editTodo(form) {
    var urgencyRadio = parseInt($('.editTodoInput .todoInputRadio input[type="radio"]:checked').val()),
        title = form.title.value,
        extra = form.todoInputExtra.value,
        listId = form.listId.value,
        urgency = 'low';

    if(!(urgencyRadio >= 1 && urgencyRadio <= 3)) {
        alert('Please select the urgency.');
        exit;
    } else if(title.length < 1) {
        alert('The title is not long enough.');
        exit;
    } else if(extra.length > 132) {
        alert('Please make the extra note shorter');
        exit;
    }

    if(extra.length < 1) {extra = '';}

    switch(urgencyRadio) {
        case 2:
            urgency = 'med';
            break;
        case 3:
            urgency = 'high';
            break;
    }

    if(localExists) {
        var todos = JSON.parse(localStorage['todo']);

        todos[listId]['title'] = title;
        todos[listId]['extra'] = extra;
        todos[listId]['urgency'] = urgency;
        localStorage.setItem('todo', JSON.stringify(todos));
    }
    var listElement = $('#'+listId);

    listElement.find('.message h4').html(title);
    listElement.find('.message p').html(extra);
    listElement.attr('class','doForgetTodo urgency-'+urgency);

    $('.editTodoInputBg').fadeOut('fast');
}
