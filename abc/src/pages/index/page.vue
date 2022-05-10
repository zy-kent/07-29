<template>
    <d2-container :filename="filename">
        <p>首页还在等待需求</p>
    </d2-container>
</template>

<script>
// import D2HelpBtn from './components/d2-help-btn';
// import D2Badge from './components/d2-badge';
export default {
    components: {
        // D2HelpBtn,
        // D2Badge
    },
    data() {
        return {
            filename: __filename
        };
    }
};
</script>

<style lang="less" scoped>
.test {
    .test {
        font-size: 123px;
    }
}
</style>
