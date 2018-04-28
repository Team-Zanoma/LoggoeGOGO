const mysql = require('mysql');
const KEYS = require('../keys.js');

const connection = mysql.createConnection({
  host     : KEYS.host,
  user     : KEYS.user,
  database : KEYS.database,
  password : KEYS.password
});


//---------------------------------------------------------USER QUERIES
//-------------------------------------------- GET REQUESTS
const getUser = (user, callback) => {
  let query = `SELECT * FROM users WHERE name = "${user}"`;

  connection.query(query, (err, results) => {
    (err) ?
      console.error(err) :
      callback(err, results);
  });
  } 
  
  const getUserId = (user, callback) => {
    let query = `SELECT id FROM users WHERE name = "${user}"`;

    connection.query(query, (err, results) => {
      (err) ?
        console.error(err) :
        callback(results);
    });
  } 

//-------------------------------------------- SET REQUESTS
const setUser = (user, callback) => {
  var query = `INSERT IGNORE INTO users (name, owner) VALUE (?, ?);`

  connection.query(query, [user.username, user.isOwner], (err, results) => {
    (err) ?
      console.error(err) :
      callback(err, results);
  })
}

//---------------------------------------------------------VIDEO QUERIES
//-------------------------------------------- GET REQUESTS
const getAllVideos = (callback) => {
  const query = 'SELECT * FROM videos';

  connection.query(query, (err, results) => {
    (err) ?
      console.log('Did not get videos from database', err) :
      callback(results);
  });
};

const getCurrentVideo = (videoId, callback) => {
  const query = `SELECT * FROM videos WHERE videoId='${videoId}'`;

  connection.query(query, (err, results) => {
    (err) ?
      console.log('err', err) :
      callback(results);
  })
}

const getOwnerVideos = (userId, callback) => {
  const query = `SELECT * FROM videos WHERE userId='${userId}'`;

  connection.query(query, (err, results) => {
    (err) ?
      console.log('Did not get videos from database', err) :
      callback(results);
  });
};


const getBuckets = function({videoId, duration}, callback) {
  let bucketFloors = []
  for (let i = 0; i < duration; i+=duration/10) {
    bucketFloors.push(Math.floor(i))
  }
  
  connection.query(`select TimeStampGroup,
  count(*) as total
  from (
    select case when timestamp between ${bucketFloors[0]} and ${bucketFloors[1]} then '${bucketFloors[0]}-${bucketFloors[1]}' 
      when timestamp between ${bucketFloors[1]} and ${bucketFloors[2]} then '${bucketFloors[1]}-${bucketFloors[2]}' 
      when timestamp between ${bucketFloors[2]} and ${bucketFloors[3]} then '${bucketFloors[2]}-${bucketFloors[3]}' 
      when timestamp between ${bucketFloors[3]} and ${bucketFloors[4]} then '${bucketFloors[3]}-${bucketFloors[4]}' 
      when timestamp between ${bucketFloors[4]} and ${bucketFloors[5]} then '${bucketFloors[4]}-${bucketFloors[5]}' 
      when timestamp between ${bucketFloors[5]} and ${bucketFloors[6]} then '${bucketFloors[5]}-${bucketFloors[6]}' 
      when timestamp between ${bucketFloors[6]} and ${bucketFloors[7]} then '${bucketFloors[6]}-${bucketFloors[7]}'
      when timestamp between ${bucketFloors[7]} and ${bucketFloors[8]} then '${bucketFloors[7]}-${bucketFloors[8]}'
      when timestamp between ${bucketFloors[8]} and ${bucketFloors[9]} then '${bucketFloors[8]}-${bucketFloors[9]}'
      else '${bucketFloors[9]}+' end as TimeStampGroup
      from timeStamps WHERE videoId = '${videoId}'
    ) t
    group by TimeStampGroup order by TimeStampGroup;`, 
    function(err, results, fields) {
      if(err) {
        console.error(err);
      } else {
        callback(results);
      }
    })
}


//-------------------------------------------- POST REQUESTS
const setVideo = (video, userId, duration, callback) => {
  const query = "INSERT IGNORE INTO videos (videoId, title, description, image, userId, duration) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [video.id.videoId, video.snippet.title, video.snippet.description, video.snippet.thumbnails.default.url, userId, duration];

  connection.query(query, values, (err, result) => {
    err ? callback(err) : callback();
  })
}

