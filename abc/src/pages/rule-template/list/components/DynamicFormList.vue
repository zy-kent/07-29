<template>
    <div>
        <div class="field-title">
            <span>
                {{ config.label }}
                <el-popover placement="top-start" trigger="hover" :content="config.desc ">
                    <i class="el-icon-info opt-a" slot="reference"></i>
                </el-popover>
            </span>
        </div>
        <div class="field-content" style="margin-top: -40px; margin-left: 142px;">
            <div v-for="(item, index) in data" :key="index" style="margin: 8px;">
                <el-input
                    v-model="data[index]"
                    style="width: 350px;"
                    :type="data.type==='int'? 'number' : 'text'"
                    @change="change($event, index)"
                ></el-input>
                <span
                    style="display:inline-block; min-width:70px;"
                    v-if="!disabled && config.scalable"
                >
                    <span
                        v-if=" data.length !==1  && !item.disabled"
                        @click="()=> { data.splice(index, 1)}"
                    >
                        <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="remove"/>
                    </span>
                    <span v-if="index=== data.length-1" @click="()=> { data.push('') }">
                        <d2-icon class="d2-pr-10 d2-pl-10 dynamatic-opt-button" name="plus"/>
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    inject: ['elForm'],
    props: {
        config: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            data: []
        };
    },
    computed: {
        disabled() {
            return this.elForm.disabled;
        }
    },
    watch: {
        config: {
            deep: true,
            immediate: true,
            handler(value) {
                this.data = JSON.parse(JSON.stringify(value.value)).map(item =>
                    decodeURI(item)
                );
            }
        }
    },
    methods: {
        change(value, index) {
            this.config.value[index] = encodeURI(value);
        }
    }
};
</script>

<style>
</style>
