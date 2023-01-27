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
    let currentimport = consumeenergy - 941.5; //variable total
    let currentexport = feedinenergy - 331.69; //variable total
    let bill = currentimport * 11.29; //variable rate
    let exportsavings = currentexport * 7.12; //variable rate
    let totalbill = bill - exportsavings;
    let selfusesavings = (yieldtotal - 755.55 - currentexport) * 11.29; //variable rate
    let monthlysavings = selfusesavings + exportsavings;

    let totalsavings = selfusesavings + exportsavings + 6629.46; //variable total

    const monthname = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
    ];

    const d = new Date();
    let month = monthname[d.getMonth() + 1];

    document.querySelector(".bill").innerText =
      "₱ " + Math.round(totalbill * 100) / 100;
    document.querySelector(".meralco").innerText = "Meralco Bill for " + month;
    document.querySelector(".uptime").innerText = "Updated: " + uploadTime;
    document.querySelector(".prebill").innerText =
      "Import Cost: ₱ " + Math.round(bill * 100) / 100;
    document.querySelector(".export").innerText =
      "Export Savings: ₱ " + Math.round(exportsavings * 100) / 100;
    document.querySelector(".selfuse").innerText =
      "Self-Use Savings: ₱ " + Math.round(selfusesavings * 100) / 100;
    document.querySelector(".monthly").innerText =
      "Monthly Savings: ₱ " + Math.round(monthlysavings * 100) / 100;
    document.querySelector(".overall").innerText =
      "Overall Savings: " +"\n" + "₱ " + Math.round(totalsavings * 100) / 100;
    document.querySelector(".solar").classList.remove("loading");
    //   document.body.style.backgroundImage =
    //     "url('https://source.unsplash.com/1600x900/?" + name + "')";
  },
};

solar.fetchSolar();
