'use strict'

const Validator = use('Validator');
const User = use('App/Model/User');
const Expense = use('App/Model/Expense');
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

        if(parseInt(post.funds) > 0) {
            var today = new Date();
            var expenseData = {
                username: post.username,
                amount: parseInt(post.funds),
                category_id: 0,
                date: today.toISOString().slice(0, 10)
            }

            var expense = yield Expense.create(expenseData);
            yield expense.save();
        }

        yield req.auth.login(user);
        res.redirect('/');
    }

    * ajaxLogin (req, res) {
        const username = req.input('username');
        const password = req.input('password');

        try {
            yield req.auth.attempt(username,password);
            res.ok({success:true});
        } catch(err) {
            res.ok({success:false});
        }
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
                 .andWith({errors: [{
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

    * ajaxSearch(req, res) {
        var wanted = req.input('query') || '';
        var page = Math.max(req.input('page'),1);

        var users = yield User.query()
            .where(function(){
                if(wanted != '') this.where('username', 'LIKE', `%${wanted}%`)
            })
            .paginate(page, 5);

        res.ok(users);
    }

    * search (req, res) {
        var wanted = req.input('query') || '';
        var page = Math.max(req.input('page'),1);

        var users = yield User.query()
            .where(function(){
                if(wanted != '') this.where('username', 'LIKE', `%${wanted}%`)
            })
            .paginate(page, 5);

        yield res.sendView('search', {
            users: users.toJSON(),
            wanted: wanted
        })
    }

    * main (req, res) {
        yield res.sendView('main');
    }
}

module.exports = UserController;