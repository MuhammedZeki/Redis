import crypto from "crypto";

export const csrfProtection = (req, res, next) => {
    if (!req.session) {
        return res.status(403).json({ message: "CSRF blocked" });
    }

    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }

    // Safe methods geçsin burda adama hatırlatıyoruz senin token bu diye ve oturum açılıp kapanana kadar budur req.session silinmediği takdirde
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        res.setHeader("x-csrf-token", req.session.csrfToken);
        return next();
    }

    //post,put işlemlerde
    const token = req.headers["x-csrf-token"] || req.body?.csrfToken;

    if (token !== req.session.csrfToken) {
        return res.status(403).json({ message: "Invalid CSRF token" });
    }

    next();
};


//const token = response.headers.get('x-csrf-token');
// fetch('/api/data', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-csrf-token': token // <-- Bu olmazsa 403 yersin
//   },
//   body: JSON.stringify(data)
// });