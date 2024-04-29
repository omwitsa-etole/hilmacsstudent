const express = require('express');
const router = express.Router();
const resource = require("../properties.json")
const fetchFunction = require("../modules/fetch")
const auth = require("../routes/checker")

router.get('/library.html', auth,async (req, res) => {
    let result = {}
    const library  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/subjects/data","get",null,function(data,e){
        if(data !== undefined){
            result.subjects = data
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
    const classes  = await fetchFunction(req.session.token,resource.SERVER+"/hapi/classes/data","get",null,function(data,e){
        if(data !== undefined){
            result.classes = data
            return data
        }
        if(e.ok){
            return data
        }else{
            return {message:"Response not ok =>",data}
        }
        
    })
    result.classes = result.classes?.map(post => {
      return { ...post, _id: post._id.toString() };
    });
    
    
    console.log("result=>",result)
    res.render('library', { pageTitle: 'All Courses',user:req.session.user,data:result,session:req.session });
});
  


module.exports = router
