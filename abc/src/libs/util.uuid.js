export default class uuid {
    // 生成16位的uuid
    static create() {
        return 'xxxx-xxxx-4xxx-yxxx-xxx'.replace(/[xy]/g, function(c) {
            let r = (Math.random() * 16) | 0;
            let v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
