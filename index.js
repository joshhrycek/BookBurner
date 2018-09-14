const TASTEKID_URL ="https://tastedive.com/api/similar"
let user_search = "";

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

function getBackupTastekidData(searchTerm,callback) {
    const settings = {
      url: TASTEKID_URL,
      data: {
        q:`book:${searchTerm}`,
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
    console.log(data.Similar.Info[0].Type)
    if (data.Similar.Info[0].Type === "book") {
        const firstResult = data.Similar.Results.slice(0,10)
        const secondResult = data.Similar.Results.slice(11,19)
        const trueResult = firstResult.map(i => renderRecsPage(i));
        $('main').html(trueResult);
        watchNameLink()
        watchDesButton()
    }else{
        getBackupTastekidData(user_search, displayBackupTastekidData)
    }
}

function displayBackupTastekidData(data){
    if (data.Similar.Info[0].Type === "book") {
        const firstResult = data.Similar.Results.slice(0,10)
        const secondResult = data.Similar.Results.slice(11,19)
        const trueResult = firstResult.map(i => renderRecsPage(i));
        $('main').html(trueResult);
        watchNameLink()
        watchDesButton()
    }else{
        $('main').html(renderRecsError())
    }
}

function watchNameLink() {
    $('main').one('click','#title-link', event =>{
        clearGlobalSearchVar()
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
        updateGlobalSearchVar(query)
        const rule = /[^\w]/gi;
        const identifier = query.replace(rule,'');
        if (identifier === '') {
            renderBookError()
        }else{
            getDataFromGoogle(identifier, displayGoogleData)
        }
    })
}

function getErrorSearchTerm() {
    $('main').on('submit','.form-error', event => {
        event.preventDefault();
        let query = $(".serach-box-error").val()
        updateGlobalSearchVar(query)
        const rule = /[^\w]/gi;
        const identifier = query.replace(rule,'');
        if (identifier === '') {
            renderBookError()
        }else{
            getBackupTastekidData(query, displayTastekidData)
        }
    })
}


function updateGlobalSearchVar(term) {
    user_search = term;
}

function clearGlobalSearchVar(){
    return user_search = "";
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

function renderRecsError(){
    getErrorSearchTerm()
    return `
            <form class="col-12 row form-error" role="search">
            <legend class="form-legend"><h2 id="rec-error">We are sorry, we couldn't find any reccomendations.</br>Try a manual search for your book</h2></legend>
            <label>Search Recommendations for:</label><br/>
            <input type="text" class="serach-box-error col-4" placeholder="I.e: Catcher in the Rye" role="searchbox" required><br/>
            <input type="submit" class="submit-button-error col-4">
            </form>`
}

function createApp() {
    getSearchTerm()
    
}

$(createApp)