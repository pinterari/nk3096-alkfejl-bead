'use strict'

const Route = use('Route')

Route.get('/', 'ExpenseController.list');
Route.get('/signup', 'UserController.signUp');
Route.post('/signup', 'UserController.doSignUp');
Route.get('/login', 'UserController.login');
Route.post('/login', 'UserController.doLogin');
Route.get('/logout', 'UserController.logout');
