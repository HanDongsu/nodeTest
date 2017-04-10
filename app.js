var express = require('express')
  , http = require('http')
  , path = require('path');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var expressError = require('express-error-handler');
var socketio = require('socket.io');
var cors = require('cors');
var bcrypt=require("bcrypt-nodejs");
var mongodb = require('mongodb');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set('port', process.env.PORT||3000);
app.use('/', express.static(path.join(__dirname, ''))); //기본경로 설정

app.use(cors());
app.use(expressSession({
	secret:'12asdf09@1rasdlfj@DF@T@',
	resave: false,
	saveUninitialized:true
}));
app.get('/count', function(req, res) {
	if(req.session.count) {
		req.session.count++;
	} else {
		req.session.count = 1;
	}
	res.send("count:" + req.session.count);
});
var database;
function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/db';
	mongodb.connect(databaseUrl, function(err, db) {
		if(err) throw err;
		console.log('database에 연결됨. : ' + databaseUrl);
		database = db;
	});
}
app.get('/main', function(req, res) {
	res.sendFile(__dirname+'/client/main.html');
});
var joinUser = function(database, id, password, name, callback) {
	var users = database.collection('users');
	users.insert([{"id":id,"password":password,"name":name}], function(err, result) {
		if(err) {
			callback(err, null);
			return;
		}
		callback(null, result);
	});
}
app.get('/signUp', function(req, res) {
	res.sendFile(__dirname+'/client/signUp.html');
});
app.post('/signUp_User', function(req, res) {
	var userId = req.body.userId;
	var userPwd = req.body.userPwd;
	var userName = req.body.userName;
	if(database) {
		joinUser(database, userId, userPwd, userName, function(err, result) {
			if(err) {throw err;}
			if(result) {
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write(JSON.stringify({'state':'success'}));
				res.end();
			} else {
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write(JSON.stringify({'state':'fail'}));
				res.end();
			}
		});
	} else {
		res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
});
app.get('/sessionInfo', function(req, res) {
	res.send(req.session);
})
var authUser = function(database, id, password, callback) {
	var users = database.collection('users');
	users.find({"id":id,"password":password}).toArray(function(err, docs){
		if(err) {
			callback(err, null);
			return;
		}
		if(docs.length > 0) {
			console.log('아이디 [%s], 패스워드 [%s] 인 사용자 찾음 nameL:[%s]', id, password);
			callback(null, docs);
		} else {
			console.log('사용자못찾음');
			callback(null, null);
		}
	});
}
app.get('/signIn', function(request, response) {
	response.sendFile(__dirname + '/client/signIn.html');
});
app.post('/auth/signIn', function(req, res) {
	var userId = req.body.userId;
	var userPwd = req.body.userPwd;
	if(database) {
		authUser(database, userId, userPwd, function(err, docs) {
			if(err) {throw err;}
			if(docs) {
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write(JSON.stringify({'state':'success'}));
				req.session.userName = docs[0].name;
				req.session.userid = docs[0].id;
				res.end();
			} else {
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write(JSON.stringify({'state':'fail'}));
				res.end();
			}
		});
	} else {
		res.send("디비 연결실패");
		res.end();
	}
});
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
	connectDB();
});
app.get('/chatting', function (req, res) {
	res.sendFile(__dirname+'/client/chatting.html');
})
var io = socketio.listen(server);
io.sockets.on('connection', function(req, res) {
	socket.on('message', function(message) {
		io.sockets.emit('message',message);
	});
});
