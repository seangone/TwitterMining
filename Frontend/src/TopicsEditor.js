import React from 'react';


// const apiurl = "http://18.144.22.172:8080/api";
const apiurl = "http://localhost:8080/api";
const emptytopic = {
    'name': '',
    'keywords': '',
    'userids': ''
};
const data = [{
    'name': 'trump',
    'keywords': 'aa',
    'userids': '123,123'
}, {
    'name': 'james',
    'keywords': '#nba,lebrown',
    'userids': '123,123'
}];

class TopicsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filterText: "",
            error: null,
            isLoaded: false,
            data: data,
            dataStatus: Array(data.length).fill("")
        };
    }
    componentDidMount(){
        this.fetchTopics();
    }
    // communication with back-end
    fetchTopics() {
        const url = apiurl + "/topics";
        console.log("Fetch URL: " + url);
        fetch(url, {method: 'GET', mode: 'cors'})
            .then(res => res.json())
            .then(
                (raw) => {
                    console.log("fetchTopics Success: size " + raw.length);
                    let fined = raw.map((line) => {
                        return {
                            name: line._id,
                            keywords: line.keywords.join(','),
                            userids: line.ids.join(',')
                        };
                    }).filter(line => line.name !== "");
                    this.setState({
                        isLoaded: true,
                        data: fined,
                        dataStatus: Array(data.length).fill("")
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    console.log("err"+error.message);
                    this.setState({
                        isLoaded: true,
                        error,
                        data: [],
                        dataStatus: Array([].length).fill("")
                    });
                }
            )
    };
    submitOneToServer(method, index) {
        var data = this.state.data[index];
        if (data === undefined || data.name === undefined || data.name === "") {
            console.log("Empty " + index);
            if (method === "submit") {
                return false;
            } else if (method === "delete") {
                this.state.data.splice(index, 1);
                this.state.dataStatus.splice(index, 1);
                this.setState(this.state.data);
                this.setState(this.state.dataStatus);
                return false;
            }
            return false;
        }
        const url = apiurl + "/topics/";
        const body = JSON.stringify({
            "_id": data.name,
            "keywords": data.keywords.split(",").filter((item)=>item!==""),
            "ids": data.userids.split(",").filter((item)=>item!=="")
        });
        console.log(method + " URL: " + url);
        console.log(body);
        if (method === "submit") {
            fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: body,
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .catch(error => {
                console.log('--Error:', error);
                var newDataStatus = this.state.dataStatus.slice();
                newDataStatus[index] = "error";
                this.setState({dataStatus: newDataStatus});
            })
            .then(response => {
                console.log('--Success:', response);
                var newDataStatus = this.state.dataStatus.slice();
                newDataStatus[index] = "submitted";
                this.setState({dataStatus: newDataStatus});
            });
        } else if (method === "delete") {
            fetch(url + data.name, {
                method: 'DELETE',
                mode: 'cors',
                body: body,
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .catch(error => {
                console.log('Error:', error);
                var newDataStatus = this.state.dataStatus.slice();
                newDataStatus[index] = "error";
                this.setState({dataStatus: newDataStatus});
            })
            .then(response => {
                console.log('--Deleted:', response);
                this.state.data.splice(index, 1);
                this.state.dataStatus.splice(index, 1);
                this.setState(this.state.data);
                this.setState(this.state.dataStatus);
            })
        }

        return ;
    };
    // handle submitting events
    handleSubmit(index) {
        if (index === -1) {
            var newDataStatus = this.state.dataStatus.slice();
            this.state.data.map((data, ix) => {
                if (data === undefined || data.name === undefined || data.name === "") {
                    newDataStatus[ix] = "error";
                }
                return ;
            });
            this.setState({dataStatus: newDataStatus});
            this.state.data.map((line, ix) => {
                this.submitOneToServer("submit", ix);
            })
        } else {
            this.submitOneToServer("submit", index);
        }
        return true;
    };
    // handle all filtering events
    handleUserInput(filterText) {
        this.setState({filterText: filterText});
    };
    // handle all editing events
    handleRowDel(index) {
        this.submitOneToServer("delete", index);
    };
    handleAddEvent(evt) {
        // var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var topic = Object.assign({}, emptytopic);
        // topic.name = id;
        this.state.data.push(topic);
        this.state.dataStatus.push("");
        this.setState(this.state.data);
        this.setState(this.state.dataStatus);

    };
    handleTableUpdate(evt) {
        var item = {
            id: evt.target.id, // index
            name: evt.target.name, // keywords
            value: evt.target.value
        };

        console.log("Update:" + evt.target.id);
        var data = this.state.data.slice();
        // var newData = data.map((topic, index) => { // O(n)
        //     if (topic.name == item.id) {
        //         topic[item.name] = item.value;
        //     }
        //     return topic;
        // });
        data[item.id][item.name] = item.value;
        var dataStatus = this.state.dataStatus.slice();
        dataStatus[item.id] = "changed";
        this.setState({data:data});
        this.setState({dataStatus:dataStatus});
        //  console.log(this.state.data);
    };
    //rendering
    render() {
        const { error, isLoaded} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (this.state.data == null) {
            return <div>Null</div>;
        }

        return (
            <div>
                <SearchBar filterText={this.state.filterText}
                           onUserInput={this.handleUserInput.bind(this)}/>
                <ProductTable onTableUpdate={this.handleTableUpdate.bind(this)}
                              onSubmit={this.handleSubmit.bind(this)}
                              onRowAdd={this.handleAddEvent.bind(this)}
                              onRowDel={this.handleRowDel.bind(this)}
                              data={this.state.data}
                              dataStatus={this.state.dataStatus}
                              filterText={this.state.filterText}/>
            </div>
        );

    }

}

// only for style and dom, it doesn't contain data
class SearchBar extends React.Component {
    handleChange() {
        this.props.onUserInput(this.refs.filterTextInput.value);
    }
    render() {
        return (
            <div>
                <input type="text"
                       placeholder="Search Name..."
                       value={this.props.filterText}
                       ref="filterTextInput"
                       onChange={this.handleChange.bind(this)}
                       className='form-control'
                />
            </div>

        );
    }

}

class ProductTable extends React.Component {
    render() {
        var onTableUpdate = this.props.onTableUpdate;
        var onRowDel = this.props.onRowDel;
        var onSubmit = this.props.onSubmit;
        var filterText = this.props.filterText;
        var rows = this.props.data
            .filter(topic => topic.name.indexOf(filterText) !== -1)
            .map( (topic, index)=> {
                return (
                    <ProductRow key={index}
                                index={index}
                                topic={topic}
                                dataStatus={this.props.dataStatus[index]}
                                onTableUpdate={onTableUpdate}
                                onSubmit={(e)=>onSubmit(index)}
                                onRowDel={(e)=>onRowDel(index)}
                    />)
        });
        return (
            <div>
                <button type="button"
                        onClick={(e)=>this.props.onSubmit(-1)}
                        className="btn btn-outline-primary float-right">
                    Submit All
                </button>
                <button type="button"
                        onClick={this.props.onRowAdd}
                        className="btn btn-outline-secondary float-right">
                    Add Topic
                </button>
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th style={{width: "20%"}}>Name</th>
                        <th style={{width: "33%"}}>Keywords</th>
                        <th style={{width: "33%"}}>UserIds</th>
                        <th>✓</th>
                        <th>✗</th>
                    </tr>
                    </thead>

                    <tbody>
                    {rows}

                    </tbody>

                </table>
            </div>
        );

    }

}

class ProductRow extends React.Component {
    render() {
        let trstyle = "";
        if (this.props.dataStatus ===undefined){

        } else if (this.props.dataStatus === "changed") {
            trstyle = "table-warning"
        } else if (this.props.dataStatus === "error") {
            trstyle = "table-danger"
        }
        return (
            <tr className={"eachRow " + trstyle}>
                <td>{this.props.index}</td>
                <EditableCell onTableUpdate={this.props.onTableUpdate}
                              cellData={{
                                  index: this.props.index,
                                  id: this.props.topic.name,
                                  type: "name",
                                  value: this.props.topic.name
                              }}/>
                <EditableCell onTableUpdate={this.props.onTableUpdate}
                              cellData={{
                                  index: this.props.index,
                                  id: this.props.topic.name,
                                  type: "keywords",
                                  value: this.props.topic.keywords
                }}/>
                <EditableCell onTableUpdate={this.props.onTableUpdate}
                              cellData={{
                                  index: this.props.index,
                                  id: this.props.topic.name,
                                  type: "userids",
                                  value: this.props.topic.userids,
                }}/>
                <td className="submit-cell">
                    <input type="button"
                           onClick={this.props.onSubmit}
                           value="✓"
                           className="submit-btn btn-outline-primary"/>
                </td>
                <td className="del-cell">
                    <input type="button"
                           onClick={this.props.onRowDel}
                           value="✗"
                           className="del-btn btn-outline-danger"/>
                </td>
            </tr>
        );

    }

}

class EditableCell extends React.Component {
    render() {
        return (
            <td>
                <input type='text'
                       id={this.props.cellData.index} // topic.name, like Trump, James
                       name={this.props.cellData.type}  // Name, Keywords, UserIds
                       value={this.props.cellData.value} // value
                       onChange={this.props.onTableUpdate}
                       className='form-control'
                />
            </td>
        );

    }

}

export default TopicsEditor;
