'use strict'

const User = use('App/Model/User')
const Team = use('App/Model/Team');
const TeamMember = use('App/Model/TeamMember');
const SavingsPlan = use('App/Model/SavingsPlan');
const Validator = use('Validator');

class TeamController {
    * makeNew(req, res) {
        if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        yield res.sendView('newteam');
    }

    * doMakeNew(req, res) {
        if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        var post = req.post();
        var data = {
            name: post.name,
            username: req.currentUser.username,
            isSupervisor: post.supervisor == 'on' ? '1' : '0'
        }

        const rules = {
            name: 'required',
            username: 'required',
            isSupervisor: 'required|boolean'
        }

        const validation = yield Validator.validateAll(data, rules);

        if(validation.fails()){
            yield req
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        }

        const team = yield Team.create({
            name: post.name
        });

        const member = yield TeamMember.create({
            team_id: team.id,
            username: data.username,
            is_supervisor: data.isSupervisor
        });

        res.redirect('/profile');
    }

    * showTeam(req, res) {
        if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        var teamID = req.param('id');
        const currentUserTeams = yield TeamMember.query().where('username', req.currentUser.username);
        var isMember = false;
        for(var i = 0; i < currentUserTeams.length; i++){
            if(currentUserTeams[i].team_id == teamID) {
                isMember = true; break;
            }
        }

        if(!isMember) { res.redirect('/'); return }

        const team = yield Team.findBy('id', teamID);
        const members = yield TeamMember.with('team');
        const teammates = [];
        for(var i = 0; i < members.length; i++) {
            if(members[i].team_id == teamID) teammates.push(members[i]);
        }

        const savings = yield SavingsPlan.query().where('team_id', teamID);
        console.log("savings ", savings);

        yield res.sendView('team', {
            team: team,
            teammates: teammates,
            savings: savings
        });
    }

    * newMember (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }

        const u = yield User.all(); var users = u.toJSON();
        const id = req.param('id');
        const team = yield Team.find(id);
        const members = yield TeamMember.query().where('team_id', id);

        var canAdd = false;
        for(var i = 0; i < members.length; i++) {
            if(members[i].username == req.currentUser.username && members[i].is_supervisor) {
                canAdd = true; break;
            }
        }

        if(canAdd) {
            var availableUsers = [];
            for(var i = 0; i < users.length; i++) {
                var isMember = false;
                for(var j = 0; j < members.length; j++) {
                    if(members[j].team_id == id && users[i].username == members[j].username) {isMember = true; break}
                }
                if(!isMember) availableUsers.push(users[i]);
            }

            yield res.sendView('newmember', {
                users: availableUsers,
                team: team
            });
        } else {
            res.redirect('back'); return
        }
    }

    * makeNewMember (req, res) {
        var post = req.post(); const id = req.param('id');
        console.log('post', post);

        var memberData = { username: post.member, isSupervisor: post.isSupervisor };
        const rules = { username: 'required', isSupervisor: 'required' }
        const validation = yield Validator.validateAll(memberData, rules);
        if(validation.fails()){
            yield req
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        }

        const user = yield User.findBy('username', memberData.username);
        console.log("user ", user);

        const member = yield TeamMember.create({
            team_id : id,
            username: memberData.username,
            is_supervisor: memberData.isSupervisor
        });
        member.save();

        res.redirect('/teams/'+id);
    }

    * quit (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }
        const teamID = req.param('id');

        const member = yield TeamMember.query().where('username',req.currentUser.username);
        var isMember = false;
        var memberID = -1;
        for(var i = 0; i < member.length; i++) {
            if(teamID == member[i].team_id) { isMember = true; memberID = member[i].id;  break; }
        }
        if(isMember){
            const user = yield TeamMember.find(memberID);
            yield user.delete();
            res.redirect('/');
        } else { res.redirect('/'); return }
    }
}

module.exports = TeamController;