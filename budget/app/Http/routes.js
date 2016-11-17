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

Route.get('/teams/new', 'TeamController.makeNew');
Route.post('/teams/new', 'TeamController.doMakeNew');
Route.get('/teams/:id', 'TeamController.showTeam');
