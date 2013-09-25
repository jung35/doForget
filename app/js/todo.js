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
    var urgencyRadio = parseInt($('.newTodoInputRadio input[type="radio"]:checked').val()),
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

    var newObj = JSON.parse(localStorage['todo']);
    newObj["list"+listSize] = {
        time: +new Date(),
        urgency: urgency,
        title: title,
        extra: extra,
        listSize: listSize
    }

    localStorage.setItem('todo',JSON.stringify(newObj));

    console.log(localStorage['todo']);

    objTime["list"+listSize] = {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
    }

}

$('.doForgetList').on('click', '.doForgetTodo', function() {
    var listPos = $(this).offset();

    $('.todoEditBg').fadeIn('slow').find('.todoEdit').css({
        top: listPos.top,
        left: listPos.left
    });
});

$('.todoEditBg').on('click', function(evt) {
    if($(event.target).is('.todoEdit')) {

    } else {
        $(this).fadeOut('fast');
    }
});
