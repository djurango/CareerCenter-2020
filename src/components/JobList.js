import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField";
import loadingImg from '../assets/loading.gif';


class JobList extends Component {

    state = {
        isLoading: true,
        totalJobs: [],
        jobs: [],
        apiJobs: [],
        error: null,
    }

    fetchJobs() {
        fetch('https://ohws.prospective.ch/public/v1/medium/1000470/jobs?lang=de&limit=200&offset=0')
            .then(response => response.json())
            .then(data => {
                    this.apiJobs = data.jobs;
                    this.setState({
                        jobs: data.jobs,
                        isLoading: false,
                    })
                }
            )
            .catch(error => this.setState({error, isLoading: false}));
    }

    fetchFilters() {
        fetch('https://ohws.prospective.ch/public/v1/medium/1000470/attributes/?lang=de')
            .then(response => response.json())
            .then(data => {
                    this.setState({
                        BerufsfeldFilter: data.attributes[0].values,
                        LevelFilter: data.attributes[1],
                        ArbeitsortFilter: data.attributes[2],
                        isLoading: false,
                    })
                }
            )
            .catch(error => this.setState({error, isLoading: false}));
    };

    componentDidMount() {
        this.fetchJobs();
        this.fetchFilters();
    };

    onChangeHandler(e) {
        let newArray = this.apiJobs.filter((d) => {
            let searchValue = d.title.toLowerCase();
            return searchValue.indexOf(e.target.value) !== -1;
        });
        this.setState({
            jobs: newArray
        })
    };

    render() {
        const {isLoading, jobs, error} = this.state;

        return (

            <div>

                <header>
                    <div>

                    </div>
                </header>

                <Grid className={"filterContainer"} container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <TextField variant="outlined" id="standard-basic" label="Suchbegriff" type="text"
                                   value={this.state.value} onChange={this.onChangeHandler.bind(this)} />
                    </Grid>
                    {error ? <p>Keine Jobs, sorry</p> : null}
                </Grid>

                <Grid container spacing={2}>
                    {!isLoading ? (
                        jobs.map(job => {
                            return (
                                <Grid item xs={12} sm={12} key={job.id}>
                                    <a target="_blank" rel="noopener noreferrer" href={job.links.directlink}>
                                        <Paper className={"element"}>
                                            <h2>{job.title}</h2>
                                            <br/>
                                            <div><b>Abteilung: </b>{job.attributes[10]}</div>
                                            <div><b>Erfahrung: </b>{job.attributes[20]}</div>
                                            <div><b>Land: </b>{job.attributes[25]}</div>
                                            <div><b>Ort: </b>{job.attributes[27]}</div>
                                        </Paper>
                                    </a>
                                </Grid>
                            );
                        })
                    ) : (
                        <div className={"loading"}>
                            <img className={"loadingSpinner"} src={loadingImg} alt=""/>
                            <div><b>Loading...</b></div>
                        </div>
                    )}
                </Grid>
            </div>
        );
    };
}

export default JobList;
