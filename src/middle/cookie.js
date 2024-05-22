const cookieMiddleware = {}

cookieMiddleware.setCookie = (req, res, next) => {
  res.cookie('myCookieName','cookieValue', {maxAge:900000, httpOnly:false});
  next()
};

cookieMiddleware.readCookies = (req,res,next) => {
  const cookies =req.cookies;
  console.log("받은 쿠키",cookies)
  const myCookie = cookies.myCookieName;
  console.log("쿠키 이름",myCookie)
  next()
}

module.exports = cookieMiddleware