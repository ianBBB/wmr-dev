var express = require('express');
var app = express();
//var multer = require('multer');
app.use(express.json());
app.use(express.urlencoded());
//app.use(multer({ dest: './uploads/' }));


app.get('/', function (req, res) {
    // render to views/Login.ejs template file

    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM roles ORDER BY role_level desc', function (err, rows, fields) {

            //if(err) throw err
            if (err) {
                console.log(err);
                req.flash('error', err)
                res.render('user/list', {
                    title: 'empty User List',
                    data: ''
                })
            } else {
                // render to views/Login.ejs template file
                res.render('Login', {
                    title: 'Login',
                    data: ["Robbie", "Ying", "Ian"]
                })
            }
        })
    })

})


// user selects a login role
app.post('/SetUser', function (req, res, next) {

    //create the session and add set the userID.
    // first collect the users role selection.
    var sess = req.session;
    var requested_role_level = req.body.person_selected;

    // set the userID and role_level in session vars and reirect to the appropriate page
    req.session.role_level = requested_role_level;
    switch (requested_role_level) {
        case '0':

            //req.session.user = 'e03351';
            req.session.user = 'e03351';
            res.redirect('/marker');
            break;

        case '1':

            //req.session.user = 'e52483';
            req.session.user = 'e52483';
            res.redirect('/marker');
            break;

        case '2':

            req.session.user = 'e62892';
            res.redirect('/marker');
            break;

            //        case '4':
            //
            //            req.session.user = 'e62892';
            //            res.redirect('/root');
            //            break;

            //        default: alert("incorrect input)";

    }

    // find and set the user email address for later look-ups.
    // SHOW LIST OF USERS
//    pool.getConnection(function (error, conn) {
//        conn.query('SELECT * FROM w_users ORDER BY loginname DESC', function (err, rows, fields) {
//            //conn.query('alter table yallara_users rename to users',function(err, rows, fields) {
//
//            //if(err) throw err
//            if (err) {
//                console.log(err);
//                req.flash('error', err)
//                res.render('user/list', {
//                    title: 'empty User List',
//                    data: ''
//                })
//            } else {
//                // render to views/user/list.ejs template file
//                res.render('user/list', {
//                    title: 'User List',
//                    data: rows
//                })
//            }
//        })
//    })
})



// Home Base
app.post('/base', function (req, res, next) {

    //create the session and add set the userID.
    // first collect the users role selection.
    var sess = req.session;

    var requested_role_level = req.body.role_level;

    // set the userID and role_level in session vars and reirect to the appropriate page
    req.session.role_level = requested_role_level;
    switch (requested_role_level) {
        case '1':

            req.session.user = 'e62892';
            res.redirect('/marker');
            break;

        case '2':

            req.session.user = 'e62892';
            res.redirect('/marker');
            break;

        case '3':

            req.session.user = 'e62892';
            res.redirect('/marker');
            break;

        case '4':

            req.session.user = 'e62892';
            res.redirect('/marker');
            break;

            //        default: alert("incorrect input)";

    }

})


module.exports = app;
