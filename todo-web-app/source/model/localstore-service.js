import { TodoItem } from "../utils/todo-item.js"

// let { getTodoLocal, setTodoLocal, returnRequireObject} = localStore()

export function localStore() {
    return {
        getTodoLocal : function () {
            return JSON.parse(localStorage.getItem("todo") || '[]')
        },

        setTodoLocal : function (taskValue) {
            localStorage.setItem("todo", JSON.stringify(taskValue))
        },

        createTodoLocal : function (value) {
            const existingList = this.getTodoLocal()
            existingList.push(new TodoItem(value))
            this.setTodoLocal(existingList)
        },

        editTodoLocal : function (previousValue, newValue, isComplete = false) {
            const existingList = this.getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(previousValue,existingList)), 1, new TodoItem(newValue,isComplete))
            this.setTodoLocal(existingList)
        },

        deleteTodoLocal : function (value) {
            const existingList = this.getTodoLocal()
            existingList.splice(existingList.indexOf(returnRequireObject(value,existingList)), 1)
            setTodoLocal(existingList)
        },

        deleteAllLocal : function () {
            this.setTodoLocal([])
        },
        
        returnRequireObject : function(value,existingList){
            for(let elem of existingList){
                if(elem.name === value){
                    return elem
                }
            }
        }
    }
}