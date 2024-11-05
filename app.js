// app.js

// 初始化 Web3
const web3 = new Web3("https://mainnet.infura.io/v3/c7e8057fade44aaeb27574f2f11170c0");

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

async function connectMetamask() {
      const connectButton = document.getElementById('connectButton');
      const statusText = document.getElementById('status');

      connectButton.onclick = async () => {
          if (typeof window.ethereum !== 'undefined') {
              try {
                  // 请求用户连接到 MetaMask
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  
                  // 连接成功，显示用户地址
                  statusText.innerText = `连接成功！您的地址是: ${accounts[0]}`;
              } catch (error) {
                  // 用户拒绝连接或发生错误
                  console.error("用户拒绝连接:", error);
                  statusText.innerText = "连接失败，请重试。";
              }
          } else {
              statusText.innerText = "请安装 MetaMask 钱包！";
          }
      };
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
      gas: 21000,
    };

    // 使用私钥签名交易（注意安全）
    const signedTransaction = await web3.eth.accounts.signTransaction(transaction, "YOUR_PRIVATE_KEY");
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    document.getElementById("transactionResult").innerText = `交易成功! Hash: ${receipt.transactionHash}`;
  } catch (error) {
    document.getElementById("transactionResult").innerText = `交易失败: ${error.message}`;
  }
}
