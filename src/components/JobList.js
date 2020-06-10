import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField";

class JobList extends Component {

    state = {
        isLoading: true,
        jobs: [],
        error: null
    }

    apiJobs = [];

    fetchJobs() {
        fetch(`http://ohws.prospective.ch/public/v1/medium/1001946/jobs?lang=de&limit=200&offset=0`)
            .then(response => response.json())
            .then(data =>{
                    this.apiJobs = data.jobs;
                    this.setState({
                        jobs: data.jobs,
                        isLoading: false,
                    })
                }
            )
            .catch(error => this.setState({ error, isLoading: false }));
    }

    componentDidMount() {
        this.fetchJobs();
    }

    onChangeHandler(e) {
        let newArray = this.apiJobs.filter((d)=>{
            let searchValue = d.title.toLowerCase();
            return searchValue.indexOf(e.target.value) !== -1;
        });
        this.setState({
            jobs:newArray
        })
    }

    render() {
        const {isLoading, jobs, error} = this.state;
        return (
            <main>
                <h1>Jobs</h1>
                <TextField id="standard-basic" label="Suchbegriff" type="text" value={this.state.value} onChange={this.onChangeHandler.bind(this)}/>
                {error ? <p>Keine Jobs, sorry</p> : null}


                <Grid container spacing={2}>
                    {!isLoading ? (
                        jobs.map(job => {
                            return (
                                <Grid item xs={12} sm={12} key={job.id}>
                                    <a target="_blank" rel="noopener noreferrer" href={job.links.directlink}>
                                        <Paper className={"element"} >
                                            <h2>{job.title}</h2>
                                            <br/>
                                            <div><b>Arbeitsort: </b>{job.attributes[10]}</div>
                                            <br/>
                                            <div><b>Publikationsdatum: </b>{job.last_modification_timestamp}</div>


                                        </Paper>
                                    </a>
                                </Grid>
                            );
                        })
                    ) : (
                        <div className={"loading"}>
                            <img className={"loadingSpinner"} src="https://i.pinimg.com/originals/3e/f0/e6/3ef0e69f3c889c1307330c36a501eb12.gif" alt=""/>
                        </div>
                    )}
                </Grid>







            </main>
        );
    }

}

export default JobList;
