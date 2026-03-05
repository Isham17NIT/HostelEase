export const clearAuth = async(res, user)=>{
    
    // remove refreshtoken from user database
    user.refreshToken = null;
    await user.save()

    
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    })
}