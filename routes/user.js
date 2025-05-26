const {Router} = require("express");
const User = require("../models/user");
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin");
});

router.get('/signup',(req,res)=>{
    return res.render("signup");
});

router.post('/signin',async(req,res)=>{
    const {email,password} = req.body;
    try{
    const token=await User.matchedPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect("/");
    }
    catch(err){
        console.log(err);
        return res.status(401).render("signin",{error: "Invalid email or password"});
    };
});
router.get('/profile',async (req,res)=>{
    const user = await User.findById(req.user._id);
    return res.render("profile",{
        user:req.user,
    })
});
router.post('/signup', async (req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).render("signup",{error: "All fields are required"});
    }
    const existingUser = await User.findOne({email})
     if (existingUser) {
            return res.render('signup', { 
                error: 'This email is already registered. Please use a different email or sign in.',
                fullName,
                email 
            });
        }
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});
router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
});
module.exports = router;