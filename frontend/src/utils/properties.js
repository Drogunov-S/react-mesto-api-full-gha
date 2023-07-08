const propertiesApiCard = {
    // baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-62',
    baseUrl: 'http://api.mesto-drogunov.nomoredomains.work/',
    headers: {
        // authorization: '68ff74c2-9ffa-4750-b60b-83127c7e3981',
        // authorization: '68ff74c2-9ffa-4750-b60b-83127c7e3981',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

const propertiesApiAuth = {
    // baseUrl: 'https://auth.nomoreparties.co',
    baseUrl: 'http://api.mesto-drogunov.nomoredomains.work/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

export {
    propertiesApiCard
        , propertiesApiAuth
}
