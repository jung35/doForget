var localExists = 1;

$(function() {
    if(localStorage['todo'] == undefined) {
        localStorage.setItem('todo', JSON.stringify({}));
    } else {
        var todos = JSON.parse(localStorage['todo']),
            time;
        $.each(todos, function(k, v) {
            if(v['disabled'] == undefined) {
                time = +new Date();
            } else {
                time = v['disabled'];
                v['urgency'] += '-done';
            }

            var timepassed = time - v['time'];

            objTime[k] = getTimePass(timepassed);

            $('.doForgetList').prepend(
                '<ul class="doForgetTodo urgency-'+v['urgency']+'" id="'+k+'">'
                +'<li class="timer"><div>'+objTime[k]['day']+' Day</div><div>'+objTime[k]['hour']+' Hour</div><div>'+objTime[k]['minute']+' Min</div><div>'+objTime[k]['second']+' Sec</div></li>'
                +'<li class="message"><h4>'+v['title']+'</h4><p>'+v['extra']+'</p></li></ul>'
            );
        });
    }
});
