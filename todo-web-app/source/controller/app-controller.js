import { view } from "../view/view-todo.js";
import { cloudStore } from "../model/cloudstore-service.js"
import { localStore } from "../model/localstore-service.js";
import { TodoItem } from "../utils/todo-item.js"

const taskInput = document.querySelector(".form-input")
const divToDisplay = document.querySelector(".div-to-display")
const store = document.querySelector(".storage")
let previousSpanValue = ""

let lsGet;
localStorage.setItem("storage", localStorage.getItem("storage") || "CloudStorage")

const { postMethod, deleteMethodCloud, getTodoCloud, putMethod, deleteAllCloud } = cloudStore()
const { getTodoLocal, createTodoLocal, editTodoLocal, deleteTodoLocal, deleteAllLocal } = localStore()
const { clearAllTasks, handlePageRefresh, setTaskToList, switchBetweenStorage, } = appController()
const { showEmptyInputError, prepareTask } = view()
console.log(this)
handlePageRefresh()

export function appController() {
    return {
        setTaskToList: async function (event) {
            event.preventDefault()
            let inputValue = taskInput.value;
            if (showEmptyInputError() && lsGet === "CloudStorage") {
                let postResult = await postMethod(inputValue)
                postResult && prepareTask(postResult)

            } else if (showEmptyInputError() && lsGet === "LocalStorage") {
                createTodoLocal(inputValue)
                prepareTask(new TodoItem(inputValue))
            }
        },

        handlePageRefresh: function () {
            lsGet = localStorage.getItem("storage");
            console.log(this);
            let tasks = lsGet === "CloudStorage" ? getTodoCloud() : getTodoLocal()
                (tasks || [])?.map((task) => {
                    prepareTask(task)
                })
            store.innerText = lsGet
        },

        switchBetweenStorage: function () {
            if (confirm(`You are switching your default Storage. Press Ok to proceed`)) {
                localStorage.getItem("storage") === "CloudStorage" ? localStorage.setItem("storage", "LocalStorage")
                    : localStorage.setItem("storage", "CloudStorage");
                divToDisplay.innerHTML = ""
                handlePageRefresh()
                store.innerText = lsGet
            }
        },

        clearAllTasks: async function () {
            let result = confirm("Your all tasks will be erased, Continue?")
            if (result) {
                if (localStorage.getItem("storage") === "CloudStorage") {
                    let deleteResponse = await deleteAllCloud()
                    deleteResponse.status === 200 && (divToDisplay.innerHTML = "")
                } else {
                    deleteAllLocal()
                    divToDisplay.innerHTML = ""
                }
            }
        },

        deleteSingleTask: async function (parentElement, value) {
            if (localStorage.getItem("storage") === "CloudStorage") {
                let result = await deleteMethodCloud(value.id)
                if (result.status === 204) {
                    divToDisplay.removeChild(parentElement)
                }
            } else { deleteTodoLocal(value.name), divToDisplay.removeChild(parentElement) }

        },

        editSelectedTask: function (editButton, span, index) {
            if (editButton.innerText === "Edit") {
                previousSpanValue = span.innerText
                span.contentEditable = true
                span.focus()
                editButton.innerText = "Save"
            } else {
                editButton.innerText = "Edit"
                span.contentEditable = false
                localStorage.getItem("storage") === "CloudStorage" ? putMethod(index, span.innerText)
                    : editTodoLocal(previousSpanValue, span.innerText)
            }
        },

        varifyCheck: async function (check, value) {
            if (check.checked === true) {
                lsGet === "CloudStorage" ? putMethod(value.id, value.name, true) : editTodoLocal(value.name, value.name, true)
                check.parentElement.style.textDecoration = "line-through"
            } else {
                lsGet === "CloudStorage" ? putMethod(value.id, value.name, false) : editTodoLocal(value.name, value.name, false)
                check.parentElement.style.textDecoration = "none"
            }
        }
    }
}

document.querySelector("form").addEventListener("submit", setTaskToList)
store.addEventListener("click", switchBetweenStorage)
document.querySelector(".all-clear").addEventListener("click", clearAllTasks)