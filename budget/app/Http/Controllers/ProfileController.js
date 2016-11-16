'use strict'

const User = use('App/Model/User');
const Expense = use('App/Model/Expense');
const Category = use('App/Model/Category');
const Team = use('App/Model/Team');
const TeamMember = use('App/Model/TeamMember');
const Validator = use('Validator');
const Hash = use('Hash');

class ProfileController {

    * ownProfile(req, res) {
         if(!req.currentUser) {
            res.redirect('/');   
        }

        const own_teams = yield TeamMember.query().where('username', req.currentUser.username);
        const team_members = yield TeamMember.with('teams');
        const teams = yield Team.with('team_members');
        var teammates = [];

        for(var i = 0; i < team_members.length; i++) {
            for(var j = 0; j < own_teams.length; j++) {
                if(team_members[i].team_id == own_teams[j].team_id)
                    teammates.push(team_members[i]);
            }
        }

        yield res.sendView('profile', {
            teams: teams,
            teammates: teammates
        });
    }

    * editProfile(req, res) {
        yield res.sendView('modifyprofile');
    }

    * doEditProfile(req, res){
         if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        var userData = req.except('_csrf');
        var currentUser = req.currentUser.toJSON()

        const rules = {
            username: userData.username != currentUser.username ? 'alpha_numeric|unique:users': 'alpha_numeric',
            email: userData.email != currentUser.email ? 'email|unique:users' : 'email',
            password: userData.password ? 'min:4' : 'min:0',
            passwordAgain: 'required_if:password|same:password'
        }

        const validation = yield Validator.validateAll(userData, rules);

        if (validation.fails()) {
            yield req
                .withAll()
                .andWith({errors: validation.messages()})
                .flash()
            res.redirect('back')
            return
        } 

        const user = yield User.findBy('id', currentUser.id);
        user.username = userData.username;
        user.email = userData.email;
        if(userData.name) user.name = userData.name;
        if(userData.password) user.password = yield Hash.make(userData.password);
        yield user.save();

        res.redirect('/profile');
    }

    * otherProfile (req,res) {
        var username = req.param('username');
        if(req.currentUser && username == req.currentUser.username) { res.redirect('/profile'); return }

        const user = yield User.findBy('username', username);
        if(!user) {res.redirect('/'); return}

        const allteams = yield Team.with('team_members');
        const otherUserTeams = yield TeamMember.query().where('username', username);
        var teams = [];

        for(var i = 0; i < otherUserTeams.length; i++) {
            for(var j = 0; j < allteams.length; j++) {
                if(allteams[i].id == otherUserTeams[j].team_id) teams.push(allteams[i]);
            }
        }

        var currentUserIsSupervisor = false;
        if(req.currentUser) {
            const currentUserTeams = yield TeamMember.query().where('username', req.currentUser.username);

            for(var i = 0; i < currentUserTeams.length; i++) {
                for(var j = 0; j < otherUserTeams.length; j++) {
                    if(currentUserTeams[i].team_id == otherUserTeams[j].team_id &&
                       currentUserTeams[i].is_supervisor && !otherUserTeams[j].is_supervisor) {
                        currentUserIsSupervisor = true;
                        break;  
                    }
                }
            }

            var expenses = null; var categories = null;
            if(currentUserIsSupervisor) {
                categories = yield Category.with('expenses');
                expenses = yield Expense.query().where('username', username);
            }
        }

        yield res.sendView('otherprofile', {
            user: user,
            supervisor: currentUserIsSupervisor,
            categories: req.currentUser ? categories : null,
            expenses: req.currentUser ? expenses : null,
            teams: teams
        })
    }
}

module.exports = ProfileController;