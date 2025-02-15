// Vue.component('kanban-column', {
//     template: `
//     <div class="task-column">
//       <h2>{{ title }}</h2>
//       <div class="task-list">
//         <task-card
//           v-for="task in tasks"
//           :key="task.id"
//           :task="task"
//           @edit-task="emitEditTask(task.id, $event)"
//           @delete-task="emitDeleteTask(task.id)"
//           @move-task="emitMoveTask(task.id, nextStatus)"
//           @return-task="emitReturnTask(task.id, $event)"
//           :can-edit="canEdit"
//           :can-delete="canDelete"
//           :next-status="nextStatus"
//           :can-return="canReturn"
//         />
//       </div>
//       <button v-if="canAdd" @click="showAddTaskForm = true">Add Task</button>
//       <task-form
//         v-if="showAddTaskForm"
//         @add-task="emitAddTask($event); showAddTaskForm = false"
//       />
//     </div>
//     `,
//     data() {
//         return {
//             showAddTaskForm: false
//         };
//     },
//     props: {
//         title: {
//             type: String,
//             required: true
//         },
//         tasks: {
//             type: Array,
//             required: true
//         },
//         canAdd: {
//             type: Boolean,
//             default: false
//         },
//         canEdit: {
//             type: Boolean,
//             default: false
//         },
//         canDelete: {
//             type: Boolean,
//             default: false
//         },
//         canReturn: {
//             type: Boolean,
//             default: false
//         },
//     },
//     computed: {
//         nextStatus() {
//             switch (this.title) {
//                 case 'Запланированные задачи':
//                     return 'inProgress';
//                 case 'Задачи в работе':
//                     return 'testing';
//                 case 'Тестирование':
//                     return 'completed';
//                 default:
//                     return null;
//             }
//         },
//     },
//     emits: ['edit-task', 'delete-task', 'move-task', 'return-task', 'add-task'],
//     methods: {
//         emitEditTask(taskId, event) {
//             this.$emit('edit-task', taskId, event);
//         },
//         emitDeleteTask(taskId) {
//             this.$emit('delete-task', taskId);
//         },
//         emitMoveTask(taskId, nextStatus) {
//             this.$emit('move-task', taskId, nextStatus);
//         },
//         emitReturnTask(taskId, event) {
//             this.$emit('return-task', taskId, event);
//         },
//         emitAddTask(event) {
//             this.$emit('add-task', event);
//         }
//     }
// });
//
// Vue.component('return-form', {
//     template: `
//     <div>
//       <form @submit.prevent="returnTask">
//         <textarea v-model="returnReason" placeholder="Reason for returning" required></textarea>
//         <button type="submit">Return</button>
//       </form>
//     </div>
//     `,
//     data() {
//         return {
//             returnReason: '',
//         };
//     },
//     methods: {
//         returnTask() {
//             this.$emit('return-task', this.returnReason);
//             this.resetForm();
//         },
//         resetForm() {
//             this.returnReason = '';
//         },
//     }
// });
//
// Vue.component('task-card', {
//     template: `
//     <div class="task-card">
//       <h3>{{ task.title }}</h3>
//       <p>{{ task.description }}</p>
//       <p>Created: {{ task.createdDate }}</p>
//       <p v-if="task.lastEditedDate">Last Edited: {{ task.lastEditedDate }}</p>
//       <p>Deadline: {{ task.deadline }}</p>
//       <p v-if="task.completedDate">Completed: {{ task.completedDate }}</p>
//       <p v-if="task.isOverdue" class="overdue">Expired</p>
//       <p v-else-if="task.status === 'completed'">Completed in time</p>
//       <p v-if="task.returnReason">Return Reason: {{ task.returnReason }}</p>
//
//       <button v-if="canEdit" @click="showEditForm = true">Edit</button>
//       <button v-if="canDelete" @click="$emit('delete-task')">Delete</button>
//       <button v-if="canReturn" @click="showReturnForm = true">Return</button>
//       <button v-if="nextStatus" @click="moveTask" id="move">
//           Move to {{ nextStatus }}
//       </button>
//
//       <task-form
//         v-if="showEditForm"
//         :task="task"
//         @add-task="$emit('edit-task', $event); showEditForm = false"
//       />
//       <return-form
//         v-if="showReturnForm"
//         @return-task="returnTask"
//       />
//     </div>
//     `,
//     props: {
//         task: {
//             type: Object,
//             required: true
//         },
//         canEdit: {
//             type: Boolean,
//             default: false
//         },
//         canDelete: {
//             type: Boolean,
//             default: false
//         },
//         nextStatus: {
//             type: String,
//             default: null
//         },
//         canReturn: {
//             type: Boolean,
//             default: false
//         },
//     },
//     data() {
//         return {
//             showEditForm: false,
//             showReturnForm: false,
//         };
//     },
//     methods: {
//         moveTask() {
//             this.$emit('move-task', this.task.id, this.nextStatus);
//         },
//         returnTask(returnReason) {
//             this.$emit('return-task', this.task.id, returnReason);
//             this.showReturnForm = false; // Скрыть форму после возврата
//         }
//     }
// });
//
// Vue.component('task-form', {
//     template: `
//     <div>
//       <form @submit.prevent="addTask">
//         <input type="text" v-model="taskData.title" placeholder="Title" required>
//         <textarea v-model="taskData.description" placeholder="Description" required></textarea>
//         <input type="date" v-model="taskData.deadline" required>
//         <button type="submit">Save</button>
//       </form>
//     </div>
//     `,
//     props: {
//         task: {
//             type: Object,
//             default: null
//         },
//     },
//     data() {
//         return {
//             taskData: this.task ? { ...this.task } : { title: '', description: '', deadline: '' }
//         };
//     },
//     methods: {
//         addTask() {
//             this.$emit('add-task', this.taskData);
//             this.resetForm();
//         },
//         resetForm() {
//             this.taskData = { title: '', description: '', deadline: '' };
//         },
//     }
// });
//
// Vue.component('app', {
//     template: `
//     <div class="kanban-board">
//       <kanban-column
//         title="Запланированные задачи"
//         :tasks="plannedTasks"
//         @add-task="addTask"
//         @move-task="moveTask"
//         @edit-task="editTask"
//         @delete-task="deleteTask"
//         can-add
//         can-edit
//         can-delete
//       />
//       <kanban-column
//         title="Задачи в работе"
//         :tasks="inProgressTasks"
//         @move-task="moveTask"
//         @edit-task="editTask"
//         can-edit
//       />
//       <kanban-column
//         title="Тестирование"
//         :tasks="testingTasks"
//         @move-task="moveTask"
//         @edit-task="editTask"
//         @return-task="returnTask"
//         can-edit
//         can-return
//       />
//       <kanban-column
//         title="Выполненные задачи"
//         :tasks="completedTasks"
//       />
//     </div>
//     `,
//     data() {
//         return {
//             tasks: JSON.parse(localStorage.getItem('tasks')) || [],
//             nextTaskId: 1,
//         };
//     },
//     computed: {
//         plannedTasks() { return this.tasks.filter(task => task.status === 'planned'); },
//         inProgressTasks() { return this.tasks.filter(task => task.status === 'inProgress'); },
//         testingTasks() { return this.tasks.filter(task => task.status === 'testing'); },
//         completedTasks() { return this.tasks.filter(task => task.status === 'completed'); },
//     },
//     methods: {
//         addTask(taskData) {
//             const newTask = {
//                 ...taskData,
//                 id: this.nextTaskId++,
//                 createdDate: new Date().toLocaleString(),
//                 lastEditedDate: null,
//                 status: 'planned'
//             };
//             this.tasks.push(newTask);
//             this.saveTasks();
//         },
//         editTask(taskId, updatedTaskData) {
//             const task = this.tasks.find(task => task.id === taskId);
//             if (task) {
//                 Object.assign(task, updatedTaskData);
//                 task.lastEditedDate = new Date().toLocaleString();
//                 this.saveTasks();
//             }
//         },
//         deleteTask(taskId) {
//             this.tasks = this.tasks.filter(task => task.id !== taskId);
//             this.saveTasks();
//         },
//         moveTask(taskId, newStatus, returnReason = null) {
//             const task = this.tasks.find(task => task.id === taskId);
//             if (task) {
//                 task.status = newStatus;
//                 if (newStatus === 'completed') {
//                     task.completedDate = new Date().toLocaleString();
//                     task.isOverdue = new Date(task.deadline) < new Date();
//                 } else if (newStatus === 'inProgress' && returnReason) {
//                     task.returnReason = returnReason;
//                 } else {
//                     task.returnReason = null;
//                 }
//                 this.saveTasks();
//             } else {
//                 console.warn(`Task with ID: ${taskId} not found.`);
//             }
//         },
//         returnTask(taskId, returnReason) {
//             this.moveTask(taskId, 'inProgress', returnReason);
//         },
//         saveTasks() {
//             localStorage.setItem('tasks', JSON.stringify(this.tasks));
//         },
//     },
//     mounted() {
//         const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
//         this.tasks = savedTasks.map(task => ({
//             ...task,
//             status: task.status || 'planned'
//         }));
//
//         const savedNextTaskId = localStorage.getItem('nextTaskId');
//         if (savedNextTaskId) {
//             this.nextTaskId = parseInt(savedNextTaskId, 10);
//         }
//     },
//     beforeUnmount() {
//         localStorage.setItem('nextTaskId', this.nextTaskId);
//     }
// });
//
// let app = new Vue({
//     el: '#app',
//     template: '<app></app>'
// });


