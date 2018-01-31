var express = require('express');
var qs = require('qs');
var app = express();

app.get('/', function (req, res) {

    // set what this users current activity is and its stage
    req.session.current_action = 'mark';

    // set the stage value. this is the point in the marking process
    // the user is currently at.    
    req.session.stage = '1';



    // Stage 1 - get a list of subjects for this user from the db
    req.getConnection(function (error, conn) {
        conn.query("SELECT SubjectID FROM access_privileges where LoginName='" + req.session.user + "' order by SubjectID", function (err, rows) {
            if (err) throw err

            // save the data in a session var
            req.session.subjects = rows;

            // send the data off to the user.
            res.render('marker', {
                title: 'Marking',
                Stage: req.session.stage,
                SubjectList: JSON.stringify(req.session.subjects),
                AssessmentList: 0,
                StudentList: 0,
                MarkingForm: 0,
                Marks: 0,
                Comments: 0,
                Responses: 0

            })

        })
    })
})


// Stage 2 - Get assessment list
app.post('/getAssessmentList', function (req, res) {

    // set the stage value. this is the point in the marking process
    // the user is currently at.
    console.log(req.body);
    req.session.stage = '2';

    // extract the subject from the posted data.
    var subject = req.sanitize('M_subject_name').escape().trim();
    req.session.subject = subject.split(":")[1];


    // get a list of assessments for this subject.
    req.getConnection(function (error, conn) {
        var SqlString = {};
        conn.query("SELECT distinct ModuleID FROM part_data where ModuleID like '" + req.session.subject + "%' order by ModuleID", function (err, rows) {
            if (err) throw err

            // save the assessmentlist to a session var
            req.session.assessmentList = rows;


            var SqlString = {};
            conn.query("SELECT distinct ModuleID FROM part_data1", function (err, rows) {
                req.session.marking_form = rows;

                // send to user.
                res.render('marker', {
                    title: 'Marking',
                    Stage: req.session.stage,
                    SubjectList: 0,
                    AssessmentList: JSON.stringify(req.session.assessmentList),
                    marking_form: JSON.stringify(req.session.marking_form),
                    StudentList: 0,
                    MarkingForm: 0,
                    Marks: 0,
                    Comments: 0,
                    Responses: 0

                })

            })


        })
    })
})


// Stage 3 - Get student list
app.post('/getStudentList', function (req, res) {

    console.log(req.body);
    req.session.stage = '3';
    var assessment = req.sanitize('M_assessment_name').escape().trim();
    req.session.assessment = assessment.split(":")[1];


    // get a list of students for this assessment.
    req.getConnection(function (error, conn) {
        var SqlString = {};

        // query database for student list
        conn.query("SELECT distinct StudentID FROM part_data where ModuleID like '" + req.session.assessment + "' order by StudentID", function (err, rows) {
            if (err) throw err


            if (rows.length <= 0) {
                req.flash('error', 'Student not found with id = ' + req.params.id);
                res.redirect('/users')
            } else { // if user found

                req.session.StudentList = rows;

                //                /////////////////////////////////////////////               
                //                conn.query("select * from ((SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`, 0 as PartNumber,  0 as CommentNumber, `Question` as field1,`NoteToMarker` as field2, 0 as field3, 0 as field4 from question_config where `ModuleID` ='" + req.session.assessment + "') UNION (SELECT * FROM `parts_and_responses` where `ModuleID` ='" + req.session.assessment + "')  UNION (SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`,`commentnumber`,`Comment` as field1, `Weight` as field2,`NoteToMarker` as fields3, 0 as field4 FROM `comment_config`where `ModuleID` ='" + req.session.assessment + "'))as combined_output order by `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, CommentNumber", function (err, rows) {
                //                    if (err) throw err
                //
                //
                //                    /////////////////////////////////////  


                /////////////////////////////////////////////               
                conn.query("select concat('QP' ,SectionNumber,'_',QuestionNumber,'_',PartNumber,'_',CommentNumber) as id, `ModuleID`,`SectionNumber`,`QuestionNumber`,PartNumber,   CommentNumber, field1, field2,field3, field4 from ((SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`, 0 as PartNumber,  0 as CommentNumber, `Question` as field1,`NoteToMarker` as field2, 0 as field3, 0 as field4 from question_config where `ModuleID` ='" + req.session.assessment + "') UNION (SELECT * FROM `parts_and_responses` where `ModuleID` ='" + req.session.assessment + "')  UNION (SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`,`commentnumber`,`Comment` as field1, `Weight` as field2,`NoteToMarker` as fields3, 0 as field4 FROM `comment_config`where `ModuleID` ='" + req.session.assessment + "'))as combined_output order by `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, CommentNumber", function (err, rows) {
                    if (err) throw err


                    /////////////////////////////////////                
                    req.session.Marking_form = rows;


                    res.render('marker', {
                        title: 'Marking',
                        Stage: req.session.stage,
                        SubjectList: 0,
                        AssessmentList: 0,
                        StudentList: JSON.stringify(req.session.StudentList),
                        MarkingForm: JSON.stringify(req.session.Marking_form),
                        Marks: 0,
                        Comments: 0,
                        Responses: 0
                    })
                })
            }
        })
    })

})

