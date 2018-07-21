const express = require('express');
const http = require('http');
const createError = require('http-errors');
// const routes = require('./routes');
const app = express();

var cors = require('cors')
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var ObjectID = require('objectid')

const jsonParser = require('body-parser').json;
// const logger = require('morgan');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;

db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});

app.get('/',function(req,res){
res.status(200).json({ok:'ok'})
})

// app.use(function(req, res, next) {
//     next(createError(404));
//   });


app.use(jsonParser());

app.post('/api/empDetails',function(req,res){
        console.log('req.body', req.body);
        db.collection("employee").insertOne(req.body,function(err,obj){
          if(err)  res.status(400).json({success:false, sucerror:err.errors})
            else{
                res.status(200).json({success:true, message: 'Registered successfully.'})
            }
        })
})


app.get('/api/empDetails',function(req,res){
        db.collection("employee").find().toArray(function(err,obj){
          if(err)  res.status(400).json({success:false, sucerror:err.errors})
            else{
                res.status(200).json({success:true, message: obj})
            }
        })
})

app.put('/api/empDetails/:id', function(req,res){

        db.collection("employee").updateOne({_id:ObjectID(req.params.id)},req.body,function(err,data){

            if(err) res.status(500).json({success:false,message:'something went wrong.'})
            else{
                // console.log(data)
                res.status(200).json({success:true, message:'updated successfully'})
            }
        })

});
app.get('/api/empDetails/:id', function(req,res){
    db.collection("employee").find().toArray(function(err,data){
        if(err) res.status(500).json({success:false,message:'something went wrong.'})
        else{
            // console.log(data)
            res.status(200).json({success:true, message:'executed successfully', data:data})
        }
    })

});

app.delete('/api/empDetails/:id', function(req,res){

        db.collection("employee").remove({_id:ObjectID(req.params.id)},function(err,data){
            if(err) res.status(500).json({success:false,message:'something went wrong.'})
            else{
                // console.log(data)
                res.status(200).json({success:true, message:'deleted successfully'})
            }
        })

});
app.get('/api/empDetails/:id', function(req,res){
    db.collection("employee").find().toArray(function(err,data){
        if(err) res.status(404).json({success:false,message:'Data not found.'})
        else{
            // console.log(data)
            res.status(200).json({success:true, message:'executed successfully', data:data})
        }
    })

});


// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   if (req.method === 'Options') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
//     return res.status(200).json({});
//   }
// });
// app.use(logger('dev'));
// app.use(jsonParser());
// app.use('/questions', routes);
//
// app.get('/new', function (req, res) {
//   console.log('hiiii');
// });
//
// app.use((req, res, next) => {
//   const err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({
//     error: {
//       message: err.message
//     }
//   });
// });

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Web server listening on: ${port}`);
});
