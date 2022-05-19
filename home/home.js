const cont1 = document.getElementById('c-1')
dragToScroll(cont1)
gridLayout(cont1)
document.getElementById('car-left').addEventListener('click', () =>{scrollToLeft(cont1)})
document.getElementById('car-right').addEventListener('click', () =>{scrollToRight(cont1)})
function dragToScroll(ele){
    document.addEventListener('DOMContentLoaded', function () {
        ele.style.cursor = 'grab';
    
        let pos = { top: 0, left: 0, x: 0, y: 0 };
    
        const mouseDownHandler = function (e) {
            ele.style.cursor = 'grabbing';
            ele.style.userSelect = 'none';
    
            pos = {
                left: ele.scrollLeft,
                top: ele.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };
    
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };
    
        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - pos.x;
            const dy = e.clientY - pos.y;
    
            // Scroll the element
            ele.scrollTop = pos.top - dy;
            ele.scrollLeft = pos.left - dx;
        };
    
        const mouseUpHandler = function () {
            ele.style.cursor = 'grab';
            ele.style.removeProperty('user-select');
    
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
    
        // Attach the handler
        ele.addEventListener('mousedown', mouseDownHandler);
    });
}
function gridLayout(ele){
    var childrenCount = ele.childElementCount
    ele.style.gridTemplateColumns = 'repeat(' + childrenCount + ', 500px'
}
function scrollToRight(content){
    content.scrollLeft += 500
    console.log('scrolled right')
}
function scrollToLeft(content){
    content.scrollLeft -= 500
    console.log('scrolled left')
}

window.addEventListener('load', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    var isAdmin = localStorage.getItem('isAdmin')
    var loggedIn = localStorage.getItem('loggedIn')
    if(loggedIn == 'true'){
        document.getElementById('sign-in-btn').style.display = 'none'
    }
    if(isAdmin == 'true'){
        document.getElementById('editBtn').style.display = 'unset'
    }

})

var socket = io();
var opened = false
document.getElementById('editBtn').addEventListener('click', () => {
    opened = !opened
    if(opened == true){
       document.getElementById('editFormContainer').style.display = 'inherit'
    }else if(opened == false){
       document.getElementById('editFormContainer').style.display = 'none'
    }
})
var image
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault()
    var title = document.getElementById('title').value
    socket.emit('add', `{ "img": "${image}", "title": "${title}" }`);
})
document.getElementById('image').addEventListener('change', (e) => {
    const file = e.target.files[0]
    console.log(file)
    document.getElementById('fileName').innerHTML = file.name
    var reader = new FileReader();
    reader.onload = function(){
        const date = new Date()
        var numericData = date.getMilliseconds()+date.getDay()+date.getFullYear()+date.getDate()+date.getMonth()+date.getMinutes()+date.getTime()
        var uploadedName = numericData + e.target.files[0].name
        var img = reader.result
        socket.emit('file', img + '..' + uploadedName)
        console.log(uploadedName)
        image = '/uploads/' + uploadedName
    }
    reader.readAsDataURL(e.target.files[0])
})
socket.on('data-change', (data) => {
    loadData(data)
})

const loadData = (data) => {
    cont1.innerHTML = ''
    data.forEach(cardata => {
        const card = document.createElement('div')
        card.classList.add('card')
        cont1.appendChild(card)
        const img = document.createElement('img')
        img.classList.add('image')
        img.src = cardata.img
        img.draggable = false
        card.appendChild(img)
        const info = document.createElement('div')
        info.classList.add('card-info')
        const p = document.createElement('p')
        p.classList.add('card-text')
        p.innerHTML = cardata.title
        card.appendChild(info)
        info.appendChild(p)
    });
    gridLayout(cont1)
}

function updateData(){
    const response = fetch('../data.json')
    .then(response => {
        return response.json();
    })
    .then(jsondata => loadData(jsondata));

}
updateData()

async function getIp(){
    var response = await fetch(`https://api.ipify.org?format=json`).then(data => {
        console.log(data)
    })
}
getIp()