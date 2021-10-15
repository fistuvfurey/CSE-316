import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that works changing an item. 
 * It will be managed by the transaction stack.
    
    @author Aidan Furey
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(initStore, initId, initOldItem, initNewItem) {
        super();
        this.store = initStore;
        this.id = initId;
        this.oldItem = initOldItem;
        this.newItem = initNewItem;
    }

    doTransaction() {
        this.store.changeItem(this.id, this.newItem);
    }
    
    undoTransaction() {
        this.store.changeItem(this.id, this.oldItem);
    }
}