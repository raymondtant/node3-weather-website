const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


console.log(__dirname)
console.log(path.join(__dirname,'../public'))

const app = express()
const port = process.env.PORT || 3000

const weatherstack_key=process.env.WEATHERSTACK
console.log(weatherstack_key)

const geocode_key=process.env.GEOCODE
console.log(geocode_key)

//Define path for express config
const publicDirectory = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)


//Setup Static directory to serve
app.use(express.static(publicDirectory))


app.get('',(req,res) => {
    res.render('index',{
       title: 'Weather',
       name: 'Raymond Tant'
    })
})

app.get('/about',(req,res) => {
    res.render('about',{
       title: 'About Me',
       name: 'Raymond Tant'
    })
})

app.get('/help',(req,res) => {
    res.render('help',{
       helpMessage: 'This is your help message.',
       title: 'Help',
       name: 'Raymond Tant'
    })
})

app.get('/weather',(req,res) => {
    if (!req.query.address) {
    return res.send({
            error: "Need an address."
        })
    }
    console.log(geocode_key)
    geocode(req.query.address, geocode_key, (error, {longitude, latitude, location} = {}) => {
        if (error) {
          return res.send({error: error})
        } 
    
        forecast(latitude, longitude, weatherstack_key, (error, forecastData) => {
           if (error) {
               return res.send ({error: error})
           }
            
            res.send({
                forcastData: forecastData,
                location: location,
                address: req.query.address
            })
        })
    
    
    })
})

//PRODUCT EXAMPLE
app.get('/products', (req, res) => {
if (!req.query.search) {
   //RETURN stops after this error
    return res.send({
       error: 'You must provie a search term.'
   })
} 
    console.log(req.query.search)
    res.send({
    products: []
})
})


app.get('/help/*', (req, res) => {
    res.render('my404',{
        title: '404 ERROR',
        errorMessage: 'Help article not found.',
        name: 'Raymond Tant'
    })
})

app.get('*',(req, res) => {
    res.render('my404',{
        title: '404 ERROR',
        errorMessage: 'Page not found.',
        name: 'Raymond Tant'
    })
})


app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})







//{ description: 'Sunny', temperature: 66, feelslike: 66, location: 'Atoka, Tennessee, United States' }
// {
//     latitude: 35.4412,
//     longitude: -89.7781,
//     location: 'Atoka, Tennessee, United States'
//   }