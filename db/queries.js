// import pg promise library interface for PostgreSQL to handel database requests
let pgp = require('pg-promise')();
// load the postgress database location from  .env
let connString = process.env.DATABASE_URL
// connect  db promise to my database
let db = pgp(connString);

// The axios get comes here
function history(req, res, next) {
  // return all the records from the database using pg-promise method any , then
  db.any('SELECT information.id , products.product , information.result FROM information LEFT JOIN products ON products.barcode = information.barcode ;')
    .then(function(data) {
      console.log('DATA:', data);
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'All history were retrieved '
        });
    })
    .catch(function(err) {
      return next(err);
    });
}
// The axios get : id comes here
function getuserpref(req, res, next) {
  // parse the requested url to get the required tweed id using pg-promise method one , then
  let userid = parseInt(req.params.userid);
    db.one('select * from allergies where userid = $1', userid)
    .then(function(data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'One user preference was retrieved'
        });
    })
    .catch(function(err) {
      return next(err);
    });
}
// this function add one tweed to the database using postman

/*
http://localhost:3000/api/allergies
{
  "userid" : 123456,
    "eggsallergy": true,
    "fishallergy": false,
    "milkallergy": true,
    "peanutsallergy": false,
    "sesameallergy": false,
    "shellfishallergy": false,
    "soyallergy": false,
    "treenutsallergy": false,
    "wheatallergy": false
  }
);*/



function adduserpref(req, res, next) {
  console.log(req);
  console.log('req.body ===>', req.body)
   db.none('insert into allergies (userid ,eggsallergy , fishallergy , milkallergy, peanutsallergy, sesameallergy, shellfishallergy , soyallergy , treenutsallergy,wheatallergy)' +
      'values(${userid} , ${eggsallergy} , ${fishallergy} , ${milkallergy},${peanutsallergy},${sesameallergy} ,${shellfishallergy},${soyallergy},${treenutsallergy},${wheatallergy}  )',
      req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'One user preference was added'
        });
    })
    .catch(function(err) {
      console.log("This user already exist in the database");
      return next(err);
    });
}


function addnewproduct(req, res, next) {
  console.log(req);
  console.log('req.body ===>', req.body)
   db.none('insert into products (barcode ,product)' +
      'values(${barcode} , ${product} )',
      req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'One product was added'
        });
    })
    .catch(function(err) {
      console.log("This product already exist in the database");
      return next(err);
    });
}

function addresult(req, res, next) {
  console.log(req);
  console.log('req.body ===>', req.body)
   db.none('insert into information (userid ,barcode, eggs , fish, milk, peanuts, sesame, shellfish , soy , treenuts, wheat ,result)' +
      'values(${userid} ,${barcode}, ${eggs} , ${fish} , ${milk},${peanuts},${sesame} ,${shellfish},${soy},${treenuts},${wheat},${result}  )',
      req.body)
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: 'One product comparison result was added'
        });
    })
    .catch(function(err) {
      console.log("You have error in adding comparison result");
      return next(err);
    });
}

// change the information inside the database
/*
http://localhost:3000/api/allergies/123456
 put
  {

    "eggsallergy": false,
    "fishallergy": true,
    "milkallergy": true,
    "peanutsallergy": true,
    "sesameallergy": true,
    "shellfishallergy": true,
    "soyallergy": true,
    "treenutsallergy": true,
    "wheatallergy": true
  }
*/
function editpref(req, res, next) {
  console.log(req);
  db.none('update allergies set eggsallergy=$1, fishallergy=$2, milkallergy=$3, peanutsallergy=$4, sesameallergy=$5 ,shellfishallergy=$6 , soyallergy=$7,  treenutsallergy=$8 , wheatallergy=$9  where userid=$10', [req.body.eggsallergy, req.body.fishallergy, req.body.milkallergy, req.body.peanutsallergy, req.body.sesameallergy, req.body.shellfishallergy, req.body.soyallergy, req.body.treenutsallergy, req.body.wheatallergy , req.params.userid
    ])
    .then(function() {
      res.status(200)
        .json({
          status: 'success',
          message: ' one user preference was Updated'
        });
    })
    .catch(function(err) {
      console.log(err)
      return next(err);
    });
}
// this function delete the tweeds which it's id was after url
function deleteproduct(req, res, next) {
  let id = parseInt(req.params.id);
  db.result('delete from information where id = $1', id)
    .then(function(result) {
      res.status(200)
        .json({
          status: 'success',
          message: ` ${result.rowCount} product was removed`
        });
    })
    .catch(function(err) {
      return next(err);
    });
}



//CRUD
module.exports = {
  getuserpref  : getuserpref,    //read
  adduserpref  : adduserpref,    //add
  editpref     : editpref,       //Edit
  addnewproduct: addnewproduct,  //add
  addresult    : addresult,      //add
  history      : history,        //read
  deleteproduct: deleteproduct   //DELETE
};



