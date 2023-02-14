import {appController} from "../controller/app-controller.js"

let {deleteSingleTask, editSelectedTask, varifyCheck} = appController()

const divToDisplay = document.querySelector(".div-to-display")
const taskInput = document.querySelector(".form-input")
const inputError = document.getElementById("error-div")

let {appendToParent, createCheckBox, getDeleteButton, createNewElement, getEditButton, adjustCheckValue} = view()

export function view(){
    return {
        createNewElement : function(elementName,text){
            let newElement = document.createElement(elementName)
            if(text){newElement.innerText = text}
            return newElement;
        },

        getDeleteButton : function(event, value){
            let deleteButton = createNewElement("button","X")
            deleteButton.addEventListener(event,()=>deleteSingleTask(deleteButton.parentNode,value))
            return deleteButton
        },

        getEditButton : function(event,span,value){
            let editButton = createNewElement("button","Edit")
            editButton.addEventListener(event,()=>editSelectedTask(editButton,span,value.id))
            return editButton
        },

        createCheckBox : function(event,value){
            let check = createNewElement("input")
            check.type = "checkbox"
            adjustCheckValue(check,value)
            check.addEventListener(event,()=>varifyCheck(check,value))
            return check
        },

        prepareTask : function(value){
            let paraBlock = createNewElement("p")
            let span = createNewElement("span",value.name)
            appendToParent(paraBlock,span)
            appendToParent(paraBlock,createCheckBox("change",value))
            appendToParent(paraBlock,getEditButton("click",span,value))
            appendToParent(paraBlock,getDeleteButton("click",value))
            appendToParent(divToDisplay,paraBlock)
            taskInput.value = ""
        },

        appendToParent : function(parent,child){
            parent.appendChild(child)
        },

        showEmptyInputError: function () {
            if (!taskInput.value) {
                inputError.innerHTML = "** please enter a task"
                return false
            } else {
                inputError.innerHTML = ""
                return true
            }
        },

        adjustCheckValue : function(check,value){
            value.isCompleted ? 
            (check.checked = true,console.log(check.parentNode.firstChild))
            : check.checked = false
        }

    }
}

// view().another()