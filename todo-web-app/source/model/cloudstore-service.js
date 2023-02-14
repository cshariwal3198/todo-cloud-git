import {TodoItem} from "../utils/todo-item.js"

const todoApiURL = "https://mk-todo-web-api.azurewebsites.net/api/ChethanTodoItems"
const deleteApiURL = "https://mk-todo-web-api.azurewebsites.net/ChethanTodoItems/deleteAll"

const optionHeader = {
    "Content-type": "application/json",
}

let {OptionObject, setTodoCloud} = cloudStore()

export function cloudStore(){
    return {
        OptionObject : function(method,body,header){
            
            return {
                method : method,
                body : JSON.stringify(body),
                headers: header,
            }
        },

        getTodoCloud: async function(){
            let result = await fetch(todoApiURL);
            return await result.json();
        },

        setTodoCloud : async function (apiURL, options) {
            try {
                return await fetch(apiURL, options)
            } catch (error) {
                console.log("error occured")
            }
        },

        postMethod : async function(value){
            let result = await setTodoCloud(todoApiURL,new OptionObject("POST",
                new TodoItem(value),optionHeader))
            return await result.json()
        },

        putMethod : function (index, editedValue, isComplete=false) {
            return setTodoCloud(`${todoApiURL}/${index}`,
                new OptionObject("PUT",new TodoItem(editedValue,isComplete,index),optionHeader))
        },
        
        deleteMethodCloud : async function (index) {
            return await setTodoCloud(`${todoApiURL}/${index}`, new OptionObject("DELETE"))
        },

        deleteAllCloud : async function () {
            return await setTodoCloud(deleteApiURL,new OptionObject("DELETE"))
        },
    }
}


