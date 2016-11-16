'use strict'

const Route = use('Route')

Route.get('/', 'UserController.main');
Route.get('/signup', 'UserController.signUp');
Route.post('/signup', 'UserController.doSignUp');
Route.get('/login', 'UserController.login');
Route.post('/login', 'UserController.doLogin');
Route.get('/logout', 'UserController.logout');
Route.get('/expenses/new', 'ExpenseController.makeNew')/*.middleware('auth')*/;
Route.post('/expenses/new', 'ExpenseController.doMakeNew')/*.middleware('auth')*/;
Route.get('/expenses', 'ExpenseController.list')/*.middleware('auth')*/;
Route.post('/expenses', 'ExpenseController.listDate')/*.middleware('auth')*/;
Route.get('/profile/:username', 'ProfileController.otherProfile');
Route.get('/profile-edit', 'ProfileController.editProfile');
Route.post('/profile-edit', 'ProfileController.doEditProfile');
Route.get('/profile', 'ProfileController.ownProfile');
