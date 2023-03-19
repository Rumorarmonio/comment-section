let commentId = 1,
    state = false,
    like = 0;

const commentForm = document.querySelector('.form'),
    nameInput = commentForm.querySelector('.form__name'),
    textInput = commentForm.querySelector('.form__text'),
    dateInput = commentForm.querySelector('.form__date'),
    commentList = document.querySelector('.comment-list'),
    likeButton = document.querySelector('.like'),
    form = document.querySelector('.form'),
    svgHeartPath = `<path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>`,
    counter = '.counter',
    validation = new JustValidate('.form');

document.addEventListener('click', event => {
    if (event.target.classList.contains('form__send')) {
        validateForm(validation);
    }
    if (event.target.classList.contains('comment__delete')) {
        commentId = event.target.getAttribute('data-delete-id');
        document.querySelector(`[data-comment-id='${commentId}']`).remove();
    }
});

likeButton.addEventListener('click', addLike);

function validateForm(validation) {
    validation
        .addField('.form__name', [
            {
                rule: 'minLength',
                value: 3,
            },
            {
                rule: 'maxLength',
                value: 50,
            },
            {
                rule: 'required',
                value: true,
                errorMessage: 'Enter your name!'
            }
        ])
        .addField('.form__text', [
            {
                rule: 'required',
                value: true,
                errorMessage: 'Your comment cannot be empty!',
            },
        ])
        .onSuccess((event) => {
            console.log('Validation passes and the form is submitted!', event);
            createComment(nameInput.value, textInput.value, dateInput.value);
        });
}

function createComment(name, text, date) {
    name = name ? name : 'anonymous ¯\\_(ツ)_/¯';
    text = text ? text : 'nothing to say ¯\\_(ツ)_/¯';

    let localTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: "numeric",
        minute: "numeric"
    })
    if (date) {
        let dateArray = date.split('-');
        let dateDate = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
        let tempDate = new Date();
        let isToday = dateDate.setHours(0, 0, 0, 0) === tempDate.setHours(0, 0, 0, 0);
        tempDate.setDate(tempDate.getDate() - 1)
        let isYesterday = dateDate.setHours(0, 0, 0, 0) === tempDate.setHours(0, 0, 0, 0);
        if (isToday) {
            date = `сегодня, ${localTime}`;
        } else if (isYesterday) {
            date = `вчера, ${localTime}`;
        } else {
            date = `${date}, ${localTime}`;
        }
    } else {
        date = `сегодня, ${localTime}`;
    }

    const newComment = document.createElement('li');
    newComment.classList.add("comment");
    newComment.setAttribute('data-comment-id', commentId.toString());

    newComment.innerHTML = `
        <div class="comment__row">
            <h3 class="comment__name">${name}</h3>
            <time class="comment__date">${date}</time>
        </div>
            <p class="comment__text">${text}</p>
            <div class="comment__row">
                
                <a class="comment__like" data-like-id="${commentId}">
                    <div class="icon">
                        <svg class="prime" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            ${svgHeartPath}
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            ${svgHeartPath}
                        </svg>
                    </div>
                    <div class="counter">0</div>
                </a>
                <a>
                    <img class="comment__delete" data-delete-id="${commentId}" src="img/trash.svg" alt="trashcan" width="40">
                </a>
            </div>
        `;

    commentList.appendChild(newComment);
    commentId++;

    nameInput.value = textInput.value = dateInput.value = '';
}

// like button
function setState(state, element) {
    if (state) {
        element.classList.remove('dislike');
        element.classList.add('active');
    } else {
        element.classList.remove('active');
        element.classList.add('dislike');
    }
}

function addLike() {
    if (!state) {
        like++;
        state = true;
        writeCounter(like, counter);
        setState(state, likeButton);
    } else {
        like--;
        state = false;
        writeCounter(like, counter);
        setState(state, likeButton);
    }
}

function writeCounter(number, counter) {
    const element = likeButton.querySelector(counter);
    element.innerHTML = number;
}
