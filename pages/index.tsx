import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useRef, useState, useEffect } from "react";
import {
  addEmail,
  addPassword,
  isLogin,
  addNickName,
  editAllUserState,
  userInfoReset,
} from "redux/userReducer";
import store from "redux/store";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import Title from "components/Title";
import { addUser, editUser, findIsSameTrue } from "redux/dataReducer";
import { Container } from "styles/Container";
import Button from "styles/Button";

interface Password {
  type: string;
  visible: boolean;
}

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const pwRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const [pwType, setPwType] = useState<Password>({
    type: "password",
    visible: false,
  });
  const [emailList, setEmailList] = useState<string[]>([]);

  const onLoginClick = (e: any) => {
    const email = emailRef.current?.value;
    const pw = pwRef.current?.value;

    if (email && pw) {
      if (emailList.includes(email) === true) {
        store.getState().data.users.forEach((user) => {
          if (user.email === email && user.password === pw) {
            dispatch(editAllUserState(user));
            dispatch(isLogin(true));
            dispatch(editUser(store.getState().userInfo));
            dispatch(findIsSameTrue(store.getState().userInfo.email));
          } else if (user.email === email && user.password !== pw) {
            alert("이미 가입된 아이디입니다. \n비밀번호를 확인해 주세요 :)");
            e.preventDefault();
          }
        });
      } else if (emailList.includes(email) === false) {
        dispatch(addEmail(email));
        dispatch(addPassword(pw));
        dispatch(isLogin(true));
        dispatch(addNickName(email));
        dispatch(addUser(store.getState().userInfo));
        dispatch(findIsSameTrue(store.getState().userInfo.email));
      }
    } else {
      alert("아이디 또는 비밀번호를 입력해주세요 :)");
      e.preventDefault();
    }
    console.log(emailList);
    console.log(store.getState());
  };

  // 비밀번호 보기/숨기기
  const handlePwType = () => {
    if (!pwType.visible) {
      setPwType({ type: "text", visible: true });
    } else {
      setPwType({ type: "password", visible: false });
    }
  };

  useEffect(() => {
    setEmailList([]);
    store.getState().data.users.forEach((user) => {
      setEmailList([...emailList, user.email]);
    });
  }, []);

  return (
    <Container className="login">
      <Title title="Login" />
      <header>
        <Image src="/tirrilee-logo.png" alt="logo" width={180} height={50} />
      </header>
      <form>
        <div className="login__email">
          <span>이메일</span>
          <input
            ref={emailRef}
            id="id"
            type="email"
            placeholder="이메일을 입력하세요."
            required
          />
        </div>
        <div className="login__password">
          <span>비밀번호</span>
          <input
            ref={pwRef}
            id="pw"
            type={pwType.type}
            placeholder="비밀번호를 입력하세요."
            required
          />
          <span onClick={handlePwType} className="login__password-visible">
            {pwType.visible ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </span>
        </div>
        <Link href={"/prod-list/[category]"} as="/prod-list/전체">
          <Button onClick={onLoginClick} size="complete" variant="bgBlue">
            로그인
          </Button>
        </Link>
      </form>
    </Container>
  );
};

export default Login;
