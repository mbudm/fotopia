
$(() => {
  $('#upload-accepted-images').on('click', () => {
    $.post('/upload', (data) => {
      $('#upload-accepted-images').after(`
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>${data}
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`);
    });
  });
});
