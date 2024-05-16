import 'dotenv/config';
import db from "../config/db.js";
import bcrypt from 'bcrypt';

export const memberRegister = async (req,res) => {
  
  try {
    const {user_id, password1, password2} = req.body
    const findQuery = `SELECT user_id FROM User WHERE user_id = ?`;
    const [rows, fields] = await db.execute(findQuery, [user_id]);
  
    // 이미 존재하는 사용자 ID인 경우
    if (rows.length > 0) {
      console.log("이미 존재하는 사용자 ID입니다.");
      return res.send({ message: "이미 존재하는 사용자 ID입니다.", result : false});
    }
    else {
      // 존재하지 않는 사용자 ID인 경우
      if(password1 === password2) {
        const salt = bcrypt.genSaltSync(5);
        const hashedPassword = bcrypt.hashSync(password1, salt);
        const registerQuery = `INSERT INTO User (user_id, user_pw) VALUES (?, ?)`
        await db.execute(registerQuery,[user_id, hashedPassword])
        return res.send({messages: "가입 성공", result : true})
      }
      else {
        return res.send({ message : "비밀번호가 같지 않습니다.", result2 : false})
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "서버 오류입니다. 다시 시도해주세요." });
  }
}

export const memberLogin = async (req,res) => {
  console.log(req.body)
  try {
    const { user_id, user_pw } = req.body
    const findQuery = `SELECT user_pw,user_id FROM User WHERE user_id = ?`
    const [rows, fields] = await db.execute(findQuery,[user_id])
    if(rows.length > 0) {
      const ok = bcrypt.compareSync(user_pw, rows[0].user_pw)
      if(!ok) {
        return res.send({message :"패스워드가 일치하지 않습니다.", result : false})
      }
      else {
        const salt = bcrypt.genSaltSync(5);
        const hashedID = bcrypt.hashSync(rows[0].user_id, salt);
        return res.send({result : true, token : hashedID, user_id})
      }
    }
    else {
      return res.send({message : "사용자가 존재하지 않습니다.", result2 : false})
    }
  } catch (error) {
    console.log(error)
  }
}

export const kakaoLogin = async (req, res) => {
  // step 1. 인가코드 받기
  const {
      query: { code },
  } = req;

  // step 2. 토큰 받기
  const KAKAO_BASE_PATH = 'https://kauth.kakao.com/oauth/token';
  const config = {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.REDIRECT_URI,
      code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${KAKAO_BASE_PATH}?${params}`;
  const data = await fetch(finalUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
  const tokenRequest = await data.json();

  // step 3. 사용자 정보 받기
  const { access_token } = tokenRequest;
  if (access_token) {
      const userRequest = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      });
      const userData = await userRequest.json();
      const {
          properties: { nickname },
          kakao_account: { email },
      } = userData;
      const salt = bcrypt.genSaltSync(5);
      const token = bcrypt.hashSync(nickname, salt)
      console.log(nickname, email)
      const findQuery = `select * from User where user_id = ?`
      const [rows, fields] = await db.execute(findQuery, [nickname]);
      // 존재하면 로그인
      console.log(rows)
      if (rows.length > 0) {
        const user_id = rows[0].user_id
        const hashedID = bcrypt.hashSync(user_id, salt);
        return res.send({result : true, token : hashedID, user_id})
      }
      else {
        const hashedPassword = bcrypt.hashSync(email, salt);
        const registerQuery = `INSERT INTO User (user_id, user_pw) VALUES (?, ?)`
        await db.execute(registerQuery,[nickname, hashedPassword])
        return res.send({result : true, token : token, user_id : nickname})
      }
    }
  }
//구글 로그인
export const googleLogin = async (req, res) => {
  const {
      query: { code },
  } = req;
  const GOOGLE_BASE_PATH = 'https://oauth2.googleapis.com/token';
  const config = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URL,
      grant_type: 'authorization_code',
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${GOOGLE_BASE_PATH}?${params}`;
  const data = await fetch(finalUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
  });
  const tokenRequest = await data.json();
  const { access_token } = tokenRequest;
  if (access_token) {
      const userRequest = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
              Authorization: `Bearer ${access_token}`,
          },
      });
      const userData = await userRequest.json();
      const {
        id,email,name
      } = userData
      console.log(id, email, name)
      const salt = bcrypt.genSaltSync(5);
      const token = bcrypt.hashSync(id, salt)
      const findQuery = 'select * from User where user_id = ?'
      const [rows, fields] = await db.execute(findQuery,[name]);
      if (rows.length > 0) {
        const user_id = rows[0].user_id
        const hashedID = bcrypt.hashSync(user_id, salt);
        return res.send({result : true, token : hashedID, user_id})
      }
      else {
        const registerQuery = `INSERT INTO User (user_id, user_pw) VALUES (?, ?)`
        const hashedPassword = bcrypt.hashSync(email, salt);
        await db.execute(registerQuery,[name, hashedPassword]);
        return res.send({result : true, token : token, user_id : name})
        
      }
    }
  }
  //내일 비밀번호 수정 이어서 => 지금까지는 user_id받아옴
export const passwordEdit = async (req, res) => {
  const { passwordEdit,user_id } = req.body;
  console.log(passwordEdit, user_id)
  try {
    if(passwordEdit === "") {
      return res.send({result : false , message : "적절한 비밀번호를 입력해주세요."})
    }
    const salt = bcrypt.genSaltSync(5);
    const hashedPassword = bcrypt.hashSync(passwordEdit, salt);
    const updatePwQuery = 'update User set user_pw = ? where user_id = ?'
    await db.execute(updatePwQuery,[hashedPassword,user_id])
    return res.send({result: true, message:"비밀번호 변경 성공"})
  } catch (error) {
    console.log(error)
  }
}

//큐알 테스트
export const testQr = async (req,res) => {
  console.log(req.body)
}