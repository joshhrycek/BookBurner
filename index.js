const TASTEKID_URL ="https://tastedive.com/api/similar"

function getDataFromGoogle(serachTerm, callback) {
    const q = `https://www.googleapis.com/books/v1/volumes?q=`+`${serachTerm}`
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
    const query = {
        q:`book:${data.items[0].volumeInfo.title}`,
        type: "books"+"authors",
        k:"319027-BookBurn-IT9TT9CC",
    }
    $.getJSON(TASTEKID_URL, query, callback)
}

function displayTastekidData() {

}

function getSearchTerm() {
    $('form').on('submit', event => {
        event.preventDefault();
        let query = $(".serach-box").val()
        getDataFromGoogle(query, displayGoogleData)
    })
}

function renderBookPage(data) {
    const info = data.items[0];
    return `<h2>${info.volumeInfo.title}</h2>
    <img src="${info.volumeInfo.imageLinks.thumbnail}">
        <p>${info.volumeInfo.description}</p>
        <button type="button" class="rec-button">Get Recommendations</button>`
}

function createApp() {
    getSearchTerm()
    
}

$(createApp)