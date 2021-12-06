const coinList = document.querySelector("#coin_list");

function loadMarket() {
  getData("market/all?isDetails=false", null, loadTicker);
}

loadMarket();

function loadTicker(data, names, callback = printCoin) {
  const markets = data
    .map((e) => e.market)
    .filter((e) => e.substring(0, 3) === "KRW");
  const coinNames = data.filter((e) => e.market.substring(0, 3) === "KRW");

  getData(`ticker?markets=${markets}`, coinNames, callback);
}

function getData(url, names, callback) {
  const xhr = new XMLHttpRequest();
  const addr = `https://api.upbit.com/v1/${url}`;

  xhr.onreadystatechange = (e) => {
    const { target } = e;

    if (target.readyState === XMLHttpRequest.DONE) {
      if (target.status === 200) {
        const req = JSON.parse(target.response);

        callback(req, names);
      }
    }
  };
  xhr.open("GET", addr);
  xhr.send();
}

function printCoin(data, names) {
  const assigns = names.map((e, i) => {
    return {
      ...e,
      market: data[i].market,
      trade_price: data[i].trade_price,
      acc_trade_price: data[i].acc_trade_price_24h,
      signed_change_rate: data[i].signed_change_rate,
    };
  });

  assigns.forEach((e) => {
    const coinDetails = document.createElement("li");
    const korean_name = document.createElement("div");
    const english_name = document.createElement("div");
    const market_name = document.createElement("div");
    const trade_price = document.createElement("div");
    const signed_change_rate = document.createElement("div");
    const acc_trade_price = document.createElement("div");

    coinDetails.classList.add("coin-each");
    korean_name.innerText = e.korean_name;
    english_name.innerText = e.english_name;
    market_name.innerText = e.market;
    trade_price.innerText = `현재가: ${e.trade_price.toLocaleString("ko-KR")}`;
    signed_change_rate.innerText = `전일대비: ${
      (e.signed_change_rate * 100).toFixed(2) + "%"
    }`;
    const price = e.acc_trade_price + "";
    const price_num = price.slice(-(price + "").length, -10);
    acc_trade_price.innerText = `거래대금: ${Number(price_num).toLocaleString(
      "ko-KR"
    )}백만`;

    coinDetails.appendChild(korean_name);
    coinDetails.appendChild(english_name);
    coinDetails.appendChild(market_name);
    coinDetails.appendChild(trade_price);
    coinDetails.appendChild(signed_change_rate);
    coinDetails.appendChild(acc_trade_price);
    coinList.appendChild(coinDetails);
  });
}

document.querySelector("#query").addEventListener("keyup", (e) => {
  e.preventDefault();

  const value = e.target.value;
  const list = document.querySelectorAll(".coin-each");

  list.forEach((e, i) => {
    const name = e.firstChild;
    name.innerText.indexOf(value) > -1
      ? (e.style.display = "block")
      : (e.style.display = "none");
  });
});
