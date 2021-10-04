import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    onClick={this.props.undoCallback}
                    className={this.props.tps.hasTransactionToUndo() && this.props.currentList ? "top5-button" : "top5-button-disabled"}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    onClick={this.props.redoCallback}
                    className={this.props.tps.hasTransactionToRedo() && this.props.currentList ? "top5-button" : "top5-button-disabled"}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    onClick={this.props.closeCallback}
                    className={this.props.currentList ? "top5-button" : "top5-button-disabled"}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}