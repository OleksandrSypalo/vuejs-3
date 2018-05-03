<template>
    <div class="widget-editor">
        <b-card :title="name" tag="article">
            <div class="card-content">
                <div v-for="item in items"
                     class="editable"
                     :class="{'focus': item.isFocused}"
                     :style="'font-size:' + item.fontSize + 'px;'"
                     @click="focusIn(item)"
                >{{item.html}}</div>

                <!--<b-form inline v-if="item.isFocused">-->
                    <!--<label class="mr-sm-2" for="inlineFormCustomSelectPref">Preference</label>-->
                    <!--<b-form-select class="mb-2 mr-sm-2 mb-sm-0"-->
                    <!--:value="null"-->
                    <!--:options="{ '1': 'One', '2': 'Two', '3': 'Three' }"-->
                    <!--id="inlineFormCustomSelectPref">-->
                    <!--<option slot="first" :value="null">Choose...</option>-->
                    <!--</b-form-select>-->
                <!--</b-form>-->
            </div>
            <div>
                <b-button :to="{name: 'delete', params: {id: $route.params.id}}" variant="danger">
                    Delete
                </b-button>
            </div>
        </b-card>
    </div>
</template>

<script>
import utils from '../utils';
import conf from '../conf';
import DB from '../db';

export default {
    data() {
        return {
            name: 'Loading...',
            items: [],
            template: '',
            templateDOM: null,
        };
    },
    computed: {},
    mounted() {
        const id = this.$route.params.id;
        let data = DB.get('widgets', {id: +id});

        if (!data) {
            this.$router.replace('/');
        } else {
            Object.assign(this, data);

            this.templateDOM = document.createElement('div');
            this.templateDOM.innerHTML = this.template;

//            console.log(createDataItems(this.templateDOM))
            this.items = createDataItems(this.templateDOM);
        }
    },
    methods: {
        focusIn(currentItem){
            this.items.forEach((item)=>{
                item.isFocused = false;
            });

            currentItem.isFocused = true;
        }
    }
};

function createDataItems(context) {
    let result = [];
    let items = context.querySelectorAll('.editable');

    Array.prototype.forEach.call(items, (item)=> {
        result.push({
            originalNode: item,
            isFocused: false,
            html: item.innerHTML,
            fontSize: (item.style.fontSize || conf.defaultFontSize)
        });
    });

    return result;
}
</script>

<style>
.widget-editor {
}

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
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .3);
    line-height: 100px;
    text-align: center;
    cursor: pointer;
    transition: background-color .1s;
}

.widget-editor .editable:hover,
.widget-editor .editable.focus {
    background-color: #eee;
}
</style>
