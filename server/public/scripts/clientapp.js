
$(document).ready(function () {

  //Gets notes from database upon page load
  getNotes();

  //Button Event Listeners
  $('#submit').on('click', postNote);
  $('#todoList').on('click', '.delete', deleteNote);
  $('#todoList').on('click', '.complete', toggleComplete);
});

function getNotes() {
  $('#todoList').empty();
  $.ajax({
    type: 'GET',
    url: '/notes',
    success: function (notes) {
        console.log(notes);
        notes.forEach(function (note) {

        //note.note_status is initially set to false in the database
        //note.note_status = true would set the task to complete
        if (note.note_status == true) {

        //If task is complete, the class togglecomplete is applied
        $container = $('<div class="togglecomplete"></div>');
        $container.append("<p class='bold'>" + note.note_title + '<br>' + '</br>' + '<button class="delete">Delete Note</button>'
        + "</p>" + "<p>" + note.note_text + "</p>");

        //If task is not complete, the class toggleincomplete is applied
      } else {
        $container = $('<div class="toggleincomplete"></div>');
        $container.append("<p class='bold'>" + note.note_title + '<br>' + '</br>' + '<button class="delete">Delete Note</button>' +
        '<button class="complete">Archive Note</button>' + "</p>" + "<p>" + note.note_text + "</p>");
      }

        //Appends information to the DOM
        $('#todoList').append($container);

        //Attaches the note.id from the DB to each note container
        $container.data('noteID', note.id);
        });

      }
    });
  }

//Submits form to database for storage
function postNote(event) {
    event.preventDefault();
    var note = {};

    $.each($('#todoForm').serializeArray(), function (i, field) {
      note[field.name] = field.value;
    });
    console.log(note);
  $.ajax({
    type: 'POST',
    url: '/notes',
    data: note,
    success: function (data) {
      getNotes();
     }
    });
}

//Returns the note.id assigned to each note by the database
function noteId(button) {
  var noteId = button.closest('#todoList').data('noteID');
  return noteId;
}

//Delete functionality
function deleteNote(event) {
event.preventDefault;
  var noteId = $(this).parent().parent().data('noteID');
  $.ajax({
    type: 'DELETE',
    url: '/notes/' + noteId,
    success: function (data) {
      getNotes();
    },
  });
}

//Toggles CSS class for task complete, updates database with new status
function toggleComplete () {
  event.preventDefault();
  $(this).parent().parent().removeClass('toggleincomplete');
  $(this).parent().parent().addClass('togglecomplete');
  var noteID = $(this).parent().parent().data('noteID');
  var status = {'note_status': true,
                  'id': noteID};
  console.log(noteID);
  $.ajax({
    type: 'PUT',
    url: '/notes/' + noteID,
    data: status,
    success: function (data) {
      getNotes();
    }
  });

}