// Stage 4 - Get student marks
app.post('/getStudentMarks', function (req, res) {


    req.session.stage = '4';
    var assessment = req.sanitize('M_student_number').escape().trim();
    req.session.student = assessment.split(":")[1];
    console.log(req.session.student);

    // get a list of students for this assessment.
    req.getConnection(function (error, conn) {

        // query database for student marks
        conn.query("SELECT concat('QP' ,SectionNumber,'_',QuestionNumber,'_',PartNumber,'_0') as id, `ModuleID`,`SectionNumber`,`QuestionNumber`,PartNumber,  Marks FROM part_data where ModuleID like '" + req.session.assessment + "' and studentID like '" + req.session.student + "'", function (err, rows) {
            if (err) throw err

            req.session.Marks = rows;


            // query database for student comments
            conn.query("SELECT concat('QP' ,SectionNumber,'_',QuestionNumber,'_',PartNumber,'_',CommentNumber) as id, Comment FROM comment_data where ModuleID like '" + req.session.assessment + "' and studentID like '" + req.session.student + "'", function (err, rows) {
                if (err) throw err

                req.session.Comments = rows;

                // query database for student comments
                conn.query("SELECT concat('QP' ,SectionNumber,'_',QuestionNumber,'_',PartNumber,'_99') as id, response FROM response_data where ModuleID like '" + req.session.assessment + "' and studentID like '" + req.session.student + "'", function (err, rows) {
                    if (err) throw err

                    req.session.Responses = rows;
                    res.render('marker', {
                        title: 'Marking',
                        Stage: req.session.stage,
                        SubjectList: 0,
                        AssessmentList: 0,
                        StudentList: 0,
                        MarkingForm: 0,
                        Marks: JSON.stringify(req.session.Marks),
                        Comments: JSON.stringify(req.session.Comments),
                        Responses: JSON.stringify(req.session.Responses)
                    })
                })
            })

        })
    })
})


// Stage 5 - Save marked results
app.post('/submitMarks', function (req, res) {


    req.session.stage = '5';
    req.session.new_marks = req.body;
    var new_marks = req.session.new_marks
    console.log(new_marks);
    //    console.log(req.session.assessment);


    // now add all the marking content
    for (i in new_marks) {

        var extracted_Q_data = i.split("_");
        //console.log(extracted_Q_data);
        var QuestionNumber = extracted_Q_data[1];
        var PartNumber = extracted_Q_data[2];
        var CommentNumber = extracted_Q_data[3];
        console.log(req.session.assessment);
        // test to see what is in this row (question, part, comment, etc)
        // then execute the appropriate SQL for it by calling save_mark_data.
        if (CommentNumber == 99) {

            // this is a Response.
            save_mark_data(req, 1, QuestionNumber, PartNumber, CommentNumber, new_marks[i]);

        } else if (CommentNumber == 0) {

            // this is a Part. 
            save_mark_data(req, 2, QuestionNumber, PartNumber, 0, new_marks[i]);

        } else {
            // this is a Comment.
            save_mark_data(req, 3, QuestionNumber, PartNumber, CommentNumber, new_marks[i]);
        }
    }

    // send a response
    req.getConnection(function (error, conn) {

        // save the data in a session var
        req.session.subjects = 0;

        // send the data off to the user.
        res.render('marker', {
            title: 'Marking',
            Stage: req.session.stage,
            SubjectList: 0,
            AssessmentList: 0,
            StudentList: 0,
            MarkingForm: 0,
            Marks: 0,
            Comments: 0,
            Responses: 0
        })

    })
})


function save_mark_data(req, query_type, field1, field2, field3, field4) {

    //console.log(req, query_type, field1, field2, field3, field4);
    // select which query to execute.
    req.getConnection(function (error, conn) {

        switch (query_type) {
            case 1:
                //                console.log("INSERT INTO response_data (ModuleID, SectionNumber, QuestionNumber, PartNumber,StudentID, Response) VALUES ('" + req.session.assessment + "',1," + field1 + "," + field2 + "," + req.session.student + ",'" + field4 + "') ON DUPLICATE KEY UPDATE Response = '");
                // save typed response to the response table.
                conn.query("INSERT INTO response_data (ModuleID, SectionNumber, QuestionNumber, PartNumber,StudentID, Response) VALUES ('" + req.session.assessment + "',1," + field1 + "," + field2 + "," + req.session.student + ",'" + field4 + "') ON DUPLICATE KEY UPDATE Response = '" + field4 + "'", function (err, rows) {
                    if (err) throw err
                })
                break;

            case 2:
                // save Part marks to the part_data table.
                // first test the mark field. if blank , delete the record.
                if (field4 == "") {
                    // mark field is blank. remove record.
                    conn.query("DELETE FROM part_data WHERE (ModuleID ='" + req.session.assessment + "') AND (SectionNumber=1) AND (QuestionNumber=" + field1 + ") AND (PartNumber=" + field2 + ") AND (StudentID like '" + req.session.student + "')", function (err, rows) {
                        if (err) throw err
                    })
                } else {
                    conn.query("INSERT INTO part_data (ModuleID, SectionNumber, QuestionNumber, PartNumber,StudentID, Marks) VALUES ('" + req.session.assessment + "',1," + field1 + "," + field2 + ",'" + req.session.student + "','" + field4 + "') ON DUPLICATE KEY UPDATE Marks = '" + field4 + "'", function (err, rows) {
                        if (err) throw err
                    })
                }
                break;

            case 3:
                // first delete all comments for this student for this assignment.
                //                console.log("DELETE FROM comment_data WHERE (ModuleID ='"+ req.session.assessment + "') AND (StudentID='"+ req.session.student + "')");
                if (typeof (comments_deletes) == 'undefined') {
                    conn.query("DELETE FROM comment_data WHERE (ModuleID ='" + req.session.assessment + "') AND (StudentID like '" + req.session.student + "')", function (err, rows) {
                        if (err) throw err
                    });
                    comments_deletes = 1;
                    console.log("comments wiped");
                };

                //                console.log("INSERT INTO comment_data (ModuleID, SectionNumber, QuestionNumber, PartNumber,CommentNumber, StudentID, Comment) VALUES ('" + req.session.assessment + "',1," + field1 + "," + field2 + "," +  field3 + "," +req.session.student + "," + field4 + ") ON DUPLICATE KEY UPDATE Comment = " + field4);
                // save comment states to the comment_data table.
                conn.query("INSERT INTO comment_data (ModuleID, SectionNumber, QuestionNumber, PartNumber,CommentNumber, StudentID, Comment) VALUES ('" + req.session.assessment + "',1," + field1 + "," + field2 + "," + field3 + ",'" + req.session.student + "'," + field4 + ") ON DUPLICATE KEY UPDATE Comment = " + field4, function (err, rows) {
                    if (err) throw err
                })
                break;
        }
    })

    //    conn.query("SELECT distinct StudentID FROM part_data where ModuleID like '" + req.session.assessment + "' order by StudentID", function (err, rows) {
    //        if (err) throw err
    //    })
}




// ALTER TABLE subs ADD UNIQUE (subs_email)
//INSERT INTO subs
//  (subs_name, subs_email, subs_birthday)
//VALUES
//  (?, ?, ?)
//ON DUPLICATE KEY UPDATE
//  subs_name     = VALUES(subs_name),
//  subs_birthday = VALUES(subs_birthday)

app.get('/error', function (req, res) {
    res.sendFile(__dirname + "/public/error.html");
});


module.exports = app;
