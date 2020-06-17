import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import Paper from "@material-ui/core/Paper/Paper";
import TextField from "@material-ui/core/TextField";
import loadingImg from '../assets/images/loading.gif';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {number} from "prop-types";
import InputAdornment from "@material-ui/core/InputAdornment";
import CloseSharpIcon from '@material-ui/icons/CloseSharp';

const attributeType = {
    workArea: '10',
    workLocation: '25',
    level: '30'
}

const Job = job => ({
    get workAreas() {
        return job.attributes[attributeType.workArea] || []
    },
    get workLocations() {
        return job.attributes[attributeType.workLocation] || []
    }

})

class JobList extends Component {

    state = {
        isLoading: true,
        totalJobs: number,
        jobs: [],
        filteredJobs: [],
        apiJobs: [],
        error: null,
        workAreaFilter: {},
        levelFilter: {},
        locationFilter: {},
        filterValues: {
            searchTerm: '',
            workAreaFilter: '',
            levelFilter: '',
            locationFilter: '',
        }
    }

    fetchJobs() {
        fetch('https://ohws.prospective.ch/public/v1/medium/1000470/jobs?lang=de&limit=200&offset=0&query=')
            .then(response => response.json())
            .then(data => {
                    this.apiJobs = data.jobs;
                    this.setState({
                        jobs: data.jobs,
                        filteredJobs: data.jobs,
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
                        workAreaFilter: data.attributes.find(attribute => attribute.id === attributeType.workArea),
                        levelFilter: data.attributes.find(attribute => attribute.id === attributeType.level),
                        locationFilter: data.attributes.find(attribute => attribute.id === attributeType.workLocation),
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

    applyFilters(filters) {
        return this.state.jobs.filter(job => {
            let result = true;
            if (filters.searchTerm) result = result && job.title.toLowerCase().indexOf(filters.searchTerm) > -1;
            if (filters.workAreaFilter) result = result && Job(job).workAreas.includes(filters.workAreaFilter);
            if (filters.locationFilter) result = result && Job(job).workLocations.includes(filters.locationFilter);
            return result;
        });
    }

    onSearchTermChange(e) {
        const filters = {...this.state.filterValues};
        filters.searchTerm = e.target.value.toLowerCase();
        const filteredJobs = this.applyFilters(filters);
        this.setState({filteredJobs, filterValues: filters});
    };

    onWorkAreaFilterChange(e) {
        const filters = {...this.state.filterValues};
        filters.workAreaFilter = e.target.value;
        const filteredJobs = this.applyFilters(filters);
        this.setState({filteredJobs, filterValues: filters});
    }

    onLocationFilterChange(e) {
        const filters = {...this.state.filterValues};
        filters.locationFilter = e.target.value;
        const filteredJobs = this.applyFilters(filters);
        this.setState({filteredJobs, filterValues: filters});
    }

    clear = () => {
        this.setState({
            value: '',
        })
    }


    render() {
        const {isLoading, filteredJobs} = this.state;


        return (
            <div>
                <Grid className={"filterContainer"} container spacing={2}>
                    <Grid className={"searchFilter"} item xs={12} sm={12}>
                        <TextField variant="outlined"
                                   id="standard-basic"
                                   label="Suchbegriff"
                                   type="text"
                                   value={this.state.value}
                                   InputProps={{
                                       endAdornment: (
                                           //TODO Add function to reset input field
                                           <InputAdornment position="end">
                                               <CloseSharpIcon onClick={() => {}}/>
                                           </InputAdornment>
                                       )
                                   }}
                                   onChange={this.onSearchTermChange.bind(this)}/>

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined">
                            <InputLabel id="work-area-select-label">{this.state.workAreaFilter.name}</InputLabel>
                            <Select
                                labelId="work-area-select-label"
                                id="work-area-select"
                                value={this.state.filterValues.workAreaFilter}
                                onChange={this.onWorkAreaFilterChange.bind(this)}
                                label={this.state.workAreaFilter.name}
                            >
                                <MenuItem value="">Alle</MenuItem>
                                {
                                    // TODO Use key instead of value
                                    Object.entries(this.state.workAreaFilter.values || {}).map(([key, value]) => (
                                        <MenuItem key={value} value={value}>{value}</MenuItem>))
                                }</Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined">
                            <InputLabel id="location-select-label">{this.state.locationFilter.name}</InputLabel>
                            <Select
                                labelId="location-select-label"
                                id="location-select"
                                value={this.state.filterValues.locationFilter}
                                onChange={this.onLocationFilterChange.bind(this)}
                                label={this.state.locationFilter.name}

                            >
                                <MenuItem value="">Alle</MenuItem>
                                {
                                    // TODO Use key instead of value
                                    Object.entries(this.state.locationFilter.values || {}).map(([key, value]) => (
                                        <MenuItem key={value} value={value}>{value}</MenuItem>))
                                }</Select>
                        </FormControl>
                    </Grid>

                </Grid>

                <h5>{filteredJobs.length} Stellen entsprechen Ihren Filterkriterien</h5>


                <Grid container spacing={2}>
                    {!isLoading ? (
                        filteredJobs.map(job => {
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
