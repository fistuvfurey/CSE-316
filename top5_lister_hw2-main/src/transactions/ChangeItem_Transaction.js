import jsTPS_Transaction from "../common/jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Aidan Furey
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(changeItemFunc, index, oldItem, newItem) {
        super();
        this.index = index;
        this.changeItemFunc = changeItemFunc
        this.oldItem = oldItem;
        this.newItem = newItem;
    }

    doTransaction() {
        this.changeItemFunc(this.index, this.newItem);
    }
    
    undoTransaction() {
        this.changeItemFunc(this.index, this.oldItem);
    }
}