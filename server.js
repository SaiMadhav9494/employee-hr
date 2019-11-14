
//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const whiteList = ['http://localhost:4200', 'https://employee-hr-app.herokuapp.com/'];
app.use(cors({
    origin(origin, callback) {
        console.log('the origin ', origin);
      if (whiteList.indexOf(origin) !== -1 || !origin) callback(null, true);
      else callback(new Error('Origin not allowed by CORS policy'));
    },
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
    limit: '4MB'
}));

const mongoose = require('mongoose');
const { Employee } = require('./employee.model');

const db = mongoose.connection;

mongoose.connect('mongodb+srv://sperumal:sperumal@cluster0-cp4wj.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    auth: {
        user: 'sperumal',
        password: 'sperumal'
    },
    server: {
        auto_connect: true
    }
});

db.once('open', () => {
    console.log('Database connected');
});

db.on('connect', () => {
    console.log('Database connected');
});

db.on('error', (e) => {
    console.log('Database error ', e);
    mongoose.disconnect();
});

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/datis'));

app.get('/employees', function(req, res) {
    Employee.find({}, function(err, employees) {
        if(err) return res.status(500).send({
            error: 'internal_server_error',
            data: null
        });

        console.log('Employees ', employees);
        return res.status(200).send({
            error: null,
            data: employees
        })
    });
});

app.post('/employees', function(req, res) {
    const employee = new Employee({
        fullName: req.body.fullName,
        role: req.body.role,
        grossPay: req.body.grossPay,
        deductions: req.body.deductions,
        takeHomePay: req.body.takeHomePay
    });

    employee.save((err, employee) => {
        if(err) return res.status(500).send({
            error: 'internal_server_error',
            data: null
        });

        console.log('Employee saved ');
        return res.status(200).send({
            error: null,
            data: null
        })
    });
});

app.get('/*', function(req, res) {
    
    res.sendFile(path.join(__dirname+'/dist/datis/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);