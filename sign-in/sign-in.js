localStorage.removeItem('loggedIn')
localStorage.removeItem('isAdmin')
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault()
    if(document.getElementById('roblox-user').value == '1030-3827-2747-6815'){
        authSuccess()
    }else{
        authFailed()
    }
})

const authFailed = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    var keys = urlParams.get('asd')
    console.log('Authorization Failed')
    document.getElementById('p').style.display = 'inherit'
    console.log(keys);
}

const authSuccess = () => {
    localStorage.setItem('loggedIn', true)
    localStorage.setItem('isAdmin', true)
    window.location = '../'
}