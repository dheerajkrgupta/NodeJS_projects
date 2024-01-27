exports.home = (req, res) => {
    res.send("Your home api is working.");
}
exports.login = (req, res) => {
    res.json({"message": "Your login api is working."})
}
