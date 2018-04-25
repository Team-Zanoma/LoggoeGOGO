import React from 'react';
import axios from 'axios';
import c3 from 'c3';
import 'c3/c3.css';
import RaisedButton from 'material-ui/RaisedButton';

class Analytics extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      buckets: [],
      counts: [],
      view: 'chart',
      tags: []
    };

    this.getBuckets = this.getBuckets.bind(this);
    this.createChart = this.createChart.bind(this);
    this.chartGenCount = 0;
  }

  componentDidMount() {
    this.getBuckets();
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

  createChart(type) {
    const data = this.state.counts.slice();
    const times = this.state.buckets.slice();
    times[times.length-1] = times[times.length-1] + '+';

    if (type === 'chart') {
      const id = this.chartGenCount === 1 ? '#chart' : '#pie';
      const chart = c3.generate({
        bindto: id,
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
    } else {
      console.log(this.state.tags)
      const pie = c3.generate({
          bindto: '#chart',
          data: {
              columns: this.state.tags,
              type : 'pie',
              onclick: function (d, i) { console.log("onclick", d, i); },
              onmouseover: function (d, i) { console.log("onmouseover", d, i); },
              onmouseout: function (d, i) { console.log("onmouseout", d, i); }
          }
      });
    }
    this.chartGenCount++;
  }

  
  render() {
    this.createChart(this.state.view);
    return (
      <div>
        <h2>Analytics</h2>
      <RaisedButton label={this.state.view === 'chart' ? 'pie' : 'chart'} 
      onClick={() => {
        this.setState({view: this.state.view === 'chart' ? 'pie' : 'chart'});
      }}/>
        <div id={this.state.view === 'chart' ? 'chart' : 'pie'}>
        </div>
      </div>  
    );
  }

}
export default Analytics;

