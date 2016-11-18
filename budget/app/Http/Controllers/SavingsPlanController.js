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

        var accessible = false;
        const member = yield TeamMember.query().where('username', req.currentUser.username);
        for(var i = 0; i < member.length; i++) {
            if(plan_json && member[i].team_id == plan_json.team_id) {
                accessible = true; break;
            }
        }

        if(accessible) {
            const funds = yield AllocatedFunds.query().where('plan_id', id);

            yield res.sendView('savingsplan', {
                plan: plan_json,
                funds: funds
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

    * delete (req, res) {
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

}

module.exports = SavingsPlanController;