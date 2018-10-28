import React from 'react';

const emptytopic = {
    'name': '',
    'keywords': '',
    'userids': ''
}
const data = [{
    'name': 'trump',
    'keywords': 'aa',
    'userids': '123,123'
}, {
    'name': 'james',
    'keywords': '#nba,lebrown',
    'userids': '123,123'
}]

class TopicsEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.filterText = "";
    }
    // handle all filtering events
    handleUserInput(filterText) {
        this.setState({filterText: filterText});
    };
    // handle all editing events
    handleRowDel(index) {
        // var index = this.props.data.indexOf(topic);
        this.props.data.splice(index, 1);
        this.setState(this.props.data);
        this.props.submitToServer("delete", this.props.data);
    };
    handleAddEvent(evt) {
        // var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var topic = Object.assign({}, emptytopic);
        // topic.name = id;
        this.props.data.push(topic);
        this.setState(this.props.data);

    };
    handleTableUpdate(evt) {
        var item = {
            id: evt.target.id, // index
            name: evt.target.name, // keywords
            value: evt.target.value
        };

        console.log("Update:" + evt.target.id);
        var data = this.props.data.slice();
        // var newData = data.map((topic, index) => { // O(n)
        //     if (topic.name == item.id) {
        //         topic[item.name] = item.value;
        //     }
        //     return topic;
        // });
        data[item.id][item.name] = item.value;
        this.setState({data:data});
        //  console.log(this.props.data);
    };
    // handle submitting events
    handleSubmit(index) {
        if (index === -1) {
            this.props.submitToServer("submit all", this.props.data);
        } else {
            this.props.submitToServer("submit", this.props.data[index]);
        }
    };
    //rendering
    render() {

        return (
            <div>
                <SearchBar filterText={this.state.filterText}
                           onUserInput={this.handleUserInput.bind(this)}/>
                <ProductTable onTableUpdate={this.handleTableUpdate.bind(this)}
                              onSubmit={this.handleSubmit.bind(this)}
                              onRowAdd={this.handleAddEvent.bind(this)}
                              onRowDel={this.handleRowDel.bind(this)}
                              data={this.props.data}
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
        var rows = this.props.data.map( (topic, index)=> {
            if (topic.name.indexOf(filterText) === -1) {
                return ;
            }
            return (
                <ProductRow key={index}
                            index={index}
                            topic={topic}
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
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Index</th>
                        <th>Name</th>
                        <th>Keywords</th>
                        <th>UserIds</th>
                        <th>Submit</th>
                        <th>Delete</th>
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
        return (
            <tr className="eachRow">
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
                           value="Submit"
                           className="submit-btn btn-outline-primary"/>
                </td>
                <td className="del-cell">
                    <input type="button"
                           onClick={this.props.onRowDel}
                           value="Delete"
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
