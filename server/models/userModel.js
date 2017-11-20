import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import _ from 'lodash'
mongoose.Promise = global.Promise

let userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {type: String, required: true},
    password: String
})


userSchema.statics.saveUser = async usrObj => {
    if(!usrObj.email)
        throw new Error("User's email must be passed to save user")
    if(!usrObj.password)
        throw new Error("User's password must be passed to save user")

    let count = await UserModel.count({email: usrObj.email})
    if(count !== 0)
        throw new Error("Email already registered with another user")

    usrObj.password = await bcrypt.hash(usrObj.password, 10)
    return await UserModel.create(usrObj)
}

userSchema.statics.verifyUser = async (email, password) => {
    if(_.isEmpty(email))
        throw new Error("User's email must be passed to verify user")
    if(_.isEmpty(password))
        throw new Error("User's password must be passed to verify user")

    console.log("finding user with email")
    let user = await UserModel.findOne({email:email}).lean()

    if(user){
        return user
    } else {
        return false
    }


    //return await UserModel.findOne({email:email}).exec()

    /*console.log("found user ", user)
    return user
    */

    /*
    if(user){
        console.log("comparing password")
        return bcrypt.compare(password, user.password)

        console.log("result is ", result)
        if(result)
            return Promise.resolve(result)
        else
            return Promise.resolve(false)
    } else {
        console.log("returning false")
        return Promise.resolve(false)
    }
    */

}

const UserModel = mongoose.model("User", userSchema)
export default UserModel