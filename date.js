
exports.getDate = function () {
    // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const today = new Date();
    // let day = weekday[today.getDay()];
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    
    const day = today.toLocaleDateString("en-US", options)
    
    return day
}
