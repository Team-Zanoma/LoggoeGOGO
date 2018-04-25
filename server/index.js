const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const lodash = require('lodash');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
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
} = require('../database-mysql');

const searchYouTube = require ('youtube-search-api-with-axios');
const api = require('../config.js').API;


//---------------------------------------------------------MIDDLEWARE

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//---------------------------------------------------------USER LOGIN

app.post('/login', (req, res) => {
  getUser(req.body.username, (err, response) => {
    (err) ? 
      res.status(403).send(err) :
      res.status(201).send(response);
  });
});

//---------------------------------------------------------USER REGISTRATION

app.post('/register', (req, res) => {
  getUser(req.body.username, (err, response) => {
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
    console.log(success)
    res.status(201).send()
  });
})

app.delete('/timestamps', (req, res) => {
  let params = req.query;
  deleteTimestamp(params, (success) => {res.send()})
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
  })

  socket.on('disconnect', () => {
    console.log('user disconnected!');
  })
})


//---------------------------------------------------------SERVER

server.listen(3000, () => {
  console.log('listening on port 3000!');
});









