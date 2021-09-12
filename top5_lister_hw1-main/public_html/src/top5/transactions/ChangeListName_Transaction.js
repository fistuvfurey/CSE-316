import jsTPS_Transaction from "../../common/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author Aidan Furey 
 */
export default class ChangeListName_Transaction extends jsTPS_Transaction {
    constructor(initModel, initId, initOldText, initNewText) {
        super();
        this.model = initModel;
        this.id = initId;
        this.oldText = initOldText;
        this.newText = initNewText;
    }

    doTransaction() {
        this.model.changeListName(this.newText);
    }

    undoTransaction() {
        this.model.changeListName(this.oldText);
    }
}
