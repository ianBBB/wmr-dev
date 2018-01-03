var express = require('express')
var SqlString = require('sqlstring')
var app = express()
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM w_users ORDER BY loginname DESC',function(err, rows, fields) {
			//conn.query('alter table yallara_users rename to users',function(err, rows, fields) {
			
            //if(err) throw err
            if (err) {
				console.log(err);
                req.flash('error', err)
                res.render('user/list', {
                    title: 'empty User List', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List', 
                    data: rows
                })
            }
        })
    })
})
 
// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        LoginName: '',
        Name: ''
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('LoginName', 'Enumber is required').notEmpty()           //Validate enumber
    req.assert('Name', 'Name is required').notEmpty()             //Validate name

 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            LoginName: req.sanitize('LoginName').escape().trim(),
            Name: req.sanitize('Name').escape().trim(),
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO users SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        LoginName: user.LoginName,
                        Name: user.Name                
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        LoginName: '',
                        Name: ''                 
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/add', { 
            title: 'Add New User',
            LoginName: req.body.LoginName,
            Name: req.body.Name
        })
    }
})
 
// SHOW EDIT USER FORM
app.get('/edit/(:LoginName)', function(req, res, next){
    req.getConnection(function(error, conn) {
		
        conn.query('SELECT * FROM users WHERE LoginName = ' + SqlString.escape(req.params.LoginName), function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'User not found with id = ' + req.params.id)
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User', 
                    LoginName: rows[0].LoginName,
                    Name: rows[0].Name
                   
                })
            }            
        })
    })
})
 
// EDIT USER POST ACTION
app.put('/edit/(:LoginName)', function(req, res, next) {
    req.assert('LoginName', 'Enumber is required').notEmpty()           //Validate Enumber
    req.assert('Name', 'Name is required').notEmpty()             //Validate Name

 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            LoginName: req.sanitize('LoginName').escape().trim(),
            Name: req.sanitize('Name').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE users SET ? WHERE LoginName = ' + SqlString.escape(req.params.LoginName), user, function(err, result) {   
			// + req.params.LoginName, user, function(err, result) {
                //if(err) throw err
                if (err) { 
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
						LoginName: req.body.LoginName,
						Name: req.body.Name
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
						LoginName: req.body.LoginName,
						Name: req.body.Name
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
        res.render('user/edit', { 
            title: 'Edit User',             
            LoginName: req.body.LoginName,
            Name: req.body.Name
        })
    }
})
 
// DELETE USER
app.delete('/delete/(:LoginName)', function(req, res, next) {
    var user = { LoginName: req.params.LoginName }
    req.getConnection(function(error, conn) {
	conn.query('DELETE FROM users WHERE LoginName = ' + SqlString.escape(req.params.LoginName), user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'User deleted successfully! Enumber = ' + req.params.LoginName)
                // redirect to users list page
                res.redirect('/users')
            }
        })
    })
})
 
module.exports = app