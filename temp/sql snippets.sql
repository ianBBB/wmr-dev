// get the question data in the same format as part data with '0' as the partnumber. extra fields are in numbered format.
select `ModuleID`,`QuestionNumber`,`SectionNumber`, 0 as PartNumber, `Question` as field1,`NoteToMarker` as fields2, 0 as field3, 0 as field4
from question_config;

// same for part data.
SELECT `ModuleID`,`QuestionNumber`,`SectionNumber`,`PartNumber`,`PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4
FROM `part_config`


select `ModuleID`,`QuestionNumber`,`SectionNumber`, 0 as PartNumber, `Question` as field1,`NoteToMarker` as fields2, 0 as field3, 0 as field4
from question_config
union
(SELECT `ModuleID`,`QuestionNumber`,`SectionNumber`,`PartNumber`,`PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4
FROM `part_config`);

select *
from ((select `ModuleID`,`QuestionNumber`,`SectionNumber`, 0 as PartNumber, `Question` as field1,`NoteToMarker` as fields2, 0 as field3, 0 as field4
from question_config)
union
(SELECT `ModuleID`,`QuestionNumber`,`SectionNumber`,`PartNumber`,`PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4
FROM `part_config`)) as combined_output
order by `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`


select *
from ((SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`, 0 as PartNumber, `Question` as field1,`NoteToMarker` as fields2, 0 as field3, 0 as field4
from question_config
where `ModuleID` ='CompSysPlat_2017_S1_A_1')
union
(SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`,`PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4
FROM `part_config`
where `ModuleID` ='CompSysPlat_2017_S1_A_1')
union
(SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`,`commentnumber` as field1,`Comment` as field2, `Weight` as field3,`NoteToMarker` as fields4
FROM `comment_config`
where `ModuleID` ='CompSysPlat_2017_S1_A_1')) as combined_output
order by `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, field1

(SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, 0 as CommentNumber, `PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4 FROM part_config) UNION (SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, 99 as CommentNumber, `PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4 FROM part_config)

CREATE SQL SECURITY INVOKER VIEW parts_and_responses AS (SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, 0 as CommentNumber, `PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4 FROM part_config) UNION (SELECT `ModuleID`,`SectionNumber`,`QuestionNumber`,`PartNumber`, 99 as CommentNumber, `PartQuestion` as field1,`Marks` as field2, `StartWithFullMarks` as field3,`PartNoteToMarker` as fields4 FROM part_config);









