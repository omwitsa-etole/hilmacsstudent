const express = require('express');
const router = express.Router();
const resource = require("../properties.json")
const fetchFunction = require("../modules/fetch")
const auth = require("../routes/checker")

router.get('/', auth,async (req, res) => {
    let result = {}
    const course  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/student/data","get",null,function(data,e){
        
        if(data !== undefined){
            result.courses = data.classes
            result.subjects = data.subjects
            result.user = data.user
            result.exams = data.exams
            result.gradings = data.gradings
            return data
        }
        if(e.ok){
            return data
        }else{
            return {message:"Response not ok =>",data}
        }})
        result.subjects = result.subjects?.map(post => {
            return { ...post, _id: post._id.toString() };
          });
          result.courses = result.courses?.map(post => {
            return { ...post, _id: post._id.toString() };
          });
          result.exams = result.exams?.map(post => {
            return { ...post, _id: post._id.toString() };
          });
    console.log("result=>",result)
    req.session.courses = result.courses
    req.session.subjects = result.subjects
    req.session.exams = result.exams
    res.render('student\\student-dashboard', { pageTitle: 'Student Dashboard',user:req.session.user,session:req.session,fullnames:req.session.user.hcFullnames,courses:req.session.courses,subjects:req.session.subjects,exams:req.session.exams });
});
  


module.exports = router
