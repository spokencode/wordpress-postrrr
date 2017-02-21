var list;

function getPosts() {
  $.ajax({
    url: 'https://spokencode.com/wp-json/wp/v2/posts',
    type: 'GET',
    success: function(result) {

      var posts = [];

      $.each(result, function() {
        var content = this.title.rendered;
        var id = this.id;
        posts.push("<li id='" + id + "'><button class='js-delete btn btn-danger'><i class='fa fa-trash' aria-hidden='true'></i></button><button class='js-edit btn btn-warning'><i class='fa fa-pencil' aria-hidden='true'></i></button><span>" + content + "</span></li>");
      });

      var listHTML = posts.join("");
      list.html(listHTML);
    }
  });
}

function deletePost(deleteButton) {
  list.on('click', deleteButton, function(e) {
    e.preventDefault();
    var id = $(deleteButton).closest('li').attr('id');
      ajaxCallToPosts('DELETE', {}, id);
  });
}

function editPost(editButton, updateButton) {
  list.on('click', editButton, function(e) {
    e.preventDefault();

    var textToEdit = $(this).closest('li').find('span').html();
    var editableText = $("<input value='" + textToEdit + "'></input>");
    var elementToEdit = $(this).closest('li').find('span');
    var saveButton = "<button class='js-save btn btn-success'><i class='fa fa-floppy-o' aria-hidden='true'></i></button>";

    $(elementToEdit).replaceWith(editableText);
    $(this).replaceWith(saveButton);
    
  });
  
  list.on('click', updateButton, function(e) {
      e.preventDefault();
    
      var id = $(this).closest('li').attr('id');

      ajaxCallToPosts('POST', {
        title: $(this).closest('li').find('input').val(),
        status: 'publish'
      }, id);

    });
}

function newPost(form, status) {

  form.submit(function(e) {
    e.preventDefault();
    
      ajaxCallToPosts('POST', {
        title: form.find(status).val(),
        status: 'publish'
      } );
    
    this.reset();
   
  });
}

function ajaxCallToPosts(method, data, id) {
  
  var url = 'https://spokencode.com/wp-json/wp/v2/posts';
  
  if (id) {
    url += '/' + id;
  }
  
  $.ajax({
    url: url,
    method: method,
    data: data,
    headers: {
      'Authorization': 'Basic dGhpbms6bCpmYk1mWTlMbVpOaExeS1IxYXc1OVVM'
    },
    'Content-Type': 'application/json; charset=UTF-8',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', 'Basic dGhpbms6bCpmYk1mWTlMbVpOaExeS1IxYXc1OVVM');
    },
    success: function(data, txtStatus, xhr) {
      getPosts();
    }
  });

}


$(function() {
  list = $('#js-posts');
  deletePost('.js-delete');
  editPost('.js-edit', '.js-save');
  getPosts();
  newPost($('#js-form'), $('#js-post'));
})