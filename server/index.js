const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const lodash = require('lodash');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const {
  getOwnerTimestamp,
  getCurrentVideo,
  getOwnerVideos,
  getTimestamp, 
  getAllVideos, 
  getUserId,
  getUser, 
  setTimestamp, 
  setVideo,
  deleteVideo, 
  setUser,
  getBuckets,
  deleteTimestamp, 
  addChatMessage,
  getAllMessages,
  makeNote,
  getNotes
} = require('../database-mysql');
var request = require("request");


const searchYouTube = require ('youtube-search-api-with-axios');
const api = require('../config.js').API;
const azureAPI = require('../config.js').azureAPI;
const chalk = require('chalk');

//---------------------------------------------------------MIDDLEWARE

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//---------------------------------------------------------USER LOGIN

app.post('/login', (req, res) => {
  getUser(req.body.username, (err, response) => {
    
    req.session.user = req.body.username;

    err ? res.status(403).send(err) 
    : res.status(201).send(response);
  });
});

//---------------------------------------------------------USER REGISTRATION

app.post('/register', (req, res) => {
  getUser(req.body.username, (err, response) => {
    req.session.username = req.body.username;

    if (err) res.status(403).send(err);
    let isExist = !!response.length;

    if (isExist) {
      res.status(201).send(true);
    } 
    else {
      setUser(req.body, (err, response) => 
        (err) ? 
          res.status(403).send(err) :
          res.status(201).send(false)
      )      
    }
  })
})
//---------------------------------------------------------AUTH
app.get('/auth', (req, res) => {
  res.send({user: req.session.user, videoId: req.session.videoId});
})

app.post('/videoId', (req, res) => {
  req.session.videoId = req.body.videoId;
  res.send();
})

app.get('/videoId', (req, res) => {
  res.send(req.session.videoId);
})


//---------------------------------------------------------USER ID
//get userId for owner homepage and student homepage
app.get('/user/id', (req, res) => {
  getUserId(req.query.user, (userId) => 
    res.send(userId)
  )
})

//---------------------------------------------------------STUDENT USER REQUESTS
//get all videos for student homepage
app.get('/student/homepage', (req, res) => 
  getAllVideos((videos) => 
    res.send(videos)
  )
)

//---------------------------------------------------------OWNER USER REQUESTS

app.get('/owner/search', (req, res) => {
  searchYouTube({key: api, q: req.query.query, maxResults: 10}, 
    (video) => {
      res.status(200).send(video)
    });
});

//get all videos for owner.
app.get('/owner/videoList', (req, res) => {
  getOwnerVideos(req.query.userId, (videos) => {
    res.send(videos);
  })
})

app.post('/owner/save', (req, res) => {
  const {video, userId} = req.body;
  let url = `https://www.googleapis.com/youtube/v3/videos?id=${video.id.videoId}&part=contentDetails&key=${api}`;
  axios.get(url).then((data) => {
    let duration = moment.duration(data.data.items[0].contentDetails.duration, moment.ISO_8601).asSeconds();
    setVideo(video, userId, duration, (err, resp) => {
      err ? console.log(err) : console.log('saved video');
      res.send();
    })
  });
})

app.post('/owner/remove', (req, res) => {
  const {video, userId} = req.body;

  deleteVideo(video, userId, (err, resp) => {
    err ? console.log(err) : console.log(resp)
    res.send('deleted!')
  })
})

//---------------------------------------------------------ANALYTICS

app.get('/buckets', (req,res) => {
  const params = req.query
  getBuckets(params, (data) => {
    data.sort(function (a, b) {
      return Number(a.TimeStampGroup.match(/\d+/)) - Number(b.TimeStampGroup.match(/\d+/));
    });

    const formatNumbers = (range) => {
      var timeRange = [];
      const timesArr = range.split('-');
      timesArr.forEach(time => {
        time = Number(time);
        let minutes = Math.floor(time / 60);
        let seconds = time - minutes * 60;
        timeRange.push(String(minutes) + ':' + String(seconds));
      })
      return timeRange.join('-');
    }

    data.forEach(timeObj => {
      timeObj.TimeStampGroup = formatNumbers(timeObj.TimeStampGroup.replace(/[+]/, ''));
    })
    res.json(data)
  })
})

//---------------------------------------------------------WORKING WITH TIMESTAMPS

app.get('/timestamps', (req, res) => {
  let videoId = req.query.videoId
  getTimestamp(videoId, req.query.userId, (data) => {res.json(data)});  
})


app.get('/timestamps/owner', (req, res) => {
  let videoId = req.query.videoId
  getOwnerTimestamp(videoId, (data) => {res.send(data)});  
})

app.post('/timestamps', (req, res) => {
  let params = req.body.params;
  console.log(params)
  setTimestamp(params, (success) => {
    res.status(201).send()
  });
})

app.delete('/timestamps', (req, res) => {
  let params = req.query;
  deleteTimestamp(params, (success) => {res.send()})
})

//---------------------------------------------------------GET MESSAGES

app.post('/chatMessages', (req, res) => {
  const {videoId} = req.body;
  getAllMessages(videoId, (err, result) => {

    let azureString = result.reduce((accum, curr) => {return accum + '. ' + curr.body}, '');

    let url = 'https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
    let data = {
      documents: [{language: 'en', id: 1, text: azureString}]
    }
    var options = { method: 'POST',
    url: 'https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment',
    headers: 
     { 'Postman-Token': 'bba7ddd4-ef0c-4b25-b7d0-071acb6fecae',
       'Cache-Control': 'no-cache',
       'Content-Type': 'application/json',
       'Ocp-Apim-Subscription-Key': azureAPI },
    body: 
     { documents: 
        [ { id: '1',
            text: azureString } ] },
    json: true };

    if (azureString === '') return res.send();

    request(options, function (error, response, body) {
      res.send({n: body.documents[0].score.toFixed(2)*100});
    });
  })
})

//---------------------------------------------------------NOTES

app.post('/notes', (req, res) => {
  const { note, userId, videoId } = req.body;
  makeNote(note, userId, videoId, (err, success) => {
    err ? res.send(err) : res.send(success);
  })
})

app.post('/userNotes', (req, res) => {
  const { userId, videoId } = req.body;
  getNotes(userId, videoId, (err, notes) => {
    err ? res.send(err) : res.send(notes);
  })
})

app.delete('/notes', (res, req) => {
  const { username, note } = req.query;

  res.send();
})

//---------------------------------------------------------CATCH ALL FOR REACT-ROUTER

app.get('*', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../react-client/dist/index.html`));
});

//---------------------------------------------------------Socket.io

io.on('connection', (socket) => {
  console.log('user connected!');

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
    addChatMessage(message.message, message.room, (err, res) => {
      err ? console.log(err) : console.log('added!');
    });
  })

  socket.on('disconnect', () => {
    console.log('user disconnected!');
  })
})

//---------------------------------------------------------SERVER

server.listen(3000, () => {
  console.log('listening on port 3000!');
});









