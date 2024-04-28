const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cors =require('cors');
const path = require('path');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');

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

app.use('/', indexRouter);
app.use('/fetch', fetchRouter);

// Set Handlebars as the view engine
app.set('views', path.join(__dirname, 'files'));
app.engine('.html', exphbs({ extname: 'html', defaultLayout: "index"}));
app.set('view engine', '.html');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.get('/student-profile.html', auth,(req, res) => {
  res.render('student\\student-profile', { pageTitle: req.session.user.hcFullnames.toUpperCase(),user:req.session.user,fullnames:req.session.user.hcFullnames });
});

app.get('/profile', auth,(req, res) => {
  res.render('student\\student-profile', { pageTitle: req.session.user.hcFullnames.toUpperCase(),user:req.session.user,fullnames:req.session.user.hcFullnames });
});

app.get('/results', auth,(req, res) => {
  res.render('student\\student-quiz-results', { pageTitle: 'Your Results',user:req.session.user });
});


app.get('/path.html', auth,(req, res) => {
  res.render('paths', { pageTitle: 'Select Path',user:req.session.user });
});


app.get('/library-filters.html', auth,(req, res) => {
  res.render('library\\library-filters.html', { pageTitle: 'All Courses',user:req.session.user });
});

app.get('/library-featured.html', auth,(req, res) => {
  res.render('library\\library-featured.html', { pageTitle: 'All Courses',user:req.session.user });
});

app.get('/library.html', auth,(req, res) => {
  res.render('library', { pageTitle: 'All Courses',user:req.session.user });
});

app.get('/courses', auth,(req, res) => {
  res.render('library', { pageTitle: 'All Courses',user:req.session.user });
});

app.get('/student-my-courses.html', auth,(req, res) => {
  res.render('course\\student-my-courses', { pageTitle: 'Current Courses',user:req.session.user });
});

app.get('/student/courses', auth,(req, res) => {
  res.render('course\\student-my-courses', { pageTitle: 'Current Courses',user:req.session.user });
});

app.get('/student/courses/:id', auth,(req, res) => {
  res.render('course\\student-take-course', { pageTitle: 'Take Course',user:req.session.user });
});

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
  res.render('student-discussions', { pageTitle: 'Student Discussions' });
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

app.get('/student', auth,(req, res) => {
  console.log("names=",req.session.user.hcFullnames)
  res.render('student\\student-dashboard', { pageTitle: 'Student Dashboard',user:req.session.user,fullnames:req.session.user.hcFullnames });
});


app.get('/instructor', auth,(req, res) => {
  res.render('instructor-dashboard', { pageTitle: 'Student Dashboard' });
});


app.get('/', (req, res) => {
  res.render('home\\index', { pageTitle: 'Home' });
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
