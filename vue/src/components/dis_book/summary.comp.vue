<template>

  <div>
    <div class="vCenter" v-html="contents">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
  import {host} from "../../env/environment";
  import axios from 'axios';

    @Component
 export default class summary extends Vue {
   contents='';
    @Watch('$route')
    created() {
       console.log(this.$route.params['id'])
      axios.get(`${host.io}/api/course/resources/`+this.$route.params['id']).then(res=>{
        this.contents = res.data.resourceInfo.content;
         console.log(res.data.resourceInfo.content);
       })
    }




  }
</script>

<style lang="scss" scoped>
  .vCenter{
    padding: 0 10px;
  }
</style>
