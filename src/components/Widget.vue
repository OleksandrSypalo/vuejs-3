<template>
    <div class="widget-editor">
        <b-card :title="name" tag="article">
            <div>
                <div v-for="item in items"
                     class="editable"
                     :class="{'focus': item.isFocused}"
                     @click="focusIn(item)"
                >
                <div class="content-wrap"
                     :style="'font-size:' + item.fontSize + 'px;'"
                >{{item.html}}</div>

                <div v-if="item.isFocused" class="form-wrap">
                    <b-container fluid tag="form" @submit.prevent="submitMethod(item)">
                        <b-row>
                            <b-col sm="3">
                                <label :for="`text-${id}`">Content:</label>
                            </b-col>
                            <b-col sm="9">
                                <b-form-input :id="`text-${id}`"
                                              v-model="item.html"
                                              type="text"
                                ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="3">
                                <label :for="`font_size-${id}`">Font Size ({{item.fontSize}}px):</label>
                            </b-col>
                            <b-col sm="9">
                                <b-form-input :id="`font_size-${id}`"
                                              v-model="item.fontSize"
                                              type="range"
                                              min="1"
                                              max="100"
                                ></b-form-input>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col sm="9">
                                <b-button type="submit"
                                          variant="primary"
                                >Save & Close
                                </b-button>
                            </b-col>
                        </b-row>
                    </b-container>
                </div>
                </div>
                <b-button :to="{name: 'delete', params: {id: $route.params.id}}" variant="danger">
                    Delete
                </b-button>
            </div>
        </b-card>
    </div>
</template>

<script>
import DB from '../db';

export default {
    data() {
        return {
            id: null,
            name: 'Loading...',
            items: [],
            template: '',
            templateDOM: null
        };
    },
    mounted() {
        this.id = +this.$route.params.id;
        let data = DB.get('widgets', {id: this.id});

        if (!data) {
            this.$router.replace('/');
        } else {
            Object.assign(this, data);

            this.templateDOM = document.createElement('div');
            this.templateDOM.innerHTML = this.template;

            this.items = createDataItems(this.templateDOM);
        }
    },
    methods: {
        focusIn(currentItem){
            this.items.forEach((item)=> {
                if (item.isFocused) {
                    this.submitMethod(item);
                }
            });

            currentItem.isFocused = true;
        },
        submitMethod(currentItem){
            let DBid = DB.getID('widgets', {id: this.id});

            currentItem.isFocused = false;
            currentItem.originalNode.innerHTML = currentItem.html;
            currentItem.originalNode.style.fontSize = currentItem.fontSize + 'px';

            DB.set('widgets', {
                [DBid]: {
                    id: this.id,
                    modified: Date.now(),
                    name: this.name,
                    template: this.templateDOM.innerHTML
                }
            });
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
            fontSize: (parseInt(item.style.fontSize, 10) || 16)
        });
    });

    return result;
}

</script>

<style>
.widget-editor {
}

.widget-editor .editable {
    background-color: #fff;
    position: relative;
    min-height: 170px;
    margin: 10px 0;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, .3);
    transition: background-color .1s;
    overflow: hidden;
}

.widget-editor .editable:hover,
.widget-editor .editable.focus {
    background-color: #eee;
}

.widget-editor .editable .content-wrap {
    cursor: pointer;
    padding: 15px;
}

.widget-editor .editable .form-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .8);
    color: #fff;
}

.widget-editor .editable .container-fluid {
    position: relative;
    top: 15px;
}

.widget-editor .editable .container-fluid .row {
    margin-bottom: 10px;
}
</style>
