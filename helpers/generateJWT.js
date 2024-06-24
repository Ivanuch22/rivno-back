const jwt = require("jsonwebtoken");
const { Token } = require('../models/models');
class generateJWT {
    acess(id, email,role="user") {
        return jwt.sign({ id, email,role }, process.env.SECRET_KEY_ACESS, {
            expiresIn: "10h",
        });
    }
    refresh(id, email,role="user") {
        return jwt.sign({ id, email,role }, process.env.SECRET_KEY_REFRESH, {
            expiresIn: "30d",
        });
    }
    saveRefreshToken = async (userId, refreshToken) => {
        const candidate = await Token.findOne({where: {userId}})
        if(candidate){
            await this.updateRefreshToken(userId,refreshToken)
            return 
        }else{
            await Token.create({ userId, refreshToken });
            return 
        }
    };
    updateRefreshToken = async (userId, newRefreshToken) => {
        await Token.update({ refreshToken: newRefreshToken }, { where: { userId } });
    };
    tokens(id, email,role="user") {
        return {
            access: this.acess( id, email,role ),
            refresh: this.refresh( id, email,role )
        }
    }
}
module.exports = new generateJWT();