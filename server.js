const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cors =require('cors');
const path = require('path');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const fetchFunction = require("./modules/fetch")
const resource = require("./properties.json")

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions));

// MongoDB connection
/*mongoose.connect('mongodb://0.0.0.0:27017/school')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));
*/
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(express.json());

const indexRouter = require('./routes/auth');
const auth = require("./routes/checker")
const fetchRouter = require("./routes/fetch")
const Library = require("./routes/library")


app.use('/', indexRouter);
app.use('/fetch', fetchRouter);
app.use('/',Library)

const splitLength = (string, separator) => {
  if (!string || typeof string !== 'string') {
    return 0;
  }
  
  const parts = string.split(separator || ',');
  return parts.length;
};

const isInList = (item, list) => {
  if (!Array.isArray(list)) {
    return false;
  }
  
  return list.includes(item);
};

const isInString = (item, string) => {
  if(string === undefined){
    return false
  }
  if (!string.includes(item)) {
    return false;
  }
  
  return string.includes(item);
};


// Set Handlebars as the view engine
app.set('views', path.join(__dirname, 'files'));
app.engine('handlebars', exphbs({ extname: 'handlebars', defaultLayout: "index",helpers: {
  splitLength: splitLength,
  isInList:isInList,
  isInString:isInString
}}));
app.set('view engine', 'handlebars');



app.use(express.static(path.join(__dirname, 'files')));
app.use('/assets', express.static(path.join(__dirname, 'files/assets')));

app.get('/student-profile.html', auth,(req, res) => {
  res.render('student\\student-profile', { pageTitle: req.session.user.hcFullnames.toUpperCase(),user:req.session.user,fullnames:req.session.user.hcFullnames });
});

app.get('/profile', auth,(req, res) => {
  res.render('student\\student-profile', { pageTitle: req.session.user.hcFullnames.toUpperCase(),user:req.session.user,fullnames:req.session.user.hcFullnames });
});

app.get('/results', auth,(req, res) => {
  res.render('student\\student-quiz-results', { pageTitle: 'Your Results',user:req.session.user });
});

app.get('/logout', auth,(req, res) => {
  req.session = null
  res.redirect("login")
});

app.use('/path', require("./routes/coursedetail.js"));

app.use('/path.html', require("./routes/coursedetail.js"));


app.get('/library-filters.html', auth,async (req, res) => {
  let data = {}
  const library  = await Library.getLibrary(req)
  const classes  = await Library.getClasses(req)
  console.log("libary",library)
  data.subjects = library ? library : []
  data.classes = classes ?classes : []
  res.render('library', { pageTitle: 'All Courses',user:req.session.user,library:data });
});

app.get('/library-featured.html', auth,(req, res) => {
  res.render('library\\library-featured.html', { pageTitle: 'All Courses',library:{subjects:[]},user:req.session.user });
});


app.get('/courses', auth,(req, res) => {
  res.render('library', { pageTitle: 'All Courses',user:req.session.user });
});

app.get('/student-my-courses.html', auth,(req, res) => {
  res.render('course\\student-my-courses', { pageTitle: 'Current Courses',user:req.session.user });
});


app.use('/student/courses',require('./routes/course'))

app.get('/student/lesson/:id', auth,(req, res) => {
  res.render('course\\student-take-lesson', { pageTitle: 'Take Course' });
});

app.get('/billing', auth,(req, res) => {
  res.render('billing\\student-billing', { pageTitle: 'Billing Dashboard' });
});

app.get('/billing/history', auth,(req, res) => {
  res.render('billing\\student-billing-history', { pageTitle: 'Billing History' });
});

app.get('/billing/:id', auth,(req, res) => {
  res.render('billing\\student-billing-invoice', { pageTitle: 'Billing History' });
});

app.get('/pricing', auth,(req, res) => {
  res.render('pricing', { pageTitle: 'Price Dashboard' });
});

app.get('/payment', auth,(req, res) => {
  res.render('signup-payment', { pageTitle: 'Payment Dashboard' });
});

app.get('/discussions', auth,(req, res) => {
  res.render('student-discussions', { pageTitle: 'Student Discussions',user:req.session.user,session:req.session });
});

app.get('/discussion/:title', auth,(req, res) => {
  res.render('student-discussion', { pageTitle: req.params.title });
});

app.get('/discussions/ask', auth,(req, res) => {
  res.render('discussions\\student-discussions-ask', { pageTitle: 'Student Discussions',user:req.session.user });
});

app.get('/student/edit', auth,(req, res) => {
  res.render('student\\student-edit-account', { pageTitle: 'Edit Dashboard',user:req.session.user });
});

app.use("/student",require("./routes/student.js"))



app.get('/instructor', auth,(req, res) => {
  res.render('instructor-dashboard', { pageTitle: 'Student Dashboard' });
});


app.get('/', async (req, res) => {
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
            result.classes = data.classes
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
  
  
  res.render('home\\index', { pageTitle: 'Home',library:result,user:req.session.user,session:req.session });
});

app.get('/index.html', (req, res) => {
  res.render('home\\index', { pageTitle: 'Home' });
});

// Route to render index.handlebars
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname,'files/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname,'files/signup.html'));
});


app.get('/*', (req, res) => {
	try{
    res.sendFile(path.join(__dirname,'files'+req.url));
  }catch(e){}
  
})

// Start the server
const PORT = 8181;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
