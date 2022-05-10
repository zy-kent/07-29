<template>
    <div style="color: rgb(96, 98, 102); font-size: 14px;">
        <span style="padding-right: 8px;">
            <span class="important-red">*</span> 业务名称：
        </span>
        <el-select
            class="custom-select"
            filterable
            remote
            :remote-method="queryServiceName"
            :loading="queryServiceNameLoading"
            v-model="domain.domainId"
            :disabled="domain.disabled || this.disabled || type!=='create'"
            placeholder="请输入搜索下拉选择"
            @change="getEntryList"
        >
            <el-option
                v-for="item in serviceNameList"
                :key="item.domainId"
                :label="item.serviceName"
                :value="item.domainId"
            ></el-option>
        </el-select>

        <span style="padding-left:24px;padding-right: 8px;">
            <span class="important-red">*</span>
            网站入口：
        </span>
        <el-select
            class="custom-select"
            multiple
            v-model="domain.entryList"
            :disabled="domain.disabled || this.disabled"
            placeholder="下拉多选"
        >
            <el-option v-for="item in entryList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <slot></slot>
        <span v-if="domain.errorInfo">{{ errorInfo }}</span>
    </div>
</template>

<script>
import { pageQueryDomain } from '@/api/base-config';

export default {
    props: {
        domain: {
            type: Object,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        resetFlag: {
            type: Boolean
        },
        type: {
            type: String
        }
    },
    data() {
        return {
            serviceNameList: [
                {
                    domainId: this.domain.domainId,
                    serviceName: this.domain.serviceName
                }
            ],
            entryList: [],
            queryServiceNameLoading: false,
            initFlag: true
        };
    },
    methods: {
        queryServiceName(val) {
            // debugger;
            if (val.length < 2) return;
            this.queryServiceNameLoading = true;
            return pageQueryDomain({
                serviceNamePat: val,
                pageSize: 9999,
                pageIndex: 1
            })
                .then(res => {
                    this.serviceNameList = res.domains;
                    this.queryServiceNameLoading = false;
                })
                .catch(res => {
                    this.queryServiceNameLoading = false;
                });
        },
        getEntryList(value) {
            // 加载入口
            if (!value) return;
            this.entryList = this.serviceNameList.filter(
                item => item.domainId === value
            )[0].entryList;
            this.domain.entryList = [];
        }
    },
    watch: {
        'domain.serviceName': {
            async handler(value) {
                if (this.initFlag && this.type !== 'create') {
                    await this.queryServiceName(value);
                    this.entryList = this.serviceNameList.filter(
                        item => item.serviceName === value
                    )[0].entryList;
                    this.initFlag = false;
                }
            },
            immediate: true
        },
        resetFlag() {
            this.entryList = [];
        }
    },
    mounted() {}
};
</script>

<style scoped>
.custom-select {
    width: 300px;
}
</style>
