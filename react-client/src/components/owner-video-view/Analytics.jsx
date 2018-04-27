import React from 'react';
import axios from 'axios';
import c3 from 'c3';
import 'c3/c3.css';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class Analytics extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      buckets: [],
      counts: [],
      view: 'chart',
      tags: [],
      open: false,
      sentiment: 0
    };

    this.getBuckets = this.getBuckets.bind(this);
    this.createChart = this.createChart.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getBuckets();
    this.getChatMessages();
  }

  getBuckets() {
    axios.get('/buckets', {
      params: {
        videoId : this.props.video.videoId,
        duration: this.props.video.duration
      }
    })
    .then((data) => {
      this.setState({
        buckets: data.data.map((row) => row.TimeStampGroup),
        counts: data.data.map((row) => row.total)
      })
      this.arrangeTags();
    })
  }

  getChatMessages() {
    axios.post('/chatMessages', {videoId: this.props.video.videoId})
    .then(num => {
      if (num.data.n) {
        this.setState({sentiment: num.data.n});
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  arrangeTags() {
    const tags = {};

    this.props.timeStamps.forEach(comment => {
      let tag = comment.tag;
      if (tags.hasOwnProperty(tag)) {
        tags[tag].push(1);
      } else {
        tags[tag] = [2];
      }
    })

    const tagsArray = Object.entries(tags);
    tagsArray.forEach((arr, i) => {
      tagsArray[i] = [arr[0] ,...arr[1]]
    })
    this.setState({tags: tagsArray})
  }

  createChart() {
    const type = this.state.view;
    const data = this.state.counts.slice();
    const times = this.state.buckets.slice();
    times[times.length-1] = times[times.length-1] + '+';

    if (type === 'chart') {
      const chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            ['confused', ...data]
          ],
        },
        axis: {
            x: {
                type: 'category',
                categories: times
            }
        }
      });
    } else if (type === 'pie') {
      const pie = c3.generate({
          bindto: '#pie',
          data: {
              columns: this.state.tags,
              type : 'pie',
              onclick: function (d, i) { console.log("onclick", d, i); },
              onmouseover: function (d, i) { console.log("onmouseover", d, i); },
              onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          },
          size: {
              height: 350
          }
      });
    } else {
      var gauge = c3.generate({
        bindto: '#gauge',
          data: {
              columns: [
                  ['user sentiment', this.state.sentiment]
              ],
              type: 'gauge',
              onmouseover: function (d, i) { console.log("onmouseover", d, i); },
              onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          },
          color: {
              pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], 
              threshold: {
                  values: [30, 60, 90, 100]
              }
          },
          size: {
              height: 300
          }
      }); 
    }
  }

  handleClick(e) {
    const innerText = e.target.innerText
    const view = innerText === 'Confusion Graph' ? 'chart' 
    : innerText === 'Feedback Pie' ? 'pie' : 'gauge';
    this.setState({view: view});
  }

  
  render() {
    this.createChart(this.state.view);
    return (
      <div>
        <h2>Analytics</h2>
      <div>
        <RaisedButton
          onClick={(e) => {
            e.preventDefault();
            this.setState({open: true, anchorEl: e.currentTarget});
          }}
          label="views"
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={() => {
            this.setState({open: false})
          }}
        >
          <Menu>
            <MenuItem value="chart" primaryText="Confusion Graph" onClick={this.handleClick}/>
            <MenuItem value="pie" primaryText="Feedback Pie" onClick={this.handleClick}/>
            <MenuItem value="gauge" primaryText="Chat Sentiment" onClick={this.handleClick}/>
          </Menu>
        </Popover>
          <div id={this.state.view}>
          </div>
        </div> 
      </div> 
    );
  }

}
export default Analytics;

