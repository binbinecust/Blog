<template lang='pug'>
div
  el-row(:gutter="20")
    el-col(:span="12")
      span.mr-10 关键词：
      el-input(v-model="keyWord" placeholder="请输入关键词，多个关键词请用空格隔开，支持任何语言" @keyup.enter.native="fnClickSearch" clearable style="width: calc(100% - 70px)")
    el-col.tlc(:span="12")
      el-button(type="primary" size="small" @click="fnClickSearch" :loading="bIsSearching") 点击搜索
      el-button(size="small" @click="fnClearSearch") 清空
  el-card.mt-20(v-loading="bIsListLoading" v-if="aImgList.length")
    el-card.w-200.mr-10.mb-10.inbl(v-for="item in aImgList" :key="item.imgUrl")
      .tlc.h-200.lh-200
        img.max-w-p100.max-h-p100.vtal-md(:src="item.imgUrl" @click="fnShowImgModal(item.imgUrl)")
      .tlc.mt-5 {{ item.name }}
    .tlr.mt-10
      el-pagination(
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="oPageConf.page"
        :page-sizes="[12, 20, 50, 100]"
        :page-size="oPageConf.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="oPageConf.total"
      )
  el-dialog(
    :visible.sync="bIsImgDialogVisable"
    width="700"
    center
  )
    .tlc
      img.max-w-p100(:src="imgDialogUrl")
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      bIsImgDialogVisable: false,
      aImgList: <any>[],
      imgDialogUrl: '',
      bIsSearching: false,
      bIsListLoading: false,
      keyWord: '',
      oPageConf: {
        limit: 12,
        page: 1,
        total: null
      }
    };
  },
  watch: {
    $route() {
      this.fnInitPageDate();
    }
  },
  methods: {
    // ======================事件处理函数======================
    fnClickSearch() {
      this.fnBsnSetQueryString();
    },
    fnClearSearch() {
      this.oPageConf.limit = 12;
      this.oPageConf.page = 1;
      this.keyWord = '';
      this.fnBsnSetQueryString();
    },
    fnShowImgModal(url) {
      this.bIsImgDialogVisable = true;
      this.imgDialogUrl = url;
    },
    handleSizeChange(limit) {
      this.oPageConf.limit = limit;
      this.fnNetRImgList();
    },
    handleCurrentChange(page) {
      this.oPageConf.page = page;
      this.fnNetRImgList();
    },
    // ======================业务逻辑函数======================
    fnBsnSetQueryString() {
      let oQuery: any = {
        limit: this.oPageConf.limit,
        page: this.oPageConf.page,
        keyWord: this.keyWord
      };
      this.$router.push({
        query: oQuery
      });
    },
    // ========================纯函数=========================
    // ======================网络请求函数======================
    fnNetRImgList() {
      this.bIsSearching = true;
      this.bIsListLoading = true;
      let oData = {
        page: this.oPageConf.page,
        limit: this.oPageConf.limit,
        keyWord: this.keyWord
      };
      this.$dc.square
        .list({ data: oData })
        .then((res: any) => {
          let result = res.data;
          this.aImgList = result.imgs;
          this.oPageConf.total = result.total;
        })
        .catch(e => {})
        .done(() => {
          this.bIsSearching = false;
          this.bIsListLoading = false;
        });
    },
    // =======================初始化函数=======================
    fnInitPageDate() {
      let oQuery = this.$route.query;
      this.oPageConf.limit = +oQuery.limit || 12;
      this.oPageConf.page = +oQuery.page || 1;
      this.keyWord = oQuery.keyWord ? oQuery.keyWord.toString() : '';
      this.fnNetRImgList();
    }
  },
  mounted() {
    this.fnInitPageDate();
  }
});
</script>

<style lang='scss' scoped>
</style>
