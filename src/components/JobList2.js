import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";


class JobList extends Component {

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

        if (!isLoaded) {
            return (
                <div className={"loading"}>
                    <img className={"loadingSpinner"} src="https://miro.medium.com/max/882/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt=""/>
                </div>)
        } else {
            return (
                <main>
                    <Grid container spacing={2}>
                        {
                            jobs.map(job => (
                                    <Grid item xs={12} key={job.id}>
                                        <a target="_blank" rel="noopener noreferrer" href={job.links.directlink}>
                                            <Paper className={"element"} >
                                                <img src="https://pms.imgix.net/" alt=""/>
                                                <h2>{job.title}</h2>
                                                <div><b>Abteilung </b>{job.templateData.adr_abteilung.value}</div>
                                                <div><b>Stellenantritt </b> {job.templateData.sza_starting_date.value}</div>
                                            </Paper>
                                        </a>
                                    </Grid>
                                )
                            )
                        }
                    </Grid>

                </main>
            )
        }
    }
}

export default JobList;
