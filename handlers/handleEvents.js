const { readdirSync } = require('node:fs')

function handleEvents(client) {
    console.log(`[EVENTS]:`.green.bold + ' Ивенты Стартовали.'.blue.bold)
    readdirSync('events').forEach(directory => {
        let eventFiles = readdirSync(`./events/${directory}`).filter(file => file.endsWith('.js'))
        for (let i = 0; i < eventFiles.length; i++) {
            const eventRun = require(`../events/${directory}/${eventFiles[i]}`)
            const eventName = eventFiles[i].replace('.js', '')
            client.on(eventName, (...args) => eventRun(client, ...args))

        }
    })
}

module.exports = { handleEvents }