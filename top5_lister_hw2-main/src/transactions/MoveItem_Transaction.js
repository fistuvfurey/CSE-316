import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Aidan Furey
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(moveItemFunc, oldItemIndex, newItemIndex) {
        super();
        this.moveItem = moveItemFunc;
        this.oldItemIndex = oldItemIndex;
        this.newItemIndex = newItemIndex;
    }

    doTransaction() {
        this.moveItem(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        this.moveItem(this.newItemIndex, this.oldItemIndex);
    }
}