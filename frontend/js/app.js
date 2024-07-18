$(document).ready(function() {
    let currentColor = '#ffffff'; 
    let currentPage = 'notes';

    const token = localStorage.getItem('jwtToken');

    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    $.ajaxSetup({
        beforeSend: function(xhr) {
            if (token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + token);
            }
        }
    });

    fetchNotes();

    $('.color-option').click(function() {
        $('.color-option').removeClass('active');
        $(this).addClass('active');
        currentColor = $(this).data('color');
    });

    $('#add-note').click(function() {
        const title = $('#note-title').val().trim();
        const content = $('#note-content').val().trim();
        const tags = $('#note-tags').val().split(',').map(tag => tag.trim()).filter(tag => tag);
        const dueDate = $('#due-date').val();

        if (title && content) {
            createNote({
                title: title,
                content: content,
                tags: tags,
                backgroundColor: currentColor,
                reminder: dueDate ? new Date(dueDate).toISOString() : null,
                archived: false,
                trashed: false
            });
            console.log(tags);
        } else {
            showMessage('Please fill out both the title and content fields.');
        }
    });

    $('nav a').click(function() {
        $('nav a').removeClass('active');
        $(this).addClass('active');
        currentPage = $(this).data('page');
        $('.header h2').text($(this).text()); 
        fetchNotes();
    });

    function fetchNotes() {
        $.ajax({
            url: '/api/notes/noteslist',
            method: 'GET',
            success: function(notes) {
                let filteredNotes = [];

                switch (currentPage) {
                    case 'reminders':
                        filteredNotes = notes.filter(note => note.reminder).sort((a, b) => new Date(a.reminder) - new Date(b.reminder));
                        break;
                    case 'archive':
                        filteredNotes = notes.filter(note => note.archived);
                        break;
                    case 'trash':
                        filteredNotes = notes.filter(note => note.trashed);
                        break;
                    case 'labels':
                        filteredNotes = notes.filter(note => note.tags.length > 0);
                        break;
                    default:
                        filteredNotes = notes.filter(note => !note.archived && !note.trashed);
                        break;
                }

                displayNotes(filteredNotes);
            },
            error: function(err) {
                console.error('Failed to fetch notes', err);
                showMessage('Failed to fetch notes. Please try again later.');
            }
        });
    }

    function createNote(noteData) {
        $.ajax({
            url: '/api/notes/createnote',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(noteData),
            success: function(note) {
                // Clear input fields and reset color selection
                $('#note-title').val('');
                $('#note-content').val(''); 
                $('#note-tags').val(''); 
                $('#due-date').val(''); 
                $('.color-option').removeClass('active'); 
                $('.color-option[data-color="#ffffff"]').addClass('active'); 
                fetchNotes(); 
                showMessage('Note created successfully.');
            },
            error: function(err) {
                console.error('Failed to create note', err);
                showMessage('Failed to create note. Please try again later.');
            }
        });
    }

    function updateNote(id, updatedData) {
        $.ajax({
            url: `/api/notes/updatenote/${id}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedData),
            success: function(note) {
                fetchNotes(); 
                showMessage('Note updated successfully.');
            },
            error: function(err) {
                console.error('Failed to update note', err);
                showMessage('Failed to update note. Please try again later.');
            }
        });
    }

    function displayNotes(notes) {
        const notesList = $('#notes-list');
        notesList.empty();
        
        if (notes.length === 0) {
            let message = '';
            switch (currentPage) {
                case 'reminders':
                    message = 'No Reminders at Present';
                    break;
                case 'archive':
                    message = 'No Archived Notes';
                    break;
                case 'trash':
                    message = 'No Trashed Notes';
                    break;
                case 'labels':
                    message = 'No Tags Found';
                    break;
                default:
                    message = 'No Notes Available';
            }
            notesList.append(`<h3 class="no-notes-message">${message}</h3>`);
            return;
        }

        notes.forEach(note => {
            const noteElement = $(`
                <div class="note ${note.reminder ? 'reminder' : ''}" style="background-color: ${note.backgroundColor};">
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    ${note.reminder ? `<p class="due-date"><strong>Due:</strong> ${new Date(note.reminder).toLocaleDateString()}</p>` : ''}
                    ${note.tags.length > 0 ? `<p><strong>Tags:</strong> ${note.tags.join(', ')}</p>` : ''}
                    <div class="note-actions">
                        ${!note.archived && !note.trashed ? `<button class="archive-note"><i class="fas fa-archive"></i> Archive</button>` : ''}
                        ${note.trashed ? `<button class="restore-note"><i class="fas fa-undo"></i> Restore</button>` : ''}
                        ${note.archived ? `<button class="unarchive-note"><i class="fas fa-undo"></i> Unarchive</button>` : ''}
                        ${!note.trashed ? `<button class="trash-note"><i class="fas fa-trash"></i> Trash</button>` : ''}
                    </div>
                </div>
            `);

            noteElement.find('.archive-note').click(function() {
                updateNote(note._id, { archived: true });
            });

            noteElement.find('.unarchive-note').click(function() {
                updateNote(note._id, { archived: false });
            });

            noteElement.find('.trash-note').click(function() {
                updateNote(note._id, { trashed: true });
            });

            noteElement.find('.restore-note').click(function() {
                updateNote(note._id, { trashed: false });
            });

            notesList.append(noteElement);
        });
    }

    $('#search').keyup(function() {
        const query = $(this).val().toLowerCase();
        filterNotes(query);
    });

    function filterNotes(query) {
        $('.note').each(function() {
            const title = $(this).find('h3').text().toLowerCase();
            const content = $(this).find('p:first-of-type').text().toLowerCase();
            const tags = $(this).find('p:nth-of-type(2)').text().toLowerCase();
            if (title.includes(query) || content.includes(query) || tags.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    function init() {
        fetchNotes();
    }
    
    init(); 

    $('a[data-page="logout"]').click(function(e) {
        e.preventDefault();
        localStorage.removeItem('jwtToken');
        window.location.href = 'auth.html'; // Redirect to login page
    });

    $('#label-dropdown-toggle').click(function() {
        $('#label-dropdown').toggleClass('show');
    });

    $(document).click(function(e) {
        if (!$(e.target).closest('.dropdown').length) {
            $('#label-dropdown').removeClass('show');
        }
    });

    function fetchLabels() {
        $.ajax({
            url: '/api/labels/labelslist',
            method: 'GET',
            success: function(labels) {
                const dropdownContent = $('#label-dropdown');
                dropdownContent.empty();
                
                if (labels.length === 0) {
                    dropdownContent.append('<p>No labels found.</p>');
                    return;

                }

                labels.forEach(label => {
                    const labelElement = $(`
                        <div class="dropdown-item" data-label-id="${label._id}">${label.name}</div>
                    `);

                    labelElement.click(function() {
                        const selectedLabelId = $(this).data('label-id');
                        const selectedLabelName = label.name;

                        const tagsInput = $('#note-tags');
                        const currentTags = tagsInput.val();
                        const newTags = currentTags ? `${currentTags}, ${selectedLabelName}` : selectedLabelName;
                        tagsInput.val(newTags);

                    });

                    dropdownContent.append(labelElement);
                });

                showMessage('Labels fetched successfully.');
            },
            error: function(err) {
                console.error('Failed to fetch labels', err);
                showMessage('Failed to fetch labels. Please try again later.');
            }
        });
    }

    function showMessage(message) {
        alert(message); 
    }

    fetchLabels();
});
