import React, {Component} from 'react';

class TotalJobs extends Component {

    state = {
        isLoading: true,
        totalJobs: [],
        error: null,
    }

    fetchJobs() {
        fetch('https://ohws.prospective.ch/public/v1/medium/1000470/jobs?lang=de&limit=200&offset=0')
            .then(response => response.json())
            .then(data => {
                    this.apiJobs = data.jobs;
                    this.setState({
                        totalJobs: data,
                        isLoading: false,
                    })
                }
            )
            .catch(error => this.setState({error, isLoading: false}));
    }

    componentDidMount() {
        this.fetchJobs();
    }


    render() {
        const {totalJobs} = this.state;
        return (
            <div>
                <h1>Jobs</h1>
                <h5>Zur Zeit sind {totalJobs.total} Stellen ausgeschrieben</h5>
            </div>
        );
    }
}

export default TotalJobs;
