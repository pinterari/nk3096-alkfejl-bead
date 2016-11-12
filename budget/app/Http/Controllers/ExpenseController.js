'use strict'

const Category = use('App/Model/Category');
const User = use('App/Model/User');

class ExpenseController {
    *list (req,res) {
        const categories = yield Category.with('expenses').fetch();

        yield res.sendView('main', {
            categories: categories.toJSON() 
        });
    }
}

module.exports = ExpenseController;
