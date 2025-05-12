const {createHmac,randomBytes} = require('crypto');
const { Schema,model } = require('mongoose');
const {createTokenForUser} = require("../services/authentication");
const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileImage:{
        type: String,
        default: "/images/img_avatar.png",
    },
    role:{
        type: String,
        enum: ["USER","ADMIN"],
        default: "USER",
    },
},
{
    timestamps: true,
}
);
userSchema.pre("save", function(next){
    const user =this;
    if(!user.isModified("password")){
        return;
    }
    const salt=randomBytes(16).toString("hex");
    const hashPassword = createHmac("sha256",salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashPassword;
    next();
});

userSchema.static('matchedPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt= user.salt;
    const hashedPassword = user.password;

    const userProvideHash=createHmac("sha256",salt).update(password).digest("hex");

    if(userProvideHash !== hashedPassword) throw new Error("Password not matched");

    const token=createTokenForUser(user);
    return token;
});
const User = model("User",userSchema);

module.exports = User;