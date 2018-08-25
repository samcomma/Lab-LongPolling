const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const { EventEmitter } = require('events')

app.get('/', (req, res)=> {
    res.send(`
        <html>
            <head>
                <script type="text/javascript">
                    console.log('hello world!')
                    function longPollForTime () {
                    fetch('/the-time', { headers: { 'Cache-Control': 'no-cache' } })
                        .then(response => response.text())
                        .then(time => {
                        console.log('The time is:', time)
                        longPollForTime()
                        })
                    }
                    longPollForTime()
                </script>
            </head>
        </html>                   
    `)
})

//event emitter
const clock = new EventEmitter()
setInterval(()=> {
    const time = (new Date()).toLocaleString()
    clock.emit('tick', time)
}, 5000)

//event listener
clock.on('tick', time => console.log('The time is', time))

//event responder
app.get('/the-time', (req, res)=> {
    clock.once('tick', time => res.send(time))
})




app.listen(port, ()=> {
    console.log(`Listening to port: ${port}`)
})