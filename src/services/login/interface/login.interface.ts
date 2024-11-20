
interface LoginRequest{
  userName:string,
  password:string
}

interface RegisterRequest {
  userName:string,
  password:string
}

interface changePwdRequest {
  // userName:string,
  oldPassword:string,
  newPassword:string
}