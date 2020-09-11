import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Inputs from "./Input";
import Buttons from "../components/Button";
import A11yTitle from "../components/A11yTitle";
import Feedback from "../components/Feedback";

const FormArea = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 50px 40px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
`;

const Greeting = styled.p`
  font-size: 3rem;
  color: #fff;
`;

const Form = styled.form`
  margin: 40px 0 0;
`;

const InputBox = styled.div`
  & + & {
    margin: 40px 0 0;
  }
`;

const ButtonBox = styled.div`
  margin: 70px 0 0;
  text-align: center;
`;

const SigninForm = () => {
  const emailRef = React.createRef();
  const passwordRef = React.createRef();
  const [feed, setFeed] = useState(false);
  const [feedComment, setFeedComment] = useState("");
  const history = useHistory();

  const click = async e => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        "http://ec2-52-79-220-237.ap-northeast-2.compute.amazonaws.com:5000/auth/login",
        {
          email,
          password
        }
      );

      const { access_token } = response.data;

      localStorage.setItem("token", access_token);
      history.push("/");
    } catch (error) {
      setFeedComment("Incorrect email or password");
      setFeed(true);
    }
  };

  const closeFeed = () => {
    setFeed(false);
  };

  return (
    <FormArea>
      <Greeting>SignIn</Greeting>
      <Form>
        <fieldset>
          <A11yTitle as="legend">로그인 정보 입력영역</A11yTitle>
          <InputBox>
            <Inputs
              ref={emailRef}
              type="email"
              id="email"
              placeHolder="Enter Your E-mail"
              essential
            >
              E-MAIL
            </Inputs>
          </InputBox>
          <InputBox>
            <Inputs
              ref={passwordRef}
              type="password"
              id="password"
              placeHolder="Enter Your Password"
              essential
            >
              PASSWORD
            </Inputs>
          </InputBox>
        </fieldset>
        <ButtonBox>
          <Buttons size="medium" width={200} onClick={click} color="red">
            Sign In
          </Buttons>
        </ButtonBox>
      </Form>
      <Feedback visible={feed} onCloseFeed={closeFeed}>
        {feedComment}
      </Feedback>
    </FormArea>
  );
};

export default SigninForm;
