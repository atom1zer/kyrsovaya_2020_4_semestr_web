const Joi = require('@hapi/joi')
module.exports = {
    register (req, res, next) {
        const schema = Joi.object({
            email: Joi.string().email(),
            login: Joi.string(),
            password: Joi.string().regex(
                new RegExp('^[a-zA-Z0-9]{8,32}$')
            )
        })
        const {error} = schema.validate(req.body)
        if(error) {
            switch (error.details[0].context.key) { 
                case 'email' :
                    res.status(400).send({
                        error: 'You must provide a valid email address'
                    })
                    break
                case 'password': 
                    res.status(400).send({
                        error: `Rules for password
                        <br>
                        1. a-z A-Z 0-9
                        <br>
                        2. 8 characters to 32 characters`
                    })
                    break
                default:
                    res.status(400).send({
                        error: 'Unknown error'
                    })
                    break
            }
        } else {
            next()
        }
    }
}
