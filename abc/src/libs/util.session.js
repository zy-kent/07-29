// 使用sessionStorage 进行简单存储
const prefix = `mgsgw-${process.env.VUE_APP_VERSION}`;
export default class session {
    static set(key, value) {
        return sessionStorage.setItem(prefix + key, value);
    }
    static get(key) {
        return sessionStorage.getItem(prefix + key);
    }
    static remove(key) {
        return sessionStorage.removeItem(prefix + key);
    }
}
