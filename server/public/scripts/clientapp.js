$(document).ready(function () {
  getNotes();

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
        if (note.note_status == true) {

        $container = $('<div class="togglecomplete"></div>');
        $container.append("<p>" + note.note_title + '<br>' + '</br>' + '<button class="delete">Delete Note</button>'
        + "</p>" + "<p>" + note.note_text + "</p>");

      } else {
        $container = $('<div class="toggleincomplete"></div>');
        $container.append("<p>" + note.note_title + '<br>' + '</br>' + '<button class="delete">Delete Note</button>' +
        '<button class="complete">Archive Note</button>' + "</p>" + "<p>" + note.note_text + "</p>");
      }

        $('#todoList').append($container);
        console.log(note.id);
        $container.data('noteID', note.id);
        });

      }
    });
  }

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

function noteId(button) {
  var noteId = button.closest('#todoList').data('noteID');
  console.log('noteId', noteId);
  return noteId;
}

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
