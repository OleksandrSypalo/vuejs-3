<template>
    <div class="">

    </div>
</template>

<script>
export default {
    data() {
        return {
            id: '',
            template: ''
        };
    },
    created(){
//        let nodeItems = document.querySelectorAll('.widget-editor .editable');
//
//        Array.prototype.forEach.call(nodeItems, (i)=>{
//            let id = 'id_'+utils.uniq();
//
//            i.id = id;
//            i.tabindex = true;
//
//            this.itemsModel[id] =
//        });
//////        this.items =
    }
};
</script>

<style>
.widget-editor {}

.widget-editor .card-content {
    position: relative;
    margin: 0 -20px;
}
.widget-editor .editable {
    background-color: #fff;
    position: relative;
    display: inline-block;
    width: calc(50% - 40px);
    height: 100px;
    margin: 20px;
    box-shadow: 2px 2px 4px rgba(0,0,0,.3);
    line-height: 100px;
    text-align: center;
    cursor: pointer;
    transition: background-color .1s;
}
.widget-editor .editable:hover {
    background-color: #eee;
}
</style>
