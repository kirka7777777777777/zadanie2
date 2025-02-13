Vue.component('note-input', {
    template: `<div>
      <input v-model="newNoteTitle" placeholder="Note Title" />
      <div v-for="(item, index) in newNoteItems" :key="index">
        <input v-model="newNoteItems[index].text" placeholder="Item" />
        <input type="checkbox" v-model="newNoteItems[index].checked" />
      </div>
      <button @click="addNote">Add Note</button>
    </div>`,
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
    },
    template: `
    <div class="note-column">
      <h2>Column {{ column }}</h2>
      <div v-for="note in notes" :key="note.id">
        <h3>{{ note.title }}</h3>
        <div v-for="(item, index) in note.items" :key="index">
          <input type="checkbox" v-model="item.checked" @change="updateNote(note.id, index, item.checked)" />
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>`,
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
        };
    },
    methods: {
        addNote(newNote) {
            this.notes.push(newNote);
            this.saveNotes();
        },
        updateNote(noteId, itemId, checked) {
            const note = this.notes.find(n => n.id === noteId);
            if (note) {
                note.items[itemId].checked = checked;
                this.saveNotes();
            }
        },
        saveNotes() {
            localStorage.setItem('notes', JSON.stringify(this.notes));
        },
        getNotesForColumn(column) {
            return this.notes.filter(n => n.column === column);
        },
    },
});