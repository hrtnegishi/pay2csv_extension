"use strict";

document.getElementById("btn").addEventListener("click", async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: onRun,
	});
});

function onRun() {
	let PAYPAY_URL = "www.paypay-card.co.jp";
	if (window.location.href.indexOf(PAYPAY_URL) == -1){
		window.alert("この拡張機能は " + PAYPAY_URL + " のみで有効です。\n" + window.location.href);
		return;
	}
	document.body.style.backgroundColor = "#ccc";
	
	// https://gist.github.com/yamaaaaaa/522bf96c35d9d785148eee9527d30d68
	let buffer = "\"date\",\"name\",\"price\"\n";
	let sum = 0;
	let cnt = 0;
	document.querySelectorAll("[role=\"menuitem\"]").forEach(function (e) {
		let item = {};
		item.name = e.querySelector("button div:first-child div:first-child").innerText;
		item.date = e.querySelector("button div:first-child div:last-child").innerText;
		//item.price = e.querySelector("button>div:nth-child(2)").innerText.replace(",", "").replace(" ", "").replace("円", "").replace("\n", "");
		item.price = parseInt(e.querySelector("button>div:nth-child(2)").innerText.replace(",", ""));
		buffer += "\"" + item.date + "\",\"" + item.name + "\",\"" + item.price + "\"\n";
		sum += item.price;
		cnt += 1;
	});
	console.log(buffer);
	console.log("sum: ", sum);

	// print csv
	let outtext = document.createElement("div");
	outtext.id = "pay2csv_result";
	outtext.style.width = "90%";
	outtext.style.margin = "auto";
	outtext.innerText = buffer;
	document.body.prepend(outtext);

	// FIXME: can't change extension's dom..
	//document.getElementById("ext_message").innerText = "done";

	// FIXME: can't copy to clipboard
	navigator.clipboard.writeText(buffer)
	.then(() => {
		alert("CSV copied! sum: " + sum);
	});
	/*
	document.getElementById("pay2csv_result").select;
	document.execCommand("copy");
	*/

	// check sum
	alert(cnt + " 件のデータをCSV化します。\n" + "コピー＆ペーストしてご利用ください。\n\n" + "合計金額: " + sum.toLocaleString() + "円");
}