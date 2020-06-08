import React, {Component} from 'react';
import { useTable } from "react-table";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [{
          jobs: [],
          isLoaded: false
        }],
    };
  }

  componentDidMount() {
    fetch('http://ohws.prospective.ch/public/v1/careercenter/1000103/json/?limit=1000')
        .then(res => res.json())
        .then(json => {
          this.setState({
            isLoaded: true,
            jobs: json.jobs,
          })
        });
  }

  render() {
    const {isLoaded, jobs} = this.state;

    if(!isLoaded) {
      return (<div>
        <img src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt=""/>
      </div>)
    }
    else {
      return (
          <div>
            <ul>
              {
                jobs.map(job => (
                    <li key={job.id}>
                      <a href={job.links.directlink}>{job.title}</a>
                    </li>
                ))}
            </ul>
          </div>
      )
    }
  }
}

export default App;
