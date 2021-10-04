import React from "react";

export default class EditToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hasUndo: false,
            hasRedo: false,
            isListOpen: false
        }
    }

    render() {
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    onClick={this.props.undoCallback}
                    className="top5-button">
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    onClick={this.props.redoCallback}
                    className="top5-button">
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    onClick={this.props.closeCallback}
                    className="top5-button">
                        &#x24E7;
                </div>
            </div>
        )
    }
}