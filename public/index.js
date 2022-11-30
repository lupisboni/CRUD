import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask, saveImage } from './firebase.js'

const taskForm = document.getElementById('task-form')
const tasksContainer = document.getElementById('task-container')

let editStatus = false;
let id = '';

const uploadFileAction = (e) => {
    const file = e.target.files[0];

    if(file.type.includes('image')){
        console.log('si es una imagen')
        saveImage(file);
    }

    
}

window.addEventListener('DOMContentLoaded', async () => {

    onGetTasks((querySnapshot) => {
        tasksContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            const task = doc.data()
            tasksContainer.innerHTML += `
            <div class="card card-body mt-2 border-primary">
                <h3 class="h5">${task.title}</h3>
                <p>${task.description}</p>
                <div>
                    <button class="btn btn-primary btn-delete" data-id="${doc.id}">Delete</button>
                    <button class="btn btn-secondary btn-edit" data-id="${doc.id}">Edit</button>
                </div>
                </div>
            `;

        });



        const btnsDelete = tasksContainer.querySelectorAll('.btn-delete')
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({ target: { dataset } }) => {
                deleteTask(dataset.id)

            })
        })
        const btnsEdit = tasksContainer.querySelectorAll('.btn-edit')
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const doc = await getTask(e.target.dataset.id)
                const task = doc.data();

                taskForm['task-title'].value = task.title
                taskForm['task-description'].value = task.description

                editStatus = true
                id = doc.id;

                taskForm['btn-task-save'].innerText = 'Update'

            })
        })
    });

    //document.querySelector('#task-container').addEventListener('click', actionButtons);
    //taskForm.addEventListener('submit', saveSubmit);
    document.querySelector('#file').addEventListener('change', uploadFileAction);


})



taskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const title = taskForm['task-title'].value;
    const description = taskForm['task-description'].value;
    const imageUrl = document.querySelector('#image').scroll;
   

    if (title.length > 3 && description.length >3){

    if (!editStatus) {
        saveTask(title, description,imageUrl)
    } else {
        updateTask(idForEdit, {
            'title': title,
            description: description
        });

        editStatus = false;
        document.querySelector('#btn-task-save').innerText = 'Save';
    }
    taskForm.reset();
    }else{
        alert('debes escribir algo')
    }
     
})
