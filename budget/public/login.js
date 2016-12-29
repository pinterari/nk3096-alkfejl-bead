$(function(){
    var $loginLink=$('#login-link');

    var $loginDialog = $(`
        <div class="modal fade confirm-modal" tabindex="-1" role="dialog" id="loginModal">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
            <div class="modal-header"><b>Belépés</b></div>
            <div class="modal-body">
                <div class="alert alert-danger"><b>A megadott adatok hibásak!</b></div>
                <div class="form-area"></div>
            </div>
            </div>
        </div>
        </div>`);

    var $loginAlert = $loginDialog.find('.alert');
    $loginAlert.hide();

    $loginDialog.find('.form-area').load('/login .login-form', function(){
        $loginForm=$loginDialog.find('.login-form');
        $loginForm.on('submit', function(e){
            e.preventDefault();

            $.ajax({
                url: '/ajax/login',
                data: $loginForm.serializeArray(),
                type: 'POST',
                dataType: 'json',
            }).done(function(resp){
                if(resp.success){
                    $loginDialog.modal('hide');
                    $('.navbar-collapse').load('/ .navbar-collapse');
                }else{
                    $loginAlert.show();
                }
            })
            .fail(function(){
                alert('Hiba történt!')
            });
        });
    });

    $loginLink.on('click', function(e){
        e.preventDefault();
        $loginDialog.modal('show');
    });
})