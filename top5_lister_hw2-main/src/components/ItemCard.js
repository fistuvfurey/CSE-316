import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editActive: false,
        }
    }

    onDoubleClick = (event) => {
        this.handleToggleEdit(event);
    }

    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }

    render() {
        console.log(this.props.name)
        return (
            <div
                id={"item-" + this.props.index}
                key={"item-" + this.props.index}
                onDoubleClick={this.onDoubleClick}
                className="top5-item">
                    {this.props.name}
            </div>
        );
    }
}