const jwt = require("jsonwebtoken");
const { Token } = require('../models/models');
class generateJWT {
    acess(id, email) {
        return jwt.sign({ id, email }, process.env.SECRET_KEY_ACESS, {
            expiresIn: "24h",
        });
    }
    refresh(id, email) {
        return jwt.sign({ id, email }, process.env.SECRET_KEY_REFRESH, {
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
    tokens(id, email) {
        return {
            access: this.acess( id, email ),
            refresh: this.refresh( id, email )
        }
    }
}
module.exports = new generateJWT();