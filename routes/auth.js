const express = require('express');
const router = express.Router();
const resource = require("../properties.json")
const fetchFunction = require("../modules/fetch")

// Define routes
router.post('/login', async (req, res) => {
    try {
        const nextUrl = req.query.next;

        console.log("next=>",nextUrl)
        // Make fetch request to get token
        const response = await fetch(resource.SERVER+"/users/student/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
        
          },
          body: JSON.stringify(req.body) // Assuming req.body contains the necessary data for authentication
        });
    
        // Parse JSON response
        
        console.log(response.ok,resource.SERVER)
        const data = await response.json();
        // Store token in session
        if(response.ok){
            
            req.session.token = data.token;
            req.session.user = data.user;
            
            if (nextUrl) {
                res.redirect(nextUrl);
            }
            if(req.query.next){
              return res.redirect(req.query.next)
            }
            return res.redirect("/student")
        }
        return res.redirect(`/login?message${data.message}`)
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    
});

router.post('/signup', async (req, res) => {
    fetchFunction(null,resource.SERVER+"/users/student/register","post",req.body,function(data,e){
        console.log(data)
        if(e.ok){
            return res.redirect("/login?message="+data.message)
        }else{
            return res.redirect("/signup?message="+data.message)
        }
    })
})


module.exports = router;