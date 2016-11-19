'use strict'

const Category = use('App/Model/Category');
const Expense = use('App/Model/Expense');
const User = use('App/Model/User');
const Validator = use('Validator');

class ExpenseController {

    *list (req,res) {
        if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        var beginDate = new Date();
        beginDate.setDate(1);
        var begin = beginDate.toISOString().slice(0, 10);

        var endDate = new Date(); endDate.setDate(1);
        endDate.setMonth(beginDate.getMonth()+1); 
        var end = endDate.toISOString().slice(0, 10);

        const categories = yield Category.with('expenses').fetch();
        const expenses = yield Expense.query().where('username',req.currentUser.username);
        var sum = 0; var budget = 0;

        for(var i = 0; i < expenses.length; i++){
            sum += expenses[i].amount;
            if(expenses[i].date < begin)
                budget += expenses[i].amount;
            else if(expenses[i].amount > 0 && expenses[i].date < end) 
                budget += expenses[i].amount;
        }

        yield res.sendView('expenses', {
            categories: categories.toJSON(),
            expenses: expenses,
            sum: sum,
            budget: budget,
            beginDate: begin,
            endDate: end,
            isCurrent: true,
        });
    }

    * listDate(req, res) {
         if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        const post = req.post();
        const begin = post.date;

        var beginDate = new Date(begin);
        var endDate = new Date(begin);
        endDate.setMonth(beginDate.getMonth()+1);
        var end = endDate.toISOString().slice(0, 10);

        const categories = yield Category.with('expenses').fetch();
        const expenses = yield Expense.query().where('username',req.currentUser.username);
        var sum = 0; var budget = 0;

        for(var i = 0; i < expenses.length; i++){
            if(expenses[i].date < end)
                sum += expenses[i].amount;
            if(expenses[i].date < begin)
                budget += expenses[i].amount;
            else if(expenses[i].amount > 0 && expenses[i].date < end) 
                budget += expenses[i].amount;
        }

        yield res.sendView('expenses', {
            categories: categories.toJSON(),
            expenses: expenses,
            sum: sum,
            budget: budget,
            beginDate: begin,
            endDate: end,
            isCurrent: false
        })
    }

    * makeNew(req, res) {
        if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }
        
        const categories = yield Category.with('expenses').fetch();

        yield res.sendView('newexpense', {
            categories: categories.toJSON() 
        });
    }

    * doMakeNew(req,res){
         if(!req.currentUser) {
            res.unauthorized('Access denied');
            return    
        }

        var post = req.post();

        var expenseData = {
            date: post.date,
            amount: parseInt(post.amount),
            category_id: post.category,
            comment: post.comment
        }

        const validation = yield Validator.validateAll(expenseData, Expense.rules);

        if(validation.fails()){
            yield req
                .withAll()
                .andWith({ errors: validation.messages() })
                .flash()
            res.redirect('back')
            return
        }

        expenseData.username = req.currentUser.username;
        const cat = yield Category.findBy('id',expenseData.category_id);
        if(cat.isExpense) expenseData.amount *= -1;

        const expense = yield Expense.create(expenseData);
        res.redirect('/expenses');
    }

     *delete (req,res){
         const id = req.param('id');
         const expense = yield Expense.find(id);

         if(req.currentUser.username != expense.username) {
             res.unauthorized('Access denied');
             return
         }

         yield expense.delete();
         res.redirect('/expenses');
     }
}

module.exports = ExpenseController;