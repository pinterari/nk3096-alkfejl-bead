'use strict'

const Team = use('App/Model/Team');
const TeamMember = use('App/Model/TeamMember');
const User = use('App/Model/User');
const SavingsPlan = use('App/Model/SavingsPlan');
const AllocatedFunds = use('App/Model/AllocatedFund');
const Expense = use('App/Model/Expense');
const Category = use('App/Model/Category');
const Validator = use('Validator');

class SavingsPlanController {
    * show (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }

        var id = req.param('id');
        const plan = yield SavingsPlan.findBy('id',id);
        var plan_json = plan ? plan.toJSON() : null;

        var accessible = false; var isSupervisor = false;
        const member = yield TeamMember.query().where('username', req.currentUser.username);
        for(var i = 0; i < member.length; i++) {
            if(plan_json && member[i].team_id == plan_json.team_id) {
                accessible = true; isSupervisor = member[i].is_supervisor; break;
            }
        }

        if(accessible) {
            const funds = yield AllocatedFunds.query().where('plan_id', id);

            yield res.sendView('savingsplan', {
                plan: plan_json,
                funds: funds,
                isSupervisor: isSupervisor
            });
        } else { res.redirect('/'); return} 
    }

    * makeNew (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }

        const userIsMember = yield TeamMember.query().where('username', req.currentUser.username);
        const allTeams = yield Team.with('team_members');
        var teams = [];
        for(var i = 0; i < userIsMember.length; i++) {
            for(var j = 0; j < allTeams.length; j++) {
                if(userIsMember[i].team_id == allTeams[j].id) {
                    teams.push(allTeams[j]);
                    break;
                }
            }
        }

        yield res.sendView('newsavingsplan', {
            teams: teams
        });
    }

    * doMakeNew (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }

        var post = req.post();
    
        var savingsData = { 
            team_id: parseInt(post.team),
            name: post.name, 
            goal: parseInt(post.goal),
        };
        const rules = { team_id: 'required', name: 'required', goal: 'required|integer|above:0' }

        const validation = yield Validator.validateAll(savingsData, rules);

        if(validation.fails()){
            yield req
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        }

        savingsData.current = 0;
        savingsData.is_fulfilled = false;

        const plan = yield SavingsPlan.create(savingsData);
        plan.save();

        yield res.redirect('/teams/'+post.team);
    }

    * newAllocatedFund (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }
        var post = req.post();
        var planID = req.param('id');
    
        var fundData = { date: post.date, amount: parseInt(post.amount) };
        const rules = { date: 'required', amount: 'required|integer|above:0' }
        const validation = yield Validator.validateAll(fundData, rules);

        if(validation.fails()){
            yield req
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        }

        const plan = yield SavingsPlan.findBy('id', planID);

        plan.attributes.current += fundData.amount;
        if(plan.attributes.current >= plan.attributes.goal) plan.is_fulfilled = true;
        yield plan.save();

        const fund = yield AllocatedFunds.create({
            plan_id: planID,
            username: req.currentUser.username,
            amount: fundData.amount,
            date: fundData.date
        });
        yield fund.save();

        const category = yield Category.findBy('name', 'Egyéb kiadás');

        const exp = yield Expense.create({
            username: req.currentUser.username,
            amount: -1*fundData.amount,
            category_id: category.attributes.id,
            date: fundData.date,
            comment: 'Hozzájárulás: ' + plan.attributes.name
        });
        yield exp.save();
        
        const funds = yield AllocatedFunds.query().where('plan_id', planID);
        yield res.sendView('savingsplan',{
            plan: plan ? plan.toJSON() : null,
            funds: funds
        });
    }

    * deleteFund (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }
        const id = req.param('id');
        const fund = yield AllocatedFunds.find(id);

        if (req.currentUser.username != fund.username) {
             res.unauthorized('Access denied');
             return
         }

         const plan = yield SavingsPlan.find(fund.attributes.plan_id);
         plan.attributes.current -= parseInt(fund.attributes.amount);
         yield plan.save();
         yield fund.delete();

         res.redirect('back');
    }

    * deletePlan (req, res) {
        if(!req.currentUser) { res.unauthorized('Access denied'); return }
        const id = req.param('id');
        const plan = yield SavingsPlan.find(id);
        const team_id = plan.attributes.team_id
        const member = yield TeamMember.query().where('username',req.currentUser.username);

        var canDelete = false;
        for(var i = 0; i < member.length; i++) {
            if(member[i].team_id == team_id && member[i].is_supervisor) {
                canDelete = true; break;
            }
        }

        if(canDelete) {
            const funds = yield AllocatedFunds.query().where('plan_id', plan.attributes.id);
            for(var i = funds.length-1; i >= 0; i--) {
                const fund = yield AllocatedFunds.find(funds[i].id);
                yield fund.delete();
            }
            yield plan.delete();
            res.redirect('/teams/'+team_id);
        } else {
            res.redirect('back'); return
        }
    }

    * showOwnPlans(req, res){
        if(!req.currentUser) { res.unauthorized('Access denied'); return }

        const userTeams = yield TeamMember.query().where('username', req.currentUser.username);
        const allTeams = yield Team.with('team_members');
        var teams = [];
        var savings = [];
        for(var i = 0; i < userTeams.length; i++) {
            for(var j = 0; j < allTeams.length; j++) {
                if(userTeams[i].team_id == allTeams[j].id) {
                    teams.push(allTeams[j]); break;
                }
            }
            const plans = yield SavingsPlan.query().where('team_id', userTeams[i].team_id);
            for(var k = 0; k < plans.length; k++) {
                savings.push(plans[k]);
            }
        }

        yield res.sendView('ownplans', {
            teams: teams,
            savings: savings
        });
    }

}

module.exports = SavingsPlanController;