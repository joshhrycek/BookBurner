const TASTEKID_URL ="https://tastedive.com/api/similar"

function getDataFromGoogle(searchTerm, callback) {
    const key = "AIzaSyCb7dVIUPSuzucz9fvlj-Ou9TnfzlpmOz0"
    const q = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${key}`
    $.getJSON(q, callback)
}

function displayGoogleData(data) {
    if (data.totalItems === 0){
        renderBookError()
    }else{
        $('main').html(renderBookPage(data))
        watchRecButton(data);
    }
}

function watchRecButton(data){
    $('main').on('click','.rec-button', event =>{
        event.preventDefault();
        getTastekidData(data, displayTastekidData)
    })
}

function watchMoreLink(data){
    $('main').on('click','.morelink', event =>{
        event.preventDefault()
        const result = data.map(i => renderMoreList(i));
        $('main').html(result);
    })
}

function getTastekidData(data,callback) {
    const settings = {
      url: TASTEKID_URL,
      data: {
        q:`book:${data.items[0].volumeInfo.title}`,
        type: "books",
        info: "1",
        k:"319027-BookBurn-IT9TT9CC",
      },
    dataType:'jsonp',
    type: 'GET',
    success: callback
  };
    $.ajax(settings);
}

function displayTastekidData(data) {
    const firstResult = data.Similar.Results.slice(0,10)
    const secondResult = data.Similar.Results.slice(11,19)
    const trueResult = firstResult.map(i => renderRecsPage(i));
    $('main').html(trueResult);
    watchNameLink()
    watchDesButton()
}

function watchNameLink() {
    $('main').one('click','#title-link', event =>{
        event.preventDefault()
        const title = $(event.currentTarget).text()
        getDataFromGoogle(title, displayGoogleData)  
        $('main').off('click')  
    });
}

function watchDesButton(){
    $('main').on('click','.fas.fa-arrow-alt-circle-down', event =>{
        const identifier = $(event.currentTarget).attr('id')
        const descriptionEl = $(`p#${identifier}-text`);
        descriptionEl.toggle()
    })
}

function getSearchTerm() {
    $('form').on('submit', event => {
        event.preventDefault();
        $('#error').html('')
        let query = $(".serach-box").val()
        const rule = /[^\w]/gi;
        const identifier = query.replace(rule,'');
        if (identifier === '') {
            renderBookError()
        }else{
            getDataFromGoogle(identifier, displayGoogleData)
        }
    })
}

function renderBookError(){
    let para = document.createElement("p");
    let node = document.createTextNode("Cannot Find Book! Try Another!");
    para.appendChild(node);
    let element = document.getElementById("error");
    element.appendChild(para);
    $(".serach-box").val('')
}

function renderBookPage(data) {
    const info = data.items[0];
    const more = data.items.splice(1,10)
    watchMoreLink(more)
    return `<section role="contentinfo" aria-live="assertive">
            <h2 class="book-title">${info.volumeInfo.title}</h2>
            <p class="author">Author: ${info.volumeInfo.authors}</p>
            <img class="thumbnail" src="${info.volumeInfo.imageLinks.thumbnail}" alt="Book Cover" >
            <p class="desc">${info.volumeInfo.description}</p>
            <button type="button" class="rec-button">Get Recommendations</button>
            <p class="morelink">Not the book you are looking for? <a href="" alt="Book list">Click Here!</a></p>
            </section>`
}

function renderMoreList(data){
    const title = data.volumeInfo.title
    const author = data.volumeInfo.authors
    watchNameLink()
    return `<section role="contentinfo" aria-live="assertive">
                <h3>
                    <a href="" id="title-link" alt="Get more information on book">${title}</a>
                </h3>
                <p id="more-author">By: ${author}</p>
            </section>`
}

function renderRecsPage(data) {
    const rule = /[^\w]/gi;
    const identifier = data.Name.replace(rule,'');
    return `<section role="contentinfo" aria-live="assertive">
        <h3><a href="" id="title-link" alt="Get more information on book">${data.Name}</a>
        <span><i id="${identifier}" class="fas fa-arrow-alt-circle-down"></i></span>
        </h3>
        <p id="${identifier}-text" class="full-desc" aria-live="assertive">${data.wTeaser}</p>
        </section>`
}


function createApp() {
    getSearchTerm()
    
}

$(createApp)