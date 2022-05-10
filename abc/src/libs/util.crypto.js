import CryptoJS from 'crypto-js'
const key = 'kQrPROVXpSMZiZkWSZJdpA=='
export default class crypto {
    // md5 加密
    static md5(value) {
        return CryptoJS.AES.encrypt(value, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString()
    }
}
