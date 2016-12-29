$(function(){
    var $form = $('#quit');

    $('.modal .modal-ok').on('click', function(){
        $.ajax({
            url: '/ajax'+$form.attr('action'),
            data: $form.serializeArray(),
            type: 'POST',
            dataType: 'html',
        }).done(function(resp){
            var data = JSON.parse(resp);
            $('.container').html(data.message);
            location.assign('/');
        }).fail(function(){
            alert('Hiba történt!')
        });
    });

    $form.on('submit', function(event){
        $('.modal').modal('show');
        event.preventDefault();
    });
});