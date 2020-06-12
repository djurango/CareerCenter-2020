import React, {Component} from 'react';


const data = [
    {
        "id": 0,
        "title": "TestProductForAzure",
        "description": null,
        "owner": "Seeded Company",
        "link": null,
        "url": "http://localhost:54729/api/product/3",
        "type": "Internal",
        "rank": 0,
        "productid": 3
    },
    {
        "id": 0,
        "title": "Official example",
        "description": null,
        "owner": null,
        "link": "/search/product?url=https://support.example.com/en-ae",
        "url": "https://support.example.com/en-ae",
        "type": "External",
        "rank": 0,
        "productid": 0
    }
];

class SelectDropdown extends Component {

    constructor() {
        super();
        this.state = {
            name: 'React'
        };
    }

    render() {
        return (
            <div>
                <select onChange={e => this.setState({filter: e.target.value})}>
                    <option value="">All</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                </select>
                <br /><br />
                {
                    data
                        .filter(item => !this.state.filter || item.type === this.state.filter)
                        .map(item => (
                            item.type === 'Internal' ?
                                <div className="internal">
                                    {item.title}
                                </div> :
                                <div className="external">
                                    {item.title}
                                </div>
                        ))
                }
            </div>
        );
    }

}

export default SelectDropdown;
