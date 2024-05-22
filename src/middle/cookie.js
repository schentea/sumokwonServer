const cookieMiddleware = {};

cookieMiddleware.setCookie = (req, res, next) => {
    res.cookie('name', 'cookieValue', {
        maxAge: 900000,
        httpOnly: true,
        domain: 'port-0-sumokwonserver-17xco2nlstnj7hw.sel5.cloudtype.app',
        path: '/'
    });
    next();
};

cookieMiddleware.readCookies = (req, res, next) => {
    const cookies = req.cookies;
    console.log("받은 쿠키:", cookies);
    console.log("쿠키 타입:", typeof cookies);
    const myCookie = cookies.name; // 클라이언트에서 설정한 쿠키의 이름을 사용
    console.log("쿠키 이름:", myCookie);
    next();
};

module.exports = cookieMiddleware;