Vue.component('note-input', {
    template: `
    <div>
      <input v-model="newNoteTitle" placeholder="Note Title" class="add-note-form"/>
      <div v-for="(item, index) in newNoteItems" :key="index">
        <input v-model="newNoteItems[index].text" placeholder="Item" />
        <input id="check" type="checkbox" v-model="newNoteItems[index].checked" />
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
      <div v-for="note in notes" :key="note.id">
        <h3>{{ note.title }}</h3>
        <div v-for="(item, index) in note.items" :key="index">
          <input type="checkbox" v-model="item.checked" @change="updateNote(note.id, index, item.checked)" :disabled="isBlocked" />
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

let app = new Vue({
    el: '#app',
    data() {
        return {
            notes: JSON.parse(localStorage.getItem('notes')) || [],
            isBlocked: false,
        };
    },
    methods: {
        addNote(newNote) {
            if (newNote.column === 1) {
                if (this.notes.filter(n => n.column === 1).length < 3) {
                    this.notes.push(newNote);
                    this.saveNotes();
                } else {
                    alert('Column 1 can only hold a maximum of 3 notes.');
                }
            } else if (newNote.column === 2) {
                if (this.notes.filter(n => n.column === 2).length < 5) {
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
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.items[itemId].checked = checked;
                this.checkNoteCompletion(note);
                this.updateBlockStatus();
                this.saveNotes();
            }
        },
        checkNoteCompletion(note) {
            const totalItems = note.items.length;
            const completedItems = note.items.filter(item => item.checked).length;
            const completionRate = completedItems / totalItems;

            if (note.column === 1 && completionRate > 0.5) {
                if(this.notes.filter(n => n.column === 2).length < 5){
                    note.column = 2;
                } else {
                    alert('Column 2 is full!')
                }
            } else if (note.column === 2 && completionRate === 1) {
                note.column = 3;
                note.completedDate = new Date().toLocaleString();
            }
            this.updateBlockStatus();
        },
        updateBlockStatus() {
            const column1Notes = this.notes.filter(n => n.column === 1);
            const column2Notes = this.notes.filter(n => n.column === 2);

            const hasOver50PercentCompleted = column1Notes.some(note => {
                const completedItems = note.items.filter(item => item.checked).length;
                return completedItems / note.items.length > 0.5;
            });

            this.isBlocked = hasOver50PercentCompleted && column2Notes.length >= 5;
        },
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        getNotesForColumn(column) {
            return this.notes.filter(n => n.column === column);
        },
    },
    mounted() {
        this.updateBlockStatus();
    },
});