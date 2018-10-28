import React from "react";

class Toy extends React.Component {
    handleChange() {
        console.log(this.refs.filterTextInput.value);
    }
    render() {
        return (
            <div>
                <input type="text"
                       placeholder="Search..."
                       value={this.props.filterText}
                       ref="filterTextInput"
                       onChange={this.handleChange.bind(this)}/>

            </div>

        );
    }

}


export default Toy;