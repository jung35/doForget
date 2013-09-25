var object = {},
    time = +new Date(),
    objTime = {};
if(localStorage['todo'] == undefined) {
    localStorage.setItem('todo', JSON.stringify(object));
} else {
    var todos = JSON.parse(localStorage['todo']);
    $.each(todos, function(k, v) {
        var timepassed = time - v['time'];

        doTime = {};
        doTime['day'] = Math.floor(timepassed / (24*60*60*1000));
        doTime['hour'] = Math.floor(timepassed / (60*60*1000)) - (doTime['day']*24);
        doTime['minute'] = Math.floor(timepassed / (60*1000)) - ((doTime['day']*24*60)+(doTime['hour']*60));
        doTime['second'] = Math.floor(timepassed / 1000) - ((doTime['day']*24*60*60)+(doTime['hour']*60*60)+(doTime['minute']*60));

        console.log(doTime);

        objTime[k] = {
            day: doTime['day'],
            hour: doTime['hour'],
            minute: doTime['minute'],
            second: doTime['second']
        }

        $('.doForgetList').prepend(
            '<ul class="doForgetTodo urgency-'+v['urgency']+'" id="'+k+'">'
            +'<li class="timer"><div>'+objTime[k]['day']+' Day</div><div>'+objTime[k]['hour']+' Hour</div><div>'+objTime[k]['minute']+' Min</div><div>'+objTime[k]['second']+' Sec</div></li>'
            +'<li class="message"><h4>'+v['title']+'</h4><p>'+v['extra']+'</p></li></ul>'
        );
    });
}

$(function() {
    var div = $('.urgency-low .timer, .urgency-med .timer, .urgency-high .timer');

    $.each(div, function(k, v) {
        var times = $(v).find('div'),
            id = $(v).parent().attr('id');

        objTime[id] = {
            day: parseInt($(times[0]).text().split(" ")[0]),
            hour: parseInt($(times[1]).text().split(" ")[0]),
            minute: parseInt($(times[2]).text().split(" ")[0]),
            second: parseInt($(times[3]).text().split(" ")[0])
        }
    });

    startTimer();
});

function startTimer() {
    $.each(objTime, function(k,v) {
        var newTime = v,
            div = $($("#"+k).find('li')[0]).find('div');
        if(v['second'] + 1 >= 60) {
            newTime['second'] = 0;
            if(newTime['minute'] + 1 >= 60) {
                newTime['minute'] = 0;
                if(newTime['hour'] + 1 >= 24) {
                    newTime['hour'] = 0;
                    newTime['day']++;
                } else {
                    newTime['hour']++;
                }
            } else {
                newTime['minute']++;
            }
        } else {
            newTime['second']++;
        }

        objTime[k] = newTime;
        $(div[0]).html(newTime['day']+(newTime['day'] > 1 ? " Days":" Day"));
        $(div[1]).html(newTime['hour']+(newTime['hour'] > 1 ? " Hours":" Hour"));
        $(div[2]).html(newTime['minute']+" Min");
        $(div[3]).html(newTime['second']+" Sec");
    });

    setTimeout(startTimer, 1000);
}
