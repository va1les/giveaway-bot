function handleClietOptions(client, options){
    for(let i = 0; i < options.length; i++){
        for(let key in options[i]) {
            client[key] = options[i][key]
        }
    }
}

module.exports = { handleClietOptions }