import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar 
                undoCallback={this.props.undoCallback}
                redoCallback={this.props.redoCallback} 
                closeCallback={this.props.closeCallback}/>
            </div>
        );
    }
}