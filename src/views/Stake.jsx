import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Box from "../components/Box/Box";
import Title from "../components/Title/Title";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

import logo from "../assets/img/logo.png";
import QRCode from "react-qr-code";

const Stake = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState("enterAmount");
  const [amount, setAmount] = useState(30000);
  const [payData, setPayData] = useState({
    link: "",
  });

  useEffect(() => {
    async function fetchData() {
      let req = await fetch(
        `https://api.tonlink.xyz/api/getOperator?address=${localStorage.getItem(
          "address"
        )}`
      );
      const operator = await req.json();

      if (operator?.operator?.stake !== 0 && !operator.error) {
        navigate("/");
      }
    }

    fetchData();
  }, []);

  return (
    <>
      {page == "enterAmount" && (
        <div class="main">
          <img src={logo} class="logo" />
          <div class="Box Box__center">
            <Title style={{ "margin-bottom": "24px" }} type={2}>
              You don’t have stake.
            </Title>

            <Input
              header={"Enter stake amount"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={"1000"}
            />

            <Button
              size={"medium"}
              color={"dark"}
              onClick={async () => {
                let req = await fetch(
                  `https://api.tonlink.xyz/api/stake?amount=${amount}&address=${localStorage.getItem(
                    "address"
                  )}`
                );
                const res = await req.json();
                setPayData({
                  link: `ton://transfer/${res.wallet}?bin=${res.boc}&amount=${
                    1 * Math.pow(10, 9)
                  }`,
                });
                setPage("payStake");

                if (window.ton) {
                  window.ton.send("ton_sendTransaction", [
                    {
                      to: res.wallet,
                      value: 1 * Math.pow(10, 9),
                      data: res.boc,
                      dataType: "boc",
                    },
                  ]);
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {page == "payStake" && (
        <div class="main">
          <img src={logo} class="logo" />
          <Box center={true}>
            <Title style={{ "margin-bottom": "24px" }} type={2}>
              Send your stake.
              <br />
              Scan QR code
            </Title>

            <div class="QRBox">
              <QRCode value={payData.link} />
            </div>

            <Button
              size={"medium"}
              color={"dark"}
              onClick={() => {
                navigate("/");
              }}
            >
              Paid
            </Button>
            <Button
              size={"medium"}
              color={"dark"}
              onClick={() => {
                setPage("enterAmount");
              }}
            >
              Back
            </Button>
          </Box>
        </div>
      )}
    </>
  );
};

export default Stake;
