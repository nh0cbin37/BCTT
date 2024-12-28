import axios from "axios";
import alertCustome from "components/Alert/alert";
import DataContext from "components/UseContext/Datacontext";
import { ethers } from "ethers";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInfoUser } from "redux/redux";


const connectWallet = async (e, dispatch) => {


const sendEther = async () => {
  try {
  const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");

    // Lấy tài khoản đầu tiên từ node (ví dụ: Ganache)
    const signer = provider.getSigner(2);

    const toAddress = "0x50Bab414576369E5EaB50CA4f3bB5e5829B28eAC"; // Thay thế bằng địa chỉ MetaMask của bạn
    const value = ethers.utils.parseEther("2"); // Chuyển đổi 1 Ether sang wei

    // Gửi Ether
    const tx = await signer.sendTransaction({
      to: toAddress,
      value,
    });

    // console.log("Transaction Hash:", tx.hash);

    // Chờ giao dịch được xác nhận (tùy chọn)
    const receipt = await tx.wait();
    // console.log("Transaction Receipt:", receipt);


  } catch (error) {
    console.error("Lỗi:", error);
  }
}

  // wallet
  const handleSubmit = async (activity, AddressUser) => {
    dispatch(setInfoUser({ value: AddressUser }));
    activity.preventDefault();
    try {
      const UserLogin = {
        Address: AddressUser,
      }
      const response = await axios.post('http://localhost:3000/auth/login', UserLogin);
      sendEther();
      if (response) {
        // Đăng ký thành công
        alertCustome("Login successfully");
      } else {
        // Xử lý lỗi
        alert('Login thất bại:');
      }

    } catch (error) {
      console.error('Lỗi khi gửi request:', error);
      alert('Lỗi khi gửi request');
    }
  };
  const requestAccount = async (activity) => {
    console.log('Requesting account...');
    if (window.ethereum) {
      console.log('detected');
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        // updateData({message: accounts[0]});
        const address = accounts[0];
        handleSubmit(activity, address);
      } catch (error) {
        console.log('Error connecting...', error);
      }
    } else {
      alert('Meta Mask not detected');
    }
  }
  if (typeof window.ethereum !== 'undefined') {
    await requestAccount(e);
     const provider = new ethers.providers.Web3Provider(window.ethereum); //  Bạn có thể sử dụng provider này nếu cần
    const signer = provider.getSigner();
    const address = signer.getAddress();
    console.log(address);
    }
}
export default connectWallet;