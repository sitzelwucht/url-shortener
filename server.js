const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
require('dotenv').config()
const db = process.env.mongoURI

app.use(express.static(__dirname + '/styles'))
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.listen(process.env.PORT || 3000)

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shorturls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })

    res.redirect('/')
    })


app.get('/:shorturl', async (req, res) => {
    const short = await ShortUrl.findOne({ short: req.params.shorturl })
    if (short == null) return res.sendStatus(404)

    short.clicks++
    short.save()

    res.redirect(short.full)
})


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(console.log('database connected'))
    .catch((err) => console.log(err))