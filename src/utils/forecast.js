const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {

    const url = 'http://api.weatherstack.com/current?access_key=61b1316165656bc0846fbeb162b3853a&query='+ latitude +','+ longitude  +'&units=f'

    request({url: url, json: true}, (error, {body}) => {
        if (error) {
            callback('Something went wrong.', undefined)
        }else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, 
                body.current.weather_descriptions[0] + ". It is currently " +
                body.current.temperature + " and feels like " + 
                body.current.feelslike + " degrees." +
                "the current UV index is: " + body.current_uv_index

            )
        }
    })

}


module.exports = forecast