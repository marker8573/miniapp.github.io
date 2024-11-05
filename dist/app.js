// app.js

import { OKXUniversalProvider } from "@okxconnect/universal-provider";

// 初始okx网络实例
const okxUniversalProvider = await OKXUniversalProvider.init({
  dappMetaData: {
    name: "Mini dapp",
    icon: "https://polygonscan.com/token/images/originlgns_32.png"
  }
});

// 断开连接会触发该事件；
okxUniversalProvider.on("session_delete", ({
  topic
}) => {
  console.log(topic);
  statusText.innerText = `session_delete 断开连接成功回调！`;
});

// 初始化 Web3
const infuraEthMainNetUrl = "https://mainnet.infura.io/v3/c7e8057fade44aaeb27574f2f11170c0";
const web3 = new Web3(infuraEthMainNetUrl);

// 查询余额函数
async function checkBalance() {
  const address = document.getElementById("address").value;
  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = web3.utils.fromWei(balance, "ether");
    document.getElementById("balanceResult").innerText = `余额: ${balanceInEther} ETH`;
  } catch (error) {
    document.getElementById("balanceResult").innerText = `查询失败: ${error.message}`;
  }
}
async function connectOkxWallet() {
  const connectButton = document.getElementById('connectButton');
  const statusText = document.getElementById('status');
  connectButton.onclick = async () => {
    var session = await okxUniversalProvider.connect({
      namespaces: {
        eip155: {
          // 请按需组合需要的链id传入，多条链就传入多个
          chains: ["eip155:1", "eip155:xxx"],
          rpcMap: {
            1: infuraEthMainNetUrl // set your own rpc url
          },
          defaultChain: "1"
        }
      },
      optionalNamespaces: {
        eip155: {
          chains: ["eip155:43114"]
        }
      },
      sessionConfig: {
        redirect: "tg://resolve"
      }
    });
    console.log(JSON.stringify(session));
    statusText.innerText = `连接成功！您的地址是: ${session.accounts[0]}`;
  };
}
async function disconnectOkxWallet() {
  const connectButton = document.getElementById('disconnectButton');
  connectButton.onclick = async () => {
    okxUniversalProvider.disconnect();
    statusText.innerText = `断开连接成功！`;
  };
}

// 查询余额函数
async function requestBalance() {
  const address = document.getElementById("address").value;
  try {
    data = {
      "method": "eth_getBalance",
      "params": ["0x8D97689C9818892B700e27F316cc3E41e17fBeb9", "latest"]
    };
    data.params[0] = address;
    console.log("address:" + JSON.stringify(address));
    let chain = 'eip155:1';
    var getBalanceResult = await okxUniversalProvider.request(data, chain);
    // const balanceInEther = web3.utils.fromWei(getBalanceResult, "ether");
    document.getElementById("balanceResult").innerText = `余额: ${getBalanceResult} ETH`;
  } catch (error) {
    document.getElementById("balanceResult").innerText = `查询失败: ${error.message}`;
  }
}

// 发送交易函数
async function sendTransaction() {
  const from = document.getElementById("fromAddress").value;
  const to = document.getElementById("toAddress").value;
  const amount = document.getElementById("amount").value;
  try {
    const valueInWei = web3.utils.toWei(amount, "ether");
    const transaction = {
      from,
      to,
      value: valueInWei,
      gas: 21000
    };

    // 使用私钥签名交易（注意安全）
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, "YOUR_PRIVATE_KEY");
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    document.getElementById("transactionResult").innerText = `交易成功! Hash: ${receipt.transactionHash}`;
  } catch (error) {
    document.getElementById("transactionResult").innerText = `交易失败: ${error.message}`;
  }
}