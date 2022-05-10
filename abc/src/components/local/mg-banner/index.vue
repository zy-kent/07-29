<template>
    <div></div>
</template>

<script>
export default {
    name: 'mg-banner',
    props: {
        data: Object
    },
    computed: {
        breadcrumb() {
            if (this.data) {
                return this.data.filter(item => item.meta.title);
            } else {
                return this.$route.matched.filter(item => item.meta.title);
            }
        }
    }
};
</script>
