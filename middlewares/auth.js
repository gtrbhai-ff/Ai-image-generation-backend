import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
    const {token} = req.headers

    if (!token){
        return res.json({sucess : false, message : "not auth, login again"})    
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id){
            req.userId = tokenDecode.id
        }else{
            return res.json({sucess : false, message : "not auth, login again"})    
        }

        next()

    } catch (error) {
        console.log(error);
        res.json({sucess : false, message : error.message})
    }
}

export default userAuth