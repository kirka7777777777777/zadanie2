Vue.component('note-input', {
    template: `
    <div class="add-note-form">
        <input v-model="newNoteTitle" placeholder="Note Title" />
        <div v-for="(item, index) in newNoteItems" :key="index" id="div">
            <input v-model="newNoteItems[index].text" placeholder="Item" id="item" />
        </div>
        <button @click="addNote">Add Note</button>
    </div>
    `,
    data() {
        return {
            newNoteTitle: '',
            newNoteItems: Array(5).fill('').map(() => ({ text: '', checked: false })),
        };
    },
    methods: {
        addNote() {
            const newNote = {
                id: this.generateId(),
                title: this.newNoteTitle,
                items: this.newNoteItems.filter(item => item.text.trim() !== ''),
                column: 1,
                completedDate: null,
            };
            if (newNote.title && newNote.items.length >= 3 && newNote.items.length <= 5) {
                this.$emit('add-note', newNote);
                this.resetForm();
            } else {
                alert('Titles and 3-5 points are necessary');
            }
        },
        resetForm() {
            this.newNoteTitle = '';
            this.newNoteItems = Array(5).fill('').map(() => ({ text: '', checked: false }));
        },
        generateId() {
            return Math.random().toString(36).substring(2, 15);
        },
    }
});

Vue.component('note-column', {
    props: {
        column: Number,
        notes: Array,
        isBlocked: Boolean,
    },
    template: `
    <div class="note-column">
      <h2>Column {{ column }}</h2>
      <div v-for="note in notes" :key="note.id" class="note-card" >
        <h3>{{ note.title }}</h3>
        <div v-for="(item, index) in note.items" :key="index">
          <input type="checkbox" v-model="item.checked" @change="updateNote(note.id, index, item.checked)" />
          <span>{{ item.text }}</span>
        </div>
        <div v-if="note.completedDate">
          <small>Completed on: {{ note.completedDate }}</small>
        </div>
      </div>
    </div>
    `,
    emits: ['update-note'],
    methods: {
        updateNote(noteId, itemId, checked) {
            this.$emit('update-note', noteId, itemId, checked);
        },
    },
});

Vue.component('note-app', {
    template: `
        <div>
            <div class="note-columns">
                <note-column v-for="column in [1, 2, 3]" :key="column" :column="column" :notes="getNotesForColumn(column)" :is-blocked="isColumn1Blocked && column === 1" @update-note="updateNote"></note-column>
            </div>
             <note-input @add-note="addNote"></note-input>
        </div>
     `,
    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            isBlocked: false,
        };
    },
    computed: {
        column1Notes() {
            return this.notes.filter(note => note.column === 1);
        },
        column2Notes() {
            return this.notes.filter(note => note.column === 2);
        },
        hasOver50PercentCompleted() {
            return this.column1Notes.some(note => {
                const completedItems = note.items.filter(item => item.checked).length;
                return completedItems / note.items.length > 0.5;
            });
        },
        isColumn1Blocked() {
            // Блокируем первую колонку, если вторая колонка заполнена
            return this.column2Notes.length >= 5 && this.hasOver50PercentCompleted;
        },
    },
    methods: {
        addNote(newNote) {
            if (newNote.column === 1) {
                if (this.column1Notes.length < 3) {
                    this.notes.push(newNote);
                    this.saveNotes();
                } else {
                    alert('Column 1 can only hold a maximum of 3 notes.');
                }
            } else if (newNote.column === 2) {
                if (this.column2Notes.length < 5) {
                    this.notes.push(newNote);
                    this.saveNotes();
                } else {
                    alert('Column 2 can only hold a maximum of 5 notes.');
                }
            } else {
                this.notes.push(newNote);
                this.saveNotes();
            }

            this.updateBlockStatus();
        },
        updateNote(noteId, itemId, checked) {
            const noteIndex = this.notes.findIndex(n => n.id === noteId);
            if (noteIndex !== -1) {
                this.notes[noteIndex].items[itemId].checked = checked; // Прямое изменение для реактивности
                this.checkNoteCompletion(this.notes[noteIndex]);
            }
        },
        checkNoteCompletion(note) {
            const totalItems = note.items.length;
            const completedItems = note.items.filter(item => item.checked).length;
            const completionRate = completedItems / totalItems;

            const noteIndex = this.notes.findIndex(n => n.id === note.id);
            if (noteIndex === -1) return; // Защита от несуществующей заметки

            if (note.column === 1 && completionRate > 0.5) {
                if (this.column2Notes.length < 5) {
                    this.notes[noteIndex].column = 2; // Перемещение в колонку 2
                } else {
                    alert('Column 2 is full!');
                    this.$nextTick(() => { // nextTick для корректного сброса checked
                        this.notes[noteIndex].items.forEach(item => item.checked = false);
                    });
                }
            } else if (note.column === 2 && completionRate === 1) {
                this.notes[noteIndex].column = 3; // Перемещение в колонку 3
                this.notes[noteIndex].completedDate = new Date().toLocaleString();
            }

            this.saveNotes();
            this.updateBlockStatus();
        },
        updateBlockStatus() {
            this.isBlocked = this.hasOver50PercentCompleted && this.column2Notes.length >= 5;
        },
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        getNotesForColumn(column) {
            return this.notes.filter(n => n.column === column);
        },
    },
    watch: {
        notes: {
            handler() {
                this.updateBlockStatus();
            },
            deep: true,
        },
    },
    mounted() {
        this.updateBlockStatus();
    },
})

let app = new Vue({
    el: '#app',
    template: '<note-app></note-app>'
});