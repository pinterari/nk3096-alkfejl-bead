'use strict'

const Route = use('Route')

Route.get('/', 'UserController.main');
Route.get('/signup', 'UserController.signUp');
Route.post('/signup', 'UserController.doSignUp');
Route.get('/login', 'UserController.login');
Route.post('/login', 'UserController.doLogin');
Route.get('/logout', 'UserController.logout');

Route.get('/expenses/new', 'ExpenseController.makeNew');
Route.post('/expenses/new', 'ExpenseController.doMakeNew');
Route.get('/expenses', 'ExpenseController.list');
Route.post('/expenses', 'ExpenseController.listDate');
Route.get('/expenses/:id/delete', 'ExpenseController.delete');

Route.get('/profile/:username', 'ProfileController.otherProfile');
Route.get('/profile-edit', 'ProfileController.editProfile');
Route.post('/profile-edit', 'ProfileController.doEditProfile');
Route.get('/profile', 'ProfileController.ownProfile');

Route.get('/search', 'UserController.search');
Route.group('ajax', function(){
    Route.get('/search', 'UserController.ajaxSearch')
    Route.post('/login', 'UserController.ajaxLogin')
}).prefix('/ajax');

Route.get('/teams/new', 'TeamController.makeNew');
Route.post('/teams/new', 'TeamController.doMakeNew');
Route.get('/teams', 'TeamController.showOwnTeams');
Route.get('/teams/:id', 'TeamController.showTeam');
Route.get('/teams/:id/quit', 'TeamController.quit');
Route.get('/teams/:id/newmember', 'TeamController.newMember');
Route.post('/teams/:id/newmember', 'TeamController.makeNewMember');

Route.get('/savings', 'SavingsPlanController.showOwnPlans');
Route.get('/savings/new', 'SavingsPlanController.makeNew');
Route.post('/savings/new', 'SavingsPlanController.doMakeNew');
Route.get('/savings/:id', 'SavingsPlanController.show');

Route.post('/savings/:id', 'SavingsPlanController.newAllocatedFund');
Route.get('/savings/:id/delete', 'SavingsPlanController.deletePlan');
Route.get('/funds/:id/delete', 'SavingsPlanController.deleteFund');