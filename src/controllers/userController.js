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
      return res.send({message : "사용자가 존재하지 않습니다.", result : false})
    }
  } catch (error) {
    console.log(error)
  }
}
