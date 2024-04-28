const express = require('express');
const router = express.Router();
const resource = require("../properties.json")
const fetchFunction = require("../modules/fetch")

router.post('/allCourses', async (req, res) => {
    try{
        fetchFunction(req.session.token,resource.SERVER+"/hapi/classes/data","post",req.body,function(data,e){
            console.log(data)
            if(data === undefined){
                
            }
            if(e.ok){
                return res.status(200).json({data})
            }else{
                return res.status(405).json({message:"Response not ok =>",data})
            }
            
        })
    }catch(e){
        console.log("Server Error =>",e)
        res.status(500).send("SERVER ERROR")
    }
    
})

module.exports = router;