Vue.component('app', {
    template: `
    <div class="kanban-board">
      <kanban-column 
        title="Запланированные задачи" 
        :tasks="plannedTasks" 
        @add-task="addTask" 
        @move-task="moveTask" 
        @edit-task="editTask" 
        @delete-task="deleteTask" 
        can-add 
        can-edit 
        can-delete 
      />
      <kanban-column 
        title="Задачи в работе" 
        :tasks="inProgressTasks" 
        @move-task="moveTask" 
        @edit-task="editTask" 
        can-edit 
      />
      <kanban-column 
        title="Тестирование" 
        :tasks="testingTasks" 
        @move-task="moveTask" 
        @edit-task="editTask" 
        @return-task="returnTask" 
        can-edit 
        can-return 
      />
      <kanban-column 
        title="Выполненные задачи" 
        :tasks="completedTasks" 
      />
    </div>
    `,
    data() {
        return {
            tasks: JSON.parse(localStorage.getItem('tasks')) || [],
            nextTaskId: 1,
        };
    },
    computed: {
        plannedTasks() { return this.tasks.filter(task => task.status === 'planned'); },
        inProgressTasks() { return this.tasks.filter(task => task.status === 'inProgress'); },
        testingTasks() { return this.tasks.filter(task => task.status === 'testing'); },
        completedTasks() { return this.tasks.filter(task => task.status === 'completed'); },
    },
    methods: {
        addTask(taskData) {
            const newTask = {
                ...taskData,
                id: this.nextTaskId++,
                createdDate: new Date().toLocaleString(),
                lastEditedDate: null,
                status: 'planned',
                isOverdue: this.isTaskOverdue(taskData.deadline)
            };
            this.tasks.push(newTask);
            this.saveTasks();
        },
        isTaskOverdue(deadline) {
            const now = new Date();
            return new Date(deadline) < now;
        },
        editTask(taskId, updatedTaskData) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                Object.assign(task, updatedTaskData);
                task.lastEditedDate = new Date().toLocaleString();
                task.isOverdue = this.isTaskOverdue(updatedTaskData.deadline);
            }
        },

        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
        },
        moveTask(taskId, newStatus) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.status = newStatus;
                task.isOverdue = this.isTaskOverdue(task.deadline);
                this.saveTasks();
            }
        },
        returnTask(taskId, returnReason) {
            this.moveTask(taskId, 'inProgress', returnReason);
        },
        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        },
    },
    mounted() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.tasks = savedTasks.map(task => ({
            ...task,
            status: task.status || 'planned'
        }));

        const savedNextTaskId = localStorage.getItem('nextTaskId');
        if (savedNextTaskId) {
            this.nextTaskId = parseInt(savedNextTaskId, 10);
        }
    },
    beforeUnmount() {
        localStorage.setItem('nextTaskId', this.nextTaskId);
    }
});




Vue.component('kanban-column', {
    template: `
    <div class="task-column">
      <h2>{{ title }}</h2>
      <div class="task-list">
        <task-card 
          v-for="task in tasks" 
          :key="task.id" 
          :task="task"
          @edit-task="emitEditTask(task.id, $event)"
          @delete-task="emitDeleteTask(task.id)"
          @move-task="emitMoveTask(task.id, nextStatus)"
          @return-task="emitReturnTask(task.id, $event)"
          :can-edit="canEdit" 
          :can-delete="canDelete"
          :next-status="nextStatus" 
          :can-return="canReturn"
        />
      </div>
      <button v-if="canAdd" @click="showAddTaskForm = true">Add Task</button>
      <task-form 
        v-if="showAddTaskForm" 
        @add-task="emitAddTask($event); showAddTaskForm = false" 
      />
    </div>
    `,
    data() {
        return {
            showAddTaskForm: false
        };
    },
    props: {
        title: {
            type: String,
            required: true
        },
        tasks: {
            type: Array,
            required: true
        },
        canAdd: {
            type: Boolean,
            default: false
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        canDelete: {
            type: Boolean,
            default: false
        },
        canReturn: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        nextStatus() {
            switch (this.title) {
                case 'Запланированные задачи':
                    return 'inProgress';
                case 'Задачи в работе':
                    return 'testing';
                case 'Тестирование':
                    return 'completed';
                default:
                    return null;
            }
        },
    },
    emits: ['edit-task', 'delete-task', 'move-task', 'return-task', 'add-task'],
    methods: {
        emitEditTask(taskId, event) {
            this.$emit('edit-task', taskId, event);
        },
        emitDeleteTask(taskId) {
            this.$emit('delete-task', taskId);
        },
        emitMoveTask(taskId, nextStatus) {
            this.$emit('move-task', taskId, nextStatus);
        },
        emitReturnTask(taskId, event) {
            this.$emit('return-task', taskId, event);
        },
        emitAddTask(event) {
            this.$emit('add-task', event);
        }
    }
});

Vue.component('task-card', {
    template: `
    <div :class="['task-card', task.status, { overdue: task.isOverdue }]">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <p>Created: {{ task.createdDate }}</p>
      <p v-if="task.lastEditedDate">Last Edited: {{ task.lastEditedDate }}</p>
      <p>Deadline: {{ task.deadline }}</p>
      <p v-if="task.completedDate">Completed: {{ task.completedDate }}</p>
      <p v-if="task.returnReason">Return Reason: {{ task.returnReason }}</p>
      
      <button v-if="canEdit" @click="showEditForm = true">Edit</button>
      <button v-if="canDelete" @click="$emit('delete-task')">Delete</button>
      <button v-if="canReturn" @click="showReturnForm = true">Return</button>
      <button v-if="nextStatus" @click="moveTask" id="move">
          Move to {{ nextStatus }}
      </button>

      <task-form 
        v-if="showEditForm" 
        :task="task" 
        @add-task="$emit('edit-task', $event); showEditForm = false" 
      />
      <return-form 
        v-if="showReturnForm" 
        @return-task="$emit('return-task', $event); showReturnForm = false" 
      />
    </div>
    `,
    props: {
        task: {
            type: Object,
            required: true
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        canDelete: {
            type: Boolean,
            default: false
        },
        nextStatus: {
            type: String,
            default: null
        },
        canReturn: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            showEditForm: false,
            showReturnForm: false,
        };
    },
    methods: {
        moveTask() {
            this.$emit('move-task', this.task.id, this.nextStatus);
        }
    }
});


Vue.component('task-form', {
    template: `
    <div>
      <form @submit.prevent="addTask">
        <input type="text" v-model="taskData.title" placeholder="Title" required>
        <textarea v-model="taskData.description" placeholder="Description" required></textarea>
        <input type="date" v-model="taskData.deadline" required>
        <button type="submit">Save</button>
      </form>
    </div>
    `,
    props: {
        task: {
            type: Object,
            default: null
        },
    },
    data() {
        return {
            taskData: this.task ? { ...this.task } : { title: '', description: '', deadline: '' }
        };
    },
    methods: {
        addTask() {
            this.$emit('add-task', this.taskData);
            this.resetForm();
        },
        resetForm() {
            this.taskData = { title: '', description: '', deadline: '' };
        },
    }
});

Vue.component('return-form', {
    template: `
    <div>
      <form @submit.prevent="returnTask">
        <textarea v-model="returnReason" placeholder="Reason for returning" required></textarea>
        <button type="submit">Return</button>
      </form>
    </div>
    `,
    data() {
        return {
            returnReason: '',
        };
    },
    methods: {
        returnTask() {
            this.$emit('return-task', this.returnReason);
            this.resetForm();
        },
        resetForm() {
            this.returnReason = '';
        },
    }
});

let app = new Vue({
    el: '#app',
    template: '<app></app>'
});
