const title = document.getElementById('Title');
const artist = document.getElementById('Artist');
const medium = document.getElementById('Medium');
const location = document.getElementById('Location');
const submit = document.getElementById('Submit');

const deleteButtons = document.getElementsByClassName('delete');


const submitHandler = () => {
    console.log('Attempting to submit...')
    let data = [{
        'title': title.value,
        'artist': artist.value,
        'medium': medium.value,
        'location': location.value
    }];
    fetch(`api/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => window.location.replace('/works'));
};

submit.addEventListener('click', submitHandler);


const deleteHandler = () => {
    console.log('ID: ', event.target.id);
    fetch(`/api/works/${event.target.id}`, {
        method: 'delete'
    }).then(() => window.location.replace('/works'));
};

for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', deleteHandler);
};

submit.addEventListener('click', deleteHandler);