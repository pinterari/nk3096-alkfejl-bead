$(function () {
    var date = document.getElementById('date').innerHTML;
    var show = date.substring(0, 4);
    var month = parseInt(date.substring(5, 7));

    switch(month) {
        case 1:  show += '. január';     break;
        case 2:  show += '. február';    break;
        case 3:  show += '. március';    break;
        case 4:  show += '. április';    break;
        case 5:  show += '. május';      break;
        case 6:  show += '. június';     break;
        case 7:  show += '. július';     break;
        case 8:  show += '. augusztus';  break;
        case 9:  show += '. szeptember'; break;
        case 10: show += '. október';    break;
        case 11: show += '. november';   break;
        case 12: show += '. december';   break;
        default:                         break;
    }

    document.getElementById('date').innerHTML = show;
})