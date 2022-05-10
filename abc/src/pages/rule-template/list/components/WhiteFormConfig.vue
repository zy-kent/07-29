<template>
    <div>
        <div>
            <p class="section-title">
                <span class="title">请求白名单</span>
            </p>
            <div class="section-wrap">
                <white-list-config :whiteList="model.reqWhiteList" :disabled="disableEdit"/>
            </div>
        </div>
        <div>
            <p class="section-title">
                <span class="title">响应白名单</span>
            </p>
            <div class="section-wrap">
                <white-list-config :whiteList="model.resWhiteList" :disabled="disableEdit"/>
            </div>
        </div>
    </div>
</template>

<script>
import WhiteListConfig from './WhiteListConfig';
export default {
    props: {
        model: {
            required: true,
            type: Object,
            default() {
                return {
                    resWhiteList: {
                        status: true,
                        rules: []
                    },
                    reqWhiteList: {
                        status: true,
                        rules: []
                    }
                };
            }
        },
        disabled: {
            type: Boolean
        }
    },
    computed: {
        disableEdit() {
            return this.$route.query.preview || this.disabled;
        }
    },
    components: {
        'white-list-config': WhiteListConfig
    },
    data() {
        return {
            activeNames: ['reqWhiteList', 'resWhiteList']
        };
    },
    methods: {
        handleChange() {}
    }
};
</script>

<style lang="less" scoped>
.section-wrap {
    color: #293849;
    margin: 8px 26px;
}
.section-title {
    margin: 16px 0;
    margin-left: 12px;
    border-left: 4px solid #409eff;
    line-height: 1;
    padding-left: 10px;
}
.title {
    padding-right: 12px;
}
</style>
