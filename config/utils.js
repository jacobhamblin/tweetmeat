function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/?login=true');
  }
}

module.exporsts = {
  loggedIn,
}
