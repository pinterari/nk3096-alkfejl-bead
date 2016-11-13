'use strict'

const Validator = use('Validator');
const User = use('App/Model/User');
const Hash = use('Hash');

class UserController {
    
    * signUp (req, res) {
        yield res.sendView('signup');
    }

    * doSignUp (req, res) {
        var post = req.except('_csrf');

        var userData = {
            username: post.username,
            email: post.email,
            password: post.password,
            passwordAgain: post.passwordAgain
        }; 

        const validation = yield Validator.validateAll(userData, User.rules);

        if(validation.fails()){
             yield req
                .withOut('password','passwordAgain')
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        } 

        delete userData.passwordAgain;
        userData.password = yield Hash.make(userData.password);

        var user = yield User.create(userData);
        yield user.save();
        yield req.auth.login(user);
        res.redirect('/');
    }

    * login (req, res) {
        const isLoggedIn = yield req.auth.check();
        if(isLoggedIn) res.redirect('/');
        yield res.sendView('login');
    }

    * doLogin (req, res) {
        const username = req.input('username');
        const password = req.input('password');

        try {
            const login = yield req.auth.attempt(username,password);
            if(login)  {
                res.redirect('/');
                return
            }
        } catch(err) {
            yield req
                .withAll()
                 .andWith({errors: [
                    {
                        message: "Hibás bejelentkezési adatok."
                    }
                ]})
                .flash()
            res.redirect('/login');
        }
    }

    * logout (req, res) {
        yield req.auth.logout(); res.redirect('/');
    }
}

module.exports = UserController;