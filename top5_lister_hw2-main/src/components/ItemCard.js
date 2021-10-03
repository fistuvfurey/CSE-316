import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.name,
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

    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }

    handleUpdate = (event) => {
        this.setState({ text: event.target.value})
    }

    handleBlur = (event) => {
        let textValue = this.state.text;
        console.log("ItemCard handleBlur: " + textValue);
        this.props.renameItemCallback(this.props.id, textValue)
        this.handleToggleEdit();
    }

    onDragOver = (event) => {
        event.preventDefault();
    }

    onDragStart = (event, id) => {
        console.log("dragstart: ", id);
        event.dataTransfer.setData("text/html", id);
    }

    onDrop = (event, id) => {
        let oldIndex = event.dataTransfer.getData("text/html");
        console.log("onDrop: ", id);
        this.props.moveItemCallback(oldIndex, id);
    }


    render() {
        if (this.state.editActive) {
            return (
                <input
                    id={"item-" + this.props.index}
                    className="top5-item"
                    type="text"
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={this.props.item}
                />
            )
        }
        else {
            return (
                <div
                    id={"item-" + this.props.id}
                    draggable
                    className="draggable"
                    className="droppable"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDragStart={(e) => this.onDragStart(e, this.props.id)}
                    onDrop={(e)=>this.onDrop(e, this.props.id)}
                    onDoubleClick={this.onDoubleClick}
                    className="top5-item">
                        {this.props.name}
                </div>
            );
        }
    }
}