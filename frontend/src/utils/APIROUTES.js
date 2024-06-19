export const host="http://localhost:4000"

export const registerRoutes=`${host}/register`
export const loginRoutes=`${host}/auth`
export const jwtRoutes=`${host}/auth/refresh`
export const verifyAuth=`${host}/auth/verifyAuth`
export const logout=`${loginRoutes}/logout`
export const setPic=`${registerRoutes}/setPic`
export const getAllAvatars=`${host}/getAllAvatars`
export const getAllUsers=`${host}/getAllUsers`
export const sendMessageRoutes=`${host}/messages/addMessage`
export const getAllMessageRoutes=`${host}/messages/getAllMessages`