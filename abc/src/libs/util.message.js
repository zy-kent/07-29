// 快速消息弹窗
import { MessageBox } from 'element-ui';
export default class Message {
    static deleteConfirm({ title = '确认', content = '是否删除当前内容？' }) {
        return MessageBox.confirm(content, title, {
            type: 'error',
            confirmButtonText: '确认删除',
            confirmButtonClass: 'el-button el-button--danger',
            cancelButtonClass: 'el-button el-button--default is-plain'
        });
    }
}
