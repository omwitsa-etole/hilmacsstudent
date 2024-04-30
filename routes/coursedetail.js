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
            result.courses = [data.course]
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
	
	req.session.subjects = result.subjects
	//let token = req.session.token
	//req.session = result
	//req.session.token = token
    res.render('coursedetail\\coursedetail\\course\\main\\index.handlebars', { pageTitle: 'Select Path',user:req.session.user ,session:req.session});
});
  
router.get('/', auth,async (req, res) => {
    let result = {}
    const course  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/classes/data/","get",null,function(data,e){
        console.log("data=>",data)
        if(data !== undefined){
            result.courses = data
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
	req.session.classes = result.courses
	req.session.subjects = result.subjects
    res.render('paths', { pageTitle: 'Select Path',user:req.session.user ,session:req.session});
});

module.exports = router
