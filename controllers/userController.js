import userModel from "../models/Usermodel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpass = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedpass
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({success: true, token, user: { name: user.name }});

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})  // returns user obj

        if (!user) {
            return res.json({success : false, message : "user doesn't exist"})
        }else{
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {

                const token = jwt.sign({id : user._id}, process.env.JWT_SECRET)
                res.json({success : true, token, user : {name : user.name}})

            }else{
                return res.json({success : false, message : "invalid credialtls"}) 
            }
        }
    } catch (error) {
        console.log(error);
        res.json({success : false, message : error.message})
    }
}

// const userCredits = async(req, res) => {
//     try {
//         const {userId} = req.body

//         const user = await userModel.findById(userId)

//         res.json({success : true, credits : user.creditBalance, user : {name : user.name}})
        
//     } catch (error) {
//         console.log(error);
//         res.json({success : false, message : error.message})
//     }
// }

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            credits: "Infinity",        // 🔥 FORCE UNLIMITED
            unlimited: true,        // 🔥 OPTIONAL FLAG
            user: { name: user.name }
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {registerUser, loginUser, userCredits}