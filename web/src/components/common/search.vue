<template>
    <div class="sys-search">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'vSearch'
}
</script>

<style lang="scss"  scoped>
    .sys-search{
        display: block;
        /* width: 100%; */
        padding: 20px 20px;
        background-color: #f9f9f9;
        // margin-bottom: 10px;
        padding-top: 40px;
        margin: 0px 20px 10px 20px;
        border-radius: 10px;
        box-shadow: 1px 2px 10px 2px rgba(0,0,0,.1);
    }

    .sys-search .el-form .line {
        text-align: center;
    }

    .sys-search .el-form .row-bg {
        padding: 30px;
        border: 1px solid #dcdfe6;
        background-color: #fff;
    }
</style>