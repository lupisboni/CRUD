import { saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask,
    saveImage } from './firebase.js';
    

const formTask = document.getElementById('task-form')
const tasksContainer = document.getElementById('task-container')

let editStatus = false;
let id = '';

const saveSubmit = (e) => {
   e.preventDefault();
   const title = formTask['task-title'].value;
   const description = formTask['task-description'].value;
   const imageUrl = '' || document.querySelector('#image').src;
   const imageName = formTask['file'].value.split('\\')[2];
   
   if(title.length > 3 && description.length > 3){
       if(!editStatus){
           saveTask(title, description, imageUrl);
       } else {
           updateTask(idForEdit, {
               'title': title, 'description': description
           });
           editStatus = false;
           document.querySelector('#btn-task-save').innerText = 'Save';
       }
       document.querySelector('#image').setAttribute('src', '');
       formTask.reset();
   } else{
       alert('Debes escribir algo');
   }
}

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
           `;
           if(task.imageUrl){
               tasksContainer.innerHTML +=`    
               <img src="${task.imageUrl}" width="200px">
               `
           }
               tasksContainer.innerHTML +=`
               <div>
                   <button class="btn btn-primary btn-delete" data-id="${doc.id}">Eliminar</button>
                   <button class="btn btn-secondary btn-edit" data-id="${doc.id}">Editar</button>
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
   formTask.addEventListener('submit', saveSubmit)
})