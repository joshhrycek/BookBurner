const TASTEKID_URL ="https://tastedive.com/api/similar"

function getDataFromGoogle(serachTerm, callback) {
    const q = `https://www.googleapis.com/books/v1/volumes?q=${serachTerm}`
    $.getJSON(q, callback)
}

function displayGoogleData(data) {
    $('main').html(renderBookPage(data))
    watchRecButton(data);
}

function watchRecButton(data){
    $('main').on('click','.rec-button', event =>{
        event.preventDefault();
        getTastekidData(data, displayTastekidData)
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
    $('main').on('click','.title-link', event =>{
        event.preventDefault()
        const title = $(event.currentTarget).text()
        getDataFromGoogle(title, displayGoogleData)    
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
        let query = $(".serach-box").val()
        const rule = /[^\w]/gi;
        const identifier = query.replace(rule,'');
        getDataFromGoogle(identifier, displayGoogleData)
    })
}

function renderBookPage(data) {
    const info = data.items[0];
    return `<section role="contentinfo" aria-live="assertive">
            <h2 class="book-title">${info.volumeInfo.title}</h2>
            <p class="author">Author: ${info.volumeInfo.authors}</p>
            <img class="thumbnail" src="${info.volumeInfo.imageLinks.thumbnail}" alt="Book Cover" >
            <p class="desc">${info.volumeInfo.description}</p>
            <button type="button" class="rec-button">Get Recommendations</button>
            </section>`
}

function renderRecsPage(data) {
    const rule = /[^\w]/gi;
    const identifier = data.Name.replace(rule,'');
    return `<section role="contentinfo" aria-live="assertive">
        <h3><a href="" class="title-link">${data.Name}</a>
        <span><i id="${identifier}" class="fas fa-arrow-alt-circle-down"></i></span>
        </h3>
        <p id="${identifier}-text" class="full-desc" aria-live="assertive">${data.wTeaser}</p>
        </section>`
}


function createApp() {
    getSearchTerm()
    
}

$(createApp)