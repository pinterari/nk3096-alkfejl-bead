$(function(){
    $('#search [name=query]').on('input', function(){
        $.get('/ajax/search', {
            query: $(this).val()
        }).done(function(result){
            let html = '';
            for(let i = 0; i < result.data.length; i++) {
                const user = result.data[i];
                html += '<a class="list-group-item" href="/profile/'+user.username+'">' + user.username + '</a>';
            }

            $('.suggestions').html(html);
        })
    })
})