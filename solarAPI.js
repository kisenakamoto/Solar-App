// const getJSON = async url => {
//   const response = await fetch(url);
//   if(!response.ok) // check if response worked (no 404 errors etc...)
//     throw new Error(response.statusText);

//   const data = response.json(); // get JSON from the response
//   return data; // returns a promise, which resolves to this data value
// }

// console.log("Fetching data...");
// getJSON("https://www.solaxcloud.com/proxyApp/proxy/api/getRealtimeInfo.do?tokenId=20221026130839175716859&sn=SVT7CYCWCP").then(data => {
//   const result = data.result;
//   console.log(result);
//   console.log("this is the time: "+result.uploadTime);
// }).catch(error => {
//   console.error(error);
// });

let solar = {
  fetchSolar: function () {
    fetch(
      "https://www.solaxcloud.com/proxyApp/proxy/api/getRealtimeInfo.do?tokenId=20221026130839175716859&sn=SVT7CYCWCP"
    )
      .then((response) => {
        if (!response.ok) {
          alert("Failed to get result.");
          throw new Error("Failed to get result.");
        }
        return response.json();
      })
      .then((data) => this.displaySolar(data));
  },
  displaySolar: function (data) {
    const { uploadTime, yieldtotal, feedinenergy, consumeenergy } = data.result;
    let currentimport = consumeenergy - 941.5;
    let currentexport = feedinenergy - 331.69;
    let bill = currentimport * 11.29
    let exportsavings = currentexport * 7.12
    let totalbill = (bill - exportsavings);

    const monthname = ["January","February","March","April","May","June","July","August","September","October","November","December","January"];

  const d = new Date();
  let month = monthname[d.getMonth() + 1];


    document.querySelector(".bill").innerText = "₱ " + Math.round(totalbill * 100) / 100;
    document.querySelector(".meralco").innerText = "Meralco Bill for " + month;
    // document.querySelector(".temp").innerText = temp + "°C";
    // document.querySelector(".humidity").innerText =
    //   "Humidity: " + humidity + "%";
    // document.querySelector(".clouds").innerText =
    //   "Cloud Cover: " + all + "%";
    // document.querySelector(".wind").innerText =
    //   "Wind speed: " + speed + " km/h";
    document.querySelector(".solar").classList.remove("loading");
  //   document.body.style.backgroundImage =
  //     "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
};

solar.fetchSolar();