const deleteVideo = (video, userId, callback) => {
  const query = "DELETE FROM videos WHERE userId = ? AND id = ?;";
  const values = [userId, video.id];

  connection.query(query, values, (err, result) => {
    err ? callback(err) : callback(null, result);
  })
}

//---------------------------------------------------------TIMESTAMP QUERIES
//-------------------------------------------- GET REQUESTS
const getTimestamp = (videoId, userId, callback) => {
  //const query = `SELECT timestamp, comment FROM timeStamps WHERE videoId = '${videoId}' AND userId = '${userId}' ORDER BY timestamp asc;`
  const query2 = `select name, comment, tag, timestamp, userId from users left join timeStamps on users.id = timeStamps.userId where userId = '${userId}';`;
  connection.query(query2, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  })
}

const getOwnerTimestamp = (videoId, callback) => {
  //const query = `SELECT userId, timestamp, userId, comment, tag FROM timeStamps WHERE videoId = '${videoId}' ORDER BY timestamp asc;`;
  const query2 = `select name, comment, tag, timestamp, userId from users left join timeStamps on users.id = timeStamps.userId where videoId = '${videoId}';`;
  connection.query(query2, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  })
}


//-------------------------------------------- POST REQUESTS
const setTimestamp = ({userId, videoId, timestamp, comment, radioButtonValue}, callback) => {
  const query = `INSERT INTO timeStamps (userId, videoId, timeStamp, comment, tag) VALUES (${userId}, '${videoId}', ${timestamp}, '${comment}', '${radioButtonValue}');`;
  
  connection.query(query, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  });
};

//-------------------------------------------- DELETE REQUESTS
const deleteTimestamp = ({userId, videoId, timestamp}, callback) => {
  const query = `DELETE FROM timeStamps WHERE userId = ${userId} AND videoId = '${videoId}' AND timeStamp = ${timestamp};`

  connection.query(query, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  })
}

//--------------------------------------------- CHAT STORAGE

const addChatMessage = (body, videoId, callback) => {
  const query = `INSERT INTO chat (body, video_id) VALUES (?, (select id from videos where videoId = ?));`;
  const value = [body, videoId];
  connection.query(query, value, (err, result) => {
    err ? callback(err) : callback(null, result);
  })
}

const getAllMessages = (videoId, callback) => {
  const query = `SELECT body FROM chat WHERE video_id = (select id from videos where videoId = ?);`;
  const value = [videoId];
  connection.query(query, value, (err, result) => {
    err ? callback(err) : callback(null, result);
  })
}

//--------------------------------------------- NOTES

const makeNote = (note, userId, videoId, callback) => {
  const query = 'INSERT INTO notes (body, user_id, video_id) VALUES(?, ?, (SELECT id FROM videos WHERE videoId = ?));';
  const values = [note, userId, videoId];
  connection.query(query, values, (err, res) => {
    err ? callback(err) : callback(null, res);
  })
}

const getNotes = (userId, videoId, callback) => {
  const query = 'SELECT * FROM notes WHERE user_id = ? AND video_id = (SELECT id FROM videos WHERE videoId = ?)';
  const values = [userId, videoId];
  connection.query(query, values, (err, res) => {
    err ? callback(err) : callback(null, res);
  })
}
  
exports.getNotes = getNotes;
exports.makeNote = makeNote;  
exports.getBuckets = getBuckets;
exports.getUser = getUser;
exports.setUser = setUser;
exports.setVideo = setVideo;
exports.deleteVideo = deleteVideo;
exports.setTimestamp = setTimestamp;
exports.getUserId = getUserId;
exports.getTimestamp = getTimestamp;
exports.getAllVideos = getAllVideos;
exports.getOwnerVideos = getOwnerVideos;
exports.getCurrentVideo = getCurrentVideo;
exports.getOwnerTimestamp = getOwnerTimestamp;
exports.deleteTimestamp = deleteTimestamp;
exports.addChatMessage = addChatMessage;
exports.getAllMessages = getAllMessages;
