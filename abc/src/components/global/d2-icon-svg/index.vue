<template>
  <svg aria-hidden="true" class="icon-svg-global">
    <use :xlink:href="icon"></use>
  </svg>
</template>

<script>
export default {
    name: 'd2-icon-svg',
    props: {
        name: {
            type: String,
            required: true
        }
    },
    computed: {
        icon () {
            return `#mgsgw-${this.name}`
        }
    }
}
</script>

<style>
    .icon-svg-global {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
