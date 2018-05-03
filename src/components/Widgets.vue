<template>
    <div>
        <b-table responsive striped
                 class="margin-bottom-1rem"
                 :fields="fields"
                 :items="currentItems"
                 :show-empty="true"
        >
            <template slot="empty">
                <div>
                    <p>There are no records to show</p>
                    <b-link to="/init-demo">Create data for demo</b-link>
                </div>
            </template>
            <template slot="name" slot-scope="data">
                <router-link :to="{name: 'widget', params:{id: data.value.id}}">
                    {{data.value.name}}
                </router-link>
            </template>
        </b-table>
        <b-pagination align="right"
                      :per-page="perPage"
                      v-model="currentPage"
                      :total-rows="totalRows"
        ></b-pagination>
    </div>
</template>

<script>
import utils from '../utils';
import DB from '../db';

export default {
    data() {
        return {
            perPage: 5,
            currentPage: 1,
            fields: [
                {
                    key: 'id',
                    label: '#'
                },
                {
                    key: 'name',
                    label: 'Name',
                    formatter: (value, key, item) => {
                        return {
                            name: utils.substring(value, 16),
                            id: item.id
                        };
                    }
                },
                {
                    key: 'modified',
                    label: 'Modified',
                    formatter: (value) => {
                        return value ? utils.replaceDate(value) : '-';
                    }
                }
            ],
            items: getItems()
        };
    },
    computed: {
        currentItems() {
            let firstItemIndex = (this.currentPage - 1) * this.perPage;
            return this.items.slice(firstItemIndex, firstItemIndex + this.perPage);
        },
        totalRows() {
            return this.items.length;
        }
    },
    created() {
        DB.setTrigger(['set'], 'widgets', () => {
            this.items = getItems();
        });
    }
};

function getItems() {
    return Object
            .values(DB.get('widgets'))
            .sort((a, b) => {
                return a.id > b.id ? 1 : -1;
            });
}
</script>

<style>
.icon {
    width: 1em;
}
</style>
