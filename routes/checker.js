
module.exports = function (req, res, next) {
  //Get token from header
  
  const token = req.session.token;
  console.log(req.session.user,req.url)
  if (!token) {
    return res.redirect("/login?next="+req.url)
  }
	
  next()
}
