const {validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookievalue=req.cookies[cookieName];
        if(!tokenCookievalue){
            return next();
        }

        try{
            const userPayload=validateToken(tokenCookievalue);
            req.user=userPayload;
        }
        catch(err){

        }
        return next();
    }
};

module.exports={
    checkForAuthenticationCookie,
}