const express = require('express');
const router = express.Router();
const resource = require("../properties.json")
const fetchFunction = require("../modules/fetch")
const auth = require("../routes/checker")

router.get('/:id', auth,async (req, res) => {
    let result = {}
    const course  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/classes/data/"+req.params.id,"get",null,function(data,e){
        console.log("data=>",data)
        if(data !== undefined){
            result.courses = [data.class]
            result.subjects = data.subjects
            result.questions = data.questions
            result.user = data.user
            return data
        }
        if(e.ok){
            return data
        }else{
            return {message:"Response not ok =>",data}
        }})
 
    
	
	req.session.subjects = result.subjects ? result.subjects:req.session.subjects
    req.session.course = result.courses[0] ? result.courses[0] : {hcName:undefined}
	//let token = req.session.token
	//req.session = result
	//req.session.token = token
    console.log("questions=>",result.questions)
    res.render('coursedetail\\coursedetail\\course\\main\\index.handlebars', { pageTitle: result.courses[0].hcName,user:req.session.user,courses:req.session.courses ,session:req.session,course:result.courses[0],questions:result.questions});
});
  
router.get('/', auth,async (req, res) => {
    let result = {}
    const course  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/classes/data/","get",null,function(data,e){
        console.log("data=>",data)
        if(data !== undefined){
            result.courses = data.classes
            result.subjects = data.subjects
            result.user = data.user
            return data
        }
        if(e.ok){
            return data
        }else{
            return {message:"Response not ok =>",data}
        }})
 
    console.log("result=>",result)
	req.session.courses = result.courses
	req.session.subjects = result.subjects ? result.subjects : req.session.subjects
    res.render('paths', { pageTitle: 'Select Path',user:req.session.user ,session:req.session});
});

module.exports = router
