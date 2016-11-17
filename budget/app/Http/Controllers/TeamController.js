'use strict'

const User = use('App/Model/User')
const Team = use('App/Model/Team');
const TeamMember = use('App/Model/TeamMember');
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

        yield res.sendView('team', {
            team: team,
            teammates: teammates
        });
    }
}

module.exports = TeamController;