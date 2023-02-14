export function TodoItem(name,isCompleted = false,index){
    return {
        name : name ,
        isCompleted : isCompleted,
        id : index,
    }
}