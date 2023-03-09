let solar = {
  fetchSolar: async function () {
    const response = await fetch(
      "https://corsproxy.io/?https%3A%2F%2Fwww.solaxcloud.com%2FproxyApp%2Fproxy%2Fapi%2FgetRealtimeInfo.do%3FtokenId%3D20221026130839175716859%26sn%3DSVT7CYCWCP",
      { credentials: "omit" }
    );
    if (!response.ok) {
      alert("Failed to get result.");
      throw new Error("Failed to get result.");
    }
    return await response.json();
  },

  fetchJSON: async function () {
    const owner = "kisenakamoto";
    const repo = "Solar-Usage";
    const file = "file.json";
    const token = "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";

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  },

  

  updateJSON: function () {
    const owner = "kisenakamoto";
    const repo = "Solar-Usage";
    const file = "file.json";
    const token = "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";

    fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => response.json())
  .then((data) => {
    const content = data.content;
    const decodedContent = atob(content);
    const fileData = JSON.parse(decodedContent);

    // console.log(fileData.importprev);
    // console.log(fileData.exportprev);

    // Update the importprev and exportprev values
    fileData.importprev = sampval1;
    fileData.exportprev = sampval2;

    // Encode the updated file data
    const encodedData = btoa(JSON.stringify(fileData, null, 2));
    // console.log(encodedData);

    // Send a PUT request to update the file
    return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Update importprev and exportprev values",
        content: encodedData,
        sha: data.sha,
      }),
    });
  })
  .then((response) => response.json())
  .then((data) => {
    console.log("File updated:", data);
  })
  .catch((error) => {
    console.error("Error updating file:", error);
  });

  },

  displaySolar: function () {
    Promise.all([this.fetchSolar(), this.fetchJSON()])
      .then(([solarData, jsonData]) => {
    const owner = "kisenakamoto";
    const repo = "Solar-Usage";
    const file = "file.json";
    const token = "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";

    const { uploadTime, yieldtotal, feedinenergy, consumeenergy } = solarData.result;
    const content = jsonData.content;
    const decodedContent = atob(content);
    const fileData = JSON.parse(decodedContent);


    //monthly variables
    let importprev = fileData.importprev;
    let exportprev = fileData.exportprev; 
    let yieldprev = fileData.yieldprev;
    let savingsprev = fileData.savingsprev;
    let importrate = fileData.importrate; 
    let exportrate = fileData.exportrate; 
    let billupdated = fileData.billupdated;

    let currentimport = consumeenergy - importprev;
    let currentexport = feedinenergy - exportprev;
    let bill = currentimport * importrate;
    let exportsavings = currentexport * exportrate;
    let totalbill = bill - exportsavings;
    let selfusesavings = (yieldtotal - yieldprev - currentexport) * importrate;
    let monthlysavings = selfusesavings + exportsavings;

    let totalsavings = selfusesavings + exportsavings + savingsprev;

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
    ];
    
    const d = new Date();
    let month = monthname[d.getMonth()];
    let day = d.getDate();
    let time = d.getHours();


    console.log(`day: ${day} time: ${time}`);

    //Change Bill month
    if (day >=9){
      if (d.getMonth()<11){
        month = monthname[d.getMonth() + 1];
        }
        else{
          month = monthname[d.getMonth() - 11];
        }
    }
    
    //Change billupdated value every 9th
    if (day>=9 && billupdated==true){
      fileData.billupdated = false; 
      const encodedData = btoa(JSON.stringify(fileData, null, 2));

      fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
        method: "PUT",
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        },
      body: JSON.stringify({
        message: "Update importprev and exportprev values",
        content: encodedData,
        sha: jsonData.sha,
        }),
      });
      console.log("File updated:", jsonData);
  }

    //Update the variable values every 8th
    if (day==8 && time>11 && billupdated==false){
        fileData.sample = 789;
        fileData.importprev = consumeenergy;
        fileData.exportprev = feedinenergy;
        fileData.yieldprev = yieldtotal;
        fileData.savingsprev = savingsprev + monthlysavings;
        fileData.billupdated = true; //set true every 8th

        const encodedData = btoa(JSON.stringify(fileData, null, 2));

        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${file}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update importprev and exportprev values",
            content: encodedData,
            sha: jsonData.sha,
          }),
        });
      
        console.log("File updated:", jsonData);
    }


    document.querySelector(".bill").innerText =
      "₱ " + Math.round(totalbill * 100) / 100;
    document.querySelector(".meralco").innerText = "Meralco Bill for " + month;
    document.querySelector(".uptime").innerText = "Updated: " + uploadTime;
    document.querySelector(".prebill").innerText =
      "Import Cost: " +"\n" + "₱ " + Math.round(bill * 100) / 100;
    document.querySelector(".export").innerText =
      "Export Savings: " +"\n" + "₱ " + Math.round(exportsavings * 100) / 100;
    document.querySelector(".selfuse").innerText =
      "Self-Use Savings: " +"\n" + "₱ " + Math.round(selfusesavings * 100) / 100;
    document.querySelector(".monthly").innerText =
      "Monthly Savings: " +"\n" + "₱ " + Math.round(monthlysavings * 100) / 100;
    document.querySelector(".overall").innerText =
      "Overall Savings: " +"\n" + "₱ " + Math.round(totalsavings * 100) / 100;
    document.querySelector(".solar").classList.remove("loading");
    //   document.body.style.backgroundImage =
    //     "url('https://source.unsplash.com/1600x900/?" + name + "')";

      })
      .catch((error) => {
        console.error(error);
      });
  },
    
};

solar.displaySolar